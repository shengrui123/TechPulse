"use client";

import Image from "next/image";
import { useState } from "react";

const quickReads = [
  {
    tag: "AI",
    title: "企业级 Agent 开始从演示走向可验证的生产力",
    time: "12 分钟前",
  },
  {
    tag: "半导体",
    title: "先进封装与高速互连成为新一轮算力竞争焦点",
    time: "28 分钟前",
  },
  {
    tag: "创投",
    title: "垂直 AI 融资回暖，投资人转向关注真实留存",
    time: "46 分钟前",
  },
  {
    tag: "开源",
    title: "小型开放模型加速进入手机与边缘设备",
    time: "1 小时前",
  },
];

const trendItems = [
  { name: "AI Agent", growth: "+240%", value: 96, className: "red" },
  { name: "AI 芯片", growth: "+128%", value: 82, className: "blue" },
  { name: "具身智能", growth: "+91%", value: 70, className: "green" },
  { name: "开源模型", growth: "+74%", value: 62, className: "yellow" },
];

const editorPicks = [
  {
    index: "01",
    category: "产业",
    title: "算力竞赛的下一站，不只是更先进的制程",
    summary:
      "记忆体、封装、互连与能源效率正在重写半导体产业的价值分配。",
    readTime: "6 分钟",
  },
  {
    index: "02",
    category: "研究",
    title: "机器人学会理解空间之后，现实世界成了新的训练场",
    summary:
      "多模态模型与低成本硬件结合，让具身智能从实验室走向真实任务。",
    readTime: "8 分钟",
  },
  {
    index: "03",
    category: "商业",
    title: "AI 产品的护城河，正在从模型转向工作流与数据",
    summary:
      "当基础能力快速商品化，真正稀缺的是场景、反馈闭环与组织信任。",
    readTime: "7 分钟",
  },
];

const pipeline = [
  ["01", "收集", "持续捕捉全球科技动态"],
  ["02", "理解", "识别主题、公司与影响"],
  ["03", "查核", "交叉验证数据与引用"],
  ["04", "呈现", "生成摘要与趋势脉络"],
];

