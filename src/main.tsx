import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'
import './styles/fonts.css'
import './styles/tailwind.css'
import './styles/theme.css'

// Supabase 쿠키 에러 완전 억제
const originalError = console.error;
console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || '';
  // Supabase 쿠키 관련 에러는 무시
  if (
    errorMessage.includes('Unable to update session cookie') ||
    errorMessage.includes('Unable to set cookie') ||
    errorMessage.includes('supabase') ||
    errorMessage.includes('session cookie')
  ) {
    return;
  }
  originalError.apply(console, args);
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