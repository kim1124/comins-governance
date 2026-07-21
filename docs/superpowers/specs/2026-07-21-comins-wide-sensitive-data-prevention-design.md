# Comins 공통 민감정보 유출 방지 설계

## 목적

모든 현재 및 향후 Comins 브랜드 저장소에서 개인정보와 인증정보가 소스, Git 이력, 협업 산출물, CI artifact 또는 npm 패키지에 포함되는 위험을 공통 정책과 저장소별 차단 계층으로 줄인다.

이번 설계는 향후 유출 방지 정책과 자동 차단 체계만 다룬다. 이미 공개된 Git 객체, 외부 clone, npm 과거 버전 및 레지스트리 메타데이터의 삭제·이력 재작성·지원 요청은 별도 remediation 작업으로 유지한다.

## 확정된 결정

- 적용 대상은 `comins-governance`, `comins-table`, `comins-grid-layout`, `comins-sortable` 및 이후 생성되는 모든 Comins 저장소다.
- `comins-governance`가 공통 정책, 검증 계약, 모듈 템플릿과 신규 모듈 체크리스트를 소유한다.
- 각 모듈은 독립 Git 저장소, CI 및 release unit을 유지하며 자체 검사기, hook, workflow와 package gate를 보유한다.
- 공용 runtime npm 의존성이나 중앙 workflow 실행에 각 모듈의 안전 경계를 의존하지 않는다.
- 정책 변경은 Comins Contract `v1.2`로 기록하고 각 모듈이 별도 검토·커밋으로 채택한다.
- 검사 결과에는 발견된 개인정보, credential, token 또는 secret-derived fingerprint를 출력하지 않는다.
- 검사 실패, 검사기 오류, 해석할 수 없는 Git 범위, 읽기 실패, symlink traversal 또는 검증 도구 checksum 불일치는 fail-closed 처리한다.
- 로컬 구현과 비파괴 검증은 모듈별로 수행하되 push, PR 변경, 원격 보안 설정 변경, publish 또는 기타 외부 쓰기는 각각 명시적 승인 후 수행한다.

## 적용 방식

### 채택한 방식: 중앙 정책과 저장소별 독립 구현

`comins-governance`는 금지 대상, 허용 예외, 필수 검사 지점, redaction 및 성공 기준을 framework-neutral 계약으로 정의한다. 각 모듈은 동일한 계약을 자체 명령과 workflow에 맞게 구현한다.

이 방식은 코드 일부가 저장소별로 중복될 수 있지만 다음 경계를 보존한다.

- 한 모듈의 도구 배포 또는 장애가 다른 모듈의 commit·CI·release를 중단시키지 않는다.
- 각 모듈의 package manager, build output 및 release workflow에 맞춰 최종 artifact를 검사할 수 있다.
- 공통 정책 변경과 모듈 채택 상태를 계약 버전으로 추적할 수 있다.

### 제외한 방식

- 문서 지침만 추가하는 방식은 실수를 자동 차단하지 못하므로 제외한다.
- 공용 CLI package 또는 중앙 reusable workflow에 안전 경계를 전적으로 위임하는 방식은 저장소 독립성과 공급망 격리 원칙을 약화하므로 제외한다.

## 정책 소유 구조

### Governance 계약

`comins-governance`는 다음 surface를 함께 갱신한다.

- `COMINS_CONTRACT.md`: 모든 모듈이 따라야 하는 normative privacy 및 credential-safety 규칙
- `SENSITIVE_DATA_STANDARD.md`: 검사 범위, rule category, 허용 예외, redaction, fail-closed 동작과 conformance 기준
- `AGENTS.md`: governance 자체의 문서·커밋·협업 산출물 보호 규칙
- `templates/module/AGENTS.md`: 신규 모듈과 기존 모듈 root 지침의 공통 문구
- `MODULE_CHECKLIST.md`: 저장소 생성, 첫 공개, release 직전 필수 privacy gate
- `SECURITY.md`: credential 또는 개인정보 노출 incident 처리와 안전한 보고 규칙
- `RELEASE_POLICY.md`: 최종 package artifact와 계정 메타데이터 검증 조건
- `CHANGELOG.md`: Contract `v1.2` 변경 내용과 모듈별 채택 필요성

