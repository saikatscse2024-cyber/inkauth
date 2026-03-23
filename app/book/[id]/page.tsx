import { tursoClient } from "@/lib/turso";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function getBookDetails(id: string) {
  const client = tursoClient();
  if (!client) return null;

  try {
    const queries = [
      {
        sql: `SELECT b.id, b.title, b.description, b.cover_page, 
                     bd.detailed_description, bd.author_name, bd.publication_date 
              FROM books b 
              LEFT JOIN book_details bd ON b.id = bd.book_id 
              WHERE b.id = ?`,
        args: [id]
      },
      {
        sql: `SELECT id, chapter_number, chapter_title 
              FROM book_chapters 
              WHERE book_id = ? 
              ORDER BY chapter_number ASC`,
        args: [id]
      }
    ];

    const results = await client.batch(queries, "read");
    const bookResult = results[0];
    const chaptersResult = results[1];

    if (bookResult.rows.length === 0) return null;
    const book = bookResult.rows[0];

    return {
      id: book.id as string,
      title: book.title as string,
      description: book.description as string,
      coverPage: book.cover_page as string,
      authorName: book.author_name as string || "Unknown Author",
      detailedDescription: book.detailed_description as string || "No detailed description available.",
      publicationDate: book.publication_date as string || "Unknown Date",
      chapters: chaptersResult.rows.map(row => ({
        id: row.id as string,
        chapterNumber: row.chapter_number as number,
        chapterTitle: row.chapter_title as string,
      })),
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = await getBookDetails(resolvedParams.id);

  if (!data) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-serif">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between font-sans shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-indigo-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold">Back to Library</span>
        </Link>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16">
        {/* Book Header Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-16 font-sans">
          {/* Cover */}
          <div className="w-full md:w-[320px] aspect-[2/3] bg-stone-100 rounded-lg shadow-xl shrink-0 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-[4%] bg-gradient-to-r from-black/20 to-transparent z-20 mix-blend-multiply pointer-events-none"></div>
            {data.coverPage ? (
              <img src={data.coverPage} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-200">
                <span className="text-stone-400 font-medium font-serif">No Cover</span>
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-3 font-serif">{data.title}</h1>
            <p className="text-xl text-stone-500 font-medium mb-8">By <span className="text-stone-800">{data.authorName}</span></p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600 mb-8 pb-8 border-b border-stone-200">
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Published: {data.publicationDate}
              </span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm">
                 <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {data.chapters.length} Chapters
              </span>
            </div>

            <h3 className="text-2xl font-bold text-stone-800 mb-4 font-serif">Synopsis</h3>
            <p className="text-stone-700 leading-relaxed text-lg font-serif">
              {data.detailedDescription}
            </p>

            {data.chapters.length > 0 && (
              <Link href={`/book/${data.id}/chapter/${data.chapters[0].id}`} className="inline-block mt-8 px-8 py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-full shadow-md transition-transform hover:-translate-y-0.5">
                Start Reading
              </Link>
            )}
          </div>
        </div>

        {/* Chapters Table of Contents */}
        <div className="max-w-3xl font-sans">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 font-serif">Table of Contents</h2>
          
          {data.chapters.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-stone-500 font-medium">No chapters available for this story yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <ul className="divide-y divide-stone-100">
                {data.chapters.map((chapter) => (
                  <li key={chapter.id} className="hover:bg-stone-50 transition-colors">
                    <Link href={`/book/${data.id}/chapter/${chapter.id}`} className="flex items-center p-5 sm:p-6 gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0 transition-colors">
                        {chapter.chapterNumber}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-stone-800 group-hover:text-indigo-700 transition-colors font-serif">{chapter.chapterTitle}</h4>
                      </div>
                      <div className="text-stone-300 group-hover:text-indigo-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
