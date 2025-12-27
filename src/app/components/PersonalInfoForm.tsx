import { UserData } from '../App';

interface PersonalInfoFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
}

export function PersonalInfoForm({ userData, setUserData, onNext }: PersonalInfoFormProps) {
  const birthYears = Array.from({ length: 16 }, (_, i) => (2010 - i).toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name && userData.birthYear && userData.gender && userData.grade && userData.semester) {
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
        <label className="block text-gray-700 mb-2">출생년도</label>
        <select
          value={userData.birthYear}
          onChange={(e) => setUserData({ ...userData, birthYear: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
          required
        >
          <option value="">출생년도를 선택하세요</option>
          {birthYears.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">성별</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserData({ ...userData, gender: '남성' })}
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
            onClick={() => setUserData({ ...userData, gender: '여성' })}
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

      <div>
        <label className="block text-gray-700 mb-2">현재 학년</label>
        <div className="grid grid-cols-2 gap-3">
          {['입학예정', '1학년', '2학년', '3학년'].map((grade) => (
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
        <label className="block text-gray-700 mb-2">학기</label>
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
        disabled={!userData.name || !userData.birthYear || !userData.gender || !userData.grade || !userData.semester}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </form>
  );
}