# 개발용 사이트 (dev.idlearning.org)

실제 사이트(`idlearning.org`)에 반영하기 전에 변경 사항을 미리 확인하는 사이트입니다.

```
idlearning/idlearning.github.io (코드는 여기서만 관리)
 ├─ main 브랜치 push → 이 저장소의 Pages           → https://idlearning.org
 └─ dev  브랜치 push → idlearning/dev-site 저장소 → https://dev.idlearning.org
```

GitHub Pages는 저장소 하나에 사이트 하나만 열 수 있어서, dev 사이트는 빌드 결과만 받는
별도 저장소(`idlearning/dev-site`)에 올립니다. 배포는
`.github/workflows/deploy-dev.yml`이 담당합니다.

dev 사이트는 검색엔진에 노출되지 않습니다 (모든 페이지에 `noindex` 메타 태그, `robots.txt`에
sitemap 미포함).

---

## 1. 처음 한 번만 하는 설정

### 1-1. 빈 저장소 만들기

GitHub에서 `idlearning` 조직에 **`dev-site`** 저장소를 만듭니다.

- **Public**으로 만드세요 (무료 플랜에서는 Pages가 public 저장소에서만 동작합니다).
- README 등은 추가하지 않아도 됩니다.

### 1-2. 배포 키 만들기

이 저장소의 workflow가 `dev-site`에 push할 수 있도록 SSH 키 한 쌍을 만듭니다.
터미널에서:

```bash
ssh-keygen -t ed25519 -C "deploy dev-site" -f dev-site-deploy-key
```

암호(passphrase)를 두 번 물어보면 **아무것도 입력하지 말고 Enter만 두 번** 누르세요
(암호가 걸린 키는 GitHub Actions에서 쓸 수 없습니다). Windows PowerShell, macOS, Linux
모두 같은 명령어로 동작합니다.

`dev-site-deploy-key`(개인키)와 `dev-site-deploy-key.pub`(공개키) 두 파일이 생깁니다.
파일 내용은 PowerShell에서는 `Get-Content <파일명>`, macOS/Linux에서는 `cat <파일명>`으로
확인해 복사합니다.

1. **공개키 등록** — `idlearning/dev-site` → Settings → Deploy keys → Add deploy key
   - Title: `idlearning.github.io deploy`
   - Key: `dev-site-deploy-key.pub` 파일 내용
   - ✅ **Allow write access** 체크
2. **개인키 등록** — `idlearning/idlearning.github.io` → Settings → Secrets and variables
   → Actions → New repository secret
   - Name: `DEV_DEPLOY_KEY`
   - Secret: `dev-site-deploy-key` 파일 내용 전체
     (`-----BEGIN OPENSSH PRIVATE KEY-----`부터 `-----END OPENSSH PRIVATE KEY-----`까지)
3. 등록이 끝나면 두 키 파일은 컴퓨터에서 지워도 됩니다.

### 1-3. DNS 레코드 추가

`idlearning.org` 도메인을 관리하는 곳(도메인 등록업체 또는 Cloudflare 등)에 추가합니다.

| 종류  | 이름(호스트) | 값                      |
| ----- | ------------ | ----------------------- |
| CNAME | `dev`        | `idlearning.github.io.` |

### 1-4. 첫 배포

`dev` 브랜치를 만들어 push하면 workflow가 실행되어 `dev-site`에 `gh-pages` 브랜치가
생깁니다. (Actions 탭 → **Deploy dev site** → Run workflow 로 수동 실행도 가능합니다.)

### 1-5. dev-site의 Pages 켜기

첫 배포가 끝난 뒤 `idlearning/dev-site` → Settings → Pages:

- Source: **Deploy from a branch** → Branch: `gh-pages` / `(root)` → Save
- Custom domain: `dev.idlearning.org` → Save (배포 시 CNAME 파일도 자동으로 들어갑니다)
- DNS 확인이 끝나면 **Enforce HTTPS** 체크 (인증서 발급에 몇 분~최대 하루 걸릴 수 있음)

---

## 2. 평소 작업 흐름

```
① dev에서 작업 브랜치 만들기
② 작업 → dev로 PR → merge
③ dev.idlearning.org에서 확인 (merge 후 1분 안에 자동 배포)
④ 괜찮으면 dev → main PR → merge
⑤ idlearning.org에 반영
```

- 작은 수정은 ①을 건너뛰고 `dev`에 바로 push해도 됩니다.
- ④는 dev에 쌓인 변경을 한 번에 실제 사이트로 내보내는 단계라, 여러 작업을 모아서 해도
  됩니다.
- Claude에게 작업을 맡기면 저장소 루트의 `CLAUDE.md`에 따라 자동으로 dev 기준으로 작업하고
  PR도 dev로 올립니다.

### 꼭 지킬 것

1. **dev → main PR은 "Create a merge commit"으로 merge하세요** (merge 버튼 옆 ▼에서 선택).
   "Squash and merge"를 쓰면 두 브랜치의 기록이 어긋나서, 다음 dev → main PR에 이미 반영한
   변경이 또 나오거나 충돌이 납니다.
2. **급한 수정을 `main`에 바로 했다면 `main`을 `dev`에도 merge하세요.** 안 그러면 `dev`가
   뒤처집니다.
3. **저장소의 기본 브랜치(default branch)는 `main`으로 두세요.** 매시간 도는 자동 배포
   (`deploy.yml`의 schedule)는 기본 브랜치의 코드로 실행되므로, 기본 브랜치를 `dev`로 바꾸면
   확인 안 된 dev 코드가 실제 사이트에 올라갈 수 있습니다.

### 콘텐츠(구글 시트)

- 구글 시트 콘텐츠는 dev와 무관하게 실제 사이트(`main`)에 매시간 자동 반영됩니다.
- dev 사이트의 콘텐츠는 `dev`에 push하거나 Actions 탭에서 **Deploy dev site**를 수동 실행할
  때만 갱신되므로, 실제 사이트보다 조금 오래된 내용일 수 있습니다 (정상).
