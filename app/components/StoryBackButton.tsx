"use client";

import { useRouter } from "next/navigation";

export default function StoryBackButton() {
  const router = useRouter();

  function goBack() {
    const story = `${window.location.pathname}${window.location.search}`;
    let savedStory: string | null = null;
    let savedPath: string | null = null;
    try {
      savedStory = sessionStorage.getItem("worldpulse-return-story");
      savedPath = sessionStorage.getItem("worldpulse-return-path");
    } catch {
      // Direct visits and restricted storage return to the news list.
    }
    const destination =
      savedStory === story && savedPath?.startsWith("/") && !savedPath.startsWith("//")
        ? savedPath
        : "/news";
    router.push(destination);
  }

  return (
    <button className="story-back-button" type="button" onClick={goBack}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m14 5-7 7 7 7" />
      </svg>
      返回
    </button>
  );
}
