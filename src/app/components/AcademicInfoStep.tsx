import { UserData } from "../App";
import { useEffect, useState } from "react";

interface AcademicInfoStepProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AcademicInfoStep({
  userData,
  setUserData,
  onNext,
  onBack,
}: AcademicInfoStepProps) {
  const [startTime] = useState(Date.now());
  const isValid = userData.studentId && userData.grade && userData.semester;

  // 페이지 이탈 감지
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'survey_exit',
        exit_step: 'step2',
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
      event: 'step2_complete',
      user_student_id: userData.studentId,
      user_grade: userData.grade,
      user_semester: userData.semester,
      step_duration: stepDuration
    });

    console.log('📊 [GTM] step2_complete:', {
      user_student_id: userData.studentId,
      user_grade: userData.grade,
      user_semester: userData.semester,
      step_duration: stepDuration
    });

    onNext();
  };

  const handleBack = () => {
    // 뒤로가기 이벤트 전송
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'step_back',
      from_step: 'step2',
      to_step: 'step1'
    });

    console.log('📊 [GTM] step_back: step2 → step1');

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
                  num === 1
                    ? "bg-blue-400 text-white"
                    : num === 2
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-300"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800">
            학적정보를 입력해주세요
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {/* 학번 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              학번
            </label>
            <input
              type="text"
              value={userData.studentId}
              onChange={(e) =>
                setUserData({ ...userData, studentId: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="학번을 입력하세요"
            />
          </div>

          {/* 다음 학기는 몇 학년인가요? */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              다음 학기는 몇 학년인가요?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["1학년", "2학년", "3학년", "4학년"].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setUserData({ ...userData, grade })}
                  className={`py-3 rounded-lg border-2 transition font-medium ${
                    userData.grade === grade
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* 몇 학기인가요? */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              몇 학기인가요?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["1학기", "2학기"].map((semester) => (
                <button
                  key={semester}
                  type="button"
                  onClick={() => setUserData({ ...userData, semester })}
                  className={`py-3 rounded-lg border-2 transition font-medium ${
                    userData.semester === semester
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {semester}
                </button>
              ))}
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleBack}
              className="py-4 rounded-lg font-medium transition bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!isValid}
              className={`py-4 rounded-lg font-medium transition ${
                isValid
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