"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { newsCategories } from "../data/news-categories";

const navigation = [
  ...newsCategories.map(
    ({ id, label }) => [label, id === "world" ? "/" : `/news/${id}`] as const,
  ),
  ["信源标准", "/sources"],
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/sources") {
      return pathname === "/sources";
    }
    return pathname === href;
  }

  return (
    <>
      <div className="topline" />
      <header className="site-header">
        <div className="page-shell header-row">
          <span className="masthead-issue">THE DAILY EDITION · SHANGHAI</span>
          <Link className="brand" href="/" aria-label="WorldPulse 首页">
            <span>WORLD</span>
            <span>PULSE</span>
            <small>世界脉动 · GLOBAL AFFAIRS</small>
          </Link>
          <div className="header-actions">
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
          {navigation.map(([label, href]) => (
            <Link
              className={isActive(href) ? "is-active" : ""}
              href={href}
              key={label}
              aria-current={isActive(href) ? "page" : undefined}
            >
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
            <Link
              className={isActive(href) ? "is-active" : ""}
              href={href}
              key={label}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
