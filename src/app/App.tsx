import { useState } from 'react';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { CareerPathForm } from './components/CareerPathForm';
import { InterestAreaForm } from './components/InterestAreaForm';
import { RecommendationResult } from './components/RecommendationResult';

export interface UserData {
  name: string;
  birthYear: string;
  gender: '남성' | '여성' | '';
  grade: string;
  semester: string;
  careerPath: string;
  interestArea: string;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    birthYear: '',
    gender: '',
    grade: '',
    semester: '',
    careerPath: '',
    interestArea: '',
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setUserData({
      name: '',
      birthYear: '',
      gender: '',
      grade: '',
      semester: '',
      careerPath: '',
      interestArea: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-blue-900 mb-2">한양대학교 산업공학과</h1>
          <h2 className="text-blue-700 mb-4">진로 맞춤 추천 시스템</h2>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step === num
                    ? 'bg-blue-600 text-white scale-110'
                    : step > num
                    ? 'bg-blue-400 text-white'
                    : 'bg-white text-gray-400'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <p className="text-gray-600">
            {step === 1 && '인적사항을 입력해주세요'}
            {step === 2 && '진로 방향을 선택해주세요'}
            {step === 3 && '관심 분야를 선택해주세요'}
            {step === 4 && '맞춤형 추천 결과'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <PersonalInfoForm
              userData={userData}
              setUserData={setUserData}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <CareerPathForm
              userData={userData}
              setUserData={setUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <InterestAreaForm
              userData={userData}
              setUserData={setUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <RecommendationResult
              userData={userData}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p>© 2025 한양대학교 산업공학과</p>
        </div>
      </div>
    </div>
  );
}