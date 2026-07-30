"use client";

import { useMemo, useState } from "react";

type Source = {
  category: string;
  name: string;
  url: string;
  focus: string;
  region: string;
  note: string;
};

const sources: Source[] = [
  {
    category: "綜合科技新聞",
    name: "TechCrunch",
    url: "https://techcrunch.com",
    focus: "新創、創投、矽谷動態、產品發表",
    region: "英文 / 全球",
    note: "新創與資金消息最權威之一",
  },
  {
    category: "綜合科技新聞",
    name: "The Verge",
    url: "https://theverge.com",
    focus: "消費電子、科技文化、產品評測",
    region: "英文 / 全球",
    note: "深度與速度兼具",
  },
  {
    category: "綜合科技新聞",
    name: "Wired",
    url: "https://wired.com",
    focus: "科技趨勢、文化、未來科技深度報導",
    region: "英文 / 全球",
    note: "長篇深度文章品質高",
  },
  {
    category: "綜合科技新聞",
    name: "Ars Technica",
    url: "https://arstechnica.com",
    focus: "技術深度、硬體、科學、政策",
    region: "英文 / 全球",
    note: "工程師首選，事實查核嚴格",
  },
  {
    category: "綜合科技新聞",
    name: "Engadget",
    url: "https://engadget.com",
    focus: "消費電子、評測、快速新聞",
    region: "英文 / 全球",
    note: "產品資訊與評測穩定可靠",
  },
  {
    category: "綜合科技新聞",
    name: "CNET",
    url: "https://cnet.com",
    focus: "產品評測、教學、消費科技",
    region: "英文 / 全球",
    note: "評測歷史悠久、數據完整",
  },
  {
    category: "商業 / 財經科技",
    name: "Bloomberg Technology",
    url: "https://bloomberg.com/technology",
    focus: "科技股、大廠動態、產業分析",
    region: "英文 / 全球",
    note: "財經角度極具權威",
  },
  {
    category: "商業 / 財經科技",
    name: "Reuters Technology",
    url: "https://reuters.com/technology",
    focus: "即時全球科技新聞",
    region: "英文 / 全球",
    note: "通訊社級事實查核",
  },
  {
    category: "商業 / 財經科技",
    name: "The Wall Street Journal Tech",
    url: "https://wsj.com/tech",
    focus: "科技商業、政策、企業策略",
    region: "英文 / 全球",
    note: "需訂閱，內容深度高",
  },
  {
    category: "商業 / 財經科技",
    name: "The Information",
    url: "https://theinformation.com",
    focus: "矽谷深度調查、獨家報導",
    region: "英文 / 全球",
    note: "付費高品質調查新聞",
  },
  {
    category: "工程 / 研究導向",
    name: "MIT Technology Review",
    url: "https://technologyreview.com",
    focus: "突破性技術、科研趨勢",
    region: "英文 / 全球",
    note: "麻省理工出品，極具權威",
  },
  {
    category: "工程 / 研究導向",
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org",
    focus: "工程、半導體、AI、機器人、能源",
    region: "英文 / 全球",
    note: "IEEE 官方旗艦，技術嚴謹",
  },
  {
    category: "工程 / 研究導向",
    name: "Nature / Science",
    url: "https://nature.com",
    focus: "頂尖科學研究論文與新聞",
    region: "英文 / 全球",
    note: "基礎科學與前沿科技必看",
  },
  {
    category: "英國 / 歐洲視角",
    name: "The Register",
    url: "https://theregister.com",
    focus: "IT 產業、企業科技、業界內幕",
    region: "英文 / 英國",
    note: "觀點鮮明，業界內幕豐富",
  },
  {
    category: "英國 / 歐洲視角",
    name: "BBC Technology",
    url: "https://bbc.com/news/technology",
    focus: "全球科技新聞、政策",
    region: "英文 / 英國",
    note: "公信力高、報導平衡",
  },
  {
    category: "英國 / 歐洲視角",
    name: "The Next Web (TNW)",
    url: "https://thenextweb.com",
    focus: "歐洲科技、新創、趨勢",
    region: "英文 / 歐洲",
    note: "歐洲觀點較強",
  },
  {
    category: "亞洲科技",
    name: "Tech in Asia",
    url: "https://techinasia.com",
    focus: "東南亞、亞洲新創與科技",
    region: "英文 / 亞洲",
    note: "亞洲新創重要英文來源",
  },
  {
    category: "亞洲科技",
    name: "36氪",
    url: "https://36kr.com",
    focus: "中國新創、投融資、科技商業",
    region: "中文 / 中國",
    note: "中文新創資訊權威",
  },
  {
    category: "亞洲科技",
    name: "虎嗅網",
    url: "https://huxiu.com",
    focus: "科技商業評論、深度分析",
    region: "中文 / 中國",
    note: "觀點與深度較強",
  },
  {
    category: "亞洲科技",
    name: "鈦媒體",
    url: "https://tmtpost.com",
    focus: "科技財經、產業洞察",
    region: "中文 / 中國",
    note: "產業分析品質穩定",
  },
  {
    category: "亞洲科技",
    name: "愛范兒 (ifanr)",
    url: "https://ifanr.com",
    focus: "消費科技、新創、產品",
    region: "中文 / 中國",
    note: "產品與趨勢報導活潑",
  },
  {
    category: "亞洲科技",
    name: "InfoQ 中文站",
    url: "https://infoq.cn",
    focus: "軟體開發、架構、技術實踐",
    region: "中文 / 中國",
    note: "開發者與技術管理者必看",
  },
  {
    category: "其他高價值來源",
    name: "Hacker News",
    url: "https://news.ycombinator.com",
    focus: "技術社群討論、連結聚合",
    region: "英文 / 全球",
    note: "工程師圈極具影響力",
  },
  {
    category: "其他高價值來源",
    name: "Slashdot",
    url: "https://slashdot.org",
    focus: "開源、技術新聞、社群評論",
    region: "英文 / 全球",
    note: "老牌技術社群",
  },
];

