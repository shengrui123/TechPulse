import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-row">
        <Link className="footer-brand" href="/">
          TechPulse
        </Link>
        <p>从全球动态，到可信情报。</p>
        <span>洞察全球科技，预见未来趋势。</span>
      </div>
    </footer>
  );
}
