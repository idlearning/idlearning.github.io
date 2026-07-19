# 홈페이지 콘텐츠 관리 가이드 (구글 시트/폼)

이 사이트의 **People / Projects / Publications / News** 콘텐츠는 코드를 건드리지 않고
**하나의 구글 시트**로 관리합니다. 시트를 수정하면 정해진 주기(기본 1시간)마다 자동으로,
또는 원할 때 수동으로 사이트에 반영됩니다.

동작 원리 요약:

```
구글 시트(4개 탭) ─▶ (링크 공개 CSV) ─▶ scripts/sync-sheets.mjs
   ▲                                              │
   │ 구글 폼으로 입력 가능(선택)                     ▼
   └─ Apps Script가 배포 트리거          src/data/generated/*.json ─▶ 빌드/배포
```

> ⚠️ 정적 사이트라 시트 수정이 **즉시** 반영되지는 않습니다. 자동 반영(스케줄) 또는
> 수동 배포(아래 6번)를 거쳐야 사이트에 나타납니다.

---

## 1. 구글 시트 구조 (이미 연결되어 있음)

> ✅ 이 사이트는 **이미 구글 시트에 연결되어 있습니다**
> (`scripts/sheets.config.json`의 `spreadsheetId`). 아래 내용은 시트를 새로 만들거나
> 옮길 때를 위한 참고용입니다. 평소 콘텐츠 수정은 연결된 시트를 열어 편집하면 됩니다.

1. 하나의 스프레드시트에 아래 4개 탭이 있어야 합니다:
   - `People`, `Projects`, `Publications`, `News`
   - (탭 이름은 `scripts/sheets.config.json`의 값과 일치해야 합니다.)
2. **각 탭의 첫 행은 반드시 아래 "컬럼 규격"의 헤더 이름과 똑같아야 합니다.**
   순서는 상관없지만 이름은 정확히 일치해야 합니다.
3. 시트를 새로 만든다면, 각 탭을 위 이름으로 추가하고 아래 규격대로 헤더를 넣은 뒤
   3번 항목(시트 ID 연결)을 갱신하면 됩니다.

### 컬럼 규격

**People 탭**

| 헤더                | 설명                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| `상태`              | `지도교수` / `박사 또는 통합 재학` / `석사 재학` / `석사 졸업` / `박사 졸업` |
| `한국어명`          | 비우면 국제학생으로 처리(영문명만 표시)                                      |
| `영문명`            | 필수                                                                         |
| `이메일`            |                                                                              |
| `관심분야`          | 재학생 화면에 표시                                                           |
| `교육 및 경력`      | **세미콜론 `;` 으로 구분** → 화면에서 줄바꿈으로 표시                        |
| `구글 스칼라`       | URL                                                                          |
| `개인 홈페이지`     | URL — Publications의 저자 이름(영문·한글 모두)이 이 주소로 연결됩니다        |
| `논문 표기 이름`    | 논문에 다르게 표기된 이름을 **세미콜론 `;` 으로 구분** (아래 설명 참고)      |
| `석사학위논문`      | 박사과정 재학생용(선택)                                                      |
| `석사학위논문 링크` | URL                                                                          |
| `졸업연도`          | 졸업생용 (숫자)                                                              |
| `소속`              | 졸업생 화면에 표시                                                           |
| `학위논문`          | 졸업생 화면에 표시                                                           |
| `학위논문 링크`     | URL                                                                          |
| `사진`              | 프로필 사진 경로(선택) — 없으면 이니셜 표시. 아래 "이미지 넣는 법" 참고      |

> `상태`를 `석사 졸업`/`박사 졸업`으로 바꾸면 자동으로 **Alumni** 섹션으로 이동합니다.
> 같은 사람이 석사 졸업 후 박사 재학이면 **두 행**(재학 1행 + 졸업 1행)으로 넣으면 됩니다.

#### 저자 이름 매칭 (`논문 표기 이름`)

Publications 탭의 저자 이름은 People 탭의 `영문명`·`한국어명`과 자동으로 대조되어,
일치하는 구성원의 `개인 홈페이지`로 연결됩니다. **국문 논문의 한글 저자명도 동일하게 연결됩니다.**

띄어쓰기·하이픈·대소문자 차이(`Sung-Eun Kim` = `Sungeun Kim`)는 자동 처리되므로 따로 적을 필요가 없습니다.
**로마자 표기 자체가 다른 경우에만** `논문 표기 이름`에 적어주세요.

