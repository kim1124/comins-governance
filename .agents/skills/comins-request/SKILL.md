---
name: comins-request
description: Use when a Comins maintainer asks for a request format, work request template, feature brief, maintenance brief, or copyable prompt before describing investigation, feature, modification, deletion, maintenance, or external work.
---

# Comins Request

## Output contract

Return exactly one fenced text block containing the template below. Preserve the
field order and Korean labels exactly.

```text
작업 유형: [조사 | 기능 추가 | 수정 | 삭제 | 유지보수 | 원격 반영]

대상:
목표:
범위:
완료 조건:
권한:
```

Do not inspect repositories. Do not start the requested work. Do not ask
questions or infer values for blank fields. Do not add introductory or closing
prose. Treat a later message containing the completed template as the actual
work request.
