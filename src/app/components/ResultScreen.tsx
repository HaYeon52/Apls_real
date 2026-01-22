import { UserData } from "../App";
import { getRecommendations } from "../utils/recommendations";
import { generateSWOT } from "../utils/swotAnalysis";
import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";
import { courseInterestMapping } from "../utils/recommendations";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useEffect, useState } from "react";

interface ResultScreenProps {
  userData: UserData;
  onCourseClick: (course: {
    name: string;
    category: string;
    credits: string;
    description: string;
  }) => void;
  onRestart: () => void;
}

export function ResultScreen({
  userData,
  onCourseClick,
  onRestart,
}: ResultScreenProps) {
  const recommendations = getRecommendations(userData);
  const swot = generateSWOT(userData);
  const [isSaved, setIsSaved] = useState(false);

  // 나이 계산
  const currentYear = 2025;
  const age = userData.age ? currentYear - parseInt(userData.age) + 1 : 0;

  // 설문 결과 자동 저장
  useEffect(() => {
    const saveSurveyResponse = async () => {
      try {
        console.log("📤 설문 결과를 서버로 전송합니다...");
        console.log("전송할 데이터:", {
          userData,
          recommendations: Array.isArray(recommendations) 
            ? recommendations.map(r => r.name) 
            : [],
          swot,
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
              recommendations: Array.isArray(recommendations) 
                ? recommendations.map(r => r.name) 
                : [],
              swot,
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

    saveSurveyResponse();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-12 space-y-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All Lecture Planning System
          </h2>
          <p className="text-blue-600">진로 맞춤 추천 시스템</p>
        </div>

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

        {/* SWOT 분석 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {userData.name}님의 SWOT 분석 결과
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">💪</span>
                <span>S (강점)</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {swot.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4">
              <h4 className="font-bold text-rose-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                <span>W (약점)</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {swot.weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span>O (기회)</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {swot.opportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
              <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>T (위협)</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {swot.threats.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 미이수 필수 과목 경고 */}
        {recommendations.missingRequiredCourses.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
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

        {/* 이번 학기 추천 과목 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📚</span>
            <span>
              {userData.grade} {userData.semester} 추천 전공 수업
            </span>
          </h3>

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

                  // 관심분야 중 과목의 가중치가 있는 분야만 필터링
                  const courseMapping = courseInterestMapping[course.name] || {};
                  const relevantInterests = userData.interestArea.filter(
                    (area) => courseMapping[area] && courseMapping[area] > 0
                  );

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
                      key={index}
                      onClick={() =>
                        onCourseClick({
                          name: course.name,
                          category: course.category,
                          credits: course.credits,
                          description: course.description,
                        })
                      }
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-gray-900 font-medium text-lg">
                              {course.name}
                            </span>
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
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                              {course.credits}
                            </span>
                          </div>

                          {/* 근거 */}
                          <div className="bg-white rounded-lg p-3 mb-2">
                            <p className="text-sm text-blue-900 font-medium mb-1">
                              💡 추천 근거
                            </p>
                            <p className="text-sm text-gray-700">{reasonText}</p>
                          </div>

                          {/* 무엇을 배우는가 */}
                          <div className="bg-white rounded-lg p-3 mb-2">
                            <p className="text-sm text-green-900 font-medium mb-1">
                              📖 무엇을 배우는가
                            </p>
                            <p className="text-sm text-gray-700">
                              {course.description}
                            </p>
                          </div>

                          {/* 클릭 안내 */}
                          <div className="text-center mt-3">
                            <p className="text-xs text-blue-600 font-medium">
                              👆 클릭하면 교수님의 코멘트와 선배의 꿀팁을 볼 수 있어요
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* 다시하기 버튼 */}
        <button
          onClick={onRestart}
          className="w-full bg-gray-600 text-white py-4 rounded-lg hover:bg-gray-700 transition font-medium"
        >
          다시 시작하기
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 한양대학교 산업공학과
        </p>
      </div>
    </div>
  );
}