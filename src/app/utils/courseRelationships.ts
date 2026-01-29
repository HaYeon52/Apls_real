import { allCourses } from "./courseData";

/**
 * 특정 과목의 후수과목(이 과목을 선수과목으로 하는 과목들) 찾기
 */
export function getFollowUpCourses(courseName: string): string[] {
  return allCourses
    .filter(course => 
      course.prerequisites && course.prerequisites.includes(courseName)
    )
    .map(course => course.name);
}

/**
 * 특정 과목까지 가는 학습 경로 찾기 (DFS 기반)
 */
export function getLearningPath(targetCourseName: string): string[][] {
  const targetCourse = allCourses.find(c => c.name === targetCourseName);
  
  if (!targetCourse || !targetCourse.prerequisites || targetCourse.prerequisites.length === 0) {
    return [[targetCourseName]];
  }

  const paths: string[][] = [];
  
  function findPaths(courseName: string, currentPath: string[]) {
    const course = allCourses.find(c => c.name === courseName);
    
    if (!course) return;
    
    // 순환 참조 방지
    if (currentPath.includes(courseName)) {
      return;
    }
    
    const newPath = [...currentPath, courseName];
    
    if (!course.prerequisites || course.prerequisites.length === 0) {
      paths.push(newPath);
      return;
    }
    
    // 각 선수과목에 대해 재귀적으로 경로 찾기
    course.prerequisites.forEach(prereq => {
      findPaths(prereq, newPath);
    });
  }
  
  findPaths(targetCourseName, []);
  
  // 경로를 역순으로 반환 (선수과목 → 목표과목)
  return paths.map(path => path.reverse());
}

/**
 * 과목의 난이도 레벨 계산 (선수과목 체인의 깊이)
 */
export function getCourseLevel(courseName: string): number {
  const paths = getLearningPath(courseName);
  
  if (paths.length === 0) return 1;
  
  // 가장 긴 경로의 길이 = 난이도 레벨
  return Math.max(...paths.map(path => path.length));
}

/**
 * 두 과목 간의 연관도 계산
 */
export function getCourseRelation(course1: string, course2: string): {
  isPrerequisite: boolean;
  isFollowUp: boolean;
  sharedPrerequisites: string[];
  sharedFollowUps: string[];
} {
  const c1 = allCourses.find(c => c.name === course1);
  const c2 = allCourses.find(c => c.name === course2);
  
  const isPrerequisite = c1?.prerequisites?.includes(course2) || false;
  const isFollowUp = c2?.prerequisites?.includes(course1) || false;
  
  const prereq1 = c1?.prerequisites || [];
  const prereq2 = c2?.prerequisites || [];
  const sharedPrerequisites = prereq1.filter(p => prereq2.includes(p));
  
  const followUp1 = getFollowUpCourses(course1);
  const followUp2 = getFollowUpCourses(course2);
  const sharedFollowUps = followUp1.filter(f => followUp2.includes(f));
  
  return {
    isPrerequisite,
    isFollowUp,
    sharedPrerequisites,
    sharedFollowUps,
  };
}

/**
 * 특정 분야의 핵심 과목 (가장 많은 후수과목을 가진 과목들)
 */
export function getCoreCoursesInField(fieldCourses: string[]): string[] {
  const coursesWithFollowUps = fieldCourses.map(courseName => ({
    name: courseName,
    followUpCount: getFollowUpCourses(courseName).filter(f => 
      fieldCourses.includes(f)
    ).length,
  }));
  
  // 후수과목이 2개 이상인 과목들을 핵심 과목으로 간주
  return coursesWithFollowUps
    .filter(c => c.followUpCount >= 2)
    .sort((a, b) => b.followUpCount - a.followUpCount)
    .map(c => c.name);
}
