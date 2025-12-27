import { UserData } from '../App';
import { getRecommendations } from '../utils/recommendations';

interface RecommendationResultProps {
  userData: UserData;
  onReset: () => void;
}

export function RecommendationResult({ userData, onReset }: RecommendationResultProps) {
  const recommendations = getRecommendations(userData);
  const currentYear = 2025;
  const age = currentYear - parseInt(userData.birthYear);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
        <h3 className="mb-3">{userData.name}님의 진로 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">출생년도</p>
            <p>{userData.birthYear}년생 ({age}세)</p>
          </div>
          <div>
            <p className="opacity-90">성별</p>
            <p>{userData.gender}</p>
          </div>
          <div>
            <p className="opacity-90">현재 학년/학기</p>
            <p>{userData.grade} {userData.semester}</p>
          </div>
          <div>
            <p className="opacity-90">진로 방향</p>
            <p>{userData.careerPath}</p>
          </div>
          <div className="col-span-2">
            <p className="opacity-90">관심 분야</p>
            <p>{userData.interestArea}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {/* 전공 수업 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📚</span>
            <h4 className="text-gray-900">추천 전공 수업</h4>
          </div>
          <div className="space-y-2">
            {recommendations.majorCourses.map((course, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-900 mb-1">{course.name}</div>
                <p className="text-sm text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 교양 수업 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📖</span>
            <h4 className="text-gray-900">추천 교양 수업</h4>
          </div>
          <div className="space-y-2">
            {recommendations.generalCourses.map((course, index) => (
              <div key={index} className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-900 mb-1">{course.name}</div>
                <p className="text-sm text-gray-600">{course.description}</p>
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
            {recommendations.certifications.map((cert, index) => (
              <div key={index} className="bg-yellow-50 p-3 rounded-lg text-yellow-900">
                {cert}
              </div>
            ))}
          </div>
        </div>

        {/* 대외활동 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌍</span>
            <h4 className="text-gray-900">추천 대외활동</h4>
          </div>
          <div className="space-y-2">
            {recommendations.externalActivities.map((activity, index) => (
              <div key={index} className="bg-purple-50 p-3 rounded-lg text-purple-900">
                {activity}
              </div>
            ))}
          </div>
        </div>

        {/* 대내활동 */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏫</span>
            <h4 className="text-gray-900">추천 대내활동</h4>
          </div>
          <div className="space-y-2">
            {recommendations.internalActivities.map((activity, index) => (
              <div key={index} className="bg-indigo-50 p-3 rounded-lg text-indigo-900">
                {activity}
              </div>
            ))}
          </div>
        </div>

        {/* 연구실 정보 */}
        {userData.careerPath === '대학원 진학' && (
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔬</span>
              <h4 className="text-gray-900">추천 연구실</h4>
            </div>
            <div className="space-y-2">
              {recommendations.labs.map((lab, index) => (
                <div key={index} className="bg-pink-50 p-3 rounded-lg">
                  <div className="text-pink-900 mb-1">{lab.name}</div>
                  <p className="text-sm text-gray-600">{lab.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 군대 시기 (남성인 경우) */}
        {userData.gender === '남성' && (
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎖️</span>
              <h4 className="text-gray-900">군 복무 추천 시기</h4>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-900 mb-2">{recommendations.militaryTiming.period}</div>
              <p className="text-sm text-gray-600 mb-3">{recommendations.militaryTiming.reason}</p>
              <div className="space-y-1 text-sm text-gray-700">
                {recommendations.militaryTiming.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
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
        <p>💡 <span>위 추천은 일반적인 가이드라인입니다. 개인의 상황과 목표에 따라 조정하여 활용하시기 바랍니다.</span></p>
      </div>
    </div>
  );
}