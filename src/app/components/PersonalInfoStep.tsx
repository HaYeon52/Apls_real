import { UserData } from "../App";
import { useEffect, useState } from "react";

interface PersonalInfoStepProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
}

export function PersonalInfoStep({
  userData,
  setUserData,
  onNext,
}: PersonalInfoStepProps) {
  const [startTime] = useState(Date.now());

  const isValid = 
    userData.name && 
    userData.age && 
    userData.gender &&
    (userData.gender === "여성" || userData.militaryStatus) &&
    userData.howDidYouKnow &&
    (userData.howDidYouKnow !== "그외" || userData.howDidYouKnowOther);

  // 페이지 이탈 감지
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'survey_exit',
        exit_step: 'step1',
        time_spent: Math.round((Date.now() - startTime) / 1000)
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime]);

  const handleNext = () => {
    const stepDuration = Math.round((Date.now() - startTime) / 1000);

    // GTM 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'step1_complete',
      user_name: userData.name,
      user_birth: userData.age,
      user_gender: userData.gender,
      military_status: userData.gender === "여성" ? "해당없음" : userData.militaryStatus,
      user_source: userData.howDidYouKnow === "그외" ? userData.howDidYouKnowOther : userData.howDidYouKnow,
      step_duration: stepDuration
    });

    console.log('📊 [GTM] step1_complete:', {
      user_name: userData.name,
      user_birth: userData.age,
      user_gender: userData.gender,
      military_status: userData.gender === "여성" ? "해당없음" : userData.militaryStatus,
      user_source: userData.howDidYouKnow === "그외" ? userData.howDidYouKnowOther : userData.howDidYouKnow,
      step_duration: stepDuration
    });

    onNext();
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
                  num === 1
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-300"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            인적사항을 입력해주세요
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {/* 이름 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              이름
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 출생년도 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              출생년도
            </label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData({ ...userData, age: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="출생년도를 입력하세요"
              min="1995"
              max="2010"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              성별
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserData({ ...userData, gender: "남성" })}
                className={`py-3 rounded-lg border-2 transition font-medium ${
                  userData.gender === "남성"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setUserData({ ...userData, gender: "여성" })}
                className={`py-3 rounded-lg border-2 transition font-medium ${
                  userData.gender === "여성"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                여성
              </button>
            </div>
          </div>

          {/* 군 복무 여부 */}
          {userData.gender === "남성" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                군 복무 여부
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserData({ ...userData, militaryStatus: "군필(면제 포함)" })}
                  className={`py-3 rounded-lg border-2 transition font-medium ${
                    userData.militaryStatus === "군필(면제 포함)"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  군필(면제 포함)
                </button>
                <button
                  type="button"
                  onClick={() => setUserData({ ...userData, militaryStatus: "미필" })}
                  className={`py-3 rounded-lg border-2 transition font-medium ${
                    userData.militaryStatus === "미필"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  미필
                </button>
              </div>
            </div>
          )}

          {/* ALPS를 알게 된 경로 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ALPS를 알게 된 경로
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setUserData({ ...userData, howDidYouKnow: "산업공학과 카카오톡 공지방" })}
                className={`py-3 px-2 rounded-lg border-2 transition font-medium text-sm ${
                  userData.howDidYouKnow === "산업공학과 카카오톡 공지방"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                카카오톡 공지방
              </button>
              <button
                type="button"
                onClick={() => setUserData({ ...userData, howDidYouKnow: "인스타그램" })}
                className={`py-3 px-2 rounded-lg border-2 transition font-medium text-sm ${
                  userData.howDidYouKnow === "인스타그램"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                인스타그램
              </button>
              <button
                type="button"
                onClick={() => setUserData({ ...userData, howDidYouKnow: "주변 지인" })}
                className={`py-3 px-2 rounded-lg border-2 transition font-medium text-sm ${
                  userData.howDidYouKnow === "주변 지인"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                주변 지인
              </button>
              <button
                type="button"
                onClick={() => setUserData({ ...userData, howDidYouKnow: "그외" })}
                className={`py-3 px-2 rounded-lg border-2 transition font-medium text-sm ${
                  userData.howDidYouKnow === "그외"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-blue-300"
                }`}
              >
                그외
              </button>
            </div>
          </div>

          {/* 그외 상세 입력 */}
          {userData.howDidYouKnow === "그외" && (
            <div>
              <input
                type="text"
                value={userData.howDidYouKnowOther}
                onChange={(e) =>
                  setUserData({ ...userData, howDidYouKnowOther: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="상세 내용을 입력해주세요"
              />
            </div>
          )}

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            disabled={!isValid}
            className={`w-full py-4 rounded-lg font-medium transition ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2025 한양대학교 산업공학과
        </p>
      </div>
    </div>
  );
}