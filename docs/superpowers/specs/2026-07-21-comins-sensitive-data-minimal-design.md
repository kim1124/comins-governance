# Comins 민감정보 유출 방지 최소 설계

## 목적

모든 Comins 저장소에서 개인정보와 인증정보가 Git, 협업 산출물 또는 npm 패키지에 포함될 가능성을 낮추되, 별도의 보안 제품을 개발하지 않는다. 공통 정책은 짧게 유지하고 검증은 검증된 외부 도구와 저장소별 얇은 검사 명령을 조합한다.

이번 설계는 향후 유출 방지만 다룬다. 이미 공개된 Git 객체, 과거 npm 버전, registry 계정 메타데이터 및 외부 cache 정리는 별도 remediation 작업이다.

## 적용 대상

- `comins-governance`
- `comins-table`
- `comins-grid-layout`
- `comins-sortable`
- 이후 생성되는 Comins 브랜드 저장소

각 저장소는 독립 Git 저장소, CI 및 release unit을 유지한다. 원격 push, PR, ruleset 변경, 배포 및 publish는 별도 승인을 받는다.

## 채택한 구조

### 1. Governance는 짧은 정책만 소유한다

`comins-governance`는 다음 항목만 공통 계약으로 관리한다.

- 금지 대상: 실명 등 개인 식별정보, 개인 이메일, 개인 home 절대경로, credential, API key, token, private key 및 민감 설정 파일
- 허용 대상: 공개 handle, GitHub noreply identity, service identity, 명시적 placeholder 및 repository-relative path
- 필수 경계: 작업 파일, staged 변경, CI, Git 이력 감사 및 실제 npm package artifact
- 출력 규칙: 탐지값을 출력하지 않고 rule과 중립 경로만 보고
- 예외 규칙: 실제 값이나 값에서 파생한 hash를 allowlist에 저장하지 않음
- 사고 대응: 노출 의심 시 배포 중단, credential 폐기·교체 및 별도 remediation

공통 표준은 120줄 이내를 목표로 하고, 모듈 `AGENTS.md` 공통 문구는 15줄 이내로 유지한다.

### 2. 검증된 도구가 secret 검사를 담당한다

API key, token, private key 및 credential 패턴은 checksum으로 고정한 Gitleaks와 GitHub Secret Scanning·Push Protection을 사용한다. Comins는 Git object parser, token engine 또는 binary secret scanner를 자체 구현하지 않는다.

CI에서는 Gitleaks의 redaction을 활성화한다. 도구 설치 실패, checksum 불일치 또는 검사 오류는 성공으로 처리하지 않는다.

### 3. 저장소별 보조 검사는 좁은 범위만 담당한다

각 모듈의 기존 Node.js 또는 shell 기반 검증 명령은 다음 항목만 검사한다.

- non-placeholder email
- 개인 home 절대경로
- 민감 filename
- Git author·committer identity가 공개 identity 정책을 따르는지 여부
- package manifest에 허용되지 않은 파일이 포함되는지 여부

보조 검사기는 Git object, tar header, archive checksum 또는 중첩 tag를 직접 파싱하지 않는다. Git 이력의 secret 검사는 Gitleaks에 맡기고, identity 검사는 `git log`의 안정된 출력 형식을 입력으로 사용한다.

### 4. Package 검사는 npm 표준 흐름을 사용한다

패키지 저장소는 `package.json#files` allow-list를 우선 사용한다. Release 검증은 다음 순서다.

1. 기존 lint, test 및 build를 통과한다.
2. `npm pack --json --ignore-scripts`로 실제 `.tgz`를 한 번 생성한다.
3. npm이 반환한 package file 목록을 allow-list와 비교한다.
4. 임시 디렉터리에 표준 `tar` 명령으로 추출하고 Gitleaks directory scan을 실행한다.
5. package metadata와 공개 identity 정책을 확인한다.
6. 검증된 동일 artifact만 후속 upload 또는 publish 단계로 전달한다.

Archive traversal 방어를 위한 별도 tar parser는 만들지 않는다. npm이 생성하지 않은 임의 archive 입력은 이 검사 명령의 지원 범위가 아니다.

### 5. Local hook은 얇은 실행 진입점이다

선택적 pre-commit hook은 staged 보조 검사와 설치된 Gitleaks를 호출한다. Hook은 `npm install`에서 자동 활성화하지 않고 명시적 setup 명령으로만 설치한다.

Hook은 우회 가능한 편의 장치다. 최종 강제 경계는 required CI와 GitHub Push Protection이다.

## 저장소별 적용

- Governance: 공통 계약, 모듈 template, checklist 및 간결한 conformance 검증만 유지한다. npm project나 공용 scanner package를 만들지 않는다.
- Data Table: 기존 repository hygiene 명령에 최소 PII 검사와 실제 package manifest 검사를 결합한다.
- Grid Layout: 이미 존재하는 상세 scanner 구현은 통합 대상으로 사용하지 않고, 필요한 정책·얇은 검사·Gitleaks 경계만 별도 clean branch에서 구성한다.
- Sortable: root 정책과 CI baseline을 먼저 추가하고, package가 생길 때 package gate를 활성화한다.

각 저장소는 별도의 짧은 실행 계획과 커밋·검증 결과를 가진다. 한 저장소의 성공으로 다른 저장소의 미적용을 완료 처리하지 않는다.

## 데이터 흐름

1. 개발자가 파일을 수정한다.
2. 선택적 hook이 staged PII 보조 검사와 Gitleaks를 실행한다.
3. PR CI가 같은 검사와 기존 전체 검증을 다시 실행한다.
4. package 저장소는 실제 npm artifact의 manifest와 추출 디렉터리를 검사한다.
5. 검사 실패 시 값은 출력하지 않고 rule과 중립 경로만 보고한다.
6. 검증을 통과한 변경만 merge 또는 release 승인 대상으로 이동한다.

## 테스트와 검증

- Fixture는 실행 시 조립한 명백한 합성값만 사용한다.
- 보조 검사기의 positive, placeholder exception 및 redacted output을 unit test로 확인한다.
- Gitleaks config와 checksum은 CI에서 검증한다.
- Package 저장소는 실제 `npm pack` 결과의 file list와 추출 tree를 검사한다.
- 모든 저장소에서 기존 lint, typecheck, unit, build 및 browser gate를 약화하지 않는다.
- 문서 변경은 `git diff --check`, local link 및 Contract/template 정합성을 확인한다.

## 명시적 비범위

- 자체 Git object·revision·annotated tag parser
- 자체 tar·PAX·checksum parser
- 자체 provider token 탐지 엔진
- 임의 binary format 검사
- Contract 이전 이력을 숨기는 enforcement baseline
- Git history rewrite, 원격 object 삭제, npm unpublish 또는 cache 제거
- GitHub PR·issue 본문과 screenshot의 자동 사전 차단 보장

## 성공 기준

- 공통 정책과 module template이 간결하고 같은 금지·허용 규칙을 사용한다.
- 네 저장소가 독립적으로 최소 PII 검사와 Gitleaks CI 경계를 가진다.
- package 저장소가 실제 npm artifact의 file list와 추출 tree를 검사한다.
- 실제 탐지값이 source, fixture, allowlist, CI log 또는 report에 저장되지 않는다.
- 기존 프로젝트 검증이 유지되고 원격 변경·publish는 별도 승인 전까지 수행되지 않는다.
- 활성 설계와 실행 계획에 자체 Git/tar parser 구현이 포함되지 않는다.
