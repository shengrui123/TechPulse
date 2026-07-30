"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
  ["精选", "/#featured"],
  ["国际", "/#latest"],
  ["政治", "/#latest"],
  ["经济", "/#latest"],
  ["社会", "/#analysis"],
  ["科技", "/#analysis"],
  ["气候与文化", "/#analysis"],
  ["信源标准", "/sources"],
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [briefEnabled, setBriefEnabled] = useState(false);

  return (
    <>
      <div className="topline" />
      <header className="site-header">
        <div className="page-shell header-row">
          <Link className="brand" href="/">
            WorldPulse <small>世界脉动</small>
          </Link>
          <div className="header-actions">
            <button
              className="brief-button"
              type="button"
              aria-pressed={briefEnabled}
              onClick={() => setBriefEnabled((enabled) => !enabled)}
            >
              {briefEnabled ? "晨报已订阅" : "订阅全球晨报"}
            </button>
            <button
              className={`menu-button ${menuOpen ? "is-active" : ""}`}
              type="button"
              aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className="desktop-nav" aria-label="主要栏目">
        <div className="page-shell nav-inner">
          {navigation.map(([label, href], index) => (
            <Link className={index === 0 ? "is-active" : ""} href={href} key={label}>
              {label}
            </Link>
          ))}
          <span>全球时事 · 中文阅读</span>
        </div>
      </nav>
      <nav
        className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        aria-label="移动栏目"
      >
        <div className="page-shell">
          {navigation.map(([label, href]) => (
            <Link href={href} key={label} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
