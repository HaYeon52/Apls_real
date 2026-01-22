import { UserData } from "../App";
import { getRecommendations, courseInterestMapping } from "../utils/recommendations";
import { getCourseSyllabus, getCourseTips } from "../utils/courseTips";

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

  return (
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

                  // 관심분야 중 과목의 가중치가 있는 분야만 필터링
                  const courseMapping = courseInterestMapping[course.name] || {};
                  const relevantInterests = userData.interestArea.filter(
                    area => courseMapping[area] && courseMapping[area] > 0
                  );

                  // 추천 근거 텍스트 생성
                  let reasonText = "";
                  if (isRequired) {
                    reasonText = "필수 과목입니다. 반드시 수강해야 합니다.";
                  } else if (relevantInterests.length > 0) {
                    const interestText = relevantInterests.join(", ");
                    const areaWord = relevantInterests.length === 1 ? "분야로" : "분야들로";
                    reasonText = `${userData.name}님의 관심분야 ${interestText} ${areaWord} 가기 위해서 들어야 하는 과목입니다.`;
                  } else {
                    reasonText = `산업공학 전공 역량을 키우기 위해 추천하는 과목입니다.`;
                  }

                  return (
                    <div key={index}>
                      <div
                        onClick={() => onCourseClick({
                          name: course.name,
                          category: course.category,
                          credits: course.credits,
                          description: course.description,
                        })}
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
                              <p className="text-sm text-gray-700">
                                {reasonText}
                              </p>
                            </div>

                            {/* 무엇을 배우는가 */}
                            <div className="bg-white rounded-lg p-3 mb-2">
                              <p className="text-sm text-blue-900 font-medium mb-1">
                                📖 무엇을 배우나요?
                              </p>
                              <p className="text-sm text-gray-700">
                                {course.description}
                              </p>
                            </div>

                            {/* 클릭 안내 */}
                            <div className="text-center mt-3 pt-3 border-t border-blue-200">
                              <p className="text-blue-600 text-sm font-medium">
                                클릭하여 교과목 개요서 & 선배의 꿀팁 보기 →
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
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
  );
}