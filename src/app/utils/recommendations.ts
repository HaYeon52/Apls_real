import { UserData } from '../App';
import { allCourses, Course } from './courseData';

interface Recommendations {
  currentSemesterCourses: Course[];
  missingRequiredCourses: Course[];
}

// 관심 분야별 과목 연관도 (새로운 분야로 매핑)
export const courseInterestMapping: Record<string, Record<string, number>> = {
  // 1학년 2학기
  '공학입문설계': { '컨설팅/기획': 0.7, '공정 (생산, 품질)': 0.4, '물류/SCM': 0.4 },
  '산업공학개론': { '물류/SCM': 0.7, '공정 (생산, 품질)': 0.7, '컨설팅/기획': 0.6 },
  '산업인공지능시스템응용': { '데이터': 1.0, '물류/SCM': 0.6, '공정 (생산, 품질)': 0.5 },
  
  // 2학년 1학기
  '객체지향프로그래밍': { '데이터': 1.0, '물류/SCM': 0.3, '컨설팅/기획': 0.2 },
  '산공수학': { '데이터': 0.8, '금융': 0.8, '물류/SCM': 0.6, '공정 (생산, 품질)': 0.6, '컨설팅/기획': 0.4 },
  '수치해석': { '데이터': 0.9, '금융': 0.7, '물류/SCM': 0.5 },
  '스마트팩토리개론': { '물류/SCM': 1.0, '공정 (생산, 품질)': 0.8, '데이터': 0.6 },
  '확률통계론': { '데이터': 1.0, '금융': 0.9, '공정 (생산, 품질)': 0.8 },
  
  // 2학년 2학기
  '공업경제학': { '금융': 1.0, '컨설팅/기획': 0.9 },
  '데이터구조론': { '데이터': 1.0, '물류/SCM': 0.4 },
  '선형계획법': { '물류/SCM': 1.0, '데이터': 0.7, '금융': 0.6, '컨설팅/기획': 0.6 },
  
  // 3학년 1학기
  '경영과학과운영연구1': { '물류/SCM': 0.9, '컨설팅/기획': 1.0, '금융': 0.7 },
  '기계학습과데이터마이닝': { '데이터': 1.0, '금융': 0.5 },
  '물류관리': { '물류/SCM': 1.0 },
  '산업공학Hy-Up(실용연구실습)1': { '컨설팅/기획': 0.5, '데이터': 0.4 },
  '시계열분석및예측': { '데이터': 1.0, '금융': 0.9 },
  '운용관리': { '물류/SCM': 0.9, '컨설팅/기획': 0.7 },
  '품질경영': { '공정 (생산, 품질)': 1.0, '컨설팅/기획': 0.6 },
  
  // 3학년 2학기
  '경영과학과운영연구2': { '물류/SCM': 0.9, '컨설팅/기획': 1.0, '데이터': 0.7 },
  '경영전략및데이터베이스': { '컨설팅/기획': 1.0, '데이터': 0.7, '물류/SCM': 0.5 },
  '공급사슬경영(Scm)': { '물류/SCM': 1.0, '컨설팅/기획': 0.6 },
  '금융공학개론': { '금융': 1.0, '데이터': 0.5 },
  '산업공학Hy-Up(실용연구실습)2': { '컨설팅/기획': 0.5, '데이터': 0.4 },
  '신뢰성및보전공학': { '공정 (생산, 품질)': 1.0, '물류/SCM': 0.4 },
  '실험계획법': { '공정 (생산, 품질)': 1.0, '데이터': 0.9 },
  
  // 4학년 1학기
  '네트워크및재고전략': { '물류/SCM': 1.0, '컨설팅/기획': 0.5 },
  '산업공학Hy-Up(실용연구실습)3': { '컨설팅/기획': 0.5, '데이터': 0.4 },
  '산업공학종합설계1': { '컨설팅/기획': 0.8, '물류/SCM': 0.6, '데이터': 0.5 },
  '산업공학캡스톤Pbl': { '컨설팅/기획': 0.8, '물류/SCM': 0.6, '데이터': 0.5 },
  '스마트제조데이터분석': { '데이터': 1.0, '물류/SCM': 0.7, '공정 (생산, 품질)': 0.6 },
  
  // 4학년 2학기
  '산업공학Hy-Up(실용연구실습)4': { '컨설팅/기획': 0.5, '데이터': 0.4 },
  '산업공학종합설계2': { '컨설팅/기획': 0.8, '물류/SCM': 0.6, '데이터': 0.5 },
};

