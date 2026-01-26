import { UserData } from "../App";
import { useEffect, useState } from "react";

interface CareerPathStepProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CareerPathStep({
  userData,
  setUserData,
  onNext,
  onBack,
}: CareerPathStepProps) {
  const [startTime] = useState(Date.now());
  const careerOptions = ["취업", "창업", "대학원 진학", "계획없음"];

  // 페이지 이탈 감지
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'survey_exit',
        exit_step: 'step4',
        time_spent: Math.round((Date.now() - startTime) / 1000)
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime]);

  const toggleCareer = (career: string) => {
    if (userData.careerPath.includes(career)) {
      setUserData({
        ...userData,
        careerPath: userData.careerPath.filter((c) => c !== career),
      });
    } else if (userData.careerPath.length < 3) {
      setUserData({
        ...userData,
        careerPath: [...userData.careerPath, career],
      });
    }
  };

  const getOrderNumber = (career: string) => {
    const index = userData.careerPath.indexOf(career);
    return index !== -1 ? index + 1 : null;
  };

  const handleNext = () => {
    const stepDuration = Math.round((Date.now() - startTime) / 1000);

    // GTM 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'step4_complete',
      career_paths: userData.careerPath,
      career_priority_1: userData.careerPath[0] || null,
      career_count: userData.careerPath.length,
      step_duration: stepDuration
    });

    console.log('📊 [GTM] step4_complete:', {
      career_paths: userData.careerPath,
      career_priority_1: userData.careerPath[0] || null,
      career_count: userData.careerPath.length,
      step_duration: stepDuration
    });

    onNext();
  };

  const handleBack = () => {
    // 뒤로가기 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'step_back',
      from_step: 'step4',
      to_step: 'step3'
    });

    console.log('📊 [GTM] step_back: step4 → step3');

    onBack();
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
                  num < 4
                    ? "bg-blue-400 text-white"
                    : num === 4
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-300"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            진로 방향을 선택하세요
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            관심 있는 진로 방향을 최대 3개까지 선택하세요.
            <br />
            (순서대로 우선순위가 반영됩니다)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* 진로 선택 */}
          <div className="space-y-3">
            {careerOptions.map((career) => {
              const orderNum = getOrderNumber(career);
              const isSelected = orderNum !== null;

              return (
                <button
                  key={career}
                  type="button"
                  onClick={() => toggleCareer(career)}
                  className={`w-full p-4 rounded-lg border-2 transition font-medium relative ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {career}
                  {isSelected && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      {orderNum}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-sm text-gray-500 text-center">
            {userData.careerPath.length}/3 선택됨
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-4 rounded-lg font-medium transition bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={userData.careerPath.length === 0}
              className={`flex-1 py-4 rounded-lg font-medium transition ${
                userData.careerPath.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2025 한양대학교 산업공학과
        </p>
      </div>
    </div>
  );
}