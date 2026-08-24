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
转载页暂未收录该报道，可选的 `JINA_API_KEY` 会作为最后备援。系统不会让匿名 Reader
直接访问 Reuters，也不会把空白内容标成全文。
