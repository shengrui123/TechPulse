"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { newsCategories } from "../data/news-categories";

const navigation = [
  ...newsCategories.map(
    ({ id, label }) => [label, id === "world" ? "/" : `/news/${id}`] as const,
  ),
  ["信源标准", "/sources"],
];

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

  const searchHref = importanceSort
    ? "/news#source-search"
    : "/news?sort=time#source-search";

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
              href={hrefWithSort(href)}
              key={label}
              aria-current={isActive(href) ? "page" : undefined}
            >
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
          <Link
            className={`nav-search-link ${searchFloating ? "is-hidden" : ""}`}
            href={searchHref}
            aria-label="搜索媒体来源"
          >
            <span aria-hidden="true">⌕</span>
            搜索
          </Link>
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
              href={hrefWithSort(href)}
              key={label}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
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
          <Link
            href={searchHref}
            onClick={() => setMenuOpen(false)}
          >
            搜索媒体来源
          </Link>
        </div>
      </nav>
      <Link
        className={`floating-search ${searchFloating ? "is-visible" : ""}`}
        href={searchHref}
        aria-label="搜索媒体来源"
      >
        <span aria-hidden="true">⌕</span>
        <small>SEARCH</small>
      </Link>
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
