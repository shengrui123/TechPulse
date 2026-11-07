# TechPulse

AI 驅動的全球科技資訊情報平台，整合科技焦點、趨勢分析、AI 研究助手與全球資訊來源資料庫。

## 技術架構

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel

## 本機開發

```bash
pnpm install
pnpm dev
```

開啟 `http://localhost:3000`。

## 驗證與部署

```bash
pnpm test
pnpm build
```

推送至 GitHub 的 `main` 分支後，由 Vercel 自動建置與部署。

## 新闻正文提取

新闻详情页会在访问时自动完成以下流程：

1. 将 Google News 聚合链接解析为原媒体链接。
2. 从可信信源页面的 JSON-LD `articleBody` 或正文段落提取内容。
3. 将提取内容自动翻译为简体中文；正文使用 `no-store`，不写入持久缓存。
4. 按照杂志风格展示署名、正文、来源和原网页入口。

默认只展示带署名的有限节选。只有在取得媒体全文转载授权后，才应在
`app/data/sources.ts` 对相应信源设置 `contentPolicy: "full"`；未明确配置
的信源始终按 `excerpt` 处理。

新闻列表覆盖全部信源最近 24 小时的文章，RSS/Google News 订阅结果每 30 分钟刷新。
正文仅在用户打开详情页时于内存中处理；响应完成后不保留本地正文文件，因此无需等待
5 分钟清理，本地留存时间为零。

Reuters 会拒绝普通服务器请求。直连 Reuters 返回非成功状态、跳转到不可信来源或无法
提取正文时，系统会根据原链接中的日期和 slug，读取 Internazionale 公开的 Reuters 授权
转载英文正文；若双方的标题更新导致 slug 不同，系统会从 Internazionale 首页解析实际
转载链接。部署节点无法直连转载页时，则由 Jina Reader 读取同一个 Internazionale 公开
页面。转载页标题必须与 RSS 原题匹配，之后才会按段落展示英文原文与中文翻译。若
转载页暂未收录该报道时，系统会按 Reuters 原题搜索 CNA、Yahoo Finance 与 Investing.com
的 Reuters 署名转载；只有白名单域名、标题匹配且页面明确标注 Reuters 的正文才会采用。
可选的 `JINA_API_KEY` 会作为最后备援。系统不会让匿名 Reader 直接访问 Reuters，也不会
把空白内容标成全文。

## 手動匯入授權全文

只匯入您已獲授權公開展示的端傳媒或《紐約時報》文章。此功能不使用或保存會員帳號。全文會寫入 `app/data/licensed-articles.json`，隨 Git 提交與網站部署公開；請勿匯入密碼、Cookie 或其他私人資料。

1. 將一篇文章的**正文**存成 UTF-8 純文字檔，段落之間留空行。標題、作者與日期另外提供。
2. 在專案目錄執行：

```bash
npm run import-article -- --url "https://theinitium.com/文章網址" --title "文章標題" --date "2026-11-07T10:00:00+08:00" --file "/完整路徑/文章.txt" --byline "作者"
```

原文網址請使用媒體的實際文章網址，不要使用 Google News 連結。日期必須包含時區；`--byline` 可省略。重複匯入同一篇文章會更新既有內容。匯入後，檢查 `app/data/licensed-articles.json` 中的全文、標題、日期及授權範圍，然後將該檔提交並推送至 GitHub，Vercel 建置完成後才會顯示。新聞列表會保留已匯入文章；點開與原文網址匹配的新聞即可閱讀。英文正文會使用現有機器翻譯服務，翻譯不可用時保留原文。

要移除已匯入文章，可從 `app/data/licensed-articles.json` 刪除該筆資料，檢查 JSON 格式後提交及重新部署。

### 從會員登入擷取授權文章（本機操作）

此流程在自己的電腦執行，不會自動讀取 Safari 或其他瀏覽器的 Cookie。先在瀏覽器登入媒體網站，從該文章的網路請求複製 Cookie **標頭值**，然後在本機終端機執行（不要把 Cookie 貼在聊天、指令參數或 Git）：

```bash
npm run member-article -- setup --url "https://theinitium.com/實際文章網址"
npm run member-article -- fetch --url "https://theinitium.com/實際文章網址" --title "文章標題" --date "2026-11-07T10:00:00+08:00" --byline "作者"
```

`setup` 會在不回顯的提示中請您輸入 Cookie 及加密密碼，以 scrypt 衍生金鑰及 AES-256-GCM 加密後存於 `~/.worldpulse/`；端傳媒與紐約時報分別設定，且每份 Cookie 僅送往設定時的同一主機。請使用強密碼，忘記後需重新設定。Cookie 過期需重新執行 `setup`。請勿將該資料夾或密碼上傳到 GitHub、Vercel 或其他人可存取的位置。

`fetch` 在本機解密並請求文章，將擷取內容儲存在僅限本機使用者讀取的預覽檔；**請先與原文核對全文是否完整及授權範圍**，確認後才會匯入。網站不會自動使用您的 Cookie，匯入後仍需檢查資料並推送部署。部分網站可能因登入機制、驗證或文章版式而無法擷取；此時可改用上方純文字手動匯入。
