export interface Course {
  name: string;
  description: string;
  semester: string;
  category: string;
  credits: string;
  courseCode: string;
  lectureHours: number;
  labHours: number;
}

// 전체 과목 데이터베이스
export const allCourses: Course[] = [
  // 1학년 1학기
  { name: '미분적분학1', courseCode: 'GEN2052', category: '전공기초(필수)', credits: '3.00-3.00', semester: '1-1', lectureHours: 3, labHours: 0, description: '미분과 적분의 기초 개념' },
  { name: '일반물리학및실험1', courseCode: 'CUL3011', category: '전공기초(필수)', credits: '4.00-5.00', semester: '1-1', lectureHours: 3, labHours: 2, description: '물리학의 기본 원리와 실험' },
  { name: '일반화학및실험1', courseCode: 'CHM1005', category: '전공기초(필수)', credits: '4.00-5.00', semester: '1-1', lectureHours: 3, labHours: 2, description: '화학의 기본 원리와 실험' },

  // 1학년 2학기
  { name: '공학입문설계', courseCode: 'COE2022', category: '전공핵심', credits: '3.00-4.00', semester: '1-2', lectureHours: 2, labHours: 2, description: '공학 설계의 기초' },
  { name: '미분적분학2', courseCode: 'GEN2053', category: '전공기초(필수)', credits: '3.00-3.00', semester: '1-2', lectureHours: 3, labHours: 0, description: '다변수 미적분학' },
  { name: '산업공학개론', courseCode: 'INE1001', category: '전공핵심', credits: '3.00-3.00', semester: '1-2', lectureHours: 3, labHours: 0, description: '산업공학의 기초 개념과 방법론' },
  { name: '산업인공지능시스템응용', courseCode: 'INE1017', category: '전공핵심', credits: '3.00-3.00', semester: '1-2', lectureHours: 3, labHours: 0, description: 'AI 시스템의 산업 응용' },
  { name: '일반물리학및실험2', courseCode: 'CUL3012', category: '전공기초(필수)', credits: '3.00-4.00', semester: '1-2', lectureHours: 2, labHours: 2, description: '전자기학 및 파동' },
  { name: '일반화학및실험2', courseCode: 'CHM1002', category: '전공기초(필수)', credits: '3.00-4.00', semester: '1-2', lectureHours: 2, labHours: 2, description: '유기화학 및 반응' },

  // 2학년 1학기
  { name: '객체지향프로그래밍', courseCode: 'COM2018', category: '전공핵심', credits: '3.00-3.00', semester: '2-1', lectureHours: 3, labHours: 0, description: 'Java/C++ 기반 객체지향 프로그래밍' },
  { name: '공업수학1', courseCode: 'COE3051', category: '전공기초(필수)', credits: '3.00-3.00', semester: '2-1', lectureHours: 3, labHours: 0, description: '공학을 위한 수학적 도구' },
  { name: '산공수학', courseCode: 'INE2015', category: '전공핵심', credits: '3.00-3.00', semester: '2-1', lectureHours: 3, labHours: 0, description: '산업공학을 위한 수학적 기초' },
  { name: '수치해석', courseCode: 'MAT3008', category: '전공기초(필수)', credits: '3.00-3.00', semester: '2-1', lectureHours: 3, labHours: 0, description: '수치 계산 기법' },
  { name: '스마트팩토리개론', courseCode: 'INE2075', category: '전공핵심', credits: '3.00-4.00', semester: '2-1', lectureHours: 2, labHours: 2, description: '스마트 제조 시스템' },
  { name: '확률통계론', courseCode: 'MAT2017', category: '전공기초(필수)', credits: '3.00-3.00', semester: '2-1', lectureHours: 3, labHours: 0, description: '확률 이론 및 통계적 추론' },

  // 2학년 2학기
  { name: '공업경제학', courseCode: 'GEN3058', category: '전공핵심', credits: '3.00-3.00', semester: '2-2', lectureHours: 3, labHours: 0, description: '공학적 의사결정을 위한 경제학' },
  { name: '데이터구조론', courseCode: 'INE2011', category: '전공핵심', credits: '3.00-3.00', semester: '2-2', lectureHours: 3, labHours: 0, description: '자료구조 및 알고리즘 기초' },
  { name: '선형계획법', courseCode: 'INE2009', category: '전공핵심', credits: '3.00-3.00', semester: '2-2', lectureHours: 3, labHours: 0, description: '선형 최적화 기법' },
  { name: '응용통계학', courseCode: 'COE3003', category: '전공핵심', credits: '3.00-3.00', semester: '2-2', lectureHours: 3, labHours: 0, description: '통계적 추정 및 검정' },
  { name: '투자과학', courseCode: 'INE2076', category: '전공핵심', credits: '3.00-3.00', semester: '2-2', lectureHours: 3, labHours: 0, description: '투자 의사결정과 포트폴리오 관리' },

  // 3학년 1학기
  { name: '경영과학과운영연구1', courseCode: 'INE3079', category: '전공핵심', credits: '3.00-3.00', semester: '3-1', lectureHours: 3, labHours: 0, description: '선형계획법 및 최적화 기법' },
  { name: '기계학습과데이터마이닝', courseCode: 'INE5008', category: '전공핵심', credits: '3.00-3.00', semester: '3-1', lectureHours: 3, labHours: 0, description: '머신러닝 알고리즘과 데이터 분석' },
  { name: '물류관리', courseCode: 'INE4023', category: '전공핵심', credits: '3.00-3.00', semester: '3-1', lectureHours: 3, labHours: 0, description: '물류 시스템 설계 및 관리' },
  { name: '시계열분석및예측', courseCode: 'INE3098', category: '전공핵심', credits: '3.00-3.00', semester: '3-1', lectureHours: 3, labHours: 0, description: '시간에 따른 데이터 분석 및 예측' },
  { name: '운용관리', courseCode: 'INE3081', category: '전공핵심', credits: '3.00-3.00', semester: '3-1', lectureHours: 3, labHours: 0, description: '생산운영관리의 기초' },
  { name: '품질경영', courseCode: 'BUS3021', category: '전공핵심', credits: '3.00-3.00', semester: '3-1', lectureHours: 3, labHours: 0, description: '품질관리 및 개선 기법' },

  // 3학년 2학기
  { name: '경영과학과운영연구2', courseCode: 'INE3080', category: '전공핵심', credits: '3.00-3.00', semester: '3-2', lectureHours: 3, labHours: 0, description: '정수계획법 및 네트워크 최적화' },
  { name: '경영전략및데이터베이스', courseCode: 'INE2016', category: '전공심화', credits: '3.00-3.00', semester: '3-2', lectureHours: 3, labHours: 0, description: '경영 전략과 데이터베이스 시스템' },
  { name: '공급사슬경영(Scm)', courseCode: 'INE1008', category: '전공심화', credits: '3.00-4.00', semester: '3-2', lectureHours: 2, labHours: 2, description: '공급망 전략 및 최적화' },
  { name: '금융공학개론', courseCode: 'INE3083', category: '전공심화', credits: '3.00-3.00', semester: '3-2', lectureHours: 3, labHours: 0, description: '금융상품 및 리스크 관리' },
  { name: '신뢰성및보전공학', courseCode: 'INE4044', category: '전공심화', credits: '3.00-3.00', semester: '3-2', lectureHours: 3, labHours: 0, description: '시스템 신뢰성 분석' },
  { name: '실험계획법', courseCode: 'INE4004', category: '전공핵심', credits: '3.00-3.00', semester: '3-2', lectureHours: 3, labHours: 0, description: '효율적 실험 설계 및 분석' },

  // 4학년 1학기
  { name: '네트워크및재고전략', courseCode: 'INE3082', category: '전공심화', credits: '3.00-3.00', semester: '4-1', lectureHours: 3, labHours: 0, description: '네트워크 최적화 및 재고 관리' },
  { name: '스마트제조데이터분석', courseCode: 'INE4115', category: '전공심화', credits: '3.00-3.00', semester: '4-1', lectureHours: 3, labHours: 0, description: '스마트 제조 환경의 데이터 분석' },
  { name: '응용데이터애널리틱스', courseCode: 'INE4116', category: '전공심화', credits: '3.00-3.00', semester: '4-1', lectureHours: 3, labHours: 0, description: '실무 데이터 분석 및 시각화' },

  // 4학년 2학기
];