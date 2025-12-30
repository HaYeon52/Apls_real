import { UserData } from '../App';

interface CareerPathFormProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CareerPathForm({ userData, setUserData, onNext, onBack }: CareerPathFormProps) {
  const careerPaths = ['대학원 진학', '창업', '취업'];

  const handleToggle = (path: string) => {
    const currentPaths = [...userData.careerPath];
    const index = currentPaths.indexOf(path);

    if (index > -1) {
      // 이미 선택된 경우 제거
      currentPaths.splice(index, 1);
    } else {
      // 최대 3개까지만 선택 가능
      if (currentPaths.length < 3) {
        currentPaths.push(path);
      } else {
        alert('최대 3개까지만 선택 가능합니다.');
        return;
      }
    }

    setUserData({ ...userData, careerPath: currentPaths });
  };

  const getOrderNumber = (path: string) => {
    const index = userData.careerPath.indexOf(path);
    return index > -1 ? index + 1 : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.careerPath.length > 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-gray-600 mb-4 text-sm">
          관심 있는 진로 방향을 최대 3개까지 선택해주세요. (순서대로 우선순위가 반영됩니다)
        </p>
        <div className="space-y-3">
          {careerPaths.map((path) => {
            const orderNumber = getOrderNumber(path);
            const isSelected = orderNumber !== null;

            return (
              <button
                key={path}
                type="button"
                onClick={() => handleToggle(path)}
                className={`w-full py-4 px-6 rounded-lg border-2 transition relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{path}</span>
                  {isSelected && (
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
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
          disabled={userData.careerPath.length === 0}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </form>
  );
}
