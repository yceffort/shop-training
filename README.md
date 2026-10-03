# 쇼핑몰

Next.js App Router, React, TanStack Query로 만든 작은 쇼핑몰입니다.

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

- 사용자는 2명이고 헤더에서 전환할 수 있습니다.
- 데이터는 메모리에 저장되므로 서버를 다시 시작하면 초기화됩니다.
- API는 실제 네트워크처럼 응답이 늦게 올 수 있습니다.

## 과제

### 1단계: 문제 찾기

코드를 읽고 문제가 있다고 생각하는 부분을 모두 찾아 정리해 주세요. 범위는 React, TanStack Query, Next.js, 성능입니다. 항목마다 다음 내용을 적습니다.

- 위치 (파일과 줄)
- 무엇이 문제인지
- 어떤 상황에서 문제가 드러나는지
- 어떻게 고치면 좋을지

### 2단계: 리팩토링

1단계에서 정리한 내용을 직접 고쳐 주세요.

- 화면의 동작은 그대로 유지해야 하며, 공개 테스트가 계속 통과해야 합니다.
- `src/server`와 `src/app/api`는 실제 백엔드를 대신하는 코드입니다. API의 요청과 응답 형식은 바꾸지 마세요.

## 테스트

```bash
npx playwright install chromium   # 처음 한 번만
npm run test:e2e
```

테스트는 production 빌드를 3000번 포트에 띄워서 실행하므로, 실행 전에 개발 서버를 꺼 주세요. 테스트는 화면에서 보이는 동작만 검증하고 코드 구조는 검사하지 않습니다.

## 폴더 구조

```
src/
  app/          라우트 (페이지, 레이아웃, API)
  components/   UI 컴포넌트
  lib/          공통 타입과 유틸
  server/       메모리 DB와 세션
  styles/       CSS Modules
e2e/            공개 테스트
```
