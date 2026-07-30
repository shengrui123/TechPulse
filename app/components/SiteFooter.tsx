import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-row">
        <Link className="footer-brand" href="/">
          WorldPulse
        </Link>
        <p>从全球动态，到可信理解。</p>
        <span>权威来源 · 中文整理 · 保留原文</span>
      </div>
    </footer>
  );
}
