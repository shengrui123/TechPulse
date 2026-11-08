"use client";

import { useEffect, useRef } from "react";

export default function LoadMoreTrigger({ onLoad, loading = false, error = false, revision = 0 }: { onLoad: () => void; loading?: boolean; error?: boolean; revision?: string | number }) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onLoad);
  useEffect(() => { callback.current = onLoad; }, [onLoad]);
  useEffect(() => {
    const target = ref.current;
    if (!target || loading || error || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) callback.current();
    }, { rootMargin: "600px" });
    observer.observe(target);
    return () => observer.disconnect();
  // Re-observe after each batch. The marker may still be inside the viewport
  // and an existing observer will not fire again without a boundary crossing.
  }, [loading, error, revision]);
  return <div ref={ref} className="news-pagination" role="status">
    {loading ? "正在加载更多新闻…" : <button type="button" onClick={onLoad}>{error ? "加载失败，点击重试" : "加载更多新闻"}</button>}
  </div>;
}
