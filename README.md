# 한양대 산업공학과 진로 맞춤 추천 시스템

7단계 설문을 통해 현재 학기 전공 과목을 추천하는 맞춤형 서비스입니다.

## 🚀 Vercel 배포 가이드

### 1단계: GitHub 푸시 (이미 완료!)
✅ 코드가 GitHub에 업로드되어 있습니다.

### 2단계: Vercel 배포 설정

1. **Vercel 프로젝트 설정**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **환경 변수 추가** (중요!)
   Vercel 대시보드 → Settings → Environment Variables에서 추가:
   
   ```
   VITE_SUPABASE_URL = https://kzsksntrwrzkgttowdov.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6c2tzbnRyd3J6a2d0dG93ZG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODMxNDcsImV4cCI6MjA4NDU1OTE0N30.XMqjMnQhjnAfVWgLqp0I9hQbLRJSBAyG6eCeWVwprgU
   ```
   
   ⚠️ **주의**: Service Role Key는 백엔드에서만 사용하므로 환경 변수로 추가하지 마세요!

3. **다시 배포**
   - Vercel 대시보드 → Deployments → 최신 배포 → "Redeploy"

### 3단계: 배포 확인

배포 완료 후 다음을 확인하세요:
- ✅ 사이트가 정상적으로 로드됨
- ✅ 설문 진행 가능
- ✅ 결과 화면 표시
- ✅ Google Analytics 작동 (G-PZY542N5YW)

---

## 📱 주요 기능

- **7단계 설문**: 시작 → 인적정보 → 학적정보 → 이전수강과목 → 진로방향 → 관심분야 → 결과
- **진로 방향**: 취업/창업/대학원진학/계획없음
- **관심 분야**: 공정/물류SCM/데이터/금융/컨설팅기획 (최대 3개, 우선순위 반영)
- **SWOT 분석**: 선수강 과목 기반 강점/약점 분석
- **과목 추천**: 관심분야 가중치 기반 맞춤 추천
- **교수님 코멘트 & 선배 꿀팁**: 각 과목 상세 정보 제공
- **관리자 대시보드**: 설문 결과 통계 확인

---

## 🛠 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

---

## 🎨 디자인

블루-인디고 그라데이션 테마로 일관성 있는 UI 제공

---

## 📊 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Database + Edge Functions)
- **Analytics**: Google Analytics (G-PZY542N5YW)
- **Deployment**: Vercel

---

## 🔧 문제 해결

### 흰 화면이 뜨는 경우
1. Vercel 환경 변수가 설정되었는지 확인
2. Build Command가 `npm run build`인지 확인
3. Output Directory가 `dist`인지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### Supabase 연결 오류
- 환경 변수 이름이 `VITE_` 접두사로 시작하는지 확인
- Supabase URL과 Anon Key가 정확한지 확인

---

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.
