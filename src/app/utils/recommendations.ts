import { UserData } from '../App';
import { allCourses, Course } from './courseData';

interface Lab {
  name: string;
  description: string;
}

interface MilitaryTiming {
  period: string;
  reason: string;
  tips: string[];
}

interface Recommendations {
  majorCoursesBySemester: { [key: string]: Course[] };
  generalCourses: Course[];
  certifications: string[];
  externalActivities: string[];
  internalActivities: string[];
  labs: Lab[];
  militaryTiming: MilitaryTiming;
  completedMajorCredits: number;
  recommendedMajorCredits: number;
  totalMajorCredits: number;
}

// 관심 분야별 과목 연관도 (각 과목이 해당 분야와 얼마나 관련있는지)
const courseInterestMapping: Record<string, Record<string, number>> = {
  '객체지향프로그래밍': { '데이터': 1.0, 'SCM': 0.3, '기획': 0.2 },
  '산공수학': { '데이터': 0.8, '금융': 0.8, '물류': 0.6, '품질': 0.6, '전략 컨설팅': 0.4, 'SCM': 0.6 },
  '수치해석': { '데이터': 0.9, '금융': 0.7, '물류': 0.5 },
  '스마트팩토리개론': { '물류': 1.0, 'SCM': 1.0, '품질': 0.8, '데이터': 0.6 },
  '확률통계론': { '데이터': 1.0, '금융': 0.9, '품질': 0.8, '마케팅': 0.7 },
  '공업경제학': { '금융': 1.0, '전략 컨설팅': 0.9, '기획': 0.7 },
  '데이터구조론': { '데이터': 1.0, 'SCM': 0.4, '마케팅': 0.3 },
  '선형계획법': { '물류': 1.0, 'SCM': 1.0, '데이터': 0.7, '금융': 0.6, '전략 컨설팅': 0.6 },
  '응용통계학': { '데이터': 1.0, '금융': 0.8, '품질': 0.9, '마케팅': 0.8 },
  '투자과학': { '금융': 1.0, '전략 컨설팅': 0.6, '기획': 0.5 },
  '경영과학과운영연구1': { '물류': 0.9, 'SCM': 0.9, '전략 컨설팅': 1.0, '금융': 0.7, '기획': 0.8 },
  '기계학습과데이터마이닝': { '데이터': 1.0, '마케팅': 0.6, '금융': 0.5 },
  '물류관리': { '물류': 1.0, 'SCM': 1.0 },
  '시계열분석및예측': { '데이터': 1.0, '금융': 0.9, '마케팅': 0.6 },
  '운용관리': { '물류': 0.9, 'SCM': 0.9, '전략 컨설팅': 0.7, '기획': 0.7 },
  '품질경영': { '품질': 1.0, '전략 컨설팅': 0.6 },
  '경영과학과운영연구2': { '물류': 0.9, 'SCM': 0.9, '전략 컨설팅': 1.0, '데이터': 0.7 },
  '경영전략및데이터베이스': { '기획': 1.0, '전략 컨설팅': 0.9, '데이터': 0.7, 'SCM': 0.5 },
  '공급사슬경영(Scm)': { 'SCM': 1.0, '물류': 1.0, '전략 컨설팅': 0.6 },
  '금융공학개론': { '금융': 1.0, '데이터': 0.5 },
  '신뢰성및보전공학': { '품질': 1.0, '물류': 0.4 },
  '실험계획법': { '품질': 1.0, '데이터': 0.9, '마케팅': 0.6 },
  '네트워크및재고전략': { '물류': 1.0, 'SCM': 1.0, '전략 컨설팅': 0.5 },
  '스마트제조데이터분석': { '데이터': 1.0, '물류': 0.7, 'SCM': 0.7, '품질': 0.6 },
  '산업인공지능시스템응용': { '데이터': 1.0, 'SCM': 0.6, '품질': 0.5 },
  '인공지능과기계학습': { '데이터': 1.0, '마케팅': 0.4 },
};

// 학년-학기를 숫자로 변환 (비교를 위해)
function getSemesterNumber(grade: string, semester: string): number {
  const gradeNum = parseInt(grade.replace('학년', ''));
  const semesterNum = parseInt(semester.replace('학기', ''));
  return (gradeNum - 1) * 2 + semesterNum;
}

