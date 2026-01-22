import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";
import { ArrowLeft } from "lucide-react";

interface CourseDetailPageProps {
  courseName: string;
  courseCategory: string;
  courseCredits: string;
  courseDescription: string;
  onBack: () => void;
}

export function CourseDetailPage({
  courseName,
  courseCategory,
  courseCredits,
  courseDescription,
  onBack,
}: CourseDetailPageProps) {
  const syllabus = getCourseSyllabus(courseName);
  const tips = getCourseTips(courseName);

  return (
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
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {courseCredits}
            </span>
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

        {/* 교수님의 코멘트 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 font-bold text-xl mb-1">교수님의 코멘트</h3>
              <p className="text-gray-500 text-sm">수업을 진행하시는 교수님께서 직접 전하는 말씀입니다</p>
            </div>
          </div>
          
          {/* 말풍선 */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
            {/* 말풍선 꼬리 */}
            <div className="absolute -top-3 left-12 w-6 h-6 bg-blue-50 border-l-2 border-t-2 border-blue-200 transform rotate-45"></div>
            
            <div
              className="prose prose-sm max-w-none"
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.8",
              }}
            >
              <div className="space-y-4">
                {syllabus.split("\n").map((line, idx) => {
                  const trimmedLine = line.trim();

                  // 교수님의 한마디 스타일
                  if (trimmedLine.startsWith("<교수님의 한마디>")) {
                    return (
                      <div key={idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 mb-4">
                        <h4 className="text-indigo-900 font-bold text-sm mb-1">💬 교수님의 한마디</h4>
                      </div>
                    );
                  }

                  // 섹션 헤더 스타일 (<💡 과목의 핵심 목표> 등)
                  if (trimmedLine.match(/^<[💡🚀📝].*>$/)) {
                    const icon = trimmedLine.match(/[💡🚀📝]/)?.[0] || "";
                    const text = trimmedLine.replace(/<|>/g, "").replace(/[💡🚀📝]/g, "").trim();
                    return (
                      <div key={idx} className="mt-6 mb-3">
                        <h4 className="text-gray-900 font-bold flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <span>{text}</span>
                        </h4>
                      </div>
                    );
                  }

                  // 기존 섹션 헤더 스타일
                  if (trimmedLine.match(/^<.*>$/)) {
                    const text = trimmedLine.replace(/<|>/g, "");
                    return (
                      <div key={idx} className="mt-6 mb-2">
                        <h4 className="text-gray-900 font-semibold text-base">{text}</h4>
                      </div>
                    );
                  }

                  // 불릿 포인트 스타일
                  if (trimmedLine.startsWith("•")) {
                    return (
                      <div key={idx} className="ml-4 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700 flex-1">{trimmedLine.substring(1).trim()}</span>
                      </div>
                    );
                  }

                  // 번호 리스트 스타일
                  if (trimmedLine.match(/^\d+\./)) {
                    return (
                      <div key={idx} className="ml-4 text-gray-700">
                        {trimmedLine}
                      </div>
                    );
                  }

                  // 인용구 스타일 (따옴표로 시작)
                  if (trimmedLine.startsWith('"')) {
                    return (
                      <div key={idx} className="bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 my-3">
                        <p className="text-gray-800 italic text-lg font-medium">{trimmedLine}</p>
                      </div>
                    );
                  }

                  // 일반 텍스트 스타일
                  if (trimmedLine) {
                    // **굵게** 표시 처리
                    const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className="text-gray-700 leading-relaxed">
                        {parts.map((part, i) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 선배의 꿀팁 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-amber-900 font-bold text-xl mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>선배의 꿀팁</span>
          </h3>
          <ul className="space-y-3">
            {tips.map((tip, idx) => (
              <li
                key={idx}
                className="bg-white rounded-lg p-4 border border-amber-200 flex items-start gap-3"
              >
                <span className="text-amber-600 font-bold text-lg flex-shrink-0">
                  {idx + 1}.
                </span>
                <span className="text-gray-800">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 하단 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          추천 결과로 돌아가기
        </button>
      </div>
    </div>
  );
}