공통 계약은 짧고 검증 가능하게 유지한다. 탐지 패턴, hook 설치 방식, CI command 같은 구현 세부사항은 표준 문서와 각 모듈에 둔다.

### 모듈 채택

각 모듈 root `AGENTS.md`는 채택한 Contract 버전을 기록하고 다음을 명시한다.

- 금지 대상과 허용되는 공개 identity
- 공개 또는 외부 전달 전 검사 대상
- 필수 local, CI 및 package gate
- 검사 우회 금지와 예외 승인 방식
- 실제 값을 노출하지 않는 실패 보고 방식

하위 `AGENTS.md`는 모듈 특화 규칙만 유지하고 root 정책을 중복하지 않는다.

## 보호 대상

### 개인정보 및 식별정보

- 실명과 repository-specific 개인 식별 문자열
- 개인 이메일 주소
- 식별 가능한 사용자 home 절대 경로
- 전화번호와 한국 주민등록번호 형식
- 개인 계정 UI, 로컬 경로 또는 기타 식별정보가 보이는 screenshot
- 관련 없는 production data, 사용자 입력 또는 support dump

### 인증정보 및 secret

- GitHub, npm, AWS, OpenAI, Google, Slack, Stripe 등 provider token과 API key
- bearer token, JWT, session value, password 및 client secret
- private key header와 key container
- credential-bearing URL
- `.env`, `.npmrc`, `.netrc`, service-account, credential 및 private-key 파일
- 비밀번호·secret·token·API-key field에 할당된 non-placeholder value

### 허용 대상

- 공개 repository 또는 조직 handle
- GitHub noreply author·committer 주소
- 문서화된 public service 주소
- 명확한 placeholder와 실행 불가능한 예제 값
- repository-relative path와 `<repo-root>`, `$HOME`, `$CODEX_HOME` 같은 중립 표기

실제 개인정보나 credential을 allowlist, fixture, hash 또는 fingerprint 형태로 저장하지 않는다. Repository-specific 개인 문자열이 필요한 검사는 `.git` 내부의 ignored local marker source에서만 읽고 출력하지 않는다.

## 보호 surface와 차단 경계

| Surface | 주요 위험 | 필수 차단 경계 |
| --- | --- | --- |
| Working tree | ignored credential 파일, 붙여 넣은 값, screenshot·log | ignore rule, repository-owned worktree/file scan, 수동 media review |
| Staged index | tracking 강제 또는 mutable worktree와 index 불일치 | exact staged blob·filename scan, pre-commit hook |
| Commit과 push 범위 | hook 우회, 과거 unsafe local commit, metadata·message | pre-push range scan, commit/tag metadata scan, Gitleaks |
| 원격 branch와 PR | web edit 또는 local hook 우회 | GitHub Push Protection, required CI, PR privacy checklist |
| `main` 이력 | custom PII 또는 지원되지 않는 secret pattern | full-history CI scan, protected merge gate |
| CI log와 artifact | scanner 자체 또는 test output의 값 노출 | redacted output, 최소 권한, artifact upload 전 scan |
| npm package | generated JavaScript, declaration, source map, README, manifest | exact `.tgz` extraction and scan before upload or stage |
| npm metadata | maintainer·publisher 계정 email, repository metadata | privacy-safe account preflight and post-publish metadata verification |

PR·issue·comment를 GitHub UI에서 직접 작성하거나 외부 screenshot을 첨부하는 경로는 repository CI가 사전에 완전히 검사할 수 없다. 공통 지침과 PR checklist는 업로드 전 로컬 검사·crop·redaction을 요구하며, 이 경로를 자동 차단 보장 범위로 표현하지 않는다.

## Repository-owned 검사기

각 모듈은 npm production dependency가 없는 Node.js 검사기를 소유하고 다음 mode를 제공한다.