예: 김평화(`Pyunghwa Kim`) 행의 `논문 표기 이름` 칸에 `Pyeong Hwa Kim` 입력

현재 연결되지 않고 있는 표기 예시 — 해당 구성원 행에 추가하면 바로 연결됩니다.

| 구성원                 | 논문에 쓰인 다른 표기 |
| ---------------------- | --------------------- |
| 김평화 `Pyunghwa Kim`  | `Pyeong Hwa Kim`      |
| 류다현 `Da Hyeon Ryoo` | `Dahyeon Ryu`         |
| 김남희 `Nam Hui Kim`   | `Nam Hee Kim`         |

**Projects 탭**

| 헤더            | 설명                                               |
| --------------- | -------------------------------------------------- |
| `한국어명`      | 비우면 영문명이 대표 제목이 됨                     |
| `영문명`        |                                                    |
| `연구 기간`     |                                                    |
| `지원기관`      |                                                    |
| `참여연구원`    |                                                    |
| `프로젝트 설명` | 더보기에 표시                                      |
| `이미지 URL`    | 프로젝트 썸네일(선택) — 아래 "이미지 넣는 법" 참고 |
| `연관 논문 ID`  | 세미콜론 구분, Publications 탭의 `id`와 일치(선택) |

**Publications 탭**

| 헤더                      | 설명                                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| `id`                      | 고유 식별자(연관 논문 연결에 사용)                                     |
| `title`                   | 필수                                                                   |
| `authors`                 | `,` 또는 `&`로 저자 구분 (People의 영문명과 같으면 이름에 링크가 걸림) |
| `year`                    | 숫자                                                                   |
| `publication date`        | 화면 미표시(선택)                                                      |
| `venue`                   | 게재처. 비우면 `journal` + `volume_issue`로 자동 구성                  |
| `journal`, `volume_issue` | 저널 논문의 게재지/권호(선택)                                          |
| `type`                    | `journal` / `conference` / `book`                                      |
| `ssci`, `scopus`, `kci`   | `1`=표시, `0`/공백=미표시 (또는 `index` 컬럼에 `SSCI; SCOPUS`처럼)     |
| `pdf`, `acmdl`, `website` | 각 링크 버튼 URL(선택)                                                 |
| `doi`                     | DOI (전체 URL 넣어도 자동으로 다듬음)                                  |
| `award`                   | 수상명(선택) — 있으면 award 뱃지 표시                                  |

**News 탭**

| 헤더        | 설명                                             |
| ----------- | ------------------------------------------------ |
| `날짜`      | `YYYY-MM-DD`                                     |
| `제목`      |                                                  |
| `국문 본문` | 상세 페이지 국문 — **마크다운 지원** (아래 참고) |
| `영문 본문` | 상세 페이지 영문 — **마크다운 지원** (아래 참고) |
| `썸네일`    | 이미지 경로 — 아래 "이미지 넣는 법" 참고         |

> 📝 **뉴스 본문 마크다운 치트시트** — 본문 칸에 아래 문법을 쓰면 서식이 적용됩니다.
> (안전상 원시 HTML은 무시되며, 아래 문법만 렌더링됩니다.)
>
> ```text
> 문단은 빈 줄로 구분합니다.
> 한 줄 안에서 줄바꿈은 그냥 엔터.
>
> ## 큰 소제목
> ### 작은 소제목
>
> **굵게**, *기울임*, `코드`
> [링크 텍스트](https://example.com)
>
> - 불릿 항목 1
> - 불릿 항목 2
>
> 1. 번호 항목 1
> 2. 번호 항목 2
> ```
>
> 별도 문법 없이 그냥 텍스트만 써도 됩니다(줄바꿈·문단 그대로 표시).

---

## 이미지 넣는 법

사이트의 모든 이미지(News 썸네일 · People 사진 · Projects 이미지)는 **저장소가 직접
보관**합니다. 시트에는 URL이 아니라 **저장소 내 경로**를 적습니다.

```
public/images/news/      ← News 썸네일
public/images/people/    ← 구성원 프로필 사진
public/images/projects/  ← 프로젝트 썸네일
```

**넣는 순서**

1. GitHub 저장소 → `public/images/` → 해당 폴더 → **Add file → Upload files**
   (브라우저에서 드래그앤드롭. 터미널 필요 없음)
