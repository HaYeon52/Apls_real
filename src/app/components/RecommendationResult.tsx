import { UserData } from "../App";
import { getRecommendations } from "../utils/recommendations";
import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";
import { careerRoadmaps } from "../utils/courseRoadmaps";
import { allCourses } from "../utils/courseData";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface RecommendationResultProps {
  userData: UserData;
  onReset: () => void;
  onCourseClick: (course: {
    name: string;
    category: string;
    credits: string;
    description: string;
  }) => void;
}

interface Course {
  name: string;
  description: string;
  category: string;
  credits: string;
  semester: string;
}

export function RecommendationResult({
  userData,
  onReset,
  onCourseClick,
}: RecommendationResultProps) {
  const recommendations = getRecommendations(userData);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // 선수과목 확인 헬퍼 함수
  const checkPrerequisites = (courseName: string) => {
    const course = allCourses.find(c => c.name === courseName);
    if (!course || !course.prerequisites || course.prerequisites.length === 0) {
      return { hasMissingPrereqs: false, missingPrereqs: [] };
    }

    const missingPrereqs = course.prerequisites.filter(
      prereq => !userData.completedCourses.includes(prereq)
    );

    return {
      hasMissingPrereqs: missingPrereqs.length > 0,
      missingPrereqs,
    };
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
        <h3 className="mb-3">{userData.name}님의 진로 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">학번</p>
            <p>{userData.studentId}</p>
          </div>
          <div>
            <p className="opacity-90">나이</p>
            <p>{userData.age}년생 ({2026 - parseInt(userData.age)}세)</p>
          </div>
          <div>
            <p className="opacity-90">성별</p>
            <p>
              {userData.gender}
              {userData.gender === '남성' && (
                <span className="ml-2">
                  ({userData.militaryCompleted ? '군필' : '미필'})
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="opacity-90">다음 학기</p>
            <p>
              {userData.grade} {userData.semester}
            </p>
          </div>
          <div className="col-span-2">
            <p className="opacity-90">진로 방향</p>
            <p>
              {userData.careerPath
                .map((path, idx) => `${idx + 1}. ${path}`)
                .join(", ")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="opacity-90">관심 분야</p>
            <p>
              {userData.interestArea
                .map((area, idx) => `${idx + 1}. ${area}`)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {/* 미이수 필수 과목 경고 */}
        {recommendations.missingRequiredCourses.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="text-red-900 mb-2">
                  아직 듣지 않은 필수 수업이 있어요!
                </h4>
                <p className="text-sm text-red-800 mb-3">
                  다음 필수 과목을 반드시 이수해야 졸업할 수 있습니다.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <div className="space-y-2">
                    {recommendations.missingRequiredCourses.map(
                      (course, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-red-100 pb-2 last:border-0 last:pb-0"
                        >
                          <div>
                            <span className="text-red-900 font-medium">
                              {course.name}
                            </span>
                            <span className="text-sm text-red-600 ml-2">
                              ({course.semester.replace('-', '학년 ')}학기)
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 이번 학기 추천 전공 수업 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <h4 className="text-gray-900">
              {userData.grade} {userData.semester} 추천 전공 수업
            </h4>
          </div>

          {recommendations.currentSemesterCourses.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                이번 학기에 추천할 수 있는 과목이 없습니다.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                모든 과목을 이미 수강하셨거나, 개설된 과목이 없을 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.currentSemesterCourses.map(
                (course: any, index: number) => {
                  const isRequired = course.category === "전공기초(필수)";
                  const syllabus = getCourseSyllabus(course.name);
                  const tips = getCourseTips(course.name);
                  
                  // 선수과목 확인
                  const { hasMissingPrereqs, missingPrereqs } = checkPrerequisites(course.name);

                  const isExpanded = expandedCourse === course.name;

                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                        hasMissingPrereqs 
                          ? 'border-orange-300 ring-2 ring-orange-200' 
                          : 'border-gray-200'
                      }`}
                    >
                      {/* 과목명 버튼 */}
                      <button
                        onClick={() => setExpandedCourse(isExpanded ? null : course.name)}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 ${
                              hasMissingPrereqs 
                                ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            } rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                              {course.semester.split('-')[0]}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-gray-900 text-lg">
                                {course.name}
                              </h3>
                              {hasMissingPrereqs && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold cursor-help flex items-center gap-1">
                                      ⚠️ 선수과목 미이수
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-orange-600 text-white border-orange-700">
                                    <div className="space-y-2">
                                      <p className="font-bold text-sm">⚠️ 경고</p>
                                      <p className="text-sm">
                                        다음 선수과목을 수강하지 않았습니다:
                                      </p>
                                      <ul className="text-xs list-disc list-inside space-y-1">
                                        {missingPrereqs.map((prereq, idx) => (
                                          <li key={idx}>{prereq}</li>
                                        ))}
                                      </ul>
                                      <p className="text-xs mt-2 pt-2 border-t border-orange-500">수강에 어려움이 있거나<br />개인적인 추가 학습이 필요할 수 있습니다.</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {isRequired && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-medium">
                                  필수
                                </span>
                              )}
                              {!isRequired && course.score >= 0.8 && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded font-medium">
                                  강력 추천
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm text-gray-500">
                                {course.category}
                              </p>
                              <span className="text-gray-300">•</span>
                              <p className="text-sm text-gray-500">
                                {course.credits}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="text-blue-600" size={24} />
                          ) : (
                            <ChevronDown className="text-gray-400" size={24} />
                          )}
                        </div>
                      </button>

                      {/* 확장된 내용 */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                          {/* 추천 근거 */}
                          {course.recommendationReason && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="text-lg">💡</span>
                                <span>추천 근거</span>
                              </h4>
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200">
                                <div className="space-y-4">
                                  {course.recommendationReason
                                    .split("\n")
                                    .filter((line) => line.trim())
                                    .map((line, idx) => {
                                      const trimmedLine = line.trim();
                                      if (trimmedLine.startsWith("•")) {
                                        const content = trimmedLine.substring(1).trim();
                                        const colonIndex = content.indexOf(":");
                                        if (colonIndex > 0) {
                                          const label = content.substring(0, colonIndex).trim();
                                          const text = content.substring(colonIndex + 1).trim();
                                          return (
                                            <div key={idx}>
                                              <div className="font-semibold text-blue-800 text-base mb-1">
                                                {label}
                                              </div>
                                              <p className="text-gray-700 text-base leading-relaxed">
                                                {text}
                                              </p>
                                            </div>
                                          );
                                        }
                                        return (
                                          <p key={idx} className="text-gray-700 text-base leading-relaxed">
                                            {content}
                                          </p>
                                        );
                                      }
                                      return (
                                        <p key={idx} className="text-gray-700 text-base leading-relaxed">
                                          {trimmedLine}
                                        </p>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 무엇을 배우는가 */}
                          {course.whatToLearn && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="text-lg">📚</span>
                                <span>무엇을 배우는가</span>
                              </h4>
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
                                <div className="space-y-4">
                                  {course.whatToLearn
                                    .split("\n")
                                    .filter((line) => line.trim())
                                    .map((line, idx) => {
                                      const trimmedLine = line.trim();
                                      if (trimmedLine.startsWith("•")) {
                                        const content = trimmedLine.substring(1).trim();
                                        const colonIndex = content.indexOf(":");
                                        if (colonIndex > 0) {
                                          const label = content.substring(0, colonIndex).trim();
                                          const text = content.substring(colonIndex + 1).trim();
                                          return (
                                            <div key={idx}>
                                              <div className="font-semibold text-green-800 text-base mb-1">
                                                {label}
                                              </div>
                                              <p className="text-gray-700 text-base leading-relaxed">
                                                {text}
                                              </p>
                                            </div>
                                          );
                                        }
                                        return (
                                          <p key={idx} className="text-gray-700 text-base leading-relaxed">
                                            {content}
                                          </p>
                                        );
                                      }
                                      if (trimmedLine.startsWith("◦")) {
                                        const content = trimmedLine.substring(1).trim();
                                        return (
                                          <p key={idx} className="text-gray-700 text-base leading-relaxed ml-4">
                                            {content}
                                          </p>
                                        );
                                      }
                                      return (
                                        <p key={idx} className="text-gray-700 text-base leading-relaxed">
                                          {trimmedLine}
                                        </p>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 교수님 코멘트 */}
                          {course.professorComment && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="text-lg">👨‍🏫</span>
                                <span>교수님 코멘트</span>
                              </h4>
                              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-5 border-2 border-purple-200">
                                <div className="space-y-4">
                                  {course.professorComment
                                    .split("\n")
                                    .filter((line) => line.trim())
                                    .map((line, idx) => {
                                      const trimmedLine = line.trim();
                                      if (trimmedLine.startsWith("•")) {
                                        const content = trimmedLine.substring(1).trim();
                                        const colonIndex = content.indexOf(":");
                                        if (colonIndex > 0) {
                                          const label = content.substring(0, colonIndex).trim();
                                          const text = content.substring(colonIndex + 1).trim();
                                          return (
                                            <div key={idx}>
                                              <div className="font-semibold text-purple-800 text-base mb-1">
                                                {label}
                                              </div>
                                              <p className="text-gray-700 text-base leading-relaxed">
                                                {text}
                                              </p>
                                            </div>
                                          );
                                        }
                                        return (
                                          <p key={idx} className="text-gray-700 text-base leading-relaxed">
                                            {content}
                                          </p>
                                        );
                                      }
                                      return (
                                        <p key={idx} className="text-gray-700 text-base leading-relaxed">
                                          {trimmedLine}
                                        </p>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 선배 꿀팁 */}
                          {course.seniorTip && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="text-lg">🎓</span>
                                <span>선배 꿀팁</span>
                              </h4>
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border-2 border-amber-200">
                                <div>
                                  {(() => {
                                    const lines = course.seniorTip.split('\n').filter(line => line.trim());
                                    const sections: { type: 'section' | 'regular', title?: string, items: string[] }[] = [];
                                    let currentSection: { type: 'section' | 'regular', title?: string, items: string[] } | null = null;
                                    
                                    lines.forEach(line => {
                                      const trimmed = line.trim();
                                      
                                      // [이론] 또는 [실험] 섹션 감지
                                      if (trimmed.startsWith('[') && trimmed.includes(']')) {
                                        if (currentSection) sections.push(currentSection);
                                        const title = trimmed.substring(1, trimmed.indexOf(']'));
                                        currentSection = { type: 'section', title, items: [] };
                                      } else if (trimmed.startsWith('•')) {
                                        const content = trimmed.substring(1).trim();
                                        if (currentSection && currentSection.type === 'section') {
                                          currentSection.items.push(content);
                                        } else {
                                          if (currentSection) sections.push(currentSection);
                                          currentSection = { type: 'regular', items: [content] };
                                        }
                                      } else if (trimmed) {
                                        // 일반 텍스트
                                        if (currentSection && currentSection.type === 'section') {
                                          currentSection.items.push(trimmed);
                                        } else {
                                          if (currentSection) sections.push(currentSection);
                                          currentSection = { type: 'regular', items: [trimmed] };
                                        }
                                      }
                                    });
                                    
                                    if (currentSection) sections.push(currentSection);
                                    
                                    return sections.map((section, sectionIdx) => {
                                      if (section.type === 'section') {
                                        // [이론] 또는 [실험] 섹션
                                        return (
                                          <div key={sectionIdx} className={sectionIdx > 0 ? "mt-6" : ""}>
                                            <div className="font-bold text-amber-900 text-lg mb-4 flex items-center gap-2">
                                              📌 {section.title}
                                            </div>
                                            <div className="space-y-4">
                                              {section.items.map((item, itemIdx) => {
                                                const colonIndex = item.indexOf(':');
                                                if (colonIndex > 0) {
                                                  const label = item.substring(0, colonIndex).trim();
                                                  const text = item.substring(colonIndex + 1).trim();
                                                  return (
                                                    <div key={itemIdx}>
                                                      <div className="font-semibold text-amber-800 text-base mb-1">
                                                        {label}
                                                      </div>
                                                      <p className="text-gray-700 text-base leading-relaxed">
                                                        {text}
                                                      </p>
                                                    </div>
                                                  );
                                                }
                                                return (
                                                  <p key={itemIdx} className="text-gray-700 text-base leading-relaxed">
                                                    {item}
                                                  </p>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        // 일반 bullet 항목들
                                        return section.items.map((item, itemIdx) => {
                                          const colonIndex = item.indexOf(':');
                                          const isFirst = sectionIdx === 0 && itemIdx === 0;
                                          
                                          if (colonIndex > 0) {
                                            const label = item.substring(0, colonIndex).trim();
                                            const text = item.substring(colonIndex + 1).trim();
                                            return (
                                              <div key={`${sectionIdx}-${itemIdx}`} className={!isFirst ? "mt-4" : ""}>
                                                <div className="font-semibold text-amber-800 text-base mb-1">
                                                  {label}
                                                </div>
                                                <p className="text-gray-700 text-base leading-relaxed">
                                                  {text}
                                                </p>
                                              </div>
                                            );
                                          }
                                          return (
                                            <div key={`${sectionIdx}-${itemIdx}`} className={!isFirst ? "mt-4" : ""}>
                                              <p className="text-gray-700 text-base leading-relaxed">
                                                {item}
                                              </p>
                                            </div>
                                          );
                                        });
                                      }
                                    });
                                  })()}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          다시하기
        </button>
        <button
          onClick={() => {
            // TODO: 저장하기 기능
            alert('저장 기능은 준비 중입니다.');
          }}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          저장하기
        </button>
        <button
          onClick={() => {
            // TODO: 공유하기 기능
            alert('공유 기능은 준비 중입니다.');
          }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          공유하기
        </button>
      </div>
    </div>
    </TooltipProvider>
  );
}