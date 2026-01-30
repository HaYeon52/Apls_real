import { UserData } from "../App";
import { allCourses, Course } from "./courseData";
import { recommendationCases, matchCase } from "./recommendationCases";

interface Recommendations {
  currentSemesterCourses: Course[];
  missingRequiredCourses: Course[];
  semesterBasedRecommendations: SemesterRecommendation[];
}

export interface SemesterRecommendation {
  semester: string;
  courses: (Course & { 
    score: number;
    recommendationReason?: string;
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

// 메인 추천 함수
export function getRecommendations(userData: UserData): Recommendations {
  const currentSemesterNum = getSemesterNumber(userData.grade, userData.semester);
  
  // 필수 과목 체크
  const requiredCourses = allCourses.filter(
    (c) => c.category === "전공기초(필수)"
  );
  
  const missingRequiredCourses = requiredCourses.filter(
    (req) => !userData.completedCourses.includes(req.name)
  );

  // 케이스 매칭
  const caseKey = matchCase(userData.interestArea);
  const caseData = recommendationCases[caseKey] || recommendationCases["none"];

  // 학기별 추천 생성
  const semesterBasedRecommendations: SemesterRecommendation[] = [];

  for (const semesterData of caseData) {
    const [gradeStr, semStr] = semesterData.semester.split('-');
    const semesterNum = getSemesterNumber(gradeStr, semStr);

    // 현재 학기 이상이고 4학년 1학기까지만
    if (semesterNum >= currentSemesterNum && semesterNum <= 7) {
      const courses: (Course & { score: number; recommendationReason?: string })[] = [];

      for (const courseRec of semesterData.courses) {
        // courseData에서 실제 과목 정보 찾기
        const courseInfo = allCourses.find(c => c.name === courseRec.name);
        
        if (courseInfo && !userData.completedCourses.includes(courseInfo.name)) {
          courses.push({
            ...courseInfo,
            score: 1.0,
            recommendationReason: courseRec.reason
          });
        }
      }

      if (courses.length > 0) {
        semesterBasedRecommendations.push({
          semester: semesterData.semester,
          courses
        });
      }
    }
  }

  return {
    currentSemesterCourses: [],
    missingRequiredCourses,
    semesterBasedRecommendations,
  };
}
