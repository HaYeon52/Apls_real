export function StartScreen({ 
  onStart, 
  onAdminClick 
}: { 
  onStart: () => void;
  onAdminClick: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ALPS</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          All Lecture Planning System
        </h2>
        <p className="text-blue-600 mb-8">진로 맞춤 추천 시스템</p>
        
        <button
          onClick={onStart}
          className="bg-blue-600 text-white px-12 py-4 rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-lg"
        >
          시작하기
        </button>
        
        <p className="mt-16 text-sm text-gray-500">
          © 2025 한양대학교 산업공학과
        </p>

        {/* 숨겨진 관리자 버튼 */}
        <button
          onClick={onAdminClick}
          className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition"
        >
          관리자
        </button>
      </div>
    </div>
  );
}