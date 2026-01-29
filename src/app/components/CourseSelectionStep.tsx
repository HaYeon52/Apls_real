import { useState, useEffect } from "react";
import { UserData } from "../App";
import { allCourses } from "../utils/courseData";

interface CourseSelectionStepProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CourseSelectionStep({
  userData,
  setUserData,
  onNext,
  onBack,
}: CourseSelectionStepProps) {
  const [startTime] = useState(Date.now());
  const [selectedCourses, setSelectedCourses] = useState<string[]>(
    userData.completedCourses || []
  );

  // 현재 학년-학기 이전의 과목들 필터링
  const currentGrade = parseInt(userData.grade.replace("학년", ""));
  const currentSemester = parseInt(userData.semester.replace("학기", ""));
  const currentSemesterNum = (currentGrade - 1) * 2 + currentSemester;

  const previousCourses = allCourses.filter((course) => {
    const [grade, sem] = course.semester.split("-");
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    
    // 통합 과목은 수강 완료 체크에서 제외 (개별 과목만 체크)
    if (course.name === '객체지향프로그래밍 + 데이터구조론') {
      return false;
    }
    
    return courseSemesterNum < currentSemesterNum;
  });

  // 페이지 이탈 감지
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'survey_exit',
        exit_step: 'step3',
        time_spent: Math.round((Date.now() - startTime) / 1000)
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime]);

  const toggleCourse = (courseName: string) => {
    console.log('🔄 토글된 과목:', courseName);
    setSelectedCourses((prev) => {
      const newList = prev.includes(courseName)
        ? prev.filter((name) => name !== courseName)
        : [...prev, courseName];
      console.log('📝 업데이트된 수강 과목 목록:', newList);
      return newList;
    });
  };

  const handleNext = () => {
    console.log('✅ 저장되는 수강 과목:', selectedCourses);
    setUserData({ ...userData, completedCourses: selectedCourses });

    const stepDuration = Math.round((Date.now() - startTime) / 1000);

    // 필수 과목 카운트
    const requiredCount = selectedCourses.filter(name => {
      const course = allCourses.find(c => c.name === name);
      return course && (course.category === "교양필수" || course.category === "전공기초(필수)");
    }).length;

    // 전체 이수 가능 과목 수 대비 이수율 계산
    const totalAvailableCourses = previousCourses.length;
    const completionRate = totalAvailableCourses > 0 
      ? Math.round((selectedCourses.length / totalAvailableCourses) * 100) 
      : 0;

    // GTM 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'step3_complete',
      completed_courses_count: selectedCourses.length,
      required_courses_count: requiredCount,
      completion_rate: `${completionRate}%`,
      step_duration: stepDuration
    });

    console.log('📊 [GTM] step3_complete:', {
      completed_courses_count: selectedCourses.length,
      required_courses_count: requiredCount,
      completion_rate: `${completionRate}%`,
      step_duration: stepDuration
    });

    onNext();
  };

  const handleBack = () => {
    // 뒤로가기 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'step_back',
      from_step: 'step3',
      to_step: 'step2'
    });

    console.log('📊 [GTM] step_back: step3 → step2');

    onBack();
  };

  // 학기별로 그룹화
  const coursesBySemester: Record<string, typeof previousCourses> = {};
  previousCourses.forEach((course) => {
    const semesterKey = course.semester.replace("-", "학년 ") + "학기";
    if (!coursesBySemester[semesterKey]) {
      coursesBySemester[semesterKey] = [];
    }
    coursesBySemester[semesterKey].push(course);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md mx-auto pt-8 pb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            All Lecture Planning System
          </h2>
          <p className="text-blue-600 mb-6">진로 맞춤 추천 시스템</p>

          {/* 진행 표시 */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  num < 3
                    ? "bg-blue-400 text-white"
                    : num === 3
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-300"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            수강한 수업을 선택해주세요
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* 과목 리스트 */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {Object.entries(coursesBySemester)
              .sort((a, b) => {
                const getSortKey = (key: string) => {
                  const match = key.match(/(\d)학년 (\d)학기/);
                  if (match) {
                    return parseInt(match[1]) * 10 + parseInt(match[2]);
                  }
                  return 0;
                };
                return getSortKey(a[0]) - getSortKey(b[0]);
              })
              .map(([semester, courses]) => (
                <div key={semester} className="space-y-2">
                  <h4 className="font-semibold text-gray-800 sticky top-0 bg-white py-2">
                    {semester}
                  </h4>
                  <div className="space-y-2">
                    {courses.map((course) => {
                      const isRequired =
                        course.category === "교양필수" ||
                        course.category === "전공기초(필수)";
                      const isSelected = selectedCourses.includes(
                        course.name
                      );

                      return (
                        <label
                          key={course.courseCode}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCourse(course.name)}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-900">
                                {course.name}
                              </span>
                              {isRequired && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                                  필수
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {course.category}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* 다음 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-4 rounded-lg font-medium transition bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              이전
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-4 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700"
            >
              다음
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2025 한양대학교 산업공학과
        </p>
      </div>
    </div>
  );
}
