import { UserData } from '../App';

interface CareerPathFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CareerPathForm({ userData, setUserData, onNext, onBack }: CareerPathFormProps) {
  const careerPaths = [
    { value: '대학원 진학', icon: '🎓', description: '학문 연구 및 전문 지식 심화' },
    { value: '창업', icon: '🚀', description: '스타트업 및 비즈니스 창출' },
    { value: '취업', icon: '💼', description: '기업 및 공공기관 취업' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.careerPath) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {careerPaths.map((path) => (
          <button
            key={path.value}
            type="button"
            onClick={() => setUserData({ ...userData, careerPath: path.value })}
            className={`w-full p-6 rounded-xl border-2 transition text-left ${
              userData.careerPath === path.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{path.icon}</span>
              <div className="flex-1">
                <div className={`mb-1 ${
                  userData.careerPath === path.value ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {path.value}
                </div>
                <p className="text-gray-600">{path.description}</p>
              </div>
              {userData.careerPath === path.value && (
                <div className="text-blue-600">✓</div>
              )}
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
          disabled={!userData.careerPath}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </form>
  );
}
