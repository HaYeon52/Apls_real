import { UserData } from '../App';
import { allCourses, Course } from './courseData';
import { careerRoadmaps } from './courseRoadmaps';

interface Recommendations {
  currentSemesterCourses: Course[];
  missingRequiredCourses: Course[];
}

// 학년-학기를 숫자로 변환
function getSemesterNumber(grade: string, semester: string): number {
  const gradeNum = parseInt(grade);
  const semNum = parseInt(semester);
  return (gradeNum - 1) * 2 + semNum;
}

// 로드맵 기반 과목 추천 점수 계산
function calculateRoadmapScore(
  courseName: string,
  interestAreas: string[],
  currentSemester: string
): number {
  const weights = [1.0, 0.6, 0.3]; // 1지망, 2지망, 3지망
  let score = 0;

  interestAreas.forEach((area, index) => {
    const roadmap = careerRoadmaps[area];
    if (roadmap && roadmap[currentSemester]) {
      const isInRoadmap = roadmap[currentSemester].includes(courseName);
      if (isInRoadmap) {
        score += weights[index];
      }
    }
  });

  return score;
}

export function getRecommendations(userData: UserData): Recommendations {
  const recommendations: Recommendations = {
    currentSemesterCourses: [],
    missingRequiredCourses: [],
  };

  // 현재 학년-학기 (로드맵 형식으로 변환: "3학년" + "1학기" → "3-1")
  const grade = userData.grade.replace('학년', '');
  const semester = userData.semester.replace('학기', '');
  const currentSemester = `${grade}-${semester}`;
  const currentSemesterNum = getSemesterNumber(userData.grade, userData.semester);

  // 앞 학기 필수 과목 중 미이수 과목 찾기 (SWOT 분석용)
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

  // 필수 과목 (전공기초(필수)만) - 무조건 포함
  const requiredCourses = currentSemesterCourses.filter(
    course => course.category === '전공기초(필수)' && !userData.completedCourses.includes(course.courseCode)
  );

  // 선택 과목 (필수가 아닌 과목)
  const electiveCourses = currentSemesterCourses.filter(
    course => course.category !== '전공기초(필수)' && !userData.completedCourses.includes(course.courseCode)
  );

  // 로드맵 기반 점수 계산
  const scoredElectives = electiveCourses
    .map(course => ({
      ...course,
      score: calculateRoadmapScore(course.name, userData.interestArea, currentSemester),
    }))
    .filter(course => course.score > 0) // 점수가 있는 과목만
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
    ...requiredCourses.map(c => ({ ...c, score: 999, isRequired: true })), // 필수는 최우선
    ...selectedElectives.map(c => ({ ...c, isRequired: false })),
  ].sort((a, b) => b.score - a.score) as Course[];

  // 객체지향프로그래밍과 데이터구조론 통합 처리 (2-2학기만)
  if (currentSemester === '2-2') {
    const hasOOP = recommendations.currentSemesterCourses.find(c => c.name === '객체지향프로그래밍');
    const hasDS = recommendations.currentSemesterCourses.find(c => c.name === '데이터구조론');
    
    if (hasOOP || hasDS) {
      // 두 과목 점수 합산
      const combinedScore = (hasOOP?.score || 0) + (hasDS?.score || 0);
      
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
      
      // 다시 5과목으로 제한
      recommendations.currentSemesterCourses = recommendations.currentSemesterCourses.slice(0, 5);
    }
  }

  return recommendations;
}