- `worktree`: repository-owned 파일과 ignored sensitive filename을 검사하고 dependency·build cache·test output은 명시적으로 제외한다.
- `file`: 외부 전달 전 report, log, screenshot companion text 또는 임시 artifact를 명시적으로 검사한다.
- `staged`: mutable working copy가 아니라 staged blob과 staged filename을 검사한다.
- `push`: pre-push 입력을 해석하고 전송될 모든 새 commit 범위를 검사한다.
- `history`: 선택한 local·remote ref의 commit, tag, message 및 text blob을 검사한다.
- `package`: 실제 `npm pack`으로 생성된 정확한 `.tgz`를 안전하게 추출하고 모든 package file을 검사한다.

검사기는 탐지 결과에 rule ID, repository-relative path와 line number만 포함한다. Binary는 filename과 알려진 key-container signature를 검사한다. Archive path traversal, symlink, unreadable content, malformed input 및 unsupported encoding을 조용히 건너뛰지 않는다.

False-positive 예외는 version-controlled allowlist에 rule ID, repository-relative path와 구체적 justification만 기록한다. 예외 추가는 maintainer 검토 대상이며 matched value, token fingerprint, 개인 주소 또는 secret-derived hash를 저장할 수 없다.

## Git hook과 로컬 사용

각 모듈은 `.githooks/pre-commit`과 `.githooks/pre-push`를 version control에 포함한다.

- pre-commit은 exact staged scan을 수행한다.
- pre-push는 전송 범위, commit·tag metadata와 history content를 검사한다.
- repository-owned 검사기는 필수이며 Gitleaks가 로컬에 설치된 경우 보완 검사로 실행한다.
- hook은 `npm install` 또는 dependency lifecycle에서 자동 활성화하지 않는다.
- 명시적 setup command가 현재 clone의 `core.hooksPath`를 설정하고 결과를 검증한다.
- `--no-verify` 사용과 검사 우회는 공통 지침에서 금지한다.

Hook은 로컬 안전장치이며 권한 경계가 아니다. 새로운 clone, web edit 및 의도적인 우회는 CI와 원격 설정으로 보완한다.

## CI 및 원격 저장소 경계

각 모듈의 required verification workflow는 다음 순서를 지킨다.

1. persisted credential 없이 필요한 전체 Git 이력을 checkout한다.
2. dependency 설치 전에 repository-owned worktree와 history scan을 실행한다.
3. exact version과 SHA-256 checksum으로 고정한 Gitleaks binary를 설치한다.
4. redaction을 활성화하여 필요한 ref와 history를 Gitleaks로 검사한다.
5. immutable dependency install과 기존 모듈 전체 gate를 실행한다.

기존 required check 이름은 가능한 한 유지한다. Security scan 오류는 기존 required check를 실패시켜 `main` 병합을 차단한다. Workflow 권한은 `contents: read`를 기본으로 하고 release의 environment-gated stage job만 필요한 `id-token: write`를 유지한다.

각 공개 저장소는 GitHub Secret Scanning과 Push Protection을 활성화하고, `main` 병합에 security scan을 포함한 required check를 요구한다. 원격 설정 확인 또는 변경은 구현 파일 변경과 분리하며 명시적 승인 후 수행한다.

## Package와 release 경계

Package를 배포하는 모듈의 unprivileged verify-and-pack job은 다음 절차를 지킨다.

1. source와 Git history scan을 통과한다.
2. 기존 lint, unit, build, browser 및 consumer gate를 수행한다.
3. 정확히 한 개의 `.tgz`를 생성한다.
4. 같은 `.tgz`를 repository-owned package scanner로 검사한다.
5. 안전하게 추출한 package tree를 Gitleaks directory mode로 검사한다.
6. 두 검사가 모두 성공한 뒤에만 artifact를 업로드한다.
7. environment-gated stage job은 검증된 artifact만 받아 publish 절차를 수행한다.