2. 파일명은 알아보기 쉽게. News는 `날짜-키워드`, People은 `영문이름` 권장
   (예: `2026-07-aied.jpg`, `hyo-jeong-so.png`)
3. 시트의 `썸네일`/`사진`/`이미지 URL` 칸에 **`/images/폴더/파일명`** 형식으로 입력

   ```text
   /images/news/2026-07-aied.jpg
   /images/people/hyo-jeong-so.png
   ```

> ⚠️ 앞의 슬래시(`/`)를 빼먹으면 안 됩니다. `images/...`가 아니라 `/images/...`입니다.

**외부 URL도 여전히 동작하지만 권장하지 않습니다.** 예전에는 이미지가 아임웹
CDN(`cdn.imweb.me`)에 있었는데, 그쪽 구독이 끝나면 사이트 이미지가 전부 깨지기
때문에 2026년 7월에 60장을 저장소로 옮겼습니다. 같은 이유로 새 이미지도 저장소에
올려 주세요.

**용량 팁.** 프로필 사진은 가로 800px, 썸네일은 가로 1200px 정도면 충분합니다.
휴대폰 원본(3~5 MB)을 그대로 올리면 페이지가 느려집니다.

---

## 2. 시트를 링크 공개로 전환하기 (한 번만)

구글 시트 오른쪽 위 **공유(Share)** 버튼 → **일반 액세스(General access)** →
**"링크가 있는 모든 사용자(Anyone with the link)"**, 역할은 **뷰어(Viewer)**로 설정.

(이렇게 해야 API 키 없이 CSV로 읽을 수 있습니다. 편집 권한과는 무관하며,
읽기 전용 공개만 하는 것입니다. "파일 → 공유 → 웹에 게시"는 별도 기능이라
이것만으로는 동작하지 않습니다 — 반드시 위의 공유 대화상자에서 설정하세요.)

## 3. 시트 ID를 코드에 연결하기 (한 번만)

시트 URL이 `https://docs.google.com/spreadsheets/d/`**`여기가_시트ID`**`/edit...` 형태입니다.
이 `시트ID`를 `scripts/sheets.config.json`의 `spreadsheetId`에 넣습니다.

```json
{
  "spreadsheetId": "여기에_시트ID",
  "tabs": {
    "people": "People",
    "projects": "Projects",
    "publications": "Publications",
    "news": "News"
  }
}
```

이 파일을 커밋/푸시하면 이후 배포부터 시트 내용이 사이트에 반영됩니다.
(설정 전에는 저장소에 커밋된 기존 데이터가 그대로 쓰입니다.)

로컬에서 미리 확인하려면: `npm run sync` → `src/data/generated/*.json`이 갱신됨.

---

## 4. (선택) 구글 폼으로 입력받기

**News**나 **Publications**를 구글 폼으로 받고 싶을 때 씁니다. 예: 연구원이 폼으로
새 논문·소식을 제출하면 자동으로 시트에 쌓이고 사이트에 반영됩니다.

문제는 폼이 응답을 **자체 탭**(예: `설문지 응답 시트1`)에 쌓는데, 컬럼 헤더가
질문 제목 그대로라 sync가 기대하는 헤더(`title`, `날짜` 등)와 다르고, 기존에
손으로 입력해 둔 `News`/`Publications` 탭과도 분리된다는 점입니다.

### 실전 적용: News 등록 폼 (설정 완료됨)

News는 **작성자(교수님)와 관리자(랩실)가 다르기** 때문에 폼으로 받습니다.
작성자는 폼만 채우면 되고, 이미지 업로드만 관리자가 처리합니다.

**폼 문항 (5개)**

| #   | 질문        | 유형                                | 필수 |
| --- | ----------- | ----------------------------------- | ---- |
| 1   | 제목        | 단답형                              | ✅   |
| 2   | 날짜        | **날짜형** (달력에서 선택)          | ✅   |
| 3   | 국문 본문   | 장문형 — 문단은 엔터 두 번          | ✅   |
| 4   | 영문 본문   | 장문형                              | ⬜   |
| 5   | 사진        | **파일 업로드** (이미지, 1개)       | ⬜   |

> 폼 설정 ⚙️ → 응답 → **"Ewha 계정으로 로그인 필요"** 를 켜 두세요.
> (파일 업로드 문항이 있으면 로그인은 자동으로 필수가 됩니다.)