// 가중치 기반 과목 추천 점수 계산
function calculateCourseScore(courseName: string, interestAreas: string[]): number {
  const weights = [0.5, 0.3, 0.2]; // 1순위, 2순위, 3순위
  let score = 0;

  interestAreas.forEach((area, index) => {
    const mapping = courseInterestMapping[courseName];
    if (mapping && mapping[area]) {
      score += mapping[area] * weights[index];
    }
  });

  return score;
}

// 자격증 추천
const certificationsMap: Record<string, string[]> = {
  '데이터': ['데이터분석 준전문가(ADsP)', '데이터분석 전문가(ADP)', 'SQL 개발자(SQLD)', '빅데이터분석기사', 'Python 데이터 분석 자격증'],
  '금융': ['재무분석사(CFA)', '금융투자분석사', 'FRM', '증권투자권유자문인력', 'Excel 전문가(MOS)'],
  '물류': ['물류관리사', '유통관리사', '국제물류사', 'CPIM (생산재고관리)', '화물운송종사자격증'],
  '품질': ['품질경영기사', '6시그마 GB/BB', '신뢰성기사', 'ISO 9001 심사원', 'Minitab 자격증'],
  '전략 컨설팅': ['경영지도사', 'PMP', 'CISA', 'CPA', 'Excel 전문가(MOS)'],
  'SCM': ['물류관리사', 'CPIM', 'CSCP', 'ERP 정보관리사', 'SAP 자격증'],
  '기획': ['PMP', 'SQLD', 'Excel 전문가(MOS)', '사업관리사', '컴퓨터활용능력 1급'],
  '마케팅': ['구글 애널리틱스 자격증', '디지털 마케팅 전문가', 'Excel 전문가(MOS)', '소셜미디어 마케팅 자격증', 'ADsP'],
};

// 대외활동 추천
const externalActivitiesMap: Record<string, string[]> = {
  '데이터': ['데이터 분석 공모전 (빅콘테스트, 데이콘)', 'AI/ML 해커톤', '데이터 분석 동아리', 'Kaggle 대회', '기업 데이터 분석 인턴'],
  '금융': ['금융 공모전 (한국은행, 금융감독원)', '투자 동아리', '핀테크 해커톤', '증권사/은행 인턴', '모의투자대회'],
  '물류': ['물류 공모전', 'SCM 케이스 스터디', '물류 스타트업 인턴', '글로벌 물류 기업 탐방', 'E-커머스 창업 동아리'],
  '품질': ['품질분임조 경진대회', '6시그마 프로젝트', '제조 기업 현장실습', '품질혁신 사례 공모전', 'ISO 인증 프로젝트'],
  '전략 컨설팅': ['컨설팅 케이스 대회', '비즈니스 전략 공모전', '컨설팅 회사 인턴', 'MBA 준비 스터디', '창업 경진대회'],
  'SCM': ['SCM 케이스 대회', '물류 최적화 공모전', 'ERP 프로젝트', '글로벌 기업 인턴', '공급망 혁신 동아리'],
  '기획': ['사업기획 공모전', '창업 경진대회', '기업 기획팀 인턴', '비즈니스 아이디어 경진대회', '프로젝트 매니지먼트 동아리'],
  '마케팅': ['마케팅 공모전', '광고 크리에이티브 대회', '브랜드 기획 공모전', '마케팅 대행사 인턴', '소셜미디어 캠페인 프로젝트'],
};

// 대내활동 추천
const internalActivitiesMap: Record<string, string[]> = {
  '데이터': ['산업공학과 데이터분석 학회', '코딩 스터디', '통계 스터디', '논문 세미나', '산학협력 프로젝트'],
  '금융': ['금융공학 연구회', '투자 스터디', '수리 최적화 학회', '산학협력 금융 프로젝트', '경제 동향 세미나'],
  '물류': ['물류/SCM 학회', '최적화 스터디', '시뮬레이션 프로젝트', '산학협력 물류 프로젝트', '글로벌 물류 사례 연구'],
  '품질': ['품질관리 학회', '6시그마 프로젝트팀', '통계 분석 스터디', '제조 현장 견학', '품질혁신 세미나'],
  '전략 컨설팅': ['경영전략 학회', '케이스 스터디 동아리', '비즈니스 모델 연구회', '기업 분석 프로젝트', '전략 세미나'],
  'SCM': ['SCM 연구회', '공급망 최적화 프로젝트', 'ERP 학습 동아리', '산학협력 SCM 프로젝트', '글로벌 SCM 사례 연구'],
  '기획': ['기획/전략 동아리', '창업 동아리', '프로젝트 매니지먼트 스터디', '비즈니스 모델 연구', '기업 탐방'],
  '마케팅': ['마케팅 학회', '디지털 마케팅 프로젝트', '브랜드 기획 동아리', '고객 분석 스터디', '마케팅 사례 연구'],
};

