import { UserData } from '../App';

interface PersonalInfoFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
}

export function PersonalInfoForm({ userData, setUserData, onNext }: PersonalInfoFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.name && userData.studentId && userData.age && userData.gender && userData.grade && userData.semester) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2">이름</label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">학번</label>
        <input
          type="text"
          value={userData.studentId}
          onChange={(e) => setUserData({ ...userData, studentId: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="학번을 입력하세요 (예: 2021012345)"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">출생년도</label>
        <input
          type="number"
          value={userData.age}
          onChange={(e) => setUserData({ ...userData, age: e.target.value })}
          onWheel={(e) => e.currentTarget.blur()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="출생년도를 입력하세요 (예: 2000)"
          min="1995"
          max="2010"
          required
        />
        {userData.age && parseInt(userData.age) >= 1995 && parseInt(userData.age) <= 2010 && (
          <p className="text-sm text-gray-600 mt-1">
            만 {2026 - parseInt(userData.age)}세
          </p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 mb-2">성별</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserData({ ...userData, gender: '남성', militaryCompleted: false })}
            className={`py-3 px-6 rounded-lg border-2 transition ${
              userData.gender === '남성'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            남성
          </button>
          <button
            type="button"
            onClick={() => setUserData({ ...userData, gender: '여성', militaryCompleted: false })}
            className={`py-3 px-6 rounded-lg border-2 transition ${
              userData.gender === '여성'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            여성
          </button>
        </div>
      </div>

      {/* 남성 선택 시 군필 여부 질문 */}
      {userData.gender === '남성' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-gray-700 mb-3">군 복무를 완료하셨나요?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserData({ ...userData, militaryCompleted: true })}
              className={`py-3 px-4 rounded-lg border-2 transition ${
                userData.militaryCompleted
                  ? 'border-blue-600 bg-white text-blue-700'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              }`}
            >
              예 (군필)
            </button>
            <button
              type="button"
              onClick={() => setUserData({ ...userData, militaryCompleted: false })}
              className={`py-3 px-4 rounded-lg border-2 transition ${
                !userData.militaryCompleted
                  ? 'border-blue-600 bg-white text-blue-700'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              }`}
            >
              아니오 (미필)
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-2">다음 학기는 몇 학년인가요?</label>
        <div className="grid grid-cols-2 gap-3">
          {['1학년', '2학년', '3학년', '4학년'].map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setUserData({ ...userData, grade })}
              className={`py-3 px-4 rounded-lg border-2 transition ${
                userData.grade === grade
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">몇 학기인가요?</label>
        <div className="grid grid-cols-2 gap-3">
          {['1학기', '2학기'].map((semester) => (
            <button
              key={semester}
              type="button"
              onClick={() => setUserData({ ...userData, semester })}
              className={`py-3 px-4 rounded-lg border-2 transition ${
                userData.semester === semester
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              {semester}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!userData.name || !userData.studentId || !userData.age || !userData.gender || !userData.grade || !userData.semester}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </form>
  );
}