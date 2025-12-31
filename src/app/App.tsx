import { useState } from "react";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { CompletedCoursesForm } from "./components/CompletedCoursesForm";
import { CareerPathForm } from "./components/CareerPathForm";
import { InterestAreaForm } from "./components/InterestAreaForm";
import { RecommendationResult } from "./components/RecommendationResult";

export interface UserData {
  name: string;
  birthYear: string;
  gender: "남성" | "여성" | "";
  grade: string;
  semester: string;
  militaryStatus: string;
  enlistmentDate: string;
  careerPath: string[];
  interestArea: string[];
  completedCourses: string[];
}

export default function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    birthYear: "",
    gender: "",
    grade: "",
    semester: "",
    militaryStatus: "",
    enlistmentDate: "",
    careerPath: [],
    interestArea: [],
    completedCourses: [],
  });

  const handleNext = () => {
    // 1학년 1학기면 step 2(들은 수업)를 건너뛰고 step 3으로
    if (step === 1 && userData.grade === '1학년' && userData.semester === '1학기') {
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    // step 3에서 뒤로 갈 때, 1학년 1학기면 step 1로
    if (step === 3 && userData.grade === '1학년' && userData.semester === '1학기') {
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setUserData({
      name: "",
      birthYear: "",
      gender: "",
      grade: "",
      semester: "",
      militaryStatus: "",
      enlistmentDate: "",
      careerPath: [],
      interestArea: [],
      completedCourses: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-blue-900 mb-2">
            All Lecture Planning System
          </h1>
          <h2 className="text-blue-700 mb-4">
            진로 맞춤 추천 시스템
          </h2>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step === num
                    ? "bg-blue-600 text-white scale-110"
                    : step > num
                      ? "bg-blue-400 text-white"
                      : "bg-white text-gray-400"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <p className="text-gray-600">
            {step === 1 && "인적사항을 입력해주세요"}
            {step === 2 && "들은 수업을 체크해주세요"}
            {step === 3 && "진로 방향을 선택해주세요"}
            {step === 4 && "관심 분야를 선택해주세요"}
            {step === 5 && "맞춤형 추천 결과"}
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
            <CompletedCoursesForm
              userData={userData}
              setUserData={setUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <CareerPathForm
              userData={userData}
              setUserData={setUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <InterestAreaForm
              userData={userData}
              setUserData={setUserData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 5 && (
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