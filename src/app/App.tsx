import { useState, useEffect } from "react";
import { StartScreen } from "./components/StartScreen";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { AcademicInfoStep } from "./components/AcademicInfoStep";
import { CourseSelectionStep } from "./components/CourseSelectionStep";
import { CareerPathStep } from "./components/CareerPathStep";
import { InterestAreaStep } from "./components/InterestAreaStep";
import { DisclaimerScreen } from "./components/DisclaimerScreen";
import { ResultScreen } from "./components/ResultScreen";
import { CourseDetailPage } from "./components/CourseDetailPage";
import { AllCourseTipsPage } from "./components/AllCourseTipsPage";

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
  prerequisites?: string[];
}

export default function App() {
  const [step, setStep] = useState(0);
  const [showAllTips, setShowAllTips] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
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

  // 설문 시작 시간 저장
  useEffect(() => {
    if (step === 1 && !localStorage.getItem('survey_start_time')) {
      localStorage.setItem('survey_start_time', Date.now().toString());
      console.log('⏱️ 설문 시작 시간 기록:', new Date().toLocaleTimeString());
    }
  }, [step]);

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

  const handleCourseClick = (course: SelectedCourse, semester?: string) => {
    // 현재 스크롤 위치와 열린 학기 저장
    setScrollPosition(window.scrollY);
    if (semester) {
      setExpandedSemester(semester);
    }
    setSelectedCourse(course);
  };

  const handleBackToCourseList = () => {
    setSelectedCourse(null);
    // 스크롤 위치는 ResultScreen의 useEffect에서 복원됨
  };

  if (showAllTips) {
    return <AllCourseTipsPage onBack={() => setShowAllTips(false)} />;
  }

  if (selectedCourse) {
    return (
      <CourseDetailPage
        courseName={selectedCourse.name}
        courseCategory={selectedCourse.category}
        courseCredits={selectedCourse.credits}
        courseDescription={selectedCourse.description}
        prerequisites={selectedCourse.prerequisites}
        completedCourses={userData.completedCourses}
        onBack={handleBackToCourseList}
      />
    );
  }

  return (
    <>
      {step === 0 && (
        <StartScreen 
          onStart={() => setStep(1)} 
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
        <DisclaimerScreen
          onConfirm={handleNext}
        />
      )}

      {step === 7 && (
        <ResultScreen
          userData={userData}
          onCourseClick={handleCourseClick}
          onRestart={handleRestart}
          onViewAllTips={() => setShowAllTips(true)}
          expandedSemester={expandedSemester}
          scrollPosition={scrollPosition}
          onExpandedSemesterChange={setExpandedSemester}
        />
      )}
    </>
  );
}