import { UserData } from '../App';

interface Course {
  name: string;
  description: string;
  semester: string; // "1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"
}

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
  majorCourses: Course[];
  generalCourses: Course[];
  certifications: string[];
  externalActivities: string[];
  internalActivities: string[];
  labs: Lab[];
  militaryTiming: MilitaryTiming;
}

// 전체 전공 수업 목록 (학년-학기별)
const allMajorCourses: Course[] = [
  // 1학년 1학기
  { name: '새내기세미나', description: '대학 생활 및 산업공학과 소개', semester: '1-1' },
  { name: '테크노경영학', description: '기술과 경영의 융합', semester: '1-1' },
  
  // 1학년 2학기
  { name: '산업공학개론', description: '산업공학의 기초 개념과 방법론', semester: '1-2' },
  
  // 2학년 1학기
  { name: '객체지향프로그래밍', description: 'Java/C++ 기반 객체지향 프로그래밍', semester: '2-1' },
  { name: '산공수학', description: '산업공학을 위한 수학적 기초', semester: '2-1' },
  { name: '생산시스템개론', description: '생산 시스템의 설계 및 운영', semester: '2-1' },
  { name: '확률통계론', description: '확률 이론 및 통계적 추론', semester: '2-1' },
  
  // 2학년 2학기
  { name: '공업경제학', description: '공학적 의사결정을 위한 경제학', semester: '2-2' },
  { name: '데이터구조론', description: '자료구조 및 알고리즘 기초', semester: '2-2' },
  { name: '선형모델수치해석', description: '선형대수 및 수치해석 기법', semester: '2-2' },
  { name: '수리통계학', description: '통계적 추정 및 검정', semester: '2-2' },
  { name: '정보통신시스템개론', description: '정보통신 시스템의 이해', semester: '2-2' },
  
  // 3학년 1학기
  { name: '경영과학과운영연구1', description: '선형계획법 및 최적화 기법', semester: '3-1' },
  { name: '금융공학개론', description: '금융상품 및 리스크 관리', semester: '3-1' },
  { name: '물류관리', description: '물류 시스템 설계 및 관리', semester: '3-1' },
  { name: '운용관리1', description: '생산운영관리의 기초', semester: '3-1' },
  { name: '인간공학기초', description: '인간-시스템 상호작용', semester: '3-1' },
  { name: '품질경영', description: '품질관리 및 개선 기법', semester: '3-1' },
  
  // 3학년 2학기
  { name: '경영과학과운영연구2', description: '정수계획법 및 네트워크 최적화', semester: '3-2' },
  { name: '신뢰성및보전공학', description: '시스템 신뢰성 분석', semester: '3-2' },
  { name: '알고리듬설계및분석', description: '알고리즘 설계 및 복잡도 분석', semester: '3-2' },
  { name: '운용관리2', description: '생산계획 및 재고관리', semester: '3-2' },
  { name: '응용확률방법론', description: '확률 모델 및 응용', semester: '3-2' },
  { name: '인간공학응용', description: 'UX/UI 설계 및 평가', semester: '3-2' },
  { name: '컴퓨터시뮬레이션', description: '시뮬레이션 모델링 및 분석', semester: '3-2' },
  
  // 4학년 1학기
  { name: '경영프로세스관리론', description: '비즈니스 프로세스 혁신', semester: '4-1' },
  { name: '공급사슬경영(SCM)', description: '공급망 전략 및 최적화', semester: '4-1' },
  { name: '산업공학종합설계1', description: '산업공학 캡스톤 프로젝트 1', semester: '4-1' },
  { name: '생체정보학', description: '생체 신호 및 의료 데이터 분석', semester: '4-1' },
  { name: '실용공학연구5', description: '실무 프로젝트 연구', semester: '4-1' },
  { name: '실험계획법', description: '효율적 실험 설계 및 분석', semester: '4-1' },
  { name: '인간-컴퓨터인터페이스설계', description: 'HCI 설계 및 평가', semester: '4-1' },
  
  // 4학년 2학기
  { name: '경영정보시스템', description: 'ERP 및 정보시스템 전략', semester: '4-2' },
  { name: '기업진단론', description: '기업 분석 및 진단', semester: '4-2' },
  { name: '산업공학종합설계2', description: '산업공학 캡스톤 프로젝트 2', semester: '4-2' },
  { name: '실용공학연구6', description: '실무 프로젝트 연구', semester: '4-2' },
  { name: '정보기술경영', description: 'IT 전략 및 디지털 전환', semester: '4-2' },
  { name: '정보화와안전관리', description: '정보보안 및 안전관리', semester: '4-2' },
  { name: '첨단생산시스템', description: '스마트팩토리 및 자동화', semester: '4-2' },
  { name: '프로젝트관리공학', description: '프로젝트 계획 및 통제', semester: '4-2' },
];

