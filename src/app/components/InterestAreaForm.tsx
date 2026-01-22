import { UserData } from '../App';

interface InterestAreaFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InterestAreaForm({ userData, setUserData, onNext, onBack }: InterestAreaFormProps) {
  const interestAreas = ['공정 (생산, 품질)', '물류/SCM', '데이터', '금융', '컨설팅/기획'];

  const handleToggle = (area: string) => {
    const currentAreas = [...userData.interestArea];
    const index = currentAreas.indexOf(area);

    if (index > -1) {
      // 이미 선택된 경우 제거
      currentAreas.splice(index, 1);
    } else {
      // 최대 3개까지만 선택 가능
      if (currentAreas.length < 3) {
        currentAreas.push(area);
      } else {
        alert('최대 3개까지만 선택 가능합니다.');
        return;
      }
    }

    setUserData({ ...userData, interestArea: currentAreas });
  };

  const getOrderNumber = (area: string) => {
    const index = userData.interestArea.indexOf(area);
    return index > -1 ? index + 1 : null;
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
          관심 있는 분야를 최대 3개까지 선택해주세요. (순서대로 우선순위가 반영됩니다)
        </p>
        <div className="grid grid-cols-2 gap-3">
          {interestAreas.map((area) => {
            const orderNumber = getOrderNumber(area);
            const isSelected = orderNumber !== null;

            return (
              <button
                key={area}
                type="button"
                onClick={() => handleToggle(area)}
                className={`py-4 px-4 rounded-lg border-2 transition relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{area}</span>
                  {isSelected && (
                    <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-2">
                      {orderNumber}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
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