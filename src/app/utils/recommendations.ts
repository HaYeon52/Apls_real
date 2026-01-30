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
  courses: (Course & { 
    score: number;
    finalScore?: number;
    isStrategic?: boolean;
    w_p1?: number;
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

// 개선된 추천 알고리즘
function calculateNewScore(
  course: Course,
  interestAreas: string[],
): { 
  score: number; 
  normalizedScore: number; 
  passesRelaxedFilter: boolean;
  w_p1: number;
  w_p2: number;
  w_p3: number;
} {
  // 가중치가 없는 과목은 0점 처리
  if (!course.weights) {
    return { 
      score: 0, 
      normalizedScore: 0, 
      passesRelaxedFilter: false,
      w_p1: 0,
      w_p2: 0,
      w_p3: 0
    };
  }

  // 우선순위 가중치: p1=1.0, p2=0.7, p3=0.4
  const priorityWeights = [1.0, 0.7, 0.4];
  
  // p1, p2, p3 추출
  const p1 = interestAreas[0] ? interestToCategoryMap[interestAreas[0]] : null;
  const p2 = interestAreas[1] ? interestToCategoryMap[interestAreas[1]] : null;
  const p3 = interestAreas[2] ? interestToCategoryMap[interestAreas[2]] : null;

  // 디버그 로그 (첫 호출 시에만)
  if (!calculateNewScore.logged) {
    console.log('🔍 [개선된 추천 알고리즘 시작]');
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

  // 완화된 하드필터: (1순위 가중치 >= 2) OR (2순위 가중치 == 3)
  const passesRelaxedFilter = (w_p1 >= 2) || (w_p2 === 3);

  // 정규화 점수 계산 (참고용)
  const sumA = (p1 ? 1.0 : 0) + (p2 ? 0.7 : 0) + (p3 ? 0.4 : 0);
  const Smax = 3 * sumA;
  const Snorm = Smax > 0 ? S / Smax : 0;

  // 상세 디버그 (점수가 있는 경우만)
  if (S > 0) {
    console.log(`  📊 ${course.name}: S=${S.toFixed(2)}, w[p1]=${w_p1}, w[p2]=${w_p2}, 완화필터=${passesRelaxedFilter}`);
  }

  return { 
    score: S, 
    normalizedScore: Snorm, 
    passesRelaxedFilter,
    w_p1,
    w_p2,
    w_p3
  };
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

// 미래 역추적 가산점 로직: 미래 핵심 과목의 선수과목인지 판단
function calculateFutureLookAheadBonus(
  course: Course,
  currentSemesterNum: number,
  interestAreas: string[],
  completedCourses: string[],
): { bonus: number; isStrategic: boolean } {
  // 1순위 관심분야 추출
  const p1 = interestAreas[0] ? interestToCategoryMap[interestAreas[0]] : null;
  if (!p1) {
    return { bonus: 0, isStrategic: false };
  }

  // 현재 학기보다 미래 학기의 모든 과목 탐색
  const futureCourses = allCourses.filter((futureCourse) => {
    const [grade, sem] = futureCourse.semester.split("-");
    const futureSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    
    // 미래 학기 & 아직 수강하지 않은 과목
    return (
      futureSemesterNum > currentSemesterNum &&
      !completedCourses.includes(futureCourse.name)
    );
  });

  // p1 가중치가 3점(최상)인 핵심 과목 찾기
  const coreFutureCourses = futureCourses.filter((futureCourse) => {
    if (!futureCourse.weights) return false;
    const weight = futureCourse.weights[p1 as keyof typeof futureCourse.weights];
    return weight === 3;
  });

  // 현재 과목이 핵심 과목의 선수과목인지 확인
  for (const coreCourse of coreFutureCourses) {
    if (coreCourse.prerequisites && coreCourse.prerequisites.includes(course.name)) {
      console.log(`  🎯 전략적 과목 발견: ${course.name} → 미래 핵심과목: ${coreCourse.name} (${coreCourse.semester})`);
      return { bonus: 50, isStrategic: true };
    }
  }

  return { bonus: 0, isStrategic: false };
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
          finalScore: 998,
          normalizedScore: 1.0,
          passesRelaxedFilter: true,
          w_p1: 3,
          isStrategic: false,
        };
      }

      // weights가 있는 경우: 개선된 알고리즘 적용
      if (course.weights) {
        const result = calculateNewScore(course, userData.interestArea);
        const futureBonus = calculateFutureLookAheadBonus(
          course,
          currentSemesterNum,
          userData.interestArea,
          userData.completedCourses
        );
        
        const finalScore = result.score + futureBonus.bonus;
        
        return {
          ...course,
          score: result.score,
          finalScore: finalScore,
          normalizedScore: result.normalizedScore,
          passesRelaxedFilter: result.passesRelaxedFilter,
          w_p1: result.w_p1,
          isStrategic: futureBonus.isStrategic,
        };
      }
      
      // weights가 없는 경우: 로드맵 기반 점수 사용 (폴백)
      const roadmapScore = calculateRoadmapScore(course.name, userData.interestArea, currentSemester);
      
      return {
        ...course,
        score: roadmapScore * 3,
        finalScore: roadmapScore * 3,
        normalizedScore: roadmapScore > 0 ? 1.0 : 0,
        passesRelaxedFilter: roadmapScore > 0,
        w_p1: 0,
        isStrategic: false,
      };
    })
    // 완화된 필터링: (1순위 가중치 >= 2) OR (2순위 가중치 == 3) OR (score > 0 for no-weights courses)
    .filter((course: any) => {
      // 산업공학개론은 무조건 포함
      if (course.name === "산업공학개론") return true;
      
      // 가중치가 있으면 완화된 필터 적용
      if (course.passesRelaxedFilter) return true;
      
      // 가중치가 없지만 점수가 있으면 통과
      if (course.score > 0) return true;
      
      return false;
    })
    // 3단계 정렬: 1) finalScore (내림차순) → 2) w_p1 (내림차순) → 3) name (오름차순)
    .sort((a, b) => {
      // 1단계: finalScore 비교
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      // 2단계: w_p1 비교
      if (b.w_p1 !== a.w_p1) {
        return b.w_p1 - a.w_p1;
      }
      // 3단계: name 오름차순 (가나다순)
      return a.name.localeCompare(b.name, 'ko');
    });

  // 학기당 최대 3과목 제한
  const topElectives = scoredElectives.slice(0, 3);

  console.log(`📋 [현재 학기 추천 결과] 총 ${topElectives.length}개 과목`);
  topElectives.forEach((c: any) => {
    console.log(`  - ${c.name}: finalScore=${c.finalScore}, w_p1=${c.w_p1}, isStrategic=${c.isStrategic}`);
  });

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

      const coursesWithScore: (Course & { 
        score: number; 
        finalScore?: number;
        normalizedScore?: number;
        w_p1?: number;
        isStrategic?: boolean;
      })[] =
        semesterCourses.map((course) => {
          const isRequired = course.category === "전공기초(필수)";
          
          // 산업공학개론은 필수가 아니지만 무조건 추천
          if (course.name === "산업공학개론") {
            return {
              ...course,
              score: 998, // 필수 다음으로 높은 우선순위
              finalScore: 998,
              normalizedScore: 1.0,
              w_p1: 3,
              isStrategic: false,
            };
          }
          
          if (isRequired) {
            // 필수 과목은 무조건 최우선
            return {
              ...course,
              score: 999,
              finalScore: 999,
              normalizedScore: 1.0,
              w_p1: 3,
              isStrategic: false,
            };
          }
          
          // 선택 과목: 개선된 알고리즘 적용
          if (course.weights) {
            const result = calculateNewScore(course, userData.interestArea);
            const futureBonus = calculateFutureLookAheadBonus(
              course,
              semesterNum,
              userData.interestArea,
              userData.completedCourses
            );
            
            const finalScore = result.score + futureBonus.bonus;
            
            return {
              ...course,
              score: result.score,
              finalScore: finalScore,
              normalizedScore: result.normalizedScore,
              passesRelaxedFilter: result.passesRelaxedFilter,
              w_p1: result.w_p1,
              isStrategic: futureBonus.isStrategic,
            };
          } else {
            // weights가 없는 경우: 로드맵 기반 점수 사용
            const roadmapScore = calculateRoadmapScore(course.name, userData.interestArea, sem);
            return {
              ...course,
              score: roadmapScore * 3,
              finalScore: roadmapScore * 3,
              normalizedScore: roadmapScore > 0 ? 1.0 : 0,
              w_p1: 0,
              isStrategic: false,
            };
          }
        });

      // 필수 과목 분리
      const requiredInSemester = coursesWithScore.filter(
        (c) => c.category === "전공기초(필수)" || c.name === "산업공학개론"
      );

      // 선택 과목 필터링: 완화된 필터 적용
      let electivesInSemester = coursesWithScore
        .filter((c) => {
          // 필수 과목과 산업공학개론 제외
          if (c.category === "전공기초(필수)") return false;
          if (c.name === "산업공학개론") return false;
          
          // 완화된 필터: passesRelaxedFilter 또는 score > 0
          return (c as any).passesRelaxedFilter || c.score > 0;
        })
        // 3단계 정렬: 1) finalScore → 2) w_p1 → 3) name
        .sort((a, b) => {
          const finalScoreA = a.finalScore || a.score;
          const finalScoreB = b.finalScore || b.score;
          
          if (finalScoreB !== finalScoreA) {
            return finalScoreB - finalScoreA;
          }
          if ((b.w_p1 || 0) !== (a.w_p1 || 0)) {
            return (b.w_p1 || 0) - (a.w_p1 || 0);
          }
          return a.name.localeCompare(b.name, 'ko');
        });

      // Fallback: 0개면 모든 선택 과목 중 상위 2개 강제 표시
      if (electivesInSemester.length === 0) {
        electivesInSemester = coursesWithScore
          .filter((c) => {
            if (c.category === "전공기초(필수)") return false;
            if (c.name === "산업공학개론") return false;
            return true;
          })
          .sort((a, b) => {
            const finalScoreA = a.finalScore || a.score;
            const finalScoreB = b.finalScore || b.score;
            
            if (finalScoreB !== finalScoreA) {
              return finalScoreB - finalScoreA;
            }
            if ((b.w_p1 || 0) !== (a.w_p1 || 0)) {
              return (b.w_p1 || 0) - (a.w_p1 || 0);
            }
            return a.name.localeCompare(b.name, 'ko');
          })
          .slice(0, 2);
      }

      // Top-K 제한: 최대 3개만
      const topElectives = electivesInSemester.slice(0, 3);

      // 최종: 필수 + Top 3 선택
      const finalCourses = [
        ...requiredInSemester,
        ...topElectives
      ].sort((a, b) => {
        const finalScoreA = a.finalScore || a.score;
        const finalScoreB = b.finalScore || b.score;
        
        if (finalScoreB !== finalScoreA) {
          return finalScoreB - finalScoreA;
        }
        if ((b.w_p1 || 0) !== (a.w_p1 || 0)) {
          return (b.w_p1 || 0) - (a.w_p1 || 0);
        }
        return a.name.localeCompare(b.name, 'ko');
      });

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
