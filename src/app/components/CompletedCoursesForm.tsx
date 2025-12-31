import { useState, useEffect } from 'react';
import { UserData } from '../App';
import { allCourses } from '../utils/courseData';

interface CompletedCoursesFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CompletedCoursesForm({ userData, setUserData, onNext, onBack }: CompletedCoursesFormProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(userData.completedCourses || []);

  // 현재 학년-학기 이전의 과목들 필터링
  const currentGrade = parseInt(userData.grade.replace('학년', ''));
  const currentSemester = parseInt(userData.semester.replace('학기', ''));
  const currentSemesterNum = (currentGrade - 1) * 2 + currentSemester;

  const previousCourses = allCourses.filter(course => {
    const [grade, sem] = course.semester.split('-');
    const courseSemesterNum = (parseInt(grade) - 1) * 2 + parseInt(sem);
    return courseSemesterNum < currentSemesterNum;
  });

  const toggleCourse = (courseCode: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseCode)) {
        return prev.filter(code => code !== courseCode);
      } else {
        return [...prev, courseCode];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 경고 없이 바로 다음으로 진행
    setUserData({ ...userData, completedCourses: selectedCourses });
    onNext();
  };

  // 학기별로 그룹화
  const coursesBySemester: Record<string, typeof previousCourses> = {};
  previousCourses.forEach(course => {
    const semesterKey = course.semester.replace('-', '학년 ') + '학기';
    if (!coursesBySemester[semesterKey]) {
      coursesBySemester[semesterKey] = [];
    }
    coursesBySemester[semesterKey].push(course);
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-2">들은 수업을 체크해주세요</h3>
        <p className="text-sm text-gray-600">
          {userData.grade} {userData.semester} 이전에 수강한 과목을 모두 선택해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 학기별 과목 리스트 */}
        <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-4">
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
              <div key={semester} className="mb-6 last:mb-0">
                <h4 className="text-blue-900 mb-3 sticky top-0 bg-white py-2">{semester}</h4>
                <div className="space-y-2">
                  {courses.map((course) => {
                    const isRequired = course.category === '교양필수' || 
                                     course.category === '전공기초(필수)';
                    const isSelected = selectedCourses.includes(course.courseCode);

                    return (
                      <label
                        key={course.courseCode}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCourse(course.courseCode)}
                          className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{course.name}</span>
                            {isRequired && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                필수
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {course.category}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {course.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            학점: {course.credits} | 학수번호: {course.courseCode}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            이전
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            다음
          </button>
        </div>
      </form>
    </div>
  );
}