**시트 구성 — 탭 3개**

| 탭            | 역할                                                   |
| ------------- | ------------------------------------------------------ |
| `News Form`   | 폼 응답이 쌓이는 탭 (건드리지 않음)                    |
| `News Photos` | 관리자가 제목 ↔ 이미지 경로를 적는 2열 탭              |
| `News`        | sync가 읽는 탭. 위 둘을 수식으로 합침 (직접 입력 금지) |

1. `News Form` 컬럼 순서 확인 — 로그인을 켜면 B열에 이메일이 생깁니다:
   `A=타임스탬프 · B=이메일 · C=제목 · D=날짜 · E=국문 본문 · F=영문 본문 · G=사진`
2. `News Photos` 탭 1행에 `제목`, `이미지 경로` 두 헤더만 넣습니다.
3. `News` 탭 1행에 정확한 헤더를 넣습니다:
   `날짜`, `제목`, `국문 본문`, `영문 본문`, `썸네일`
4. `News` 탭 **A2 셀**에 — 폼 응답을 헤더 순서대로 끌어옵니다(A:D 채움):

   ```text
   =QUERY('News Form'!A2:G, "select D, C, E, F where C is not null", 0)
   ```

5. `News` 탭 **E2 셀**에 — 제목으로 이미지 경로를 찾아옵니다(E열 채움):

   ```text
   =ARRAYFORMULA(IF(B2:B="","",IFERROR(VLOOKUP(B2:B,'News Photos'!A:B,2,FALSE),"")))
   ```

> 💡 **왜 VLOOKUP인가?** 썸네일을 행 순서로 맞추면 폼 응답을 하나 지웠을 때
> 이미지가 통째로 밀립니다. 제목으로 찾으면 행이 밀려도 안 깨집니다.
> 사이트는 날짜 기준으로 알아서 최신순 정렬하므로(`src/data/news.ts`) 시트
> 행 순서는 신경 쓰지 않아도 됩니다.

**새 소식이 올라왔을 때 관리자가 하는 일** (사진이 있을 때만)

1. `News Form` G열의 드라이브 링크를 열어 이미지를 내려받습니다
2. `public/images/news/`에 업로드 (위 "이미지 넣는 법")
3. `News Photos` 탭에 한 줄 추가: `제목` | `/images/news/파일명.jpg`

사진이 없는 소식은 **아무것도 안 해도 됩니다.** 다음 배포(매시간)에 자동 반영됩니다.

> 이 3단계마저 없애고 싶으면 아래 5번의 Apps Script를 확장해 드라이브 파일을
> 저장소에 자동 커밋하게 만들 수 있습니다(토큰에 `Contents: Read and write` 권한
> 추가 필요). 먼저 위 방식으로 운영해 보고 번거로우면 자동화하세요.

### 방법 A — 브릿지 탭(QUERY)로 연결 (권장)

폼 질문은 **친절한 문장**으로 쓰고, 시트에서 정확한 헤더로 자동 변환합니다.
기존 수동 입력 데이터와 폼 응답을 **한 탭에서 공존**시킬 수 있습니다.

1. 구글 폼 생성 → 편집 화면 **응답 → 스프레드시트에 연결** → 같은 스프레드시트에
   새 탭(예: `News Form`)으로 연결. (질문 문구는 자유롭게)
2. sync가 읽는 탭(`News`)의 **1행에 정확한 헤더**를 직접 입력:
   `날짜`, `제목`, `국문 본문`, `영문 본문`, `썸네일`.
3. 그 탭 **A2 셀**에 아래 `QUERY`를 넣어 폼 응답을 헤더 순서에 맞춰 끌어옵니다.
   폼 응답 탭의 컬럼 순서(예: A=타임스탬프, B=제목, C=날짜, …)에 맞게 `Col`
   번호만 조정하세요.

   ```text
   =QUERY('News Form'!A2:F, "select C, B, D, E, F where B is not null", 0)
   ```

   > 위는 "폼 탭의 C열(날짜), B열(제목), D열(국문), E열(영문), F열(썸네일) 순으로
   > 가져오라"는 뜻입니다. 헤더 1행 순서와 `select` 순서가 일치해야 합니다.

