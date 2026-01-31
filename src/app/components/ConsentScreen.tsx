import { useState } from "react";

interface ConsentScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function ConsentScreen({ onNext, onBack }: ConsentScreenProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [startTime] = useState(Date.now());

  const handleNext = () => {
    if (isChecked) {
      const stepDuration = Math.round((Date.now() - startTime) / 1000);

      // GTM 이벤트 전송
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'consent_complete',
        consent_agreed: true,
        step_duration: stepDuration
      });

      console.log('📊 [GTM] consent_complete:', {
        consent_agreed: true,
        step_duration: stepDuration
      });

      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-8 pb-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            All Lecture Planning System
          </h2>
          <p className="text-blue-600 mb-6">진로 맞춤 추천 시스템</p>
        </div>

        {/* 동의서 본문 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            개인정보 수집 및 이용 동의서
          </h3>

          <div className="space-y-6 text-gray-700 mb-8">
            <p className="leading-relaxed">
              <span className="font-semibold">All Lecture Planning System</span>은(는) 사용자에게 최적화된 맞춤형 정보를 제공하기 위해 아래와 같이 개인정보를 수집 및 이용하고자 합니다. 내용을 자세히 읽으신 후 동의해 주시기 바랍니다.
            </p>

            {/* 1. 개인정보의 수집 및 이용 목적 */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">
                1. 개인정보의 수집 및 이용 목적
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>사용자 맞춤형 커리큘럼 및 진로 로드맵 추천 서비스 제공</li>
                <li>서비스 이용 현황 통계 및 품질 개선 (Google Analytics 활용)</li>
                <li>서비스 관련 공지사항 전달 및 문의 응대</li>
              </ul>
            </div>

            {/* 2. 수집하는 개인정보의 항목 */}
            <div className="bg-green-50 rounded-lg p-5 border border-green-200">
              <h4 className="font-bold text-gray-900 mb-3">
                2. 수집하는 개인정보의 항목
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><span className="font-semibold">(필수)</span> 닉네임, 출생년도, 성별, 학번, 학년</li>
                <li><span className="font-semibold">(필수)</span> 진로 희망 방향, 관심 분야, 군 복무 여부, 설문 유입 경로</li>
                <li><span className="font-semibold">(자동 수집)</span> 서비스 이용 기록, 접속 로그, 쿠키, IP 주소</li>
              </ul>
            </div>

            {/* 3. 개인정보의 보유 및 이용 기간 */}
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <h4 className="font-bold text-gray-900 mb-3">
                3. 개인정보의 보유 및 이용 기간
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>수집된 정보는 <span className="font-semibold">서비스 종료 시</span> 또는 <span className="font-semibold">이용자의 파기 요청 시</span>까지 보유 및 이용합니다.</li>
                <li>보유 기간이 종료되면 해당 정보는 지체 없이 파기합니다.</li>
              </ul>
            </div>

            {/* 4. 동의 거부 권리 및 불이익 */}
            <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
              <h4 className="font-bold text-gray-900 mb-3">
                4. 동의 거부 권리 및 불이익
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.</li>
                <li>단, 동의를 거부할 경우 맞춤형 결과 제공 등 서비스의 핵심 기능 이용이 제한될 수 있습니다.</li>
              </ul>
            </div>
          </div>

          {/* 동의 체크박스 */}
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-5 h-5 mt-1 accent-blue-600 cursor-pointer"
              />
              <span className="text-gray-800 font-medium text-lg">
                위 개인정보 수집 및 이용에 동의합니다.
              </span>
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!isChecked}
              className={`flex-1 py-4 rounded-xl font-bold transition ${
                isChecked
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}