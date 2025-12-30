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
    
    // 남성이고 입대 예정을 선택한 경우 날짜 입력 필수
    if (userData.gender === '남성') {
      if (!userData.militaryStatus) {
        alert('병역 상태를 선택해주세요.');
        return;
      }
      if (userData.militaryStatus === '입대 예정' && !userData.enlistmentDate) {
        alert('입대 예정일을 입력해주세요.');
        return;
      }
    }
    
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
            onClick={() => setUserData({ ...userData, gender: '남성', militaryStatus: '', enlistmentDate: '' })}
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
            onClick={() => setUserData({ ...userData, gender: '여성', militaryStatus: '', enlistmentDate: '' })}
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

      {/* 남성 선택 시 병역 상태 질문 */}
      {userData.gender === '남성' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="block text-gray-700 mb-3">현재 병역 상태를 알려주세요.</label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setUserData({ ...userData, militaryStatus: '해당 없음', enlistmentDate: '' })}
              className={`w-full py-3 px-4 rounded-lg border-2 transition text-left ${
                userData.militaryStatus === '해당 없음'
                  ? 'border-blue-600 bg-white text-blue-700'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              }`}
            >
              해당 없음 (면제 및 복무 완료)
            </button>
            <button
              type="button"
              onClick={() => setUserData({ ...userData, militaryStatus: '입대 예정' })}
              className={`w-full py-3 px-4 rounded-lg border-2 transition text-left ${
                userData.militaryStatus === '입대 예정'
                  ? 'border-blue-600 bg-white text-blue-700'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              }`}
            >
              입대 예정
            </button>
            <button
              type="button"
              onClick={() => setUserData({ ...userData, militaryStatus: '미정', enlistmentDate: '' })}
              className={`w-full py-3 px-4 rounded-lg border-2 transition text-left ${
                userData.militaryStatus === '미정'
                  ? 'border-blue-600 bg-white text-blue-700'
                  : 'border-gray-300 bg-white hover:border-blue-300'
              }`}
            >
              미정 (아직 계획이 없어요)
            </button>
          </div>

          {/* 입대 예정 선택 시 년도/월 입력 */}
          {userData.militaryStatus === '입대 예정' && (
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">입대 예정일 (년도/월)</label>
              <input
                type="month"
                value={userData.enlistmentDate}
                onChange={(e) => setUserData({ ...userData, enlistmentDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-2">다음 학기</label>
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
        disabled={!userData.name || !userData.birthYear || !userData.gender || !userData.grade || !userData.semester || (userData.gender === '남성' && !userData.militaryStatus)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </form>
  );
}