// 연구실 추천
const labsMap: Record<string, Lab[]> = {
  '데이터': [
    { name: 'Data Mining & Business Analytics Lab', description: '빅데이터 분석 및 비즈니스 인텔리전스 연구' },
    { name: 'Machine Learning & Optimization Lab', description: 'AI/ML 알고리즘 개발 및 최적화' },
    { name: 'Statistical Quality Control Lab', description: '통계적 품질관리 및 데이터 분석' },
  ],
  '금융': [
    { name: 'Financial Engineering Lab', description: '금융상품 설계 및 리스크 관리' },
    { name: 'Optimization & Operations Research Lab', description: '금융 최적화 모델링' },
    { name: 'Quantitative Finance Lab', description: '계량 금융 및 알고리즘 트레이딩' },
  ],
  '물류': [
    { name: 'Logistics & Supply Chain Lab', description: '물류 시스템 최적화 연구' },
    { name: 'Network Optimization Lab', description: '물류 네트워크 설계 및 분석' },
    { name: 'Smart Manufacturing Lab', description: '스마트 물류 및 자동화' },
  ],
  '품질': [
    { name: 'Quality Engineering Lab', description: '품질공학 및 신뢰성 연구' },
    { name: 'Statistical Quality Control Lab', description: 'SQC 및 실험계획법' },
    { name: 'Reliability Engineering Lab', description: '제품 신뢰성 분석 및 개선' },
  ],
  '전략 컨설팅': [
    { name: 'Management Science Lab', description: '경영과학 및 의사결정 연구' },
    { name: 'Business Analytics Lab', description: '비즈니스 전략 분석' },
    { name: 'Operations Research Lab', description: '전략적 최적화 모델링' },
  ],
  'SCM': [
    { name: 'Supply Chain Management Lab', description: 'SCM 전략 및 최적화' },
    { name: 'Logistics Systems Lab', description: '물류 시스템 설계 및 운영' },
    { name: 'Smart Manufacturing Lab', description: '스마트 공급망 및 Industry 4.0' },
  ],
  '기획': [
    { name: 'Management Science Lab', description: '사업 기획 및 의사결정' },
    { name: 'Project Management Lab', description: '프로젝트 관리 및 최적화' },
    { name: 'Business Innovation Lab', description: '비즈니스 모델 혁신 연구' },
  ],
  '마케팅': [
    { name: 'Data Mining & Business Analytics Lab', description: '마케팅 데이터 분석' },
    { name: 'Consumer Behavior Lab', description: '소비자 행동 및 심리 연구' },
    { name: 'Human Factors & Ergonomics Lab', description: 'UX/UI 및 사용자 경험' },
  ],
};

