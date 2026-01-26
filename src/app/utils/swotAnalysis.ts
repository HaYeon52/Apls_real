import { UserData } from '../App';
import { allCourses } from './courseData';
import { careerRoadmaps } from './courseRoadmaps';

interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export function generateSWOT(userData: UserData): SWOTAnalysis {
  const completedCourses = allCourses.filter(course => 
    userData.completedCourses.includes(course.courseCode)
  );
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  // 이수한 과목 수 체크
  const totalCompleted = completedCourses.length;
  const requiredCompleted = completedCourses.filter(c => 
    c.category === '전공기초(필수)' || c.category === '교양필수'
  ).length;

  // 현재 학기 정보
  const currentGrade = parseInt(userData.grade.replace('학년', ''));
  const currentSemester = parseInt(userData.semester.replace('학기', ''));
  const currentSemesterNum = (currentGrade - 1) * 2 + currentSemester;

  // Strengths 분석
  // 1. 지난 학기까지의 모든 필수 과목 이수 여부 체크
  const allRequiredCoursesUpToLastSemester = allCourses.filter(course => {
    const [grade, sem] = course.semester.split('-');
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    return courseSemesterNum < currentSemesterNum && 
           course.category === '전공기초(필수)';
  });

  const allRequiredCompleted = allRequiredCoursesUpToLastSemester.every(c => 
    userData.completedCourses.includes(c.courseCode)
  );

  if (allRequiredCompleted && allRequiredCoursesUpToLastSemester.length > 0) {
    strengths.push('전공 필수 과목을 충실히 이수했어요');
  }
  
  if (totalCompleted >= 10) {
    strengths.push('다양한 과목 수강으로 폭넓은 기초를 갖췄어요');
  } else if (totalCompleted >= 5) {
    strengths.push('전공 기초를 착실히 쌓아가고 있어요');
  }

  // 관심분야별 과목 이수 체크
  const interestCourseMap: Record<string, string[]> = {
    '데이터': ['산업인공지능시스템응용', '객체지향프로그래밍', '데이터구조론', '확률통계론', '기계학습과데이터마이닝', '시계열분석및예측'],
    '물류/SCM': ['산업공학개론', '스마트팩토리개론', '선형계획법', '물류관리', '공급사슬경영(Scm)'],
    '공정 (생산, 품질)': ['스마트팩토리개론', '품질경영', '신뢰성및보전공학', '실험계획법'],
    '금융': ['공업경제학', '금융공학개론', '시계열분석및예측'],
    '컨설팅/기획': ['공학입문설계', '경영과학과운영연구1', '경영전략및데이터베이스']
  };

  userData.interestArea.forEach(area => {
    const relatedCourses = interestCourseMap[area] || [];
    const completedInArea = completedCourses.filter(c => relatedCourses.includes(c.name)).length;
    
    if (completedInArea >= 2) {
      strengths.push(`${area} 분야의 기초를 탄탄히 다졌어요`);
    }
  });

  if (strengths.length === 0) {
    strengths.push('새로운 시작, 무한한 가능성이 있어요');
  }

  // Weaknesses 분석
  // 1. 필수 과목 중 미이수 체크
  const missedRequired = allRequiredCoursesUpToLastSemester.filter(c => 
    !userData.completedCourses.includes(c.courseCode)
  );

  if (missedRequired.length > 0) {
    const courseNames = missedRequired.slice(0, 3).map(c => c.name).join(', ');
    weaknesses.push(`필수 과목 미이수: ${courseNames}${missedRequired.length > 3 ? ' 외' : ''}를 이번 학기에 꼭 수강하세요`);
  }

  // 2. 관심분야 로드맵 기반 미이수 과목 체크
  userData.interestArea.forEach(area => {
    const relatedCourses = interestCourseMap[area] || [];
    
    // 지난 학기까지 개설된 핵심 과목 중 안 들은 것 찾기
    const missedCoreCourses: string[] = [];
    relatedCourses.forEach(courseName => {
      const course = allCourses.find(c => c.name === courseName);
      if (course) {
        const [grade, sem] = course.semester.split('-');
        const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
        
        // 산업인공지능시스템응용은 작년부터 신설된 과목
        // 2-2학기 이상 학생들(3학년, 4학년)에게는 약점으로 표시하지 않음
        if (courseName === '산업인공지능시스템응용' && currentSemesterNum >= 4) {
          return; // 2-2학기(4) 이상이면 체크 안함
        }
        
        // 현재 학기보다 이전에 개설되고, 아직 안 들은 과목
        if (courseSemesterNum < currentSemesterNum && 
            !userData.completedCourses.includes(course.courseCode)) {
          missedCoreCourses.push(courseName);
        }
      }
    });

    if (missedCoreCourses.length > 0) {
      const courseNames = missedCoreCourses.slice(0, 2).join(', ');
      weaknesses.push(`${area} 분야의 ${courseNames}${missedCoreCourses.length > 2 ? ' 등' : ''}을 듣지 않아 기초가 부족할 수 있어요`);
    }
  });

  // 3. 전반적인 이수 과목 부족
  if (totalCompleted < 5 && currentGrade >= 2) {
    weaknesses.push('전공 기초를 더 다질 필요가 있어요');
  }

  if (weaknesses.length === 0) {
    weaknesses.push('특별한 약점이 발견되지 않았어요');
  }

  // Opportunities 분석
  // 1. 학년별 다음 학기 목표
  if (currentGrade === 1) {
    opportunities.push('다양한 분야를 탐색할 수 있는 시기예요');
  } else if (currentGrade === 2) {
    if (userData.careerPath.includes('대학원 진학')) {
      opportunities.push('학부연구생으로 연구 경험을 쌓을 수 있어요');
    } else {
      opportunities.push('인턴십과 공모전으로 실무 역량을 키울 수 있어요');
    }
  } else if (currentGrade === 3) {
    if (userData.careerPath.includes('창업')) {
      opportunities.push('창업 공모전과 액셀러레이팅 프로그램에 도전하세요');
    } else if (userData.careerPath.includes('대학원 진학')) {
      opportunities.push('논문 작성과 학회 발표로 연구 역량을 강화하세요');
    } else {
      opportunities.push('기업 프로젝트와 현장실습으로 취업을 준비하세요');
    }
  } else if (currentGrade === 4) {
    if (userData.careerPath.includes('대학원 진학')) {
      opportunities.push('대학원 입시와 연구계획서 작성에 집중하세요');
    } else {
      opportunities.push('포트폴리오 완성과 최종 취업 준비에 집중하세요');
    }
  }

  // 2. 융합형 인재
  if (userData.interestArea.length >= 2) {
    opportunities.push('융합형 인재로 성장할 수 있어요');
  }

  // 3. 1지망 관심분야별 기회
  userData.interestArea.forEach((area, index) => {
    if (index === 0) { // 첫 번째 관심분야
      if (area === '데이터') {
        opportunities.push('AI/ML 분야의 높은 수요를 활용할 수 있어요');
      } else if (area === '물류/SCM') {
        opportunities.push('글로벌 물류 시장 성장에 기여할 수 있어요');
      } else if (area === '컨설팅/기획') {
        opportunities.push('전략적 사고로 비즈니스를 이끌 수 있어요');
      }
    }
  });

  if (opportunities.length === 0) {
    opportunities.push('체계적인 학습으로 경쟁력을 키울 수 있어요');
  }

  // Threats 분석
  if (currentGrade >= 3 && totalCompleted < 8) {
    threats.push('졸업 요건 이수에 시간이 촉박할 수 있어요');
  }

  if (userData.interestArea.includes('데이터') && !completedCourses.some(c => 
    c.name.includes('프로그래밍') || c.name.includes('통계')
  )) {
    threats.push('데이터 분야 진출에 필요한 기초가 부족해요');
  }

  if (currentGrade >= 3 && userData.careerPath.includes('대학원 진학')) {
    if (!completedCourses.some(c => c.name.includes('연구'))) {
      threats.push('대학원 준비를 위한 연구 경험이 필요해요');
    }
  }

  if (threats.length === 0) {
    threats.push('특별한 위협 요소가 없어요');
  }

  return {
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 2),
    opportunities: opportunities.slice(0, 2),
    threats: threats.slice(0, 2)
  };
}