// 관심 분야별 추천 과목 매핑
const interestAreaCourseMap: Record<string, string[]> = {
  '데이터': [
    '객체지향프로그래밍', '확률통계론', '데이터구조론', '수리통계학', '선형모델수치해석',
    '알고리듬설계및분석', '응용확률방법론', '컴퓨터시뮬레이션', '생체정보학', '실험계획법'
  ],
  '금융': [
    '확률통계론', '공업경제학', '수리통계학', '경영과학과운영연구1', '금융공학개론',
    '경영과학과운영연구2', '응용확률방법론', '기업진단론'
  ],
  '물류': [
    '생산시스템개론', '선형모델수치해석', '경영과학과운영연구1', '물류관리', '운용관리1',
    '경영과학과운영연구2', '운용관리2', '공급사슬경영(SCM)', '첨단생산시스템'
  ],
  '품질': [
    '확률통계론', '생산시스템개론', '수리통계학', '품질경영', '신뢰성및보전공학',
    '실험계획법', '컴퓨터시뮬레이션', '첨단생산시스템'
  ],
  '전략 컨설팅': [
    '공업경제학', '경영과학과운영연구1', '운용관리1', '경영과학과운영연구2', '경영프로세스관리론',
    '경영정보시스템', '기업진단론', '프로젝트관리공학'
  ],
  'SCM': [
    '생산시스템개론', '데이터구조론', '경영과학과운영연구1', '물류관리', '운용관리1',
    '경영과학과운영연구2', '운용관리2', '경영프로세스관리론', '공급사슬경영(SCM)', '경영정보시스템', '첨단생산시스템'
  ],
  '기획': [
    '공업경제학', '경영과학과운영연구1', '운용관리1', '인간공학기초', '인간공학응용',
    '경영프로세스관리론', '경영정보시스템', '정보기술경영', '프로젝트관리공학'
  ],
  '마케팅': [
    '확률통계론', '수리통계학', '인간공학기초', '인간공학응용', '실험계획법',
    '인간-컴퓨터인터페이스설계', '경영정보시스템', '데이터구조론'
  ],
};

// 학년-학기를 숫자로 변환 (비교를 위해)
function getSemesterNumber(grade: string, semester: string): number {
  const gradeNum = grade === '입학예정' ? 1 : parseInt(grade.replace('학년', ''));
  const semesterNum = parseInt(semester.replace('학기', ''));
  return (gradeNum - 1) * 2 + semesterNum;
}

// 교양 수업 추천
const generalCoursesMap: Record<string, { name: string; description: string }[]> = {
  '데이터': [
    { name: 'Python 프로그래밍', description: '데이터 분석 프로그래밍 기초' },
    { name: '데이터베이스', description: 'SQL 및 데이터 관리' },
    { name: '기업가정신과 창업', description: '데이터 기반 스타트업' },
  ],
  '금융': [
    { name: '경제학원론', description: '거시/미시 경제 이해' },
    { name: '회계학', description: '재무제표 분석' },
    { name: '금융의 이해', description: '금융시장 및 상품' },
  ],
  '물류': [
    { name: '글로벌 비즈니스', description: '국제 물류 환경' },
    { name: '경영학원론', description: '경영 전반 이해' },
    { name: '기업가정신과 창업', description: '물류 스타트업' },
  ],
  '품질': [
    { name: '통계학', description: '통계 분석 기초' },
    { name: '경영학원론', description: '품질경영 이해' },
    { name: '기술과 사회', description: '품질과 기술 혁신' },
  ],
  '전략 컨설팅': [
    { name: '경영학원론', description: '경영 전반 이해' },
    { name: '경제학원론', description: '산업 구조 분석' },
    { name: '비즈니스 커뮤니케이션', description: '프레젠테이션 및 보고서 작성' },
  ],
  'SCM': [
    { name: '글로벌 비즈니스', description: '글로벌 공급망' },
    { name: '경영학원론', description: '경영 기초' },
    { name: '정보시스템', description: 'IT 기반 SCM' },
  ],
  '기획': [
    { name: '경영학원론', description: '경영 전반 이해' },
    { name: '비즈니스 커뮤니케이션', description: '기획서 작성 및 발표' },
    { name: '디자인 씽킹', description: '창의적 문제 해결' },
  ],
  '마케팅': [
    { name: '마케팅원론', description: '마케팅 기초' },
    { name: '소비자 행동론', description: '고객 심리 이해' },
    { name: '디지털 미디어', description: '온라인 마케팅' },
  ],
};

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

