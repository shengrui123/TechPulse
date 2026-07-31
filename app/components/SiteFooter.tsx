import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-editorial">
        <div className="footer-statement">
          <span>WORLD PULSE</span>
          <h2>世界持续发生，理解需要被编辑。</h2>
        </div>
        <div className="footer-directory">
          <div>
            <strong>EXPLORE</strong>
            <Link href="/">国际</Link>
            <Link href="/news/politics">政治</Link>
            <Link href="/news/economy">经济</Link>
          </div>
          <div>
            <strong>MORE</strong>
            <Link href="/news/society">社会</Link>
            <Link href="/news/technology">科技</Link>
            <Link href="/news/climate-culture">气候与文化</Link>
            <Link href="/sources">信源标准</Link>
          </div>
        </div>
        <div className="footer-signoff">
          <Link className="footer-brand" href="/">
            WP
          </Link>
          <p>权威来源 · 中文整理 · 保留原文</p>
          <span>© 2026 WORLD PULSE EDITORIAL</span>
        </div>
      </div>
    </footer>
  );
}