export default function Home() {
  const [briefEnabled, setBriefEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="top">
      <div className="utility-bar">
        <div className="page-shell utility-inner">
          <span>THURSDAY · 30 JULY 2026</span>
          <span>AI 驱动的全球科技情报</span>
          <span>简中 · EN</span>
        </div>
      </div>

      <header className="masthead">
        <div className="page-shell masthead-row">
          <button
            className={`menu-button ${menuOpen ? "is-active" : ""}`}
            type="button"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <a className="wordmark" href="#top" aria-label="TechPulse 首页">
            Tech<span>Pulse</span>
          </a>

          <button
            className={`subscribe-button ${briefEnabled ? "is-active" : ""}`}
            type="button"
            onClick={() => setBriefEnabled((enabled) => !enabled)}
            aria-pressed={briefEnabled}
          >
            {briefEnabled ? "简报已开启" : "订阅每日简报"}
          </button>
        </div>

        <div
          className={`site-menu ${menuOpen ? "is-open" : ""}`}
          id="site-menu"
          aria-hidden={!menuOpen}
        >
          <nav className="page-shell site-menu-inner" aria-label="全部栏目">
            <a href="#latest" onClick={() => setMenuOpen(false)}>
              最新动态
            </a>
            <a href="#focus" onClick={() => setMenuOpen(false)}>
              人工智能
            </a>
            <a href="#trends" onClick={() => setMenuOpen(false)}>
              半导体
            </a>
            <a href="#trends" onClick={() => setMenuOpen(false)}>
              创业与投资
            </a>
            <a href="#research" onClick={() => setMenuOpen(false)}>
              科学与软件
            </a>
            <a href="#analysis" onClick={() => setMenuOpen(false)}>
              深度解读
            </a>
          </nav>
        </div>

        <nav className="section-nav" aria-label="内容分类">
          <div className="page-shell section-nav-inner">
            <a href="#latest">最新</a>
            <a href="#focus">AI</a>
            <a href="#trends">半导体</a>
            <a href="#trends">创业</a>
            <a href="#research">科学</a>
            <a href="#research">软件</a>
            <a href="#analysis">深度解读</a>
          </div>
        </nav>
      </header>

      <section className="page-shell front-page" id="focus">
        <div className="edition-heading">
          <span>今日科技焦点</span>
          <p>理解科技世界正在发生什么</p>
          <small>VOL. 001</small>
        </div>

        <div className="lead-grid">
          <article className="lead-story">
            <div className="lead-image">
              <Image
                src="/og.png"
                width={1536}
                height={1024}
                priority
                alt="TechPulse 全球科技讯号雷达"
              />
              <span className="image-caption">TECHPULSE INTELLIGENCE MAP</span>
            </div>

            <div className="lead-copy">
              <p className="article-label">封面故事 · 人工智能</p>
              <h1>AI Agent 正从工具进化为新的软件界面</h1>
              <p className="lead-deck">
                企业开始把自主代理接入客服、研发与营运流程。真正的分水岭不只在模型能力，而在工具调用、权限治理与可验证成果能否形成闭环。
              </p>
              <div className="article-meta">
                <span>TechPulse 编辑部</span>
                <span>10 分钟阅读</span>
                <span>AI SCORE 94</span>
              </div>
            </div>
          </article>

          <aside className="lead-rail" aria-label="重点报道">
            <article className="rail-story rail-story-featured">
              <p className="article-label">产业观察</p>
              <h2>先进封装，正在决定下一代 AI 芯片的上限</h2>
              <p>
                当制程进步放缓，封装、记忆体与互连成为算力系统最关键的战场。
              </p>
              <div className="article-meta">
                <span>42 分钟前</span>
                <span>AI SCORE 89</span>
              </div>
            </article>

            <article className="rail-story">
              <p className="article-label">创投雷达</p>
              <h2>垂直 AI 应用吸引新一轮资金，但增长逻辑已经改变</h2>
              <div className="article-meta">
                <span>1 小时前</span>
                <span>6 分钟阅读</span>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section className="newswire" id="latest">
        <div className="page-shell newswire-grid">
          <div className="newswire-title">
            <span className="live-dot" />
            <strong>即时脉动</strong>
            <small>LIVE</small>
          </div>
          <div className="newswire-list">
            {quickReads.map((item) => (
              <article key={item.title}>
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <time>{item.time}</time>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell editorial-section" id="analysis">
        <div className="section-title-row">
          <div>
            <span className="section-number">01</span>
            <h2>编辑精选</h2>
          </div>
          <p>值得花时间理解的技术变化</p>
        </div>

        <div className="editor-picks">
          {editorPicks.map((item) => (
            <article className="editor-pick" key={item.index}>
              <div className="pick-index">{item.index}</div>
              <div className="pick-copy">
                <p className="article-label">{item.category}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span>{item.readTime}</span>
              </div>
              <span className="read-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="trend-section" id="trends">
        <div className="page-shell">
          <div className="section-title-row inverse">
            <div>
              <span className="section-number">02</span>
              <h2>趋势仪表板</h2>
            </div>
            <p>新闻量、搜索量、GitHub 与论文讯号的综合变化</p>
          </div>

          <div className="trend-editorial-grid">
            <article className="trend-feature">
              <p className="article-label">30 DAY SIGNAL</p>
              <div className="trend-hero-number">+240%</div>
              <h3>AI Agent 热度增幅居首</h3>
              <p>
                企业采用、开发框架与工具使用能力同步上升。热度正在从模型发布转向可运行的任务系统。
              </p>
              <div className="trend-spark" aria-hidden="true">
                {[22, 29, 26, 38, 44, 41, 57, 64, 59, 73, 86, 96].map(
                  (height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ),
                )}
              </div>
            </article>

            <div className="trend-list">
              {trendItems.map((trend) => (
                <div className="trend-item" key={trend.name}>
                  <div>
                    <span>{trend.name}</span>
                    <strong>{trend.growth}</strong>
                  </div>
                  <div className="trend-track">
                    <i
                      className={trend.className}
                      style={{ width: `${trend.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="trend-note">
                趋势分数用于识别变化速度，不代表投资建议。每 30 分钟更新。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell research-section" id="research">
        <div className="section-title-row">
          <div>
            <span className="section-number">03</span>
            <h2>AI 研究助手</h2>
          </div>
          <p>你的私人科技研究员</p>
        </div>

        <div className="research-grid">
          <div className="research-intro">
            <p className="research-kicker">ASK TECHPULSE</p>
            <h3>不只找到资讯，更直接得到脉络。</h3>
            <p>
              连接新闻、公司、技术与趋势，以可追溯的资料回答研究型问题。
            </p>
          </div>

          <div className="answer-sheet">
            <p className="question">
              <span>Q</span>
              最近 AI Agent 有哪些真正值得关注的突破？
            </p>
            <div className="answer">
              <span>A</span>
              <div>
                <p>
                  过去 30 天最明显的变化，不是又多了一个聊天机器人，而是 Agent
                  开始获得持续执行任务的能力：
                </p>
                <ol>
                  <li>工具调用开始具备可观测与权限控制</li>
                  <li>多模态模型可以理解更完整的工作环境</li>
                  <li>企业从单点自动化转向跨系统工作流</li>
                </ol>
                <small>已综合 18 篇报道与 6 组研究资料</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="method-section">
        <div className="page-shell method-grid">
          <div className="method-heading">
            <span>HOW IT WORKS</span>
            <h2>从全球动态，到可信情报。</h2>
          </div>
          <div className="method-steps">
            {pipeline.map(([number, title, detail]) => (
              <div key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="daily-brief">
        <div className="page-shell daily-brief-inner">
          <div className="brief-clock">
            <span>DAILY BRIEF</span>
            <strong>08:00</strong>
          </div>
          <div>
            <h2>五分钟，看懂今天最重要的科技变化。</h2>
            <p>每日五大科技新闻、AI 摘要与影响分析，准时送达。</p>
          </div>
          <button
            type="button"
            onClick={() => setBriefEnabled((enabled) => !enabled)}
          >
            {briefEnabled ? "已加入每日简报" : "加入每日简报"}
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <a className="footer-wordmark" href="#top">
            TechPulse
          </a>
          <p>全球科技新闻库 · AI 研究助手 · 趋势分析工具</p>
          <span>洞察全球科技，预见未来趋势。</span>
        </div>
      </footer>
    </main>
  );
}
