import { UserData } from "../App";
import { allCourses, Course } from "./courseData";
import { careerRoadmaps } from "./courseRoadmaps";

interface Recommendations {
  currentSemesterCourses: Course[];
  missingRequiredCourses: Course[];
  semesterBasedRecommendations: SemesterRecommendation[];
}

export interface SemesterRecommendation {
  semester: string; // '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'
  courses: (Course & { score: number })[];
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

// 관심분야 매핑 (한글 -> 카테고리 키)
const interestToCategoryMap: Record<string, string> = {
  // InterestAreaStep의 실제 값들
  "공정 (생산, 품질)": "공정",
  "물류/SCM": "물류",
  "데이터": "IT",
  "금융": "금융",
  "컨설팅/기획": "컨설팅",
  // 이전 버전 호환성
  "공정관리·품질관리": "공정",
  "물류·SCM": "물류",
  "데이터분석·AI": "IT",
  "금융공학": "금융",
  "경영전략·컨설팅": "컨설팅"
};

// 새로운 추천 알고리즘
function calculateNewScore(
  course: Course,
  interestAreas: string[],
): { score: number; normalizedScore: number; passesHardFilter: boolean } {
  // 가중치가 없는 과목은 0점 처리
  if (!course.weights) {
    return { score: 0, normalizedScore: 0, passesHardFilter: false };
  }

  // 우선순위 가중치: p1=1.0, p2=0.7, p3=0.4
  const priorityWeights = [1.0, 0.7, 0.4];
  
  // p1, p2, p3 추출
  const p1 = interestAreas[0] ? interestToCategoryMap[interestAreas[0]] : null;
  const p2 = interestAreas[1] ? interestToCategoryMap[interestAreas[1]] : null;
  const p3 = interestAreas[2] ? interestToCategoryMap[interestAreas[2]] : null;

  // 디버그 로그 (첫 호출 시에만)
  if (!calculateNewScore.logged) {
    console.log('🔍 [추천 알고리즘 디버깅]');
    console.log('  입력 관심분야:', interestAreas);
    console.log('  매핑된 카테고리: p1=', p1, ', p2=', p2, ', p3=', p3);
    calculateNewScore.logged = true;
  }

  // 과목 점수 계산: S = 1.0*w[p1] + 0.7*w[p2] + 0.4*w[p3]
  let S = 0;
  const w_p1 = p1 ? (course.weights[p1 as keyof typeof course.weights] || 0) : 0;
  const w_p2 = p2 ? (course.weights[p2 as keyof typeof course.weights] || 0) : 0;
  const w_p3 = p3 ? (course.weights[p3 as keyof typeof course.weights] || 0) : 0;
  
  if (p1) S += 1.0 * w_p1;
  if (p2) S += 0.7 * w_p2;
  if (p3) S += 0.4 * w_p3;

  // 하드필터 (강화): 1순위 분야에서 최소 2 이상
  const passesHardFilter = w_p1 >= 2;

  // 정규화 점수 계산
  const sumA = (p1 ? 1.0 : 0) + (p2 ? 0.7 : 0) + (p3 ? 0.4 : 0);
  const Smax = 3 * sumA;
  const Snorm = Smax > 0 ? S / Smax : 0;

  // 상세 디버그 (점수가 있는 경우만)
  if (S > 0) {
    console.log(`  📊 ${course.name}: S=${S.toFixed(2)}, Snorm=${Snorm.toFixed(2)}, w[p1]=${w_p1}, 하드필터=${passesHardFilter}`);
  }

  return { score: S, normalizedScore: Snorm, passesHardFilter };
}
// 로그 플래그 추가 (타입스크립트 에러 방지)
(calculateNewScore as any).logged = false;

// 로드맵 기반 과목 추천 점수 계산 (폴백용)
function calculateRoadmapScore(
  courseName: string,
  interestAreas: string[],
  currentSemester: string,
): number {
  const weights = [1.0, 0.6, 0.3]; // 1지망, 2지망, 3지망
  let score = 0;

  interestAreas.forEach((area, index) => {
    const roadmap = careerRoadmaps[area];
    if (roadmap && roadmap[currentSemester]) {
      const isInRoadmap =
        roadmap[currentSemester].includes(courseName);
      if (isInRoadmap) {
        score += weights[index];
      }
    }
  });

  return score;
}

export function getRecommendations(
  userData: UserData,
): Recommendations {
  // 로그 플래그 초기화
  (calculateNewScore as any).logged = false;
  
  console.log('🎯 [추천 시스템 시작]');
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

  // 앞 학기 필수 과목 중 미이수 과목 찾기 (SWOT 분석용)
  const previousCourses = allCourses.filter((course) => {
    const [grade, sem] = course.semester.split("-");
    const courseSemesterNum =
      (parseInt(grade) - 1) * 2 + parseInt(sem);
    return courseSemesterNum < currentSemesterNum;
  });

  const missingRequired = previousCourses.filter((course) => {
    const isRequired = course.category === "전공기초(필수)";
    return (
      isRequired &&
      !userData.completedCourses.includes(course.name)
    );
  });

  recommendations.missingRequiredCourses = missingRequired;

  // 현재 학기 과목만 필터링
  const currentSemesterCourses = allCourses.filter((course) => {
    // 교양 과목 제외
    if (course.category.includes("교양")) return false;

    const [grade, sem] = course.semester.split("-");
    const courseSemesterNum =
      (parseInt(grade) - 1) * 2 + parseInt(sem);

    // 현재 학기 과목만
    return courseSemesterNum === currentSemesterNum;
  });

  // 필수 과목 (전공기초(필수)만) - 무조건 포함
  const requiredCourses = currentSemesterCourses.filter(
    (course) =>
      course.category === "전공기초(필수)" &&
      !userData.completedCourses.includes(course.name),
  );

  // 선택 과목 (필수가 아닌 과목)
  const electiveCourses = currentSemesterCourses.filter(
    (course) => {
      // 필수 과목 제외
      if (course.category === "전공기초(필수)") return false;
      // 이미 수강한 과목 제외
      if (userData.completedCourses.includes(course.name)) return false;
      
      // 객체지향프로그래밍(2-1)과 데이터구조론(2-2) 개별 과목은 추천에서 제외
      // (통합 과목만 추천)
      if (course.name === "객체지향프로그래밍" && course.semester === "2-1") return false;
      if (course.name === "데이터구조론" && course.semester === "2-2") return false;
      
      return true;
    }
  );

  // 새로운 추천 알고리즘 적용
  const scoredElectives = electiveCourses
    .map((course) => {
      // 산업공학개론은 필수급으로 처리
      if (course.name === "산업공학개론") {
        return {
          ...course,
          score: 998,
          normalizedScore: 1.0,
          passesHardFilter: true,
        };
      }

      // weights가 있는 경우: 새로운 알고리즘 적용
      if (course.weights) {
        const result = calculateNewScore(course, userData.interestArea);
        return {
          ...course,
          score: result.score,
          normalizedScore: result.normalizedScore,
          passesHardFilter: result.passesHardFilter,
        };
      }
      
      // weights가 없는 경우: 로드맵 기반 점수 사용 (폴백)
      const roadmapScore = calculateRoadmapScore(course.name, userData.interestArea, currentSemester);
      
      return {
        ...course,
        score: roadmapScore * 3,
        normalizedScore: roadmapScore > 0 ? 1.0 : 0,
        passesHardFilter: roadmapScore > 0,
      };
    })
    // 필터링: Snorm >= 0.60 & 하드필터 통과
    .filter((course: any) => {
      // 산업공학개론은 무조건 포함
      if (course.name === "산업공학개론") return true;
      
      // 하드필터 & Snorm >= 0.60
      return course.passesHardFilter && course.normalizedScore >= 0.60;
    })
    .sort((a, b) => b.score - a.score);

  // 학기당 최대 3과목 제한 (필수 과목 제외)
  const topElectives = scoredElectives.slice(0, 3);

  // 최종 추천 과목 = 필수 + 선택 (Top 3)
  recommendations.currentSemesterCourses = [
    ...requiredCourses.map((c) => ({
      ...c,
      score: 999,
      isRequired: true,
    })), // 필수는 최우선
    ...topElectives.map((c) => ({
      ...c,
      isRequired: false,
    })),
  ].sort((a, b) => b.score - a.score) as Course[];

  // === 학기별 전체 과목 추천 생성 ===
  // 1학년 1학기부터 4학년 1학기까지 모든 학기 (4학년 2학기 제외)
  const allSemesters = [
    "1-1",
    "1-2",
    "2-1",
    "2-2",
    "3-1",
    "3-2",
    "4-1",
  ];
  
  recommendations.semesterBasedRecommendations = allSemesters
    .map((sem) => {
      // 현재 학기 이전은 제외 (현재 학기부터 추천)
      const [semGrade, semSem] = sem.split("-").map(Number);
      const semesterNum = (semGrade - 1) * 2 + semSem;
      
      // 현재 학기부터 추천 (이전 학기는 제외)
      if (semesterNum < currentSemesterNum) return null;

      const semesterCourses = allCourses.filter((course) => {
        // 교양 과목 제외
        if (course.category.includes("교양")) return false;
        // 해당 학기 과목만
        if (course.semester !== sem) return false;
        // 이미 수강한 과목 제외
        if (
          userData.completedCourses.includes(course.name)
        )
          return false;
        
        // 객체지향프로그래밍(2-1)과 데이터구조론(2-2) 개별 과목은 추천에서 제외
        // (통합 과목만 추천)
        if (course.name === "객체지향프로그래밍" && course.semester === "2-1") return false;
        if (course.name === "데이터구조론" && course.semester === "2-2") return false;
        
        return true;
      });

      const coursesWithScore: (Course & { score: number; normalizedScore?: number })[] =
        semesterCourses.map((course) => {
          const isRequired = course.category === "전공기초(필수)";
          
          // 산업공학개론은 필수가 아니지만 무조건 추천
          if (course.name === "산업공학개론") {
            return {
              ...course,
              score: 998, // 필수 다음으로 높은 우선순위
              normalizedScore: 1.0,
            };
          }
          
          if (isRequired) {
            // 필수 과목은 무조건 최우선
            return {
              ...course,
              score: 999,
              normalizedScore: 1.0,
            };
          }
          
          // 선택 과목: 새로운 알고리즘 적용
          if (course.weights) {
            const result = calculateNewScore(course, userData.interestArea);
            return {
              ...course,
              score: result.score,
              normalizedScore: result.normalizedScore,
              passesHardFilter: result.passesHardFilter,
            };
          } else {
            // weights가 없는 경우: 로드맵 기반 점수 사용
            const roadmapScore = calculateRoadmapScore(course.name, userData.interestArea, sem);
            return {
              ...course,
              score: roadmapScore * 3,
              normalizedScore: roadmapScore > 0 ? 1.0 : 0,
            };
          }
        });

      // 필수 과목 분리
      const requiredInSemester = coursesWithScore.filter(
        (c) => c.category === "전공기초(필수)" || c.name === "산업공학개론"
      );

      // 선택 과목 필터링: Snorm >= 0.60 & 하드필터
      let electivesInSemester = coursesWithScore
        .filter((c) => {
          // 필수 과목과 산업공학개론 제외
          if (c.category === "전공기초(필수)") return false;
          if (c.name === "산업공학개론") return false;
          
          // 하드필터 & Snorm >= 0.60
          return (c as any).passesHardFilter && (c.normalizedScore || 0) >= 0.60;
        })
        .sort((a, b) => b.score - a.score);

      // Fallback: 0개면 기준을 0.55로 낮춤
      if (electivesInSemester.length === 0) {
        electivesInSemester = coursesWithScore
          .filter((c) => {
            if (c.category === "전공기초(필수)") return false;
            if (c.name === "산업공학개론") return false;
            
            return (c as any).passesHardFilter && (c.normalizedScore || 0) >= 0.55;
          })
          .sort((a, b) => b.score - a.score);
      }

      // 여전히 0개면 점수 상위 Top 2 강제 표시
      if (electivesInSemester.length === 0) {
        electivesInSemester = coursesWithScore
          .filter((c) => {
            if (c.category === "전공기초(필수)") return false;
            if (c.name === "산업공학개론") return false;
            return true;
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);
      }

      // Top-K 제한: 최대 3개만
      const topElectives = electivesInSemester.slice(0, 3);

      // 최종: 필수 + Top 3 선택
      const finalCourses = [
        ...requiredInSemester,
        ...topElectives
      ].sort((a, b) => b.score - a.score);

      return {
        semester: sem,
        courses: finalCourses,
      };
    })
    .filter(
      (rec): rec is SemesterRecommendation =>
        rec !== null && rec.courses.length > 0,
    );

  return recommendations;
}