Release 전에는 Git author·committer identity, npm maintainer·publisher email과 package metadata가 privacy-safe identity를 사용하는지 확인한다. 이 조건을 확인할 수 없거나 검사 결과가 실패하면 publication을 중단한다.

Package가 아직 없는 모듈도 root 지침과 repository gate를 먼저 채택하고, 첫 package 및 publish workflow 생성 시 package mode를 release prerequisite로 추가한다.

## 저장소별 적용

### `comins-governance`

- Contract `v1.2`, 공통 표준, templates, checklist, security 및 release policy를 먼저 확정한다.
- 문서 중심 저장소에도 root policy, ignore rule, staged·push·history 검사와 required CI를 적용한다.
- 공통 기준의 conformance fixture는 실제 token-shaped literal을 저장하지 않고 runtime에서 합성한다.

### `comins-table`

- 기존 `Repository Hygiene` 지침과 scanner·hook·CI를 유지하면서 Contract `v1.2`에 맞춘다.
- ignored sensitive worktree·explicit file mode와 exact package mode를 추가한다.
- checksum-pinned Gitleaks와 최종 `.tgz` 이중 검사를 publish workflow에 추가한다.
- 기존 full verification, browser 및 consumer gate를 약화하지 않는다.

### `comins-grid-layout`

- 기존 `2026-07-21-sensitive-data-prevention-design.md`의 repository-owned scanner, hook, Gitleaks, required CI 및 exact tarball 설계를 공통 Contract `v1.2`에 맞춰 구현한다.
- 현재 security branch의 공개 이력을 보존하고 기존 계획의 merge·PR·remote-write 승인 경계를 유지한다.
- 모듈 고유 resource 및 browser gate를 유지한다.

### `comins-sortable`

- Contract `v1.2` root 지침, ignore rule, repository-owned scanner, hook과 required CI를 신규 baseline으로 추가한다.
- 현재 package workflow가 없으므로 repository gate를 먼저 적용한다.
- package scaffold 또는 첫 public release 전 exact package scan과 privacy-safe npm metadata gate를 필수로 추가한다.

### 향후 모듈

- `templates/module/AGENTS.md`와 `MODULE_CHECKLIST.md`에서 Contract `v1.2` 및 민감정보 차단 기준을 기본값으로 상속한다.
- 첫 commit 전 local hook, 첫 PR 전 required CI, 첫 release 전 exact package scan과 원격 보안 설정을 확인한다.

## 적용 순서와 변경 경계

적용은 다음 순서로 분리한다.

1. `comins-governance`에서 Contract `v1.2`와 conformance 기준을 확정한다.
2. `comins-table`의 기존 구현을 공통 기준에 맞추고 package gap을 닫는다.
3. `comins-grid-layout`의 승인된 상세 설계를 구현하고 공통 계약을 채택한다.
4. `comins-sortable`에 신규 baseline을 적용한다.
5. 네 저장소를 대상으로 최종 cross-repository conformance audit을 수행한다.

각 저장소는 독립 commit, verification evidence 및 잔여 리스크를 가진다. 한 저장소의 실패를 다른 저장소의 완료로 숨기지 않는다. Push, PR 변경, 원격 ruleset 변경 및 publish는 로컬 변경·검증과 별도 승인 경계로 유지한다.

## 오류 처리와 안전한 보고

- 발견값은 stdout, stderr, JSON 결과, test snapshot, report 또는 CI annotation에 포함하지 않는다.
- scanner 오류와 입력 해석 실패는 finding이 없는 것으로 처리하지 않는다.
- 민감 filename 또는 path 자체에 개인정보가 포함된 경우 출력에는 원문이나 원문 파생 hash 대신 실행별 순번 기반 redacted label만 사용한다.
- test fixture는 실제 provider secret과 혼동될 literal을 commit하지 않고 runtime 조합으로 생성한다.
- 검사 실패 report에는 rule ID, redacted path, 실행 mode와 조치 방향만 기록한다.
- credential 노출이 의심되면 release를 중단하고 값을 출력하지 않은 채 회수·교체·incident 절차로 전환한다.

## 검증 전략

### 공통 detector 검증