export function getRecommendations(userData: UserData): Recommendations {
  const recommendations: Recommendations = {
    majorCourses: [],
    generalCourses: [],
    certifications: [],
    externalActivities: [],
    internalActivities: [],
    labs: [],
    militaryTiming: { period: '', reason: '', tips: [] },
  };

  // 현재 학년-학기 숫자
  const currentSemesterNum = getSemesterNumber(userData.grade, userData.semester);

  // 관심 분야에 맞는 과목 이름 목록
  const recommendedCourseNames = interestAreaCourseMap[userData.interestArea] || [];

  // 전공 수업 필터링: 현재 학기 이후 + 관심 분야에 맞는 과목
  recommendations.majorCourses = allMajorCourses
    .filter(course => {
      const [grade, sem] = course.semester.split('-');
      const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
      
      // 현재 학기 이후의 과목만
      if (courseSemesterNum < currentSemesterNum) return false;
      
      // 관심 분야에 맞는 과목이거나 필수 과목
      return recommendedCourseNames.includes(course.name) || 
             course.name.includes('세미나') || 
             course.name.includes('종합설계') ||
             course.name.includes('실용공학연구');
    })
    .map(course => ({
      name: course.name,
      description: `${course.description} (${course.semester.replace('-', '학년 ')}학기)`,
    }));

  // 교양 수업
  recommendations.generalCourses = generalCoursesMap[userData.interestArea] || [];

  // 자격증
  recommendations.certifications = certificationsMap[userData.interestArea] || [];

  // 대외활동
  recommendations.externalActivities = externalActivitiesMap[userData.interestArea] || [];

  // 대내활동
  recommendations.internalActivities = internalActivitiesMap[userData.interestArea] || [];

  // 연구실
  recommendations.labs = labsMap[userData.interestArea] || [];

  // 군대 시기 추천 (남성인 경우)
  if (userData.gender === '남성') {
    if (userData.careerPath === '대학원 진학') {
      recommendations.militaryTiming = {
        period: '학부 졸업 후 ~ 대학원 입학 전',
        reason: '학부 과정을 마친 후 군 복무를 하고, 복학 없이 바로 대학원에 진학하는 것이 학업 연속성에 유리합니다.',
        tips: [
          '4학년 2학기 조기졸업 후 입대하여 복학 과정 생략',
          '군 복무 중 대학원 준비 (영어, 연구 계획서 등)',
          '전역 후 바로 대학원 입학으로 시간 효율화',
          '산업기능요원 지원 고려 (연구실 연계)',
        ],
      };
    } else if (userData.careerPath === '창업') {
      recommendations.militaryTiming = {
        period: '2학년 수료 후 또는 졸업 후',
        reason: '창업은 타이밍이 중요하므로, 아이템 개발 전이거나 사업 안정화 후가 적절합니다.',
        tips: [
          '2학년까지 기초 다진 후 입대 → 전역 후 본격 창업 준비',
          '졸업 후 입대 → 군 복무 중 사업 아이템 구상',
          '산업기능요원으로 스타트업에서 근무하며 창업 경험 쌓기',
          '전역 후 정부 지원사업(예비창업패키지 등) 활용',
        ],
      };
    } else {
      // 취업
      const gradeNum = userData.grade === '입학예정' ? 1 : parseInt(userData.grade.replace('학년', ''));
      
      if (gradeNum <= 2) {
        recommendations.militaryTiming = {
          period: '2학년 수료 후',
          reason: '전공 기초를 다진 후 군 복무를 마치고, 전역 후 전공심화 및 취업 준비에 집중할 수 있습니다.',
          tips: [
            '1-2학년: 전공 기초 및 교양 이수',
            '군 복무 중: 어학 공부 및 자격증 준비',
            '전역 후 3-4학년: 전공 심화, 인턴, 공모전 등 취업 준비',
            '복학 후 바로 취업 준비에 집중 가능',
          ],
        };
      } else {
        recommendations.militaryTiming = {
          period: '현재 학년 마친 후 또는 졸업 유예',
          reason: '현재 학년의 학업을 마무리한 후 군 복무를 하는 것이 학점 관리에 유리합니다.',
          tips: [
            '현재 학기 마무리 후 입대하여 학업 연속성 유지',
            '군 복무 중 어학 및 자격증 준비',
            '전역 후 전공 심화 및 취업 활동 집중',
            '복학 시기를 고려하여 전역 시점 조정',
          ],
        };
      }
    }
  }

  return recommendations;
}
