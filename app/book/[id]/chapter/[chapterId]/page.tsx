import { tursoClient } from "@/lib/turso";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterContent from "@/app/components/ChapterContent";

async function getChapterDetails(bookId: string, chapterId: string) {
  const client = tursoClient();
  if (!client) return null;

  try {
    const results = await client.batch(
      [
        { sql: "SELECT id, title FROM books WHERE id = ?", args: [bookId] },
        {
          sql: `SELECT id, chapter_number, chapter_title, content,
                  (SELECT id FROM book_chapters WHERE book_id = ? AND chapter_number < c.chapter_number ORDER BY chapter_number DESC LIMIT 1) AS prev_id,
                  (SELECT id FROM book_chapters WHERE book_id = ? AND chapter_number > c.chapter_number ORDER BY chapter_number ASC LIMIT 1) AS next_id
                FROM book_chapters c WHERE c.id = ? AND c.book_id = ?`,
          args: [bookId, bookId, chapterId, bookId],
        },
      ],
      "read"
    );

    if (results[0].rows.length === 0 || results[1].rows.length === 0) return null;

    const ch = results[1].rows[0];
    return {
      book: { id: results[0].rows[0].id as string, title: results[0].rows[0].title as string },
      chapter: {
        id: ch.id as string,
        chapterNumber: ch.chapter_number as number,
        chapterTitle: ch.chapter_title as string,
        content: ch.content as string,
        prevId: ch.prev_id as string | null,
        nextId: ch.next_id as string | null,
      },
    };
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return null;
  }
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const { id, chapterId } = await params;
  const data = await getChapterDetails(id, chapterId);
  if (!data) return notFound();

  const { book, chapter } = data;

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex flex-col" style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}>
      {/* Sticky header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <Link
          href={`/book/${book.id}`}
          className="flex items-center gap-2 text-stone-500 hover:text-indigo-700 transition-colors font-sans font-medium text-sm"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="line-clamp-1 max-w-[200px]">{book.title}</span>
        </Link>
        <span className="text-stone-400 font-sans text-sm hidden sm:block">
          Chapter {chapter.chapterNumber}
        </span>
      </header>

      {/* Chapter content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 sm:px-10 py-14 sm:py-20">
        {/* Chapter title block */}
        <div className="text-center mb-16 px-2">
          <span className="inline-block text-indigo-500 font-sans font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-5">
            Chapter {chapter.chapterNumber}
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 leading-snug"
            style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}
          >
            {chapter.chapterTitle}
          </h1>
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2 items-center text-stone-300 text-xl">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
          </div>
        </div>

        {/* Story content rendered as Markdown with localStorage caching */}
        <ChapterContent content={chapter.content || ""} bookId={book.id} chapterId={chapter.id} />

        {/* Navigation */}
        <div className="mt-20 pt-10 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
          {chapter.prevId ? (
            <Link
              href={`/book/${book.id}/chapter/${chapter.prevId}`}
              className="flex items-center gap-2 text-stone-500 hover:text-indigo-700 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Chapter
            </Link>
          ) : <div />}

          <Link
            href={`/book/${book.id}`}
            className="text-stone-400 hover:text-stone-700 text-sm transition-colors"
          >
            Table of Contents
          </Link>

          {chapter.nextId ? (
            <Link
              href={`/book/${book.id}/chapter/${chapter.nextId}`}
              className="flex items-center gap-2 text-stone-500 hover:text-indigo-700 text-sm font-medium transition-colors"
            >
              Next Chapter
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
