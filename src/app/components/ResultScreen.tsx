import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { UserData } from "@/app/App";
import { getRecommendations } from "@/app/utils/recommendations";
import { allCourses } from "@/app/utils/courseData";
import { careerRoadmaps } from "@/app/utils/courseRoadmaps";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResultScreenProps {
  userData: UserData;
  onCourseClick: (course: {
    name: string;
    category: string;
    credits: string;
    description: string;
    prerequisites?: string[];
  }, semester?: string) => void;
  onRestart: () => void;
  onViewAllTips: () => void;
  expandedSemester: string | null;
  expandedCourse: string | null;
  scrollPosition: number;
  onExpandedSemesterChange: (semester: string | null) => void;
  onExpandedCourseChange: (course: string | null) => void;
}

export function ResultScreen({
  userData,
  onCourseClick,
  onRestart,
  onViewAllTips,
  expandedSemester,
  expandedCourse: initialExpandedCourse,
  scrollPosition,
  onExpandedSemesterChange,
  onExpandedCourseChange,
}: ResultScreenProps) {
  const recommendations = getRecommendations(userData);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(initialExpandedCourse);
  const [surveyStartTime] = useState(() => {
    // App.tsx에서 전달받지 않으므로 localStorage에서 가져오기
    const savedTime = localStorage.getItem('survey_start_time');
    return savedTime ? parseInt(savedTime) : Date.now();
  });

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

  // 나이 계산
  const currentYear = 2025;
  const age = userData.age ? currentYear - parseInt(userData.age) + 1 : 0;

  // form_complete 이벤트 전송
  useEffect(() => {
    const totalTimeSeconds = Math.round((Date.now() - surveyStartTime) / 1000);
    
    // 전체 추천 과목 수 계산
    const totalRecommendedCourses = recommendations.semesterBasedRecommendations.reduce(
      (sum, semRec) => sum + semRec.courses.length,
      0
    );
    
    window.dataLayer = window.dataLayer || [];
    
    // form_complete 이벤트
    window.dataLayer.push({
      event: 'form_complete',
      recommended_courses_count: totalRecommendedCourses,
      recommended_semesters_count: recommendations.semesterBasedRecommendations.length,
      missing_required_count: recommendations.missingRequiredCourses.length,
      has_required_warning: recommendations.missingRequiredCourses.length > 0,
      total_time_seconds: totalTimeSeconds
    });

    console.log('📊 [GTM] form_complete:', {
      recommended_courses_count: totalRecommendedCourses,
      recommended_semesters_count: recommendations.semesterBasedRecommendations.length,
      missing_required_count: recommendations.missingRequiredCourses.length,
      has_required_warning: recommendations.missingRequiredCourses.length > 0,
      total_time_seconds: totalTimeSeconds
    });

    // survey_complete 이벤트
    window.dataLayer.push({
      event: 'survey_complete',
      total_duration: totalTimeSeconds,
      interest_areas: userData.interestArea.join(', '),
      career_paths: userData.careerPath.join(', ')
    });

    console.log('📊 [GTM] survey_complete:', {
      total_duration: totalTimeSeconds,
      interest_areas: userData.interestArea.join(', '),
      career_paths: userData.careerPath.join(', ')
    });

    // localStorage 정리
    localStorage.removeItem('survey_start_time');
  }, []);

  const handleCourseClick = (course: any, rank: number, semester: string) => {
    // course_detail_view 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'course_detail_view',
      course_name: course.name,
      course_category: course.category,
      is_required: course.category === "전공기초(필수)",
      recommendation_rank: rank + 1
    });

    console.log('📊 [GTM] course_detail_view:', {
      course_name: course.name,
      course_category: course.category,
      is_required: course.category === "전공기초(필수)",
      recommendation_rank: rank + 1
    });

    // prerequisites 추가
    const courseDetails = allCourses.find(c => c.name === course.name);
    onCourseClick({
      ...course,
      prerequisites: courseDetails?.prerequisites,
    }, semester);
  };

  // 스크롤 위치 복원
  useEffect(() => {
    if (scrollPosition > 0) {
      // DOM이 완전히 렌더링된 후 스크롤 복원
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
  }, [scrollPosition]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto pt-8 pb-12 space-y-6 relative">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Lecture Planning System
            </h2>
            <p className="text-blue-600">진로 맞춤 추천 시스템</p>
          </div>

          {/* 블러 처리된 콘텐츠 영역 */}
          <div className="transition-all duration-300">
            {/* 사용자 정보 요약 */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                {userData.name}님의 진로 정보
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="opacity-80">학번</span>
                  <p className="font-semibold">{userData.studentId}</p>
                </div>
                <div>
                  <span className="opacity-80">나이</span>
                  <p className="font-semibold">{age}세</p>
                </div>
                <div>
                  <span className="opacity-80">성별</span>
                  <p className="font-semibold">{userData.gender}</p>
                </div>
                <div>
                  <span className="opacity-80">다음 학기</span>
                  <p className="font-semibold">
                    {userData.grade} {userData.semester}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="opacity-80">진로 방향</span>
                  <p className="font-semibold">{userData.careerPath.join(", ")}</p>
                </div>
                <div className="col-span-2">
                  <span className="opacity-80">관심 분야</span>
                  <p className="font-semibold">
                    {userData.interestArea.map((area, idx) => `${idx + 1}. ${area}`).join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* 미이수 필수 과목 경고 */}
            {recommendations.missingRequiredCourses.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-6">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="text-red-900 font-bold mb-2">
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
                                  ({course.semester.replace("-", "학년 ")}학기)
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 학기별 전체 과목 추천 */}
            {recommendations.semesterBasedRecommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎓</span>
                  <span>학기별 추천 과목</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {userData.name}님의 관심분야를 바탕으로 현재 학기부터 4학년 1학기까지 들으면 좋은 과목들을 학기별로 정리했어요. 학기를 클릭하면 추천 과목을 확인할 수 있습니다.
                </p>

                <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full space-y-3"
                  defaultValue={expandedSemester ? `semester-${expandedSemester}` : undefined}
                  onValueChange={(value) => {
                    // Accordion 값 변경 시 상태 업데이트
                    if (value) {
                      const semester = value.replace('semester-', '');
                      onExpandedSemesterChange(semester);
                    } else {
                      onExpandedSemesterChange(null);
                    }
                  }}
                >
                  {recommendations.semesterBasedRecommendations.map((semRec, sIdx) => {
                    const [gradeNum, semNum] = semRec.semester.split('-');
                    const semesterLabel = `${gradeNum}학년 ${semNum}학기`;
                    
                    return (
                      <AccordionItem 
                        key={sIdx} 
                        value={`semester-${semRec.semester}`}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-indigo-700">
                              {semesterLabel}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({semRec.courses.length}개 과목)
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3 pt-2">
                            {semRec.courses.map((course: any, cIdx: number) => {
                              const isRequired = course.category === "전공기초(필수)";
                              
                              // 선수과목 확인
                              const { hasMissingPrereqs, missingPrereqs} = checkPrerequisites(course.name);
                              
                              const isExpanded = expandedCourse === `${semRec.semester}-${course.name}`;

                              return (
                                <div
                                  key={cIdx}
                                  className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                                    hasMissingPrereqs 
                                      ? 'border-orange-300 ring-2 ring-orange-200' 
                                      : 'border-gray-200'
                                  }`}
                                >
                                  {/* 과목명 버튼 */}
                                  <button
                                    onClick={() => {
                                      const newExpandedCourse = isExpanded ? null : `${semRec.semester}-${course.name}`;
                                      setExpandedCourse(newExpandedCourse);
                                      onExpandedCourseChange(newExpandedCourse);
                                    }}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
                                  >
                                    <div className="flex items-center gap-3 flex-1 text-left">
                                      <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 ${
                                          hasMissingPrereqs 
                                            ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                        } rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                                          {semRec.semester.split('-')[0]}
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
                                  {isExpanded && (() => {
                                    // 과목 전체 정보 가져오기
                                    const fullCourseData = allCourses.find(c => c.name === course.name);
                                    
                                    return (
                                    <div 
                                      className="border-t border-gray-200 bg-gray-50 p-6 space-y-6 cursor-pointer hover:bg-gray-100 transition-colors"
                                      onClick={() => handleCourseClick(course, cIdx, semRec.semester)}
                                    >
                                      {/* 추천 근거 */}
                                      {(course.reason || fullCourseData?.recommendationReason || course.recommendationReason || course.category === "전공기초(필수)") && (
                                        <div>
                                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">💡</span>
                                            <span>추천 근거</span>
                                          </h4>
                                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200">
                                            <div className="space-y-4">
                                              {(course.reason || fullCourseData?.recommendationReason || course.recommendationReason || "필수 과목입니다. 반드시 수강해야 합니다.")
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
                                      {(fullCourseData?.whatToLearn || course.whatToLearn) && (
                                        <div>
                                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-lg">📚</span>
                                            <span>무엇을 배우는가</span>
                                          </h4>
                                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
                                            <div className="space-y-4">
                                              {(fullCourseData?.whatToLearn || course.whatToLearn || "").split("\n").filter((line) => line.trim()).map((line, idx) => {
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

                                      {/* 클릭 안내 */}
                                      {(fullCourseData?.professorComment || fullCourseData?.seniorTip) && (
                                        <div className="text-center text-gray-700 py-2">
                                          <span className="text-2xl mr-2">👉</span>
                                          <span>클릭하면 교수님 코멘트 및 선배 꿀팁을 볼 수 있습니다</span>
                                        </div>
                                      )}
                                    </div>
                                    );
                                  })()}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}

            {recommendations.semesterBasedRecommendations.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎓</span>
                  <span>학기별 추천 과목</span>
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    추천할 수 있는 과목이 없습니다.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    모든 과목을 이미 수강하셨거나, 4학년 1학기 이상이실 수 있습니다.
                  </p>
                </div>
              </div>
            )}

            {/* 버튼들 */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={onRestart}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                🔄 다시하기
              </button>
              <button
                onClick={onViewAllTips}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                📚 다른 과목 꿀팁 확인하기
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              © 2025 한양대학교 산업공학과
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}