import { useState } from "react";
import { UserData } from "../App";
import { getRecommendations } from "../utils/recommendations";

interface RecommendationResultProps {
  userData: UserData;
  onReset: () => void;
}

interface Course {
  name: string;
  description: string;
  category: string;
  credits: string;
}

export function RecommendationResult({
  userData,
  onReset,
}: RecommendationResultProps) {
  const recommendations = getRecommendations(userData);
  const currentYear = 2025;
  const age = currentYear - parseInt(userData.birthYear);
  const [openCourseInfo, setOpenCourseInfo] = useState<
    string | null
  >(null);

  const toggleCourseInfo = (courseName: string) => {
    setOpenCourseInfo(
      openCourseInfo === courseName ? null : courseName,
    );
  };

  // 전공 구분 설명
  const categoryExplanations: Record<string, string> = {
    "전공기초(필수)":
      "산업공학과 학생이라면 반드시 이수해야 하는 기초 과목",
    전공핵심: "산업공학 전공의 핵심이 되는 과목",
    전공심화: "특정 분야를 심화 학습하는 선택 과목",
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
        <h3 className="mb-3">{userData.name}님의 진로 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">출생년도</p>
            <p>
              {userData.birthYear}년생 ({age}세)
            </p>
          </div>
          <div>
            <p className="opacity-90">성별</p>
            <p>{userData.gender}</p>
          </div>
          <div>
            <p className="opacity-90">다음 학기</p>
            <p>
              {userData.grade} {userData.semester}
            </p>
          </div>
          <div>
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
                <h4 className="text-red-900 mb-2">아직 듣지 않은 필수 수업이 있어요!</h4>
                <p className="text-sm text-red-800 mb-3">
                  다음 필수 과목을 반드시 이수해야 졸업할 수 있습니다.
                </p>
                <div className="bg-white rounded-lg p-4">
                  <div className="space-y-2">
                    {recommendations.missingRequiredCourses.map((course, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-red-600">•</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-red-900 font-medium">{course.name}</span>
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                              {course.category}
                            </span>
                          </div>
                          <div className="text-gray-600 text-xs mt-1">
                            {course.semester.replace('-', '학년 ')}학기 개설 | 학점: {course.credits}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 전공 학점 현황 */}
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
          <h4 className="text-blue-900 mb-3">
            💯 전공 학점 현황
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-gray-600">
                이수 완료
              </div>
              <div className="text-2xl font-bold text-green-700">
                {recommendations.completedMajorCredits}
              </div>
              <div className="text-xs text-gray-500">학점</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-gray-600">
                추천 학점
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {recommendations.recommendedMajorCredits}
              </div>
              <div className="text-xs text-gray-500">학점</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-gray-600">합계</div>
              <div
                className={`text-2xl font-bold ${recommendations.totalMajorCredits >= 83 ? "text-green-700" : "text-red-700"}`}
              >
                {recommendations.totalMajorCredits}
              </div>
              <div className="text-xs text-gray-500">
                / 83 학점
              </div>
            </div>
          </div>
          {recommendations.totalMajorCredits < 83 && (
            <div className="mt-3 text-sm text-red-700 text-center">
              ⚠️ 졸업을 위해{" "}
              {(83 - recommendations.totalMajorCredits).toFixed(
                1,
              )}
              학점이 더 필요합니다.
            </div>
          )}
        </div>

        {/* 전공 수업 - 학기별로 구분 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📚</span>
            <h4 className="text-gray-900">추천 전공 수업</h4>
          </div>

          {/* 전공 구분 설명 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
            <div className="text-blue-900 mb-2">
              📌 전공 구분 안내
            </div>
            <div className="space-y-1 text-gray-700">
              {Object.entries(categoryExplanations).map(
                ([category, explanation]) => (
                  <div
                    key={category}
                    className="flex items-start gap-2"
                  >
                    <span className="text-blue-600">•</span>
                    <span>
                      <strong>{category}:</strong> {explanation}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* 학기별 과목 */}
          <div className="space-y-4">
            {Object.entries(
              recommendations.majorCoursesBySemester,
            )
              .sort((a, b) => {
                // 학기 순서대로 정렬 (1학년 1학기 -> 4학년 2학기)
                const getSortKey = (key: string) => {
                  const match = key.match(/(\d)학년 (\d)학기/);
                  if (match) {
                    return (
                      parseInt(match[1]) * 10 +
                      parseInt(match[2])
                    );
                  }
                  return 0;
                };
                return getSortKey(a[0]) - getSortKey(b[0]);
              })
              .map(([semester, courses]) => (
                <div
                  key={semester}
                  className="bg-blue-50 rounded-lg p-4"
                >
                  <h5 className="text-blue-900 mb-3">
                    {semester}
                  </h5>
                  <div className="space-y-2">
                    {(courses as Course[]).map(
                      (course, index) => {
                        const isRequired =
                          course.category === "교양필수" ||
                          course.category ===
                            "전공기초(필수)";

                        return (
                          <div
                            key={index}
                            className="bg-white p-3 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-900">
                                    {course.name}
                                  </span>
                                  {isRequired && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium">
                                      필수
                                    </span>
                                  )}
                                  <button
                                    onClick={() =>
                                      toggleCourseInfo(
                                        course.name,
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800 transition"
                                    title="과목 정보 보기"
                                  >
                                    ⓘ
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {course.description}
                                </p>

                                {/* 과목 상세 정보 (토글) */}
                                {openCourseInfo ===
                                  course.name && (
                                  <div className="mt-2 pt-2 border-t border-gray-200 text-sm">
                                    <div className="flex gap-4">
                                      <div>
                                        <span className="text-gray-500">
                                          구분:{" "}
                                        </span>
                                        <span className="text-blue-700 font-medium">
                                          {course.category}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">
                                          학점-시수:{" "}
                                        </span>
                                        <span className="text-blue-700 font-medium">
                                          {course.credits}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 자격증 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏆</span>
            <h4 className="text-gray-900">추천 자격증</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recommendations.certifications.map(
              (cert, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 p-3 rounded-lg text-yellow-900"
                >
                  {cert}
                </div>
              ),
            )}
          </div>
        </div>

        {/* 대외활동 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌍</span>
            <h4 className="text-gray-900">추천 대외활동</h4>
          </div>
          <div className="space-y-2">
            {recommendations.externalActivities.map(
              (activity, index) => (
                <div
                  key={index}
                  className="bg-purple-50 p-3 rounded-lg text-purple-900"
                >
                  {activity}
                </div>
              ),
            )}
          </div>
        </div>

        {/* 대내활동 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏫</span>
            <h4 className="text-gray-900">추천 대내활동</h4>
          </div>
          <div className="space-y-2">
            {recommendations.internalActivities.map(
              (activity, index) => (
                <div
                  key={index}
                  className="bg-indigo-50 p-3 rounded-lg text-indigo-900"
                >
                  {activity}
                </div>
              ),
            )}
          </div>
        </div>

        {/* 연구실 정보 */}
        {userData.careerPath.includes("대학원 진학") && (
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔬</span>
              <h4 className="text-gray-900">추천 연구실</h4>
            </div>
            <div className="space-y-2">
              {recommendations.labs.map((lab, index) => (
                <div
                  key={index}
                  className="bg-pink-50 p-3 rounded-lg"
                >
                  <div className="text-pink-900 mb-1">
                    {lab.name}
                  </div>
                  <p className="text-sm text-gray-600">
                    {lab.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 군대 시기 (남성이고 미정인 경우만) */}
        {userData.gender === "남성" &&
          userData.militaryStatus === "미정" &&
          recommendations.militaryTiming.period && (
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎖️</span>
                <h4 className="text-gray-900">
                  군 복무 추천 시기
                </h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-gray-900 mb-2">
                  {recommendations.militaryTiming.period}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {recommendations.militaryTiming.reason}
                </p>
                <div className="space-y-1 text-sm text-gray-700">
                  {recommendations.militaryTiming.tips.map(
                    (tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2"
                      >
                        <span className="text-blue-600 mt-1">
                          •
                        </span>
                        <span>{tip}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onReset}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          다시 시작하기
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          결과 저장하기
        </button>
      </div>

      {/* Footer Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
        <p>
          💡{" "}
          <span>
            위 추천은 일반적인 가이드라인입니다. 개인의 상황과
            목표에 따라 조정하여 활용하시기 바랍니다.
          </span>
        </p>
      </div>
    </div>
  );
}