const categories = [
  "全部",
  "綜合科技新聞",
  "商業 / 財經科技",
  "工程 / 研究導向",
  "英國 / 歐洲視角",
  "亞洲科技",
  "其他高價值來源",
];

const highlights = [
  {
    topic: "AI Agent",
    title: "自主代理進入企業工作流",
    summary: "模型能力、工具使用與治理開始整合，從展示走向可衡量的生產力。",
    score: 94,
    source: "12 個權威來源",
    time: "18 分鐘前",
  },
  {
    topic: "半導體",
    title: "先進封裝成為算力競賽焦點",
    summary: "供應鏈投資轉向記憶體、互連與能源效率，晶片競爭不再只看製程。",
    score: 89,
    source: "9 個權威來源",
    time: "42 分鐘前",
  },
  {
    topic: "新創融資",
    title: "垂直 AI 應用吸引新一輪資金",
    summary: "醫療、法務與開發工具最活躍，投資人更關注付費留存與資料護城河。",
    score: 86,
    source: "7 個權威來源",
    time: "1 小時前",
  },
];

const trends = [
  { name: "AI Agent", growth: "+240%", level: 96, tone: "cobalt" },
  { name: "AI 晶片", growth: "+128%", level: 82, tone: "coral" },
  { name: "機器人", growth: "+91%", level: 70, tone: "teal" },
  { name: "開源模型", growth: "+74%", level: 62, tone: "yellow" },
];

