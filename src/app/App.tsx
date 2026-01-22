import { useState, useEffect } from "react";
import { StartScreen } from "./components/StartScreen";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { AcademicInfoStep } from "./components/AcademicInfoStep";
import { CourseSelectionStep } from "./components/CourseSelectionStep";
import { CareerPathStep } from "./components/CareerPathStep";
import { InterestAreaStep } from "./components/InterestAreaStep";
import { ResultScreen } from "./components/ResultScreen";
import { CourseDetailPage } from "./components/CourseDetailPage";
import { AdminDashboard } from "./components/AdminDashboard";

// 1. GA4 타입 에러 방지용 (빨간줄 해결)
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface UserData {
  name: string;
  studentId: string;
  age: string;
  gender: "남성" | "여성" | "";
  militaryStatus: "군필(면제 포함)" | "미필" | "";
  howDidYouKnow: string;
  howDidYouKnowOther: string;
  grade: string;
  semester: string;
  militaryCompleted: boolean;
  careerPath: string[];
  interestArea: string[];
  completedCourses: string[];
}

interface SelectedCourse {
  name: string;
  category: string;
  credits: string;
  description: string;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    studentId: "",
    age: "",
    gender: "",
    militaryStatus: "",
    howDidYouKnow: "",
    howDidYouKnowOther: "",
    grade: "",
    semester: "",
    militaryCompleted: false,
    careerPath: [],
    interestArea: [],
    completedCourses: [],
  });

  // 2. Google Analytics 초기화 (중복 실행 방지 기능 추가)
  useEffect(() => {
    if (!window.gtag) {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-PZY542N5YW';
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PZY542N5YW');
      `;
      document.head.appendChild(script2);
      console.log('✅ Google Analytics 로드 완료');
    }
  }, []);

  // 3. 결제 버튼 클릭 기능 (구매하기 버튼 누르면 실행됨)
  const handlePurchase = () => {
    // GA4에 "결제 시작" 신호 보내기
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'KRW',
        value: 9900,
        items: [{ item_name: 'ALPS Premium Roadmap' }]
      });
    }
    
    // 👇 여기에 실제 결제 링크를 넣으세요! (지금은 예시로 구글로 이동합니다)
    window.open('https://your-payment-link.com', '_blank'); 
  };

  const handleNext = () => {
    // 1학년 1학기면 step 3(들은 수업)를 건너뛰고 step 4로
    if (step === 2 && userData.grade === '1학년' && userData.semester === '1학기') {
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 4 && userData.grade === '1학년' && userData.semester === '1학기') {
      setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setSelectedCourse(null);
    setUserData({
      name: "",
      studentId: "",
      age: "",
      gender: "",
      militaryStatus: "",
      howDidYouKnow: "",
      howDidYouKnowOther: "",
      grade: "",
      semester: "",
      militaryCompleted: false,
      careerPath: [],
      interestArea: [],
      completedCourses: [],
    });
  };

  const handleCourseClick = (course: SelectedCourse) => {
    setSelectedCourse(course);
  };

  const handleBackToCourseList = () => {
    setSelectedCourse(null);
  };

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  if (selectedCourse) {
    return (
      <CourseDetailPage
        courseName={selectedCourse.name}
        courseCategory={selectedCourse.category}
        courseCredits={selectedCourse.credits}
        courseDescription={selectedCourse.description}
        onBack={handleBackToCourseList}
      />
    );
  }

  return (
    <>
      {step === 0 && (
        <StartScreen 
          onStart={() => setStep(1)} 
          onAdminClick={() => setShowAdmin(true)}
        />
      )}
      
      {step === 1 && (
        <PersonalInfoStep
          userData={userData}
          setUserData={setUserData}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <AcademicInfoStep
          userData={userData}
          setUserData={setUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 3 && (
        <CourseSelectionStep
          userData={userData}
          setUserData={setUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 4 && (
        <CareerPathStep
          userData={userData}
          setUserData={setUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 5 && (
        <InterestAreaStep
          userData={userData}
          setUserData={setUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {step === 6 && (
        // 👇 결과 화면 아래에 결제 버튼을 강제로 추가했습니다 (테스트용)
        <div className="relative">
          <ResultScreen
            userData={userData}
            onCourseClick={handleCourseClick}
            onRestart={handleRestart}
          />
          {/* 만약 ResultScreen 안에 구매 버튼이 없다면, 
             아래 주석을 풀어서 버튼을 노출시킬 수 있습니다.
          */}
          {/* <button 
                onClick={handlePurchase}
                style={{position: 'fixed', bottom: '20px', right: '20px', padding: '15px', background: 'red', color: 'white', zIndex: 9999}}
              >
                🚀 로드맵 구매하기 (Test)
              </button> 
          */}
        </div>
      )}
    </>
  );
}