import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-editorial">
        <div className="footer-statement">
          <Link className="footer-wordmark" href="/">
            WORLD<span>PULSE</span>
          </Link>
          <div>
            <strong>全球时事 · 中文编辑</strong>
            <p>从可靠信源出发，为每一天建立清晰的世界坐标。</p>
          </div>
        </div>
        <div className="footer-directory">
          <Link href="/">精选</Link>
          <Link href="/news/world">国际</Link>
          <Link href="/news/politics">政治</Link>
          <Link href="/news/economy">经济</Link>
          <Link href="/news/society">社会</Link>
          <Link href="/news/technology">科技</Link>
          <Link href="/news/climate-culture">气候与文化</Link>
          <Link href="/sources">信源</Link>
        </div>
        <div className="footer-signoff">
          <p>独立编辑 · 保留原文 · 持续更新</p>
          <span>© 2026 WORLD PULSE EDITORIAL</span>
        </div>
      </div>
    </footer>
  );
}
