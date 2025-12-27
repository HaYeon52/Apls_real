import { UserData } from '../App';

interface InterestAreaFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestAreaForm({ userData, setUserData, onNext, onBack }: InterestAreaFormProps) {
  const interestAreas = [
    { value: '데이터', icon: '📊', color: 'bg-purple-100 border-purple-300 hover:border-purple-500' },
    { value: '금융', icon: '💰', color: 'bg-green-100 border-green-300 hover:border-green-500' },
    { value: '물류', icon: '📦', color: 'bg-orange-100 border-orange-300 hover:border-orange-500' },
    { value: '품질', icon: '✓', color: 'bg-blue-100 border-blue-300 hover:border-blue-500' },
    { value: '전략 컨설팅', icon: '💡', color: 'bg-yellow-100 border-yellow-300 hover:border-yellow-500' },
    { value: 'SCM', icon: '🔗', color: 'bg-indigo-100 border-indigo-300 hover:border-indigo-500' },
    { value: '기획', icon: '📋', color: 'bg-pink-100 border-pink-300 hover:border-pink-500' },
    { value: '마케팅', icon: '📢', color: 'bg-red-100 border-red-300 hover:border-red-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.interestArea) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {interestAreas.map((area) => (
          <button
            key={area.value}
            type="button"
            onClick={() => setUserData({ ...userData, interestArea: area.value })}
            className={`p-4 rounded-xl border-2 transition ${
              userData.interestArea === area.value
                ? 'ring-2 ring-blue-500 scale-105'
                : ''
            } ${area.color}`}
          >
            <div className="text-3xl mb-2">{area.icon}</div>
            <div className={userData.interestArea === area.value ? 'text-blue-700' : 'text-gray-700'}>
              {area.value}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={!userData.interestArea}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          결과 보기
        </button>
      </div>
    </form>
  );
}
