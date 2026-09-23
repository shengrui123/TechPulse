"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { newsCategories } from "../data/news-categories";
import StoryBackButton from "./StoryBackButton";

const navigation = [
  ...newsCategories.map(
    ({ id, label }) => [label, id === "world" ? "/" : `/news/${id}`, id] as const,
  ),
  ["信源标准", "/sources", "sources"] as const,
];

type NavigationIcon = (typeof navigation)[number][2];

function CategoryIcon({ name }: { name: NavigationIcon }) {
  const paths: Record<NavigationIcon, ReactNode> = {
    world: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9Z" /></>,
    politics: <><path d="m3 9 9-5 9 5M4 20h16M6 18V10m4 8V10m4 8V10m4 8V10" /></>,
    economy: <><path d="M4 20h16M6 16v-5m5 5V7m5 9V4m5 12V9" /></>,
    society: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m4 9v-2a6 6 0 0 0-4-5.7" /></>,
    technology: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M10 10h4v4h-4z" /></>,
    "climate-culture": <><path d="M20 4c-9 0-15 3-15 10a6 6 0 0 0 6 6c7 0 10-6 9-16ZM4 21c2-5 6-9 12-12" /></>,
    sources: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h6v5H7zm10 0h1m-1 4h1M7 16h11" /></>,
  };

  return (
    <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFloating, setSearchFloating] = useState(false);
  const [importanceSort, setImportanceSort] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const showSortToggle =
    pathname === "/" ||
    pathname === "/news" ||
    (pathname.startsWith("/news/") && pathname !== "/news/story");

  useEffect(() => {
    function updateSearchPosition() {
      setSearchFloating(window.scrollY > window.innerHeight);
    }

    updateSearchPosition();
    window.addEventListener("scroll", updateSearchPosition, { passive: true });
    window.addEventListener("resize", updateSearchPosition);

    return () => {
      window.removeEventListener("scroll", updateSearchPosition);
      window.removeEventListener("resize", updateSearchPosition);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDarkMode(document.documentElement.dataset.theme === "dark");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function syncSortMode() {
      setImportanceSort(
        new URL(window.location.href).searchParams.get("sort") !== "time",
      );
    }

    syncSortMode();
    window.addEventListener("popstate", syncSortMode);
    return () => window.removeEventListener("popstate", syncSortMode);
  }, [pathname]);

  useEffect(() => {
    function rememberNewsList(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="/news/story?"]');
      if (!link) return;

      const url = new URL(link.href);
      try {
        sessionStorage.setItem("worldpulse-return-story", `${url.pathname}${url.search}`);
        sessionStorage.setItem(
          "worldpulse-return-path",
          `${window.location.pathname}${window.location.search}${window.location.hash}`,
        );
      } catch {
        // The detail page still has a safe fallback when storage is unavailable.
      }
    }

    document.addEventListener("click", rememberNewsList);
    return () => document.removeEventListener("click", rememberNewsList);
  }, []);

  function hrefWithSort(href: string) {
    if (importanceSort || href === "/sources") return href;
    return `${href}${href.includes("?") ? "&" : "?"}sort=time`;
  }

  function toggleSortMode() {
    const url = new URL(window.location.href);
    const nextImportanceSort = !importanceSort;
    if (nextImportanceSort) {
      url.searchParams.delete("sort");
    } else {
      url.searchParams.set("sort", "time");
    }
    setImportanceSort(nextImportanceSort);
    router.push(`${url.pathname}${url.search}${url.hash}`);
  }

  function toggleTheme() {
    const nextTheme = darkMode ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("worldpulse-theme", nextTheme);
    } catch {
      // Theme switching still works if browser storage is unavailable.
    }
    setDarkMode(nextTheme === "dark");
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/sources") {
      return pathname === "/sources";
    }
    return pathname === href;
  }

  if (pathname === "/news/story") {
    return (
      <header className="story-topbar">
        <div className="page-shell story-topbar-inner">
          <StoryBackButton />
          <Link className="story-topbar-brand" href="/" aria-label="WorldPulse 首页">
            WORLD<span>PULSE</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <div className="topline" />
      <header className="site-header">
        <div className="page-shell header-row">
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
          {navigation.map(([label, href, icon]) => (
            <Link
              className={isActive(href) ? "is-active" : ""}
              href={hrefWithSort(href)}
              key={label}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <CategoryIcon name={icon} />
              {label}
            </Link>
          ))}
          <button
            className={`nav-theme-toggle ${darkMode ? "is-dark" : ""}`}
            type="button"
            aria-label={darkMode ? "切换为浅色模式" : "切换为暗色模式"}
            aria-pressed={darkMode}
            onClick={toggleTheme}
          >
            <i aria-hidden="true">{darkMode ? "☀" : "◐"}</i>
            {darkMode ? "浅色" : "暗色"}
          </button>
          {showSortToggle && (
            <button
              className={`nav-sort-toggle ${importanceSort ? "is-importance" : ""} ${searchFloating ? "is-hidden" : ""}`}
              type="button"
              aria-label={
                importanceSort ? "切换为按时间排序" : "切换为按重要度排序"
              }
              aria-pressed={importanceSort}
              onClick={toggleSortMode}
            >
              <i aria-hidden="true">↕</i>
              {importanceSort ? "重要度" : "时间"}
            </button>
          )}
        </div>
      </nav>
      <nav
        className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        aria-label="移动栏目"
      >
        <div className="page-shell">
          {navigation.map(([label, href, icon]) => (
            <Link
              className={isActive(href) ? "is-active" : ""}
              href={hrefWithSort(href)}
              key={label}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <CategoryIcon name={icon} />
              {label}
            </Link>
          ))}
          {showSortToggle && (
            <button
              className="mobile-sort-toggle"
              type="button"
              aria-pressed={importanceSort}
              onClick={toggleSortMode}
            >
              排序：{importanceSort ? "重要度" : "时间"}
            </button>
          )}
          <button
            className="mobile-theme-toggle"
            type="button"
            aria-label={darkMode ? "切换为浅色模式" : "切换为暗色模式"}
            aria-pressed={darkMode}
            onClick={toggleTheme}
          >
            显示：{darkMode ? "浅色" : "暗色"}
          </button>
        </div>
      </nav>
      {showSortToggle && (
        <button
          className={`floating-sort ${searchFloating ? "is-visible" : ""} ${importanceSort ? "is-importance" : ""}`}
          type="button"
          aria-label={
            importanceSort ? "切换为按时间排序" : "切换为按重要度排序"
          }
          aria-pressed={importanceSort}
          onClick={toggleSortMode}
        >
          <span aria-hidden="true">↕</span>
          <small>{importanceSort ? "RANK" : "TIME"}</small>
        </button>
      )}
    </>
  );
}