// 군대 시기 추천 (학년 & 진로방향별)
function getMilitaryRecommendation(grade: string, careerPaths: string[]): MilitaryTiming {
  const gradeNum = parseInt(grade.replace('학년', ''));
  const primaryCareer = careerPaths[0]; // 1순위 진로

  if (primaryCareer === '대학원 진학') {
    return {
      period: '학부 졸업 후 ~ 대학원 입학 전',
      reason: '학부 과정을 마친 후 군 복무를 하고, 복학 없이 바로 대학원에 진학하는 것이 학업 연속성에 유리합니다.',
      tips: [
        '4학년 2학기 조기졸업 후 입대하여 복학 과정 생략',
        '군 복무 중 대학원 준비 (영어, 연구 계획서 등)',
        '전역 후 바로 대학원 입학으로 시간 효율화',
        '산업기능요원 지원 고려 (연구실 연계)',
      ],
    };
  } else if (primaryCareer === '창업') {
    if (gradeNum <= 2) {
      return {
        period: '2학년 수료 후',
        reason: '창업은 타이밍이 중요하므로, 기초를 다진 후 군 복무를 마치고 본격적인 창업 준비를 하는 것이 좋습니다.',
        tips: [
          '2학년까지 전공 기초 및 프로그래밍 역량 확보',
          '군 복무 중 사업 아이템 구상 및 시장 조사',
          '전역 후 창업 동아리 및 정부 지원사업 활용',
          '복학 후 창업 경진대회 및 액셀러레이팅 프로그램 참여',
        ],
      };
    } else {
      return {
        period: '졸업 후 또는 사업 안정화 후',
        reason: '이미 고학년이므로 졸업 후 입대하거나, 사업을 시작한 경우 안정화 후 입대를 고려하세요.',
        tips: [
          '졸업 후 입대 → 군 복무 중 사업 계획 구체화',
          '산업기능요원으로 스타트업에서 근무하며 창업 경험 쌓기',
          '전역 후 정부 지원사업(예비창업패키지, K-Startup 등) 활용',
          '네트워킹 유지 및 멘토링 활용',
        ],
      };
    }
  } else {
    // 취업
    if (gradeNum <= 2) {
      return {
        period: '2학년 수료 후',
        reason: '전공 기초를 다진 후 군 복무를 마치고, 전역 후 전공심화 및 취업 준비에 집중할 수 있습니다.',
        tips: [
          '1-2학년: 전공 핵심 및 교양 이수, 프로그래밍 기초 확립',
          '군 복무 중: TOEIC/TOEIC Speaking, 자격증 준비',
          '전역 후 3-4학년: 전공 심화, 인턴십, 공모전 참여',
          '복학 후 바로 취업 준비 활동 시작 (학점 관리, 대외활동)',
        ],
      };
    } else if (gradeNum === 3) {
      return {
        period: '3학년 수료 후',
        reason: '3학년까지 전공 심화 과목을 이수한 후 입대하면, 전역 후 4학년 때 취업 준비에 집중할 수 있습니다.',
        tips: [
          '3학년 동안 전공 핵심 과목 이수 및 학점 관리',
          '군 복무 중: 어학 성적 확보, 자격증 취득',
          '전역 후 4학년: 캡스톤 프로젝트, 인턴십, 채용 준비',
          '전역 시기를 고려하여 하계/동계 인턴십 지원',
        ],
      };
    } else {
      return {
        period: '졸업 후 또는 졸업 유예',
        reason: '4학년이므로 졸업 후 입대하거나, 취업 후 산업기능요원 전환을 고려하세요.',
        tips: [
          '졸업 후 입대: 복학 없이 전역 후 바로 취업 준비',
          '산업기능요원: 취업 후 병역특례로 실무 경험 쌓기',
          '전역 후 신입/경력 채용 준비 (포트폴리오 강화)',
          '군 복무 중 자격증 및 어학 성적 준비',
        ],
      };
    }
  }
}

