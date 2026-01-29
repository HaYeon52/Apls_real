# 한양대 산업공학과 진로 맞춤 추천 시스템

4단계 설문을 통해 사용자의 진로 관심분야를 파악하고, 선수강 과목 방향 그래프를 고려한 학기별 로드맵 기반 과목 추천 시스템입니다.

## 🚀 주요 업데이트 (2026.01.28)

### ✅ 선수강 과목 방향 그래프 반영
- **과목 간 의존성 구조화**: 70개 이상의 과목에 대한 선수과목 정보 추가
- **학습 경로 분석**: 
  - 각 과목의 난이도 레벨 자동 계산 (선수과목 체인 깊이)
  - 선수과목과 후수과목 정보를 동시에 표시
  - 학습 경로 플래너 제공

### 📊 주요 선수과목 관계
```
금융 분야:
  미분적분학/확률통계론 → 투자과학 → 시계열분석및예측 → 금융공학개론

데이터 분야:
  확률통계론 → 응용통계학 → 기계학습과데이터마이닝 → 응용데이터애널리틱스
  
공정/OR 분야:
  산공수학 → 선형계획법 → 경영과학과운영연구1/운용관리/네트워크및재고전략

프로그래밍:
  산업인공지능시스템응용 → 객체지향프로그래밍 → 데이터구조론
```

### 🎯 새로운 기능
1. **과목 상세 페이지 개선**
   - 선수과목 정보 표시 (먼저 들어야 하는 과목)
   - 후수과목 정보 표시 (이 과목을 듣고 나면 들을 수 있는 과목)
   - 과목 레벨 표시 (선수과목 체인 깊이)

2. **추천 결과 화면 개선**
   - 각 추천 과목에 선수과목 정보 표시
   - 선수과목을 고려한 더욱 정확한 추천

3. **과목 관계 분석 유틸리티**
   - `getLearningPath()`: 특정 과목까지의 학습 경로 계산
   - `getFollowUpCourses()`: 후수과목 찾기
   - `getCourseLevel()`: 과목 난이도 레벨 계산
   - `getCourseRelation()`: 두 과목 간 연관도 분석

---

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

- **4단계 설문**: 인적정보 → 학적정보 → 이전수강과목 → 관심분야
- **관심 분야**: 공정/물류SCM/데이터/금융/컨설팅기획 (최대 3개, 우선순위 반영: 1지망 1.0, 2지망 0.6, 3지망 0.3)
- **선수과목 체계**: 과목 간 의존성을 고려한 학습 경로 제공
- **학기별 로드맵**: 현재 학기부터 4학년 1학기까지 분야별 추천
- **과목 상세 정보**: 
  - 교수님의 코멘트
  - 선배의 꿀팁
  - 선수과목 및 후수과목
  - 과목 난이도 레벨
- **Supabase KV Store**: 설문 결과 자동 저장
- **관리자 대시보드**: 설문 결과 통계 확인
- **GTM & GA4 통합**: 정밀한 사용자 행동 분석

---

## 📊 커리큘럼 구성

- **공정 분야**: 16개 과목
- **물류/SCM 분야**: 11개 과목
- **데이터 분야**: 16개 과목
- **금융 분야**: 11개 과목
- **컨설팅/기획 분야**: 16개 과목

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
- **Backend**: Supabase (KV Store + Edge Functions)
- **Analytics**: Google Tag Manager + Google Analytics 4 (G-PZY542N5YW)
- **Deployment**: Vercel
- **과목 관계 분석**: 방향 그래프 기반 선수과목 체계

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
