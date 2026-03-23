"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const StoryRenderer = dynamic(() => import("@/app/components/StoryRenderer"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 animate-pulse mt-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-5 bg-stone-100 rounded-full"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  ),
});

const CACHE_TTL_DAYS = 90;
const CACHE_TTL_MS = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
const cacheKey = (bookId: string, chapterId: string) =>
  `story_cache__${bookId}__${chapterId}`;

function getFromCache(bookId: string, chapterId: string): string | null {
  try {
    const raw = localStorage.getItem(cacheKey(bookId, chapterId));
    if (!raw) return null;
    const { content, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(bookId, chapterId));
      return null;
    }
    return content as string;
  } catch {
    return null;
  }
}

function saveToCache(bookId: string, chapterId: string, content: string) {
  try {
    localStorage.setItem(
      cacheKey(bookId, chapterId),
      JSON.stringify({ content, savedAt: Date.now() })
    );
  } catch {
    // localStorage may be full or unavailable — silently skip
  }
}

export default function ChapterContent({
  content,
  bookId,
  chapterId,
}: {
  content: string;
  bookId: string;
  chapterId: string;
}) {
  const [resolvedContent, setResolvedContent] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check cache first
    const cached = getFromCache(bookId, chapterId);
    if (cached) {
      setResolvedContent(cached);
      return;
    }
    // 2. Use fresh content from server and cache it for 90 days
    setResolvedContent(content);
    saveToCache(bookId, chapterId, content);
  }, [bookId, chapterId, content]);

  if (resolvedContent === null) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 bg-stone-100 rounded-full" style={{ width: `${75 + (i % 3) * 8}%` }} />
        ))}
      </div>
    );
  }

  return <StoryRenderer content={resolvedContent} />;
}