4. 손으로 관리하던 기존 항목도 함께 두고 싶으면, 별도 `News Manual` 탭에 두고
   두 범위를 세로로 이어붙입니다:

   ```text
   =QUERY({'News Manual'!A2:E; 'News Form'!C2:C, ...}, "...")
   ```

   (간단히는 `News Manual` 행을 브릿지 탭 위쪽에, QUERY 결과를 그 아래에 두는
   방식도 됩니다.)

이렇게 하면 **폼 응답 행을 지우면 → 브릿지 탭에서 사라지고 → 다음 배포 때
사이트에서도 내려갑니다.** (전체 재동기화 방식이라 삭제가 그대로 반영됨.)

### 방법 B — 질문 제목을 헤더명과 똑같이 (가장 단순)

브릿지 탭 없이, **폼 질문 제목 자체를 헤더 이름과 똑같이** 짓습니다
(`제목`, `날짜`, `국문 본문`, `영문 본문`, `썸네일`). 그런 다음
`scripts/sheets.config.json`의 `tabs.news`(또는 `tabs.publications`) 값을
폼 응답 탭 이름으로 바꿉니다. 폼 응답 탭의 `타임스탬프` 열은 매핑이 헤더
이름 기준이라 자동 무시됩니다. 단, 질문 문구가 딱딱해지고 기존 수동
데이터와 합치기 어렵습니다.

### ⚠️ 폼 만들 때 주의점

- **스팸 방지 (중요):** 승인 절차 없이 즉시 게시되므로, 폼 설정 ⚙️ →
  **응답 → "Ewha 계정으로 로그인 필요" + "응답 1회로 제한"** 을 켜서
  외부인의 무단 게시를 막으세요. (내부용 폼 전제)
- **이미지:** 폼의 "파일 업로드"로 받은 이미지는 구글 드라이브에 저장되어
  `<img>`로 바로 안 붙습니다. 썸네일은 **이미지 URL을 붙여넣는 단답형 질문**으로
  받으세요.
- **뉴스 본문:** 위 "마크다운 치트시트"를 폼 안내문에 넣어 두면 제출자가
  서식을 넣어 보낼 수 있습니다.

### 실전 예시: Publications 등록 폼 (8문항)

실제 데이터에서 `pdf`/`acmdl`은 한 번도 안 쓰였고 `website`는 4/163편,
`id`는 사이트에 노출되지 않으므로 — **폼은 아래 8문항이면 충분**합니다.
(그 4개 필드가 필요한 드문 경우만 관리자가 시트에서 직접 채웁니다.)

**폼 설명에 넣을 안내:** "제출 즉시 홈페이지 Publications에 반영됩니다.
설정에서 Ewha 로그인 필수 + 응답 1회 제한을 켜 두세요."

| #   | 질문             | 유형                                                               | 필수 | 매핑 헤더 |
| --- | ---------------- | ------------------------------------------------------------------ | ---- | --------- |
| 1   | 논문 유형 (Type) | 객관식: `Journal`/`Conference`/`Book`                              | ✅   | `type`    |
| 2   | 제목 (Title)     | 단답형                                                             | ✅   | `title`   |
| 3   | 저자 (Authors)   | 단답형 — 게재순, **쉼표(,) 구분**. 영문명은 People 표기와 동일하게 | ✅   | `authors` |
| 4   | 출판 연도 (Year) | 단답형(숫자)                                                       | ✅   | `year`    |
| 5   | 게재처 (Venue)   | 단답형 — 저널명/학회명/출판사                                      | ✅   | `venue`   |
| 6   | 색인 (Index)     | 체크박스: `SSCI`/`SCOPUS`/`KCI` (저널만, 복수)                     | ⬜   | `index`   |
| 7   | DOI              | 단답형 (전체 URL도 OK)                                             | ⬜   | `doi`     |
| 8   | 수상 (Award)     | 단답형 — 수상명                                                    | ⬜   | `award`   |

**예시 제출**

- 저널(SSCI+SCOPUS): `Journal` / "Examining University Students' Engagement…" /
  `Hyeji Jang, Lingxi Jin, Hyo-Jeong So` / `2026` /
  `The Asia-Pacific Education Researcher` / ☑SSCI ☑SCOPUS / `10.1007/s40299-025-01076-9`
- 학회(수상): `Conference` / "Integrating Computational Thinking…" /
  `Jeanhee Lee, Yoon-Kyeong Lee, Hyo-Jeong So` / `2025` / `ICoME 2025` /
  (색인 없음) / (DOI 없음) / `Young Scholar Award`