- 실명 marker, 개인 email, 개인 home path, 전화번호 및 주민등록번호 형식을 차단한다.
- provider token, generic API key, private key, JWT, credential URL과 sensitive filename을 차단한다.
- 공개 handle, GitHub noreply, service address와 placeholder는 허용한다.
- allowlist가 값 또는 secret-derived fingerprint 없이 path·rule·justification만 허용하는지 검사한다.
- 모든 failure output에서 합성된 발견값이 제외되는지 검증한다.

### Mode 및 integration 검증

- worktree, explicit file, staged, push, history와 package mode의 clean·failure path를 임시 저장소에서 검증한다.
- hook을 우회해 생성한 local commit이 pre-push scan에서 거부되는지 검증한다.
- malformed range, unreadable file, archive traversal, symlink 및 checksum mismatch가 fail-closed 되는지 검증한다.
- workflow YAML과 scanner configuration을 parse한다.
- clean repository history와 exact package artifact가 repository-owned scanner와 Gitleaks를 모두 통과하는지 검증한다.

### 모듈 gate

- 각 저장소의 기존 baseline 및 full verification command를 유지한다.
- package 모듈은 consumer smoke와 실제 `.tgz` scan을 수행한다.
- browser-visible module은 기존 Playwright 및 resource gate를 유지한다.
- 최종 변경 후 `git diff --check`, 전체 diff review, clean worktree와 Contract 버전 정합성을 확인한다.

## 성공 기준

- 모든 현재 모듈 root `AGENTS.md`가 Contract `v1.2`와 공통 민감정보 금지 규칙을 채택한다.
- governance template과 신규 모듈 checklist가 같은 기준을 기본값으로 제공한다.
- 모든 저장소의 worktree, staged snapshot, push 범위 및 도달 가능한 target history가 repository-owned 검사기를 통과한다.
- Worktree, target history 및 package artifact가 해당 scope를 지원하는 Gitleaks 검사도 통과한다.
- 합성 개인정보·API key·token·private key·credential filename은 commit 전에 거부된다.
- hook을 우회한 local commit은 push 전에 거부된다.
- required CI가 custom PII와 secret pattern을 `main` 병합 전에 차단한다.
- 최종 npm `.tgz`는 upload 또는 stage 전에 repository-owned scanner와 Gitleaks를 모두 통과한다.
- 실제 발견값은 local output, CI log, test artifact와 report에 나타나지 않는다.
- 각 저장소가 별도 검증 결과와 미해결 원격 설정을 명시한다.

## 보장 경계와 잔여 리스크

개인 공개 저장소에서는 임의의 민감 문자열이 어떤 원격 branch에도 도달하지 않는다는 문자 그대로의 절대 보장을 제공할 수 없다. Local hook은 의도적으로 우회할 수 있고 GitHub web edit와 직접 작성한 PR·issue·comment는 repository scanner 실행 전에 공개될 수 있다. GitHub Push Protection도 지원 provider secret 중심의 server-side 경계다.

이 설계가 제공하는 보장 범위는 다음과 같다.

- 정상적인 local Git 흐름에서는 개인정보와 지원되지 않는 secret pattern을 commit·push 전에 차단한다.
- 지원되는 provider secret은 GitHub Push Protection으로 원격 수락 전에 차단한다.
- local hook 우회 또는 web edit로 유입된 값은 required CI가 `main` 병합 전에 차단한다.
- 검증되지 않은 package artifact는 upload, stage 또는 publish 경계로 전달되지 않는다.
- 검사 실패는 값을 노출하지 않고 fail-closed 처리한다.

잔여 리스크는 의도적인 hook 우회 후 보호되지 않은 branch에 push하는 경우, CI 완료 전 원격 branch 노출, 직접 작성한 GitHub 협업 콘텐츠, screenshot의 시각적 개인정보, 외부 clone·mirror, 과거 공개 Git 객체와 npm 메타데이터다. 과거 공개 데이터 정리는 본 설계와 분리된 remediation 절차로 추적한다.
