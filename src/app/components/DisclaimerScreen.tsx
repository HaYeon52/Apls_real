import { motion } from "motion/react";
import { useState } from "react";

interface DisclaimerScreenProps {
  onConfirm: () => void;
}

export function DisclaimerScreen({ onConfirm }: DisclaimerScreenProps) {
  const [startTime] = useState(Date.now());

  const handleConfirm = () => {
    const stepDuration = Math.round((Date.now() - startTime) / 1000);

    // GTM 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'disclaimer_confirmed',
      step_duration: stepDuration
    });

    console.log('📊 [GTM] disclaimer_confirmed:', {
      step_duration: stepDuration
    });

    onConfirm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
      >
        {/* 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>

        {/* 제목 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          알림
        </motion.h1>

        {/* 면책 조항 내용 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8"
        >
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
            본 추천은 제공된 정보에 기반한 참고용 제안이며, 모든 상황을 완벽히 반영하지 않을 수 있습니다.
            <br />
            <br />
            <span className="font-semibold text-gray-800">
              최종 수강 결정과 그에 따른 책임은 본인에게 있습니다.
            </span>
          </p>
        </motion.div>

        {/* 확인 버튼 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          결과 확인하기
        </motion.button>

        {/* 부가 설명 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-4"
        >
          결과를 확인하신 후 궁금한 사항이 있으시면
          <br />
          학과 사무실이나 지도교수님께 문의하시기 바랍니다.
        </motion.p>
      </motion.div>
    </div>
  );
}