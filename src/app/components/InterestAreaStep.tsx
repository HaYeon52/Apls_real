import { UserData } from "../App";

interface InterestAreaStepProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestAreaStep({
  userData,
  setUserData,
  onNext,
  onBack,
}: InterestAreaStepProps) {
  const interestOptions = [
    { name: "공정 (생산, 품질)", emoji: "🏭" },
    { name: "물류/SCM", emoji: "📦" },
    { name: "데이터", emoji: "💻" },
    { name: "금융", emoji: "💰" },
    { name: "컨설팅/기획", emoji: "📊" },
  ];

  const toggleInterest = (interest: string) => {
    if (userData.interestArea.includes(interest)) {
      setUserData({
        ...userData,
        interestArea: userData.interestArea.filter((i) => i !== interest),
      });
    } else if (userData.interestArea.length < 3) {
      setUserData({
        ...userData,
        interestArea: [...userData.interestArea, interest],
      });
    }
  };

  const getOrderNumber = (interest: string) => {
    const index = userData.interestArea.indexOf(interest);
    return index !== -1 ? index + 1 : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            All Lecture Planning System
          </h2>
          <p className="text-blue-600 mb-6">진로 맞춤 추천 시스템</p>

          {/* 진행 표시 */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  num < 5
                    ? "bg-blue-400 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            관심 분야를 선택하세요
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            관심 있는 분야를 최대 3개까지 선택하세요.
            <br />
            (순서대로 우선순위가 반영됩니다)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* 관심분야 선택 */}
          <div className="space-y-3">
            {interestOptions.map((interest) => {
              const orderNum = getOrderNumber(interest.name);
              const isSelected = orderNum !== null;

              return (
                <button
                  key={interest.name}
                  type="button"
                  onClick={() => toggleInterest(interest.name)}
                  className={`w-full p-4 rounded-lg border-2 transition font-medium relative flex items-center gap-3 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  <span className="text-2xl">{interest.emoji}</span>
                  <span className="flex-1 text-left">{interest.name}</span>
                  {isSelected && (
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                      {orderNum}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-sm text-gray-500 text-center">
            {userData.interestArea.length}/3 선택됨
          </div>

          {/* 결과 보기 버튼 */}
          <button
            onClick={onNext}
            disabled={userData.interestArea.length === 0}
            className={`w-full py-4 rounded-lg font-medium transition ${
              userData.interestArea.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            결과 보기
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2025 한양대학교 산업공학과
        </p>
      </div>
    </div>
  );
}