- 국문 학회: `Conference` / "논쟁문제 의사결정 상황에서…" / `김규원, 소효정` /
  `2026` / `2025 한국교육정보미디어학회 춘계학술대회`

**폼 응답 탭 컬럼.** 로그인/이메일 수집을 켜면 B열에 `이메일 주소`가 생겨
한 칸씩 밀립니다. 실제 순서:
`A=타임스탬프 · B=이메일 · C=유형 · D=제목 · E=저자 · F=연도 · G=게재처 ·
H=색인 · I=DOI · J=수상`.

### 기존 데이터와 한 탭에서 합치기 (실전 적용)

이 사이트의 기존 `Publications` 탭은 17열입니다:
`id · title · authors · year · publication date · journal · volume_issue ·
venue · type · ssci · scopus · kci · pdf · doi · acmdl · website · award`.
폼은 색인을 **한 칸**(SSCI/SCOPUS/KCI 묶음)으로 받으므로, 폼 응답을 이 17열
모양으로 재배치하고 색인을 `ssci/scopus/kci` 세 칸으로 분해해 기존 데이터
아래에 이어붙입니다.

1. 기존 `Publications` 탭 이름을 → **`Pub Manual`** 로 변경 (내용은 그대로).
2. 새 탭 **`Publications`** 를 만들고, **1행에 위 17개 헤더**를 그대로 입력.
3. 폼 응답 탭 이름을 **`Pub-Form`** 으로 변경(구분 쉽게). 새 탭 **A2 셀**에
   아래 수식을 한 번 붙여넣습니다(이후 손댈 일 없음). 폼 행의 **id를
   `연도-유형-순번`으로 계산해 채우고**, 전체를 **id 내림차순(번호 큰=나중
   출판이 위)** 으로 정렬합니다:

   ```text
   =SORT(
     {
       FILTER('Pub Manual'!A2:Q, LEN('Pub Manual'!B2:B));
       FILTER(
         ARRAYFORMULA({
           'Pub-Form'!F2:F2000&"-"&LOWER(LEFT('Pub-Form'!C2:C2000,1))&"-"&TEXT(
             COUNTIF('Pub Manual'!$A$2:$A,'Pub-Form'!F2:F2000&"-"&LOWER(LEFT('Pub-Form'!C2:C2000,1))&"-*")
             +COUNTIFS('Pub-Form'!$F$2:$F$2000,'Pub-Form'!F2:F2000,'Pub-Form'!$C$2:$C$2000,'Pub-Form'!C2:C2000,ROW('Pub-Form'!$F$2:$F$2000),"<="&ROW('Pub-Form'!F2:F2000)),
           "000"),
           'Pub-Form'!D2:D2000,
           'Pub-Form'!E2:E2000,
           'Pub-Form'!F2:F2000,
           IF('Pub-Form'!D2:D2000="","",""),
           IF('Pub-Form'!D2:D2000="","",""),
           IF('Pub-Form'!D2:D2000="","",""),
           'Pub-Form'!G2:G2000,
           'Pub-Form'!C2:C2000,
           IF(REGEXMATCH('Pub-Form'!H2:H2000,"SSCI"),"1",""),
           IF(REGEXMATCH('Pub-Form'!H2:H2000,"SCOPUS"),"1",""),
           IF(REGEXMATCH('Pub-Form'!H2:H2000,"KCI"),"1",""),
           IF('Pub-Form'!D2:D2000="","",""),
           'Pub-Form'!I2:I2000,
           IF('Pub-Form'!D2:D2000="","",""),
           IF('Pub-Form'!D2:D2000="","",""),
           'Pub-Form'!J2:J2000
         }),
         LEN('Pub-Form'!D2:D2000)
       )
     },
     1, FALSE
   )
   ```

   - **id**: `연도-유형첫글자(j/c/b)-순번`. 순번 = `Pub Manual`의 같은
     연도·유형 개수 + `Pub-Form`에서 같은 연도·유형 중 이 행까지 순서 →
     예: 기존 `2026-j-001·002` 다음 폼 저널은 `2026-j-003·004`.
   - **정렬**: `SORT(…,1,FALSE)` = id 내림차순 → 번호 큰(나중 출판)게 위,
     유형은 j>c>b 순이라 사이트 그룹 순서(저널·학회·책)와도 일치.
   - 시트가 id를 채우므로 sync는 그 id를 **그대로 사용**(시트=사이트 일치).
   - 17열 순서: id, title(D), authors(E), year(F), publication date(빈),
     journal(빈), volume_issue(빈), venue(G), type(C),
     ssci/scopus/kci(색인 H를 `REGEXMATCH`로 분해), pdf(빈), doi(I),
     acmdl(빈), website(빈), award(J).

