"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MasonryGridProps = {
  children: ReactNode;
  className?: string;
};

export default function MasonryGrid({ children, className = "news-waterfall" }: MasonryGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    const cards = new Set<HTMLElement>();
    const measure = (card: HTMLElement) => {
      // Four-pixel grid rows keep the spaces between uneven cards consistent.
      const height = card.getBoundingClientRect().height;
      if (height > 0) card.style.gridRowEnd = `span ${Math.ceil((height + 20) / 4)}`;
    };
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) measure(entry.target as HTMLElement);
    });
    const update = () => {
      frame = 0;
      const current = new Set(grid.querySelectorAll<HTMLElement>(":scope > .news-card"));
      for (const card of cards) if (!current.has(card)) { observer.unobserve(card); cards.delete(card); }
      for (const card of current) {
        if (!cards.has(card)) { cards.add(card); observer.observe(card); }
        measure(card);
      }
      grid.classList.add("masonry-ready");
    };
    const mutation = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(update);
    });
    mutation.observe(grid, { childList: true });
    update();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      mutation.disconnect();
      observer.disconnect();
      grid.classList.remove("masonry-ready");
      for (const card of cards) card.style.removeProperty("grid-row-end");
    };
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
