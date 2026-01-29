import { useState } from "react";
import { allCourses } from "@/app/utils/courseData";
import { getLearningPath, getCourseLevel } from "@/app/utils/courseRelationships";
import { careerRoadmaps } from "@/app/utils/courseRoadmaps";

interface LearningPathPlannerProps {
  interestArea: string[];
}

export function LearningPathPlanner({ interestArea }: LearningPathPlannerProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [paths, setPaths] = useState<string[][]>([]);

  // 관심분야별 로드맵에 있는 모든 과목 수집
  const getRelevantCourses = () => {
    const relevantCourseNames = new Set<string>();
    
    interestArea.forEach(area => {
      const roadmap = careerRoadmaps[area];
      if (roadmap) {
        Object.values(roadmap).forEach(semesterCourses => {
          semesterCourses.forEach(courseName => {
            relevantCourseNames.add(courseName);
          });
        });
      }
    });

    return Array.from(relevantCourseNames).sort();
  };

  const handleCourseSelect = (courseName: string) => {
    setSelectedCourse(courseName);
    const learningPaths = getLearningPath(courseName);
    setPaths(learningPaths);
  };

  const relevantCourses = getRelevantCourses();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span>🗺️</span>
          <span>학습 경로 플래너</span>
        </h3>
        <p className="text-gray-600 text-sm">
          듣고 싶은 과목을 선택하면 어떤 과목들을 먼저 수강해야 하는지 확인할 수 있어요
        </p>
      </div>

      {/* 과목 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          목표 과목 선택
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => handleCourseSelect(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">과목을 선택하세요</option>
          {relevantCourses.map((courseName, idx) => {
            const course = allCourses.find(c => c.name === courseName);
            const level = getCourseLevel(courseName);
            return (
              <option key={idx} value={courseName}>
                {courseName} (Level {level}) - {course?.semester}
              </option>
            );
          })}
        </select>
      </div>

      {/* 학습 경로 표시 */}
      {selectedCourse && paths.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
              <span>🎯</span>
              <span>목표: {selectedCourse}</span>
            </h4>
            <p className="text-blue-700 text-sm">
              Level {getCourseLevel(selectedCourse)} 과목입니다. 
              {paths.length > 1 
                ? ` ${paths.length}가지 학습 경로가 있습니다.` 
                : " 아래 경로를 따라 수강하세요."}
            </p>
          </div>

          {paths.map((path, pathIdx) => (
            <div key={pathIdx} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  경로 {pathIdx + 1}
                </span>
                <span className="text-indigo-700 text-sm">
                  {path.length}단계
                </span>
              </div>
              
              <div className="space-y-2">
                {path.map((courseName, stepIdx) => {
                  const course = allCourses.find(c => c.name === courseName);
                  const isLast = stepIdx === path.length - 1;
                  
                  return (
                    <div key={stepIdx}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {stepIdx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-indigo-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-semibold ${isLast ? 'text-indigo-900 text-lg' : 'text-gray-900'}`}>
                                {courseName}
                              </span>
                              {isLast && (
                                <span className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold">
                                  목표
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 text-xs text-gray-600">
                              <span className="bg-gray-100 px-2 py-0.5 rounded">
                                {course?.semester}
                              </span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded">
                                {course?.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!isLast && (
                        <div className="ml-4 pl-4 py-2 border-l-2 border-indigo-300">
                          <span className="text-indigo-600 text-sm">↓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900 text-sm flex items-start gap-2">
              <span>💡</span>
              <span>
                <strong>Tip:</strong> 학습 경로에 표시된 순서대로 과목을 수강하면 
                체계적으로 지식을 쌓을 수 있습니다. 선수과목을 듣지 않고도 수강할 수 있지만, 
                선수과목을 먼저 들으면 훨씬 쉽게 이해할 수 있어요!
              </span>
            </p>
          </div>
        </div>
      )}

      {selectedCourse && paths.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-900 flex items-center gap-2">
            <span>✅</span>
            <span>
              <strong>{selectedCourse}</strong>은(는) 선수과목이 없는 기초 과목입니다. 
              바로 수강하실 수 있어요!
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
