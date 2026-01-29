import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";
import { getFollowUpCourses } from "../utils/courseRelationships";
import { allCourses } from "../utils/courseData";
import { ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CourseDetailPageProps {
  courseName: string;
  courseCategory: string;
  courseCredits: string;
  courseDescription: string;
  prerequisites?: string[];
  completedCourses?: string[];
  onBack: () => void;
}

export function CourseDetailPage({
  courseName,
  courseCategory,
  courseCredits,
  courseDescription,
  prerequisites,
  completedCourses = [],
  onBack,
}: CourseDetailPageProps) {
  const syllabus = getCourseSyllabus(courseName);
  const tips = getCourseTips(courseName);
  const followUpCourses = getFollowUpCourses(courseName);
  
  // 해당 과목 정보 가져오기
  const courseData = allCourses.find(c => c.name === courseName);

  // 미이수 선수과목 확인
  console.log('🔍 과목명:', courseName);
  console.log('🔍 선수과목:', prerequisites);
  console.log('🔍 수강완료 과목:', completedCourses);
  const missingPrerequisites = prerequisites?.filter(
    prereq => !completedCourses.includes(prereq)
  ) || [];
  console.log('🔍 미이수 선수과목:', missingPrerequisites);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-12 space-y-6">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>맞춤형 추천 결과로 돌아가기</span>
        </button>

        {/* 과목 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-3">{courseName}</h2>
          <div className="flex gap-3 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {courseCategory}
            </span>
            {courseData?.careerTags && courseData.careerTags.length > 0 && (
              <>
                {courseData.careerTags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tag === "취업" 
                        ? "bg-green-500 text-white" 
                        : tag === "창업"
                        ? "bg-purple-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {tag === "취업" ? "💼" : tag === "창업" ? "🚀" : "🎓"} {tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 과목 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="text-blue-900 font-medium mb-2 flex items-center gap-2">
            <span>📖</span>
            <span>과목 소개</span>
          </h3>
          <p className="text-gray-700">{courseDescription}</p>
        </div>

        {/* 선수과목 */}
        {prerequisites && prerequisites.length > 0 && (
          <div className={`rounded-xl p-5 border ${
            missingPrerequisites.length > 0 
              ? 'bg-orange-50 border-orange-300' 
              : 'bg-purple-50 border-purple-200'
          }`}>
            <h3 className={`font-medium mb-3 flex items-center gap-2 ${
              missingPrerequisites.length > 0 ? 'text-orange-900' : 'text-purple-900'
            }`}>
              <span>🔗</span>
              <span>선수과목 (먼저 들어야 하는 과목)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {prerequisites.map((prereq, idx) => {
                const isCompleted = completedCourses.includes(prereq);
                
                return isCompleted ? (
                  <span 
                    key={idx}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-1"
                  >
                    ✓ {prereq}
                  </span>
                ) : (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <span 
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md ring-2 ring-orange-300 cursor-help flex items-center gap-1"
                      >
                        ⚠️ {prereq}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-orange-600 text-white border-orange-700">
                      <div className="space-y-1">
                        <p className="font-bold text-sm">⚠️ 미이수 선수과목</p>
                        <p className="text-xs">이 과목을 수강하지 않았습니다. 수강에 어려움이 있거나<br />개인적인 추가 학습이 필요할 수 있습니다.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            {missingPrerequisites.length > 0 ? (
              <div className="bg-orange-100 rounded-lg p-3 mt-3 border border-orange-200">
                <p className="text-orange-900 text-sm font-medium flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{missingPrerequisites.length}개의 선수과목을 아직 수강하지 않았습니다. 이 과목을 수강하면 수강에 어려움이 있거나<br />개인적인 추가 학습이 필요할 수 있습니다.</span>
                </p>
              </div>
            ) : (
              <p className="text-purple-700 text-sm mt-3 flex items-start gap-2">
                <span>💡</span>
                <span>모든 선수과목을 수강했습니다. 이 과목을 수강할 준비가 되었습니다!</span>
              </p>
            )}
          </div>
        )}

        {/* 후수과목 */}
        {followUpCourses.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="text-green-900 font-medium mb-3 flex items-center gap-2">
              <span>🚀</span>
              <span>후수과목 (이 과목을 듣고 나면 들을 수 있는 과목)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {followUpCourses.map((followUp, idx) => (
                <span 
                  key={idx}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                >
                  {followUp}
                </span>
              ))}
            </div>
            <p className="text-green-700 text-sm mt-3 flex items-start gap-2">
              <span>✨</span>
              <span>이 과목을 듣고 나면 위의 과목들을 수강할 수 있는 자격을 얻게 됩니다.</span>
            </p>
          </div>
        )}

        {/* 교수님의 코멘트 */}
        {courseData?.professorComment && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl">
                  👨‍🏫
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-xl mb-1">교수님의 코멘트</h3>
                <p className="text-gray-500 text-sm">수업을 담당하시는 교수님의 조언입니다</p>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
              <div className="absolute -top-3 left-12 w-6 h-6 bg-blue-50 border-l-2 border-t-2 border-blue-200 transform rotate-45"></div>
              
              <div className="text-gray-700 whitespace-pre-line space-y-2">
                {courseData.professorComment.split("\n").map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith("•")) {
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
                      </div>
                    );
                  }
                  return trimmedLine ? <p key={idx}>{trimmedLine}</p> : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* 선배 꿀팁 */}
        {courseData?.seniorTip && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-4xl">
                  🎓
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-xl mb-1">선배 꿀팁</h3>
                <p className="text-gray-500 text-sm">이 과목을 수강한 선배들의 조언입니다</p>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
              <div className="absolute -top-3 left-12 w-6 h-6 bg-amber-50 border-l-2 border-t-2 border-amber-200 transform rotate-45"></div>
              
              <div className="text-gray-700 whitespace-pre-line space-y-2">
                {courseData.seniorTip.split("\n").map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith("•")) {
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
                      </div>
                    );
                  }
                  return trimmedLine ? <p key={idx}>{trimmedLine}</p> : null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
