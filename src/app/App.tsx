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

  // Google Analytics 초기화
  useEffect(() => {
    // gtag.js 스크립트 로드
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-PZY542N5YW';
    document.head.appendChild(script1);

    // gtag 함수 초기화
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PZY542N5YW');
    `;
    document.head.appendChild(script2);

    console.log('✅ Google Analytics 초기화 완료 (G-PZY542N5YW)');

    // 클린업
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  const handleNext = () => {
    // 1학년 1학기면 step 3(들은 수업)를 건너뛰고 step 4로
    if (step === 2 && userData.grade === '1학년' && userData.semester === '1학기') {
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    // 1학년 1학기가 step 4로 건너뛴 경우, 뒤로 갈 때 step 2로
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

  // 관리자 대시보드 표시 중
  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  // 과목 상세 페이지 표시 중
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
        <ResultScreen
          userData={userData}
          onCourseClick={handleCourseClick}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}