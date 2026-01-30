import { UserData } from '../App';

interface InterestAreaFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestAreaForm({ userData, setUserData, onNext, onBack }: InterestAreaFormProps) {
  const interestAreas = ['공정', '물류', '데이터', '금융', '컨설팅'];

  const handleToggle = (area: string) => {
    const currentAreas = [...userData.interestArea];
    const index = currentAreas.indexOf(area);

    if (index > -1) {
      // 이미 선택된 경우 제거
      currentAreas.splice(index, 1);
    } else {
      // 최대 2개까지만 선택 가능
      if (currentAreas.length < 2) {
        currentAreas.push(area);
      } else {
        // 2개 초과 선택 시 무시
        return;
      }
    }

    setUserData({ ...userData, interestArea: currentAreas });
  };

  const handleNoInterest = () => {
    setUserData({ ...userData, interestArea: [] });
    onNext();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.interestArea.length > 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-gray-600 mb-4 text-sm">
          관심 있는 분야를 최대 2개까지 선택해주세요.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {interestAreas.map((area) => {
            const isSelected = userData.interestArea.includes(area);

            return (
              <button
                key={area}
                type="button"
                onClick={() => handleToggle(area)}
                className={`py-4 px-4 rounded-lg border-2 transition font-medium ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
        
        <button
          type="button"
          onClick={handleNoInterest}
          className="w-full mt-4 py-3 px-4 rounded-lg border-2 border-gray-400 bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-700"
        >
          관심 없음 (진로 탐색)
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={userData.interestArea.length === 0}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </form>
  );
}