const pipeline = [
  { step: "01", title: "收集", detail: "RSS、API、Web crawler" },
  { step: "02", title: "分析", detail: "主題、公司、重要程度" },
  { step: "03", title: "生成", detail: "標題、摘要、影響分析" },
  { step: "04", title: "查核", detail: "數據、引用、來源交叉驗證" },
  { step: "05", title: "發佈", detail: "多語翻譯與在地 SEO" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [briefEnabled, setBriefEnabled] = useState(false);

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return sources.filter((source) => {
      const matchesCategory =
        activeCategory === "全部" || source.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        [source.name, source.focus, source.region, source.note].some((value) =>
          value.toLocaleLowerCase().includes(normalizedQuery),
        );

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="TechPulse 首頁">
          <span className="brand-mark" aria-hidden="true">
            TP
          </span>
          <span>TechPulse</span>
        </a>

        <nav className="main-nav" aria-label="主要導覽">
          <a href="#focus">科技焦點</a>
          <a href="#trends">趨勢分析</a>
          <a href="#sources">資訊來源</a>
          <a href="#assistant">AI 助手</a>
        </nav>

        <button
          className={`brief-toggle ${briefEnabled ? "is-active" : ""}`}
          type="button"
          onClick={() => setBriefEnabled((enabled) => !enabled)}
          aria-pressed={briefEnabled}
        >
          <span className="status-dot" aria-hidden="true" />
          {briefEnabled ? "簡報已開啟" : "開啟每日簡報"}
        </button>
      </header>

      <section className="hero-band" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI 驅動的全球科技資訊情報平台</p>
            <h1>
              洞察全球科技，
              <br />
              預見未來趨勢。
            </h1>
            <p className="hero-lede">
              從閱讀新聞，升級為理解科技世界正在發生什麼。TechPulse
              聚合全球訊號，以 AI 摘要、趨勢分析與公司情報，幫你更快做出判斷。
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#focus">
                查看今日焦點
              </a>
              <a className="text-action" href="#sources">
                探索 24 個資訊源 <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="hero-metrics" aria-label="平台目標指標">
              <div>
                <strong>500</strong>
                <span>每日文章採集</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>AI 摘要覆蓋</span>
              </div>
              <div>
                <strong>5</strong>
                <span>支援語言</span>
              </div>
            </div>
          </div>

          <div className="signal-board" aria-label="TechPulse 即時訊號雷達">
            <div className="signal-board-header">
              <div>
                <span className="live-label">
                  <span className="status-dot" aria-hidden="true" />
                  LIVE SIGNALS
                </span>
                <h2>全球科技脈動</h2>
              </div>
              <span className="board-time">UTC +08 · 08:24</span>
            </div>

            <div className="signal-visual" aria-hidden="true">
              <div className="radar-ring ring-one" />
              <div className="radar-ring ring-two" />
              <div className="radar-cross cross-x" />
              <div className="radar-cross cross-y" />
              <div className="signal-node node-ai">
                <b>AI</b>
                <span>94</span>
              </div>
              <div className="signal-node node-chip">
                <b>CHIP</b>
                <span>89</span>
              </div>
              <div className="signal-node node-startup">
                <b>STARTUP</b>
                <span>86</span>
              </div>
              <div className="signal-core">
                <span>24</span>
                <small>來源在線</small>
              </div>
            </div>

            <div className="score-legend">
              <span>重要性 40%</span>
              <span>熱度 25%</span>
              <span>來源權威 20%</span>
              <span>用戶興趣 15%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-band" id="focus">
        <div className="section-heading">
          <div>
            <p className="section-kicker">GOOD MORNING TECH · 5 分鐘閱讀</p>
            <h2>今日科技焦點</h2>
          </div>
          <p>
            按新聞重要性、即時熱度、來源權威與你的興趣綜合排序，快速掌握值得關注的訊號。
          </p>
        </div>

        <div className="focus-layout">
          <article className="lead-story">
            <div className="lead-topline">
              <span className="topic-chip">今日首選 · AI</span>
              <span>18 分鐘前</span>
            </div>
            <h3>AI Agent 正從工具進化為新的軟體介面</h3>
            <p className="lead-summary">
              企業開始把自主代理接入客服、研發與營運流程。真正的分水嶺不只在模型能力，而是工具調用、權限治理與可驗證成果能否形成閉環。
            </p>
            <div className="story-insights">
              <div>
                <span>TL;DR</span>
                <p>自主任務執行進入落地期，企業效率與軟體開發模式將同時改變。</p>
              </div>
              <div>
                <span>影響分析</span>
                <p>短期增加 AI 應用採用；長期重塑人機協作與企業軟體入口。</p>
              </div>
            </div>
            <div className="lead-footer">
              <span>綜合 12 個權威來源</span>
              <span className="score-badge">AI SCORE 94</span>
            </div>
          </article>

          <div className="story-stack">
            {highlights.slice(1).map((story) => (
              <article className="story-card" key={story.topic}>
                <div>
                  <span className="topic-chip">{story.topic}</span>
                  <span className="story-time">{story.time}</span>
                </div>
                <h3>{story.title}</h3>
                <p>{story.summary}</p>
                <footer>
                  <span>{story.source}</span>
                  <span className="mini-score">{story.score}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trend-band" id="trends">
        <div className="trend-inner">
          <div className="section-heading inverse">
            <div>
              <p className="section-kicker">TREND DASHBOARD</p>
              <h2>訊號正在往哪裡移動？</h2>
            </div>
            <p>綜合新聞量、搜尋量、GitHub 與論文訊號，追蹤技術熱度的方向與速度。</p>
          </div>

          <div className="trend-grid">
            <div className="trend-chart">
              {trends.map((trend) => (
                <div className="trend-row" key={trend.name}>
                  <div className="trend-label">
                    <span>{trend.name}</span>
                    <strong>{trend.growth}</strong>
                  </div>
                  <div className="trend-track">
                    <span
                      className={`trend-fill ${trend.tone}`}
                      style={{ width: `${trend.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <aside className="trend-callout">
              <p>30 DAY SIGNAL</p>
              <strong>+240%</strong>
              <h3>AI Agent</h3>
              <span>
                熱度增幅最高。企業採用、開發框架與工具使用能力同步上升。
              </span>
              <div className="spark-bars" aria-hidden="true">
                {[28, 36, 31, 47, 44, 61, 72, 68, 84, 96].map(
                  (height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ),
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="content-band pipeline-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">AI AGENT PIPELINE</p>
            <h2>從全球原文到可信情報</h2>
          </div>
          <p>
            多個 AI Agent 分工處理採集、理解、寫作與查核，保留來源脈絡，再以多語言發佈。
          </p>
        </div>

        <div className="pipeline">
          {pipeline.map((item) => (
            <div className="pipeline-step" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="assistant-band" id="assistant">
        <div className="assistant-inner">
          <div className="assistant-copy">
            <p className="section-kicker">你的私人科技研究員</p>
            <h2>不只找到資訊，更直接得到脈絡。</h2>
            <p>
              TechPulse AI 助手以 RAG 搜尋科技知識庫，串連新聞、公司、技術與趨勢，回答研究型問題並保留可追溯來源。
            </p>
            <div className="assistant-path">
              <span>問題</span>
              <i aria-hidden="true">→</i>
              <span>Embedding</span>
              <i aria-hidden="true">→</i>
              <span>Vector Search</span>
              <i aria-hidden="true">→</i>
              <span>LLM</span>
              <i aria-hidden="true">→</i>
              <span>答案</span>
            </div>
          </div>

          <div className="chat-demo" aria-label="AI 助手問答示例">
            <div className="chat-question">
              最近 AI Agent 有哪些重大突破？
            </div>
            <div className="chat-answer">
              <div className="ai-avatar">AI</div>
              <div>
                <p>
                  最近 30 天的共同趨勢，是 AI
                  開始自主完成任務。值得追蹤的三個方向：
                </p>
                <ol>
                  <li>Agent SDK 與企業工具整合</li>
                  <li>Gemini 多模態代理能力</li>
                  <li>可控的 Tool Use 與權限治理</li>
                </ol>
                <span className="citation-note">已比對 18 篇報導 · 6 個來源</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sources-band" id="sources">
        <div className="sources-inner">
          <div className="section-heading">
            <div>
              <p className="section-kicker">GLOBAL SOURCE LIBRARY</p>
              <h2>24 個高價值科技資訊源</h2>
            </div>
            <p>
              涵蓋全球科技新聞、財經商業、工程研究、歐洲視角、亞洲市場與技術社群。
            </p>
          </div>

          <div className="source-toolbar">
            <label className="search-field">
              <span className="sr-only">搜尋資訊來源</span>
              <span className="search-symbol" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜尋網站、主題或地區"
              />
            </label>

            <span className="result-count">
              {filteredSources.length} / {sources.length} SOURCES
            </span>
          </div>

          <div className="category-tabs" role="tablist" aria-label="來源分類">
            {categories.map((category) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={activeCategory === category ? "is-active" : ""}
                onClick={() => setActiveCategory(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="source-list" aria-live="polite">
            {filteredSources.map((source, index) => (
              <a
                className="source-row"
                href={source.url}
                target="_blank"
                rel="noreferrer"
                key={source.name}
              >
                <span className="source-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="source-name">
                  <strong>{source.name}</strong>
                  <span>{source.category}</span>
                </div>
                <p>{source.focus}</p>
                <span className="source-region">{source.region}</span>
                <span className="source-note">{source.note}</span>
                <span className="source-link" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}

            {filteredSources.length === 0 && (
              <div className="empty-state">
                <strong>沒有找到符合條件的來源</strong>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("全部");
                  }}
                >
                  清除篩選
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="brief-band">
        <div className="brief-inner">
          <div className="brief-time">
            <span>DAILY BRIEF</span>
            <strong>08:00</strong>
          </div>
          <div>
            <h2>五分鐘，看懂今天最重要的科技變化。</h2>
            <p>每日 5 大科技新聞、AI 摘要與影響分析，準時送達。</p>
          </div>
          <button
            type="button"
            onClick={() => setBriefEnabled((enabled) => !enabled)}
          >
            {briefEnabled ? "已加入每日簡報" : "加入每日簡報"}
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            TP
          </span>
          <div>
            <strong>TechPulse</strong>
            <span>Understand Tomorrow&apos;s Technology Today.</span>
          </div>
        </div>
        <p>全球科技新聞庫 · AI 研究助手 · 投資情報 · 趨勢分析</p>
        <span>V1.0 PRODUCT VISION</span>
      </footer>
    </main>
  );
}
