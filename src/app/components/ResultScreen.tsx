import { UserData } from "../App";
import { getRecommendations } from "../utils/recommendations";
import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";
import { careerRoadmaps } from "../utils/courseRoadmaps";
import { allCourses } from "../utils/courseData";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useEffect, useState } from "react";
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

interface ResultScreenProps {
  userData: UserData;
  onCourseClick: (course: {
    name: string;
    category: string;
    credits: string;
    description: string;
    prerequisites?: string[];
  }) => void;
  onRestart: () => void;
  onViewAllTips: () => void;
}

export function ResultScreen({
  userData,
  onCourseClick,
  onRestart,
  onViewAllTips,
}: ResultScreenProps) {
  const recommendations = getRecommendations(userData);
  const [isSaved, setIsSaved] = useState(false);
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

  // 설문 결과 자동 저장 + form_complete 이벤트
  useEffect(() => {
    const saveSurveyResponse = async () => {
      try {
        console.log("📤 설문 결과를 서버로 전송합니다...");
        
        // 학기별 추천을 평탄화하여 전송
        const allRecommendedCourses = recommendations.semesterBasedRecommendations.flatMap(
          semRec => semRec.courses.map(c => ({
            semester: semRec.semester,
            name: c.name,
            score: c.score,
          }))
        );
        
        console.log("전송할 데이터:", {
          userData,
          recommendations: allRecommendedCourses,
        });

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-40a2eee1/survey/submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              userData,
              recommendations: allRecommendedCourses,
            }),
          }
        );

        const data = await response.json();
        console.log("📥 서버 응답:", data);
        
        if (data.success) {
          console.log("✅ 설문 결과가 성공적으로 저장되었습니다!");
          console.log("📊 저장된 ID:", data.surveyId);
          console.log("💾 저장된 데이터:", data.savedData);
          setIsSaved(true);
        } else {
          console.error("❌ 설문 저장 실패:", data.error);
          console.error("상세 정보:", data.details);
        }
      } catch (error) {
        console.error("❌ 설문 저장 중 오류:", error);
      }
    };

    // form_complete 이벤트 전송
    const totalTimeSeconds = Math.round((Date.now() - surveyStartTime) / 1000);
    
    // 전체 추천 과목 수 계산
    const totalRecommendedCourses = recommendations.semesterBasedRecommendations.reduce(
      (sum, semRec) => sum + semRec.courses.length,
      0
    );
    
    window.dataLayer = window.dataLayer || [];
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

    saveSurveyResponse();
  }, []);

  const handleCourseClick = (course: any, rank: number) => {
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
    });
  };



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

              <Accordion type="single" collapsible className="w-full space-y-3">
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
                            const { hasMissingPrereqs, missingPrereqs } = checkPrerequisites(course.name);
                            
                            // 로드맵 기반 - 어느 관심분야 로드맵에 속하는지 확인
                            const relevantInterests = userData.interestArea.filter((area) => {
                              const roadmap = careerRoadmaps[area];
                              if (!roadmap || !roadmap[course.semester]) return false;
                              return roadmap[course.semester].includes(course.name);
                            });

                            // 추천 근거 텍스트 생성
                            let reasonText = "";
                            if (isRequired) {
                              reasonText = "필수 과목입니다. 반드시 수강해야 합니다.";
                            } else if (relevantInterests.length > 0) {
                              const interestText = relevantInterests.join(", ");
                              const areaWord =
                                relevantInterests.length === 1 ? "분야로" : "분야들로";
                              reasonText = `${userData.name}님의 관심분야 ${interestText} ${areaWord} 가기 위해서 들어야 하는 과목입니다.`;
                            } else {
                              reasonText = `산업공학 전공 역량을 키우기 위해 추천하는 과목입니다.`;
                            }

                            return (
                              <div
                                key={cIdx}
                                onClick={() => {
                                  // 전공기초 과목이 아닌 경우만 클릭 가능
                                  if (course.weights) {
                                    handleCourseClick(course, cIdx);
                                  }
                                }}
                                className={`p-4 rounded-lg border transition-all ${
                                  hasMissingPrereqs 
                                    ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 ring-2 ring-orange-200' 
                                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                                } ${course.weights ? 'cursor-pointer hover:shadow-lg' : ''}`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <span className="text-gray-900 font-medium text-lg">
                                        {course.name}
                                      </span>
                                      {hasMissingPrereqs && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold cursor-help flex items-center gap-1">
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
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium">
                                          필수
                                        </span>
                                      )}
                                      {!isRequired && course.score >= 0.8 && (
                                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-medium">
                                          강력 추천
                                        </span>
                                      )}
                                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                        {course.category}
                                      </span>
                                    </div>

                                    {/* 추천 근거 */}
                                    <div className="bg-white rounded-lg p-3 mb-2">
                                      <p className="text-sm text-blue-900 font-medium mb-1">
                                        💡 추천 근거
                                      </p>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {course.recommendationReason || reasonText}
                                      </p>
                                    </div>

                                    {/* 무엇을 배우는가 */}
                                    {course.whatToLearn && (
                                      <div className="bg-white rounded-lg p-3 mb-2">
                                        <p className="text-sm text-green-900 font-medium mb-1">
                                          📖 무엇을 배우는가
                                        </p>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">
                                          {course.whatToLearn}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* 추천 근거 (전공기초 과목만) */}
                                    {course.recommendationReason && !course.weights && (
                                      <div className="bg-white rounded-lg p-3 mb-2">
                                        <p className="text-sm text-blue-900 font-medium mb-1">
                                          💡 추천 근거
                                        </p>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">
                                          {course.recommendationReason}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* 선배 꿀팁 (전공기초 과목만) */}
                                    {course.seniorTip && !course.weights && (
                                      <div className="bg-white rounded-lg p-3 mb-2">
                                        <p className="text-sm text-amber-900 font-medium mb-1">
                                          🎓 선배 꿀팁
                                        </p>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">
                                          {course.seniorTip}
                                        </p>
                                      </div>
                                    )}

                                    {/* 선수과목 표시 */}
                                    {course.prerequisites && course.prerequisites.length > 0 && (
                                      <div className="bg-purple-50 rounded-lg p-3 mb-2">
                                        <p className="text-sm text-purple-900 font-medium mb-2">
                                          🔗 선수과목
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {course.prerequisites.map((prereq: string, pIdx: number) => (
                                            <span 
                                              key={pIdx}
                                              className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs"
                                            >
                                              {prereq}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* 클릭 안내 (전공기초 과목이 아닌 경우만) */}
                                    {course.weights && (
                                      <div className="text-center mt-3">
                                        <p className="text-xs text-blue-600 font-medium">
                                          👆 클릭하면 교수님의 코멘트와 선배의 꿀팁을 볼 수 있어요
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
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