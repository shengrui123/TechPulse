"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LiveNewsItem } from "../data/live-news";

type Item = LiveNewsItem & { storyHref: string; formattedDate: string };
const labels = [
  ["今日焦点", "THE TOP STORIES"], ["正在发生", "AROUND THE WORLD"],
  ["全球视野", "THE BIG PICTURE"], ["深入了解", "STORIES THAT MATTER"],
  ["更多值得关注", "MORE TO EXPLORE"], ["来自世界各地", "GLOBAL DISPATCHES"],
  ["新闻速览", "THE LATEST"], ["继续阅读", "KEEP READING"],
  ["世界观察", "WORLD WATCH"], ["今日聚焦", "IN FOCUS"],
  ["环球动态", "GLOBAL UPDATE"], ["更多报道", "MORE STORIES"],
];
function imageUrl(item: Item, photoOnly = false) {
  return `/api/news-image?url=${encodeURIComponent(item.url)}&source=${encodeURIComponent(item.source)}&title=${encodeURIComponent(item.originalTitle || item.title)}&v=6${photoOnly ? "&photo=1" : ""}`;
}

export default function EditionSections({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<string[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    const probes: HTMLImageElement[] = [];
    // Probe all candidates concurrently; only actual, browser-loadable images qualify.
    Promise.all(items.map((item) => new Promise<boolean>((resolve) => {
      const image = new window.Image();
      probes.push(image);
      const timeout = window.setTimeout(() => resolve(false), 12000);
      image.onload = () => { window.clearTimeout(timeout); resolve(image.naturalWidth > 0 && image.naturalHeight > 0); };
      image.onerror = () => { window.clearTimeout(timeout); resolve(false); };
      image.src = imageUrl(item, true);
    }))).then((results) => {
      if (!cancelled) setSelected(items.filter((_, index) => results[index]).map((item) => item.url));
    });
    return () => { cancelled = true; probes.forEach((image) => { image.onload = null; image.onerror = null; }); };
  }, [items]);

  if (selected === null) return <div className="edition-loading" role="status">正在挑选有图片的新闻…</div>;
  const featured = items.filter((item) => selected.includes(item.url));
  if (!featured.length) return <div className="edition-loading">暂时没有可展示的中文配图新闻，请稍后再试。</div>;
  const groups = labels.map(([title, subtitle], index) => ({
    title, subtitle,
    items: featured.slice(index * 2, index * 2 + 2),
  })).filter((group) => group.items.length);
  return <>{groups.map((group) => {
    const groupIndex = labels.findIndex(([title]) => title === group.title);
    return <section className="edition-section" key={group.title} aria-label={group.title}>
      <div className="edition-section-heading"><div><h2>{group.title}</h2><span>{group.subtitle}</span></div></div>
      <div className={`edition-grid edition-grid-${groupIndex % 3}`}>
        {group.items.map((item) => <article className="edition-card" key={`${item.source}-${item.url}`}>
          <Link prefetch={false} href={item.storyHref} aria-label={`阅读：${item.title}`}>
            <img src={imageUrl(item, true)} alt="" width={1000} height={650} />
            <div className="edition-card-copy"><span className="edition-card-kicker">{item.sourceName} · {item.formattedDate}</span><h3>{item.title}</h3><span className="edition-card-action">阅读报道 <span aria-hidden="true">↗</span></span></div>
          </Link>
        </article>)}
      </div>
    </section>;
  })}</>;
}
