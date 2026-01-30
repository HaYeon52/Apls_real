import { UserData } from "../App";
import { allCourses, Course } from "./courseData";
import { 
  caseBasedRecommendations, 
  getCaseId,
  CourseRecommendation 
} from "./caseBasedRecommendations";

interface Recommendations {
  currentSemesterCourses: Course[];
  missingRequiredCourses: Course[];
  semesterBasedRecommendations: SemesterRecommendation[];
}

export interface SemesterRecommendation {
  semester: string; // '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'
  courses: (Course & { 
    reason?: string; // 추천 이유
  })[];
}

// 학년-학기를 숫자로 변환
function getSemesterNumber(
  grade: string,
  semester: string,
): number {
  const gradeNum = parseInt(grade);
  const semNum = parseInt(semester);
  return (gradeNum - 1) * 2 + semNum;
}

/**
 * 케이스 기반 과목 추천 시스템
 * 
 * caseBasedRecommendations.ts에 정의된 과목만 추천합니다.
 * 필수과목 자동 추가 로직이 제거되었으며, 모든 과목은 케이스별로 하드코딩됩니다.
 */
export function getRecommendations(
  userData: UserData,
): Recommendations {
  console.log('🎯 [케이스 기반 추천 시스템 시작]');
  console.log('  사용자 관심분야:', userData.interestArea);
  
  const recommendations: Recommendations = {
    currentSemesterCourses: [],
    missingRequiredCourses: [],
    semesterBasedRecommendations: [],
  };

  // 현재 학년-학기 (로드맵 형식으로 변환: "3학년" + "1학기" → "3-1")
  const grade = userData.grade.replace("학년", "");
  const semester = userData.semester.replace("학기", "");
  const currentSemester = `${grade}-${semester}`;
  const currentSemesterNum = getSemesterNumber(
    userData.grade,
    userData.semester,
  );

  // 케이스 ID 결정
  const caseId = getCaseId(userData.interestArea);
  const caseData = caseBasedRecommendations[caseId];
  
  if (!caseData) {
    console.error('❌ 케이스 데이터를 찾을 수 없습니다:', caseId);
    return recommendations;
  }

  console.log(`✅ 적용된 케이스: ${caseData.caseName} (${caseId})`);

  // 앞 학기 필수 과목 중 미이수 과목 찾기 (케이스 데이터 기반)
  const previousSemesters = caseData.semesters.filter((semRec) => {
    const [semGrade, semSem] = semRec.semester.split("-").map(Number);
    const semesterNum = (semGrade - 1) * 2 + semSem;
    return semesterNum < currentSemesterNum;
  });

  const missingRequired: Course[] = [];
  previousSemesters.forEach((semRec) => {
    semRec.courses.forEach((rec: CourseRecommendation) => {
      const course = allCourses.find(c => c.name === rec.courseName);
      if (course && 
          course.category === "전공기초(필수)" && 
          !userData.completedCourses.includes(course.name)) {
        missingRequired.push(course);
      }
    });
  });

  recommendations.missingRequiredCourses = missingRequired;

  // 현재 학기 과목 추천 생성 (케이스 데이터만 사용)
  const currentSemesterRecommendation = caseData.semesters.find(
    sem => sem.semester === currentSemester
  );

  if (currentSemesterRecommendation) {
    // 케이스별 추천 과목 (필수 + 선택 모두 caseBasedRecommendations.ts에서 가져옴)
    const recommendedCourses = currentSemesterRecommendation.courses
      .map((rec: CourseRecommendation) => {
        const course = allCourses.find(c => c.name === rec.courseName);
        if (!course) {
          console.warn(`⚠️ 과목을 찾을 수 없습니다: ${rec.courseName}`);
          return null;
        }
        // 이미 수강한 과목 제외
        if (userData.completedCourses.includes(course.name)) {
          return null;
        }
        return {
          ...course,
          reason: rec.reason
        };
      })
      .filter((c): c is Course & { reason: string } => c !== null);

    recommendations.currentSemesterCourses = recommendedCourses;

    console.log(`📋 [현재 학기 추천] ${currentSemester}: ${recommendations.currentSemesterCourses.length}개 과목`);
  }

  // 학기별 전체 과목 추천 생성 (케이스 데이터만 사용)
  recommendations.semesterBasedRecommendations = caseData.semesters
    .filter((semRec) => {
      // 현재 학기 이후만 포함
      const [semGrade, semSem] = semRec.semester.split("-").map(Number);
      const semesterNum = (semGrade - 1) * 2 + semSem;
      return semesterNum >= currentSemesterNum && semesterNum <= 7; // 4학년 1학기까지
    })
    .map((semRec) => {
      // 케이스별 추천 과목 (필수 + 선택 모두 caseBasedRecommendations.ts에서 가져옴)
      const recommendedCourses = semRec.courses
        .map((rec: CourseRecommendation) => {
          const course = allCourses.find(c => c.name === rec.courseName);
          if (!course) {
            console.warn(`⚠️ 과목을 찾을 수 없습니다: ${rec.courseName}`);
            return null;
          }
          // 이미 수강한 과목 제외
          if (userData.completedCourses.includes(course.name)) {
            return null;
          }
          return {
            ...course,
            reason: rec.reason
          };
        })
        .filter((c): c is Course & { reason: string } => c !== null);

      return {
        semester: semRec.semester,
        courses: recommendedCourses
      };
    })
    .filter(semRec => semRec.courses.length > 0);

  console.log(`✅ [학기별 추천 완료] 총 ${recommendations.semesterBasedRecommendations.length}개 학기`);

  return recommendations;
}