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
3. 将提取内容自动翻译为简体中文，并缓存 15 分钟。
4. 按照杂志风格展示署名、正文、来源和原网页入口。

默认只展示带署名的有限节选。只有在取得媒体全文转载授权后，才应在
`app/data/sources.ts` 对相应信源设置 `contentPolicy: "full"`；未明确配置
的信源始终按 `excerpt` 处理。
