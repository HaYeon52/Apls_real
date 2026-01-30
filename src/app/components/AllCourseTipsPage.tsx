import { useState, useEffect } from "react";
import { allCourses } from "@/app/utils/courseData";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

interface AllCourseTipsPageProps {
  onBack: () => void;
}

export function AllCourseTipsPage({ onBack }: AllCourseTipsPageProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // 페이지 로드 시 최상단으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCourse = (courseName: string) => {
    setExpandedCourse(expandedCourse === courseName ? null : courseName);
  };

  // 추천 근거, 무엇을 배우는가, 교수님 코멘트, 선배 꿀팁 중 하나라도 있는 과목만 필터링
  const coursesWithContent = allCourses.filter(
    (course) =>
      course.recommendationReason ||
      course.whatToLearn ||
      course.professorComment ||
      course.seniorTip
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-12">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium mb-6"
        >
          <ArrowLeft size={20} />
          <span>결과로 돌아가기</span>
        </button>

        {/* 제목 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            📚 모든 과목 꿀팁 모음
          </h2>
          <p className="text-gray-600">
            과목명을 클릭하면 추천 근거, 교수님 코멘트, 선배 꿀팁을 확인할 수
            있습니다
          </p>
        </div>

        {/* 과목 목록 */}
        <div className="space-y-3">
          {coursesWithContent.map((course) => {
            const isExpanded = expandedCourse === course.name;

            return (
              <div
                key={course.name}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                {/* 과목명 버튼 */}
                <button
                  onClick={() => toggleCourse(course.name)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {course.semester}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {course.category}
                      </p>
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
                            {course.whatToLearn.split("\n").filter((line) => line.trim()).map((line, idx) => {
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
                              const lines = course.seniorTip.split("\n").filter(line => line.trim());
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
          })}
        </div>
      </div>
    </div>
  );
}