export function getRecommendations(userData: UserData): Recommendations {
  const recommendations: Recommendations = {
    majorCoursesBySemester: {},
    generalCourses: [],
    certifications: [],
    externalActivities: [],
    internalActivities: [],
    labs: [],
    militaryTiming: { period: '', reason: '', tips: [] },
    completedMajorCredits: 0,
    recommendedMajorCredits: 0,
    totalMajorCredits: 0,
  };

  // 현재 학년-학기 숫자
  const currentSemesterNum = getSemesterNumber(userData.grade, userData.semester);

  // 이수 완료한 전공 과목의 학점 계산
  const completedCourses = allCourses.filter(course => 
    userData.completedCourses.includes(course.courseCode) && !course.category.includes('교양')
  );
  
  recommendations.completedMajorCredits = completedCourses.reduce((sum, course) => {
    const credits = parseFloat(course.credits.split('-')[0]);
    return sum + credits;
  }, 0);

  // 전공 수업 필터링: 현재 학기 이후
  const majorCourses = allCourses.filter(course => {
    // 교양 과목 제외
    if (course.category.includes('교양')) return false;
    
    const [grade, sem] = course.semester.split('-');
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    
    // 현재 학기 이후의 과목만
    return courseSemesterNum >= currentSemesterNum;
  });

  // 가중치 기반 점수 계산 및 정렬
  const scoredCourses = majorCourses.map(course => ({
    ...course,
    score: calculateCourseScore(course.name, userData.interestArea),
  }));

  // 점수가 0보다 큰 과목만 필터링하고 정렬
  let recommendedCourses = scoredCourses
    .filter(course => course.score > 0 || course.category.includes('전공핵심') || course.category.includes('전공기초'))
    .sort((a, b) => b.score - a.score);

  // 추천 과목의 전공 학점 계산
  let recommendedCredits = recommendedCourses.reduce((sum, course) => {
    const credits = parseFloat(course.credits.split('-')[0]);
    return sum + credits;
  }, 0);

  // 83학점이 안 되면 추가 과목 추천
  const targetCredits = 83;
  const remainingCredits = targetCredits - (recommendations.completedMajorCredits + recommendedCredits);
  
  if (remainingCredits > 0) {
    // 아직 추천되지 않은 전공 과목 중에서 추가
    const notRecommendedYet = scoredCourses.filter(
      course => !recommendedCourses.includes(course)
    ).sort((a, b) => b.score - a.score);

    let additionalCredits = 0;
    for (const course of notRecommendedYet) {
      if (additionalCredits >= remainingCredits) break;
      recommendedCourses.push(course);
      const credits = parseFloat(course.credits.split('-')[0]);
      additionalCredits += credits;
    }
  }

  // 학기별로 그룹화
  recommendedCourses.forEach(course => {
    const semesterKey = course.semester.replace('-', '학년 ') + '학기';
    if (!recommendations.majorCoursesBySemester[semesterKey]) {
      recommendations.majorCoursesBySemester[semesterKey] = [];
    }
    recommendations.majorCoursesBySemester[semesterKey].push({
      name: course.name,
      description: course.description,
      semester: course.semester,
      category: course.category,
      credits: course.credits,
      courseCode: course.courseCode,
      lectureHours: course.lectureHours,
      labHours: course.labHours,
    });
  });

  // 최종 추천 전공 학점 계산
  recommendations.recommendedMajorCredits = recommendedCourses.reduce((sum, course) => {
    const credits = parseFloat(course.credits.split('-')[0]);
    return sum + credits;
  }, 0);

  recommendations.totalMajorCredits = recommendations.completedMajorCredits + recommendations.recommendedMajorCredits;

  // 교양 수업 (현재 학기 이후)
  recommendations.generalCourses = allCourses.filter(course => {
    if (!course.category.includes('교양')) return false;
    
    const [grade, sem] = course.semester.split('-');
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    
    return courseSemesterNum >= currentSemesterNum;
  });

  // 자격증 (관심 분야별로 중복 제거하여 결합)
  const certSet = new Set<string>();
  userData.interestArea.forEach(area => {
    const certs = certificationsMap[area] || [];
    certs.forEach(cert => certSet.add(cert));
  });
  recommendations.certifications = Array.from(certSet);

  // 대외활동
  const extActSet = new Set<string>();
  userData.interestArea.forEach(area => {
    const acts = externalActivitiesMap[area] || [];
    acts.forEach(act => extActSet.add(act));
  });
  recommendations.externalActivities = Array.from(extActSet);

  // 대내활동
  const intActSet = new Set<string>();
  userData.interestArea.forEach(area => {
    const acts = internalActivitiesMap[area] || [];
    acts.forEach(act => intActSet.add(act));
  });
  recommendations.internalActivities = Array.from(intActSet);

  // 연구실 (대학원 진학이 진로에 포함된 경우)
  if (userData.careerPath.includes('대학원 진학')) {
    const labSet = new Set<Lab>();
    userData.interestArea.forEach(area => {
      const labs = labsMap[area] || [];
      labs.forEach(lab => labSet.add(lab));
    });
    recommendations.labs = Array.from(labSet);
  }

  // 군대 시기 추천 (남성이고 '미정'인 경우)
  if (userData.gender === '남성' && userData.militaryStatus === '미정') {
    recommendations.militaryTiming = getMilitaryRecommendation(userData.grade, userData.careerPath);
  }

  return recommendations;
}