4. `scripts/sheets.config.json`의 `tabs.publications`는 `"Publications"`
   그대로 — 이제 이 합본 뷰를 가리킵니다.

> - 탭 이름 `Pub-Form`/`Pub Manual`이 실제와 다르면 수식 안 이름을 교체하세요
>   (하이픈·공백 있으면 작은따옴표 필수).
> - 배열 수식이 `#ERROR!`면 로케일 문제 — 배열 안 쉼표 `,`를 백슬래시 `\`로
>   바꿔 보세요(한국 로케일은 보통 `,`로 정상).
> - 순번 계산은 `Pub Manual`의 같은 연도·유형 id가 **1번부터 연속**이라고
>   가정합니다(현재 데이터 그러함). 중간 결번이 있으면 관리자가 id를 직접
>   지정하세요(그 값이 우선).
> - **폼 응답 행을 지우면** 합본 뷰에서도 사라지고 다음 배포에 사이트에서
>   내려갑니다.

### (대안) 방법 B — 탭을 분리하고 코드가 여러 탭을 읽기

위 합본 수식이 부담스러우면, 폼은 신규 전용 탭으로 두고
`scripts/sheets.config.json` + `scripts/sync-sheets.mjs`를 소폭 고쳐 한
데이터셋이 **여러 탭**을 읽어 이어붙이게 할 수도 있습니다(코드 변경 필요,
시트 수식은 단순해짐). 필요하면 요청하세요.

## 5. (선택) 폼 제출 시 자동 배포

폼 제출 즉시 사이트를 갱신하려면, 시트에 연결된 **Apps Script**로 GitHub 배포를
트리거합니다.

1. GitHub에서 **Fine-grained Personal Access Token** 발급
   (Settings → Developer settings → Fine-grained tokens):
   - Repository access: `idlearning/idlearning.github.io`
   - Permissions: **Actions → Read and write**
2. 구글 시트 → **확장 프로그램 → Apps Script**에 아래 코드를 붙여넣습니다.
   `PROJECT SETTINGS → Script properties`에 `GH_TOKEN` = 발급한 토큰을 저장합니다.

```javascript
// 폼 제출 시 GitHub Actions 배포 워크플로우를 트리거합니다.
function onFormSubmit() {
  var token = PropertiesService.getScriptProperties().getProperty("GH_TOKEN");
  var url =
    "https://api.github.com/repos/idlearning/idlearning.github.io" +
    "/actions/workflows/deploy.yml/dispatches";
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
    payload: JSON.stringify({ ref: "main" }),
    muteHttpExceptions: true,
  });
}
```

3. Apps Script의 **트리거(⏰) → 트리거 추가** → 함수 `onFormSubmit`,
   이벤트 소스 **스프레드시트에서**, 이벤트 유형 **양식 제출 시**.

> 토큰은 구글 클라우드(Script Properties)에만 저장되며, 공개 사이트에는 절대
> 노출되지 않습니다.

---

## 6. 수동으로 지금 바로 배포하기

시트를 고친 뒤 즉시 반영하고 싶을 때:

**GitHub 저장소 → Actions 탭 → "Deploy to GitHub Pages" → Run workflow → Run.**

몇 분 뒤 사이트에 반영됩니다. (스케줄 자동 반영은 기본 매시간.)

---

## 자주 묻는 것

- **시트를 잘못 고쳐도 사이트가 깨지나요?** 특정 탭을 읽지 못하면 그 탭은 직전 데이터를
  유지하고, 나머지는 정상 반영됩니다. 시트 ID가 비어 있으면 저장소에 커밋된 데이터를 씁니다.
- **반영 주기를 바꾸려면?** `.github/workflows/deploy.yml`의 `schedule: cron` 값을
  수정합니다(UTC 기준).
- **사진/이미지는?** 저장소 `public/images/`에 올리고 시트에는 `/images/...` 경로를
  적습니다. 위 "이미지 넣는 법" 참고.