// 학년-학기를 숫자로 변환
function getSemesterNumber(grade: string, semester: string): number {
  const gradeNum = parseInt(grade);
  const semNum = parseInt(semester);
  return (gradeNum - 1) * 2 + semNum;
}

// 가중치 기반 과목 추천 점수 계산
function calculateCourseScore(
  courseName: string, 
  interestAreas: string[]
): number {
  const interestWeights = [0.5, 0.3, 0.2];
  let score = 0;

  // 관심분야 점수 계산 (100% 가중치)
  interestAreas.forEach((area, index) => {
    const mapping = courseInterestMapping[courseName];
    if (mapping && mapping[area]) {
      score += mapping[area] * interestWeights[index];
    }
  });

  return score;
}

export function getRecommendations(userData: UserData): Recommendations {
  const recommendations: Recommendations = {
    currentSemesterCourses: [],
    missingRequiredCourses: [],
  };

  // 현재 학년-학기 숫자
  const currentSemesterNum = getSemesterNumber(userData.grade, userData.semester);

  // 앞 학기 필수 과목 중 미이수 과목 찾기
  const previousCourses = allCourses.filter(course => {
    const [grade, sem] = course.semester.split('-');
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    return courseSemesterNum < currentSemesterNum;
  });

  const missingRequired = previousCourses.filter(course => {
    const isRequired = course.category === '전공기초(필수)';
    return isRequired && !userData.completedCourses.includes(course.courseCode);
  });

  recommendations.missingRequiredCourses = missingRequired;

  // 현재 학기 과목만 필터링
  const currentSemesterCourses = allCourses.filter(course => {
    // 교양 과목 제외
    if (course.category.includes('교양')) return false;
    
    const [grade, sem] = course.semester.split('-');
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    
    // 현재 학기 과목만
    return courseSemesterNum === currentSemesterNum;
  });

  // 필수 과목 (전공기초(필수)만)
  const requiredCourses = currentSemesterCourses.filter(
    course => course.category === '전공기초(필수)' && !userData.completedCourses.includes(course.courseCode)
  );

  // 선택 과목 (필수가 아닌 과목)
  const electiveCourses = currentSemesterCourses.filter(
    course => course.category !== '전공기초(필수)' && !userData.completedCourses.includes(course.courseCode)
  );

  // 가중치 기반 점수 계산
  const scoredElectives = electiveCourses
    .map(course => ({
      ...course,
      score: calculateCourseScore(course.name, userData.interestArea),
    }))
    .filter(course => course.score >= 0.3)
    .sort((a, b) => b.score - a.score);

  // 학기당 최대 5과목 제한
  let selectedCount = requiredCourses.length;
  const selectedElectives = [];
  
  for (const course of scoredElectives) {
    if (selectedCount >= 5) break;
    selectedElectives.push(course);
    selectedCount++;
  }

  // 최종 추천 과목 = 필수 + 선택
  recommendations.currentSemesterCourses = [
    ...requiredCourses.map(c => ({ ...c, score: 1.0, isRequired: true })),
    ...selectedElectives.map(c => ({ ...c, isRequired: false })),
  ].sort((a, b) => b.score - a.score) as Course[];

  // 객체지향프로그래밍과 데이터구조론 통합 처리
  const hasOOP = recommendations.currentSemesterCourses.find(c => c.name === '객체지향프로그래밍');
  const hasDS = recommendations.currentSemesterCourses.find(c => c.name === '데이터구조론');
  
  if (hasOOP || hasDS) {
    // 두 과목 중 하나라도 있으면, 통합 과목으로 대체
    const combinedScore = Math.max(
      hasOOP?.score || 0,
      hasDS?.score || 0
    );
    
    // 기존 개별 과목 제거
    recommendations.currentSemesterCourses = recommendations.currentSemesterCourses.filter(
      c => c.name !== '객체지향프로그래밍' && c.name !== '데이터구조론'
    );
    
    // 통합 과목 추가
    const combinedCourse: Course = {
      name: '객체지향프로그래밍 + 데이터구조론',
      courseCode: 'COM2018+INE2011',
      category: '전공핵심',
      credits: '6.00-6.00',
      semester: '2-2',
      lectureHours: 6,
      labHours: 0,
      description: '통합 과정: 프로그래밍 리터러시 완성 - Java 기반 객체지향 프로그래밍과 자료구조 및 알고리즘',
    };
    
    recommendations.currentSemesterCourses.push({
      ...combinedCourse,
      score: combinedScore,
      isRequired: false,
    } as any);
    
    // 점수 순으로 재정렬
    recommendations.currentSemesterCourses.sort((a, b) => b.score - a.score);
  }

  return recommendations;
}