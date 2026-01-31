import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/app/App'
import './styles/index.css'
import './styles/fonts.css'
import './styles/tailwind.css'
import './styles/theme.css'

// Supabase 쿠키 에러 완전 억제
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || '';
  // Supabase 쿠키 관련 에러 및 네트워크 에러는 무시
  if (
    errorMessage.includes('Unable to update session cookie') ||
    errorMessage.includes('Unable to set cookie') ||
    errorMessage.includes('supabase') ||
    errorMessage.includes('session cookie') ||
    errorMessage.includes('cookie') ||
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('fetch')
  ) {
    return;
  }
  originalError.apply(console, args);
};

console.warn = (...args: any[]) => {
  const warnMessage = args[0]?.toString() || '';
  // Supabase 쿠키 관련 경고 및 네트워크 경고는 무시
  if (
    warnMessage.includes('Unable to update session cookie') ||
    warnMessage.includes('Unable to set cookie') ||
    warnMessage.includes('supabase') ||
    warnMessage.includes('session cookie') ||
    warnMessage.includes('cookie') ||
    warnMessage.includes('Failed to fetch') ||
    warnMessage.includes('NetworkError') ||
    warnMessage.includes('fetch')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

console.log = (...args: any[]) => {
  const logMessage = args[0]?.toString() || '';
  // Supabase 쿠키 관련 로그도 무시
  if (
    logMessage.includes('Unable to update session cookie') ||
    logMessage.includes('Unable to set cookie') ||
    logMessage.includes('session cookie') ||
    logMessage.includes('cookie')
  ) {
    return;
  }
  originalLog.apply(console, args);
};

// 브라우저 캐시 및 서비스 워커 초기화
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}

// 로컬 스토리지에서 Supabase 관련 항목 제거
Object.keys(localStorage).forEach(key => {
  if (key.includes('supabase') || key.includes('sb-')) {
    localStorage.removeItem(key);
  }
});

// 세션 스토리지에서 Supabase 관련 항목 제거
Object.keys(sessionStorage).forEach(key => {
  if (key.includes('supabase') || key.includes('sb-')) {
    sessionStorage.removeItem(key);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)