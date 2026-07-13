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

## 1. 구글 시트 만들기 (한 번만)

1. 저장소 옆에 있는 아래 3개의 엑셀 파일을 준비합니다(이미 데이터가 채워져 있습니다):
   - `idlearning_people_normalized.xlsx`
   - `idlearning_projects_normalized.xlsx`
   - `idlearning_publications_normalized.xlsx`
   - (News는 `idlearning_news_normalized.xlsx`)
2. 구글 드라이브에서 **새 구글 시트**를 만들고, 각 엑셀을 **탭(시트)별로** 붙여넣습니다.
   최종적으로 하나의 스프레드시트에 아래 4개 탭이 있어야 합니다:
   - `People`, `Projects`, `Publications`, `News`
   - (탭 이름은 `scripts/sheets.config.json`의 값과 일치해야 합니다.)
3. **각 탭의 첫 행은 반드시 아래 "컬럼 규격"의 헤더 이름과 똑같아야 합니다.**
   순서는 상관없지만 이름은 정확히 일치해야 합니다.

### 컬럼 규격

**People 탭**

| 헤더          | 설명                                                   |
| ----------- | ---------------------------------------------------- |
| `상태`        | `지도교수` / `박사 또는 통합 재학` / `석사 재학` / `석사 졸업` / `박사 졸업` |
| `한국어명`      | 비우면 국제학생으로 처리(영문명만 표시)                               |
| `영문명`       | 필수                                                   |
| `이메일`       |                                                      |
| `관심분야`      | 재학생 화면에 표시                                           |
| `교육 및 경력`   | **세미콜론 `;` 으로 구분** → 화면에서 줄바꿈으로 표시                   |
| `구글 스칼라`    | URL                                                  |
| `개인 홈페이지`   | URL                                                  |
| `석사학위논문`    | 박사과정 재학생용(선택)                                        |
| `석사학위논문 링크` | URL                                                  |
| `졸업연도`      | 졸업생용 (숫자)                                            |
| `소속`        | 졸업생 화면에 표시                                           |
| `학위논문`      | 졸업생 화면에 표시                                           |
| `학위논문 링크`   | URL                                                  |
| `사진`        | 프로필 사진 URL(선택) — 없으면 이니셜 표시                          |

> `상태`를 `석사 졸업`/`박사 졸업`으로 바꾸면 자동으로 **Alumni** 섹션으로 이동합니다.
> 같은 사람이 석사 졸업 후 박사 재학이면 **두 행**(재학 1행 + 졸업 1행)으로 넣으면 됩니다.

**Projects 탭**

| 헤더         | 설명                                    |
| ---------- | ------------------------------------- |
| `한국어명`     | 비우면 영문명이 대표 제목이 됨                     |
| `영문명`      |                                       |
| `연구 기간`    |                                       |
| `지원기관`     |                                       |
| `참여연구원`    |                                       |
| `프로젝트 설명`  | 더보기에 표시                               |
| `이미지 URL`  | 프로젝트 썸네일(선택)                          |
| `연관 논문 ID` | 세미콜론 구분, Publications 탭의 `id`와 일치(선택) |

**Publications 탭**

| 헤더 | 설명 |
|---|---|
| `id` | 고유 식별자(연관 논문 연결에 사용) |
| `title` | 필수 |
| `authors` | `,` 또는 `&`로 저자 구분 (People의 영문명과 같으면 이름에 링크가 걸림) |
| `year` | 숫자 |
| `publication date` | 화면 미표시(선택) |
| `venue` | 게재처. 비우면 `journal` + `volume_issue`로 자동 구성 |
| `journal`, `volume_issue` | 저널 논문의 게재지/권호(선택) |
| `type` | `journal` / `conference` / `book` |
| `ssci`, `scopus`, `kci` | `1`=표시, `0`/공백=미표시 (또는 `index` 컬럼에 `SSCI; SCOPUS`처럼) |
| `pdf`, `acmdl`, `website` | 각 링크 버튼 URL(선택) |
| `doi` | DOI (전체 URL 넣어도 자동으로 다듬음) |
| `award` | 수상명(선택) — 있으면 award 뱃지 표시 |

**News 탭**

| 헤더 | 설명 |
|---|---|
| `날짜` | `YYYY-MM-DD` |
| `제목` | |
| `국문 본문` | 상세 페이지 국문 |
| `영문 본문` | 상세 페이지 영문 |
| `썸네일` | 이미지 URL |

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
  "tabs": { "people": "People", "projects": "Projects", "publications": "Publications", "news": "News" }
}
```

이 파일을 커밋/푸시하면 이후 배포부터 시트 내용이 사이트에 반영됩니다.
(설정 전에는 저장소에 커밋된 기존 데이터가 그대로 쓰입니다.)

로컬에서 미리 확인하려면: `npm run sync` → `src/data/generated/*.json`이 갱신됨.

---

## 4. (선택) 구글 폼으로 입력받기

예: **Publications 추가 폼**을 만들어 교수님/연구원이 폼으로 논문을 제출하면
자동으로 시트에 쌓이게 할 수 있습니다.

1. 구글 폼 생성 → 질문 제목을 **Publications 컬럼 헤더와 동일하게**
   (`title`, `authors`, `year`, `type`, `venue`, `doi` 등).
2. 폼 편집 화면 → **응답 → 스프레드시트로 연결** → 위에서 만든 시트에 새 탭으로 연결.
3. 그 탭 이름을 `scripts/sheets.config.json`의 `tabs.publications` 값과 맞춥니다.
   (폼 응답 탭에는 `타임스탬프` 열이 자동으로 생기지만, 매핑은 헤더 이름 기준이라
   무시됩니다.)

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
  var token = PropertiesService.getScriptProperties().getProperty('GH_TOKEN');
  var url = 'https://api.github.com/repos/idlearning/idlearning.github.io'
          + '/actions/workflows/deploy.yml/dispatches';
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    payload: JSON.stringify({ ref: 'main' }),
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
- **사진/이미지는?** People의 `사진`, Projects의 `이미지 URL` 열에 이미지 URL을 넣습니다.