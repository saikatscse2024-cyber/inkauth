import { tursoClient } from "@/lib/turso";
import Link from "next/link";

export const revalidate = 0;

async function getBooks() {
  const client = tursoClient();
  if (!client) return [];
  try {
    const result = await client.execute(
      "SELECT id, title, description, cover_page FROM books LIMIT 16"
    );
    return result.rows.map((row) => ({
      id: row.id as string,
      title: row.title as string,
      description: row.description as string,
      coverUrl: row.cover_page as string,
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function Home() {
  const books = await getBooks();

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans">
      {/* ── Navbar ── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-0 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white font-black text-lg leading-none select-none">
              S
            </div>
            <span className="text-xl font-bold text-stone-900 tracking-tight">StoryRealm</span>
          </Link>

          {/* Centre nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <a href="#library" className="px-4 py-2 rounded-lg text-stone-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all">Library</a>
            <Link href="/support" className="px-4 py-2 rounded-lg text-stone-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all">Support</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/support" className="md:hidden p-2 rounded-lg text-stone-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <Link
              href="/admin"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all hidden sm:block"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white border-b border-stone-200">
        {/* Subtle mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_#e0e7ff_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-36 text-center">
          <span className="inline-block mb-5 text-xs font-bold tracking-[0.2em] uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full">
            Your reading sanctuary
          </span>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}
          >
            Worlds waiting <br className="hidden sm:block" />
            <span className="text-indigo-600">to be discovered</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dive into our curated library of original stories, sweeping novels and short tales — all beautifully formatted for comfortable reading.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#library"
              className="px-8 py-4 rounded-full bg-indigo-700 text-white font-bold text-base hover:bg-indigo-800 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-indigo-300/40"
            >
              Browse the Library
            </a>
            <Link
              href="/support"
              className="px-8 py-4 rounded-full bg-white text-stone-700 font-bold text-base border border-stone-200 hover:bg-stone-50 transition-all shadow-sm"
            >
              Get Help
            </Link>
          </div>

          {/* Mini stats row */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm font-medium text-stone-500">
            <span><strong className="text-stone-800 text-lg font-extrabold">{books.length}</strong> Stories</span>
            <span className="hidden sm:block text-stone-300">|</span>
            <span><strong className="text-stone-800 text-lg font-extrabold">Free</strong> to read</span>
            <span className="hidden sm:block text-stone-300">|</span>
            {/* <span><strong className="text-stone-800 text-lg font-extrabold">Offline</strong> cached</span> */}
          </div>
        </div>
      </section>

      {/* ── Featured Stories grid ── */}
      <main id="library" className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">Featured Stories</h2>
            <p className="text-stone-500 text-sm mt-1">Click any cover to start reading</p>
          </div>
          <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            {books.length} {books.length === 1 ? "book" : "books"}
          </span>
        </div>

        {books.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-stone-100">
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2" style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}>Library is empty</h3>
            <p className="text-stone-500 max-w-md mx-auto leading-relaxed text-sm">
              Configure your Turso DB credentials and add books to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-9">
            {books.map((book, i) => (
              <Link
                href={`/book/${book.id}`}
                key={book.id || i}
                className="group flex flex-col items-center"
              >
                <div className="relative w-full aspect-[2/3] bg-stone-100 rounded-xl shadow-sm mb-3 overflow-hidden group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5">
                  <div className="absolute inset-0 border border-black/5 z-10 rounded-xl pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-gradient-to-r from-black/25 to-transparent z-20 mix-blend-multiply pointer-events-none rounded-l-xl" />
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                      <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3
                  className="font-bold text-stone-900 text-sm sm:text-[0.9rem] mb-1 leading-snug text-center group-hover:text-indigo-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}
                >
                  {book.title || "Untitled Tale"}
                </h3>
                <p className="text-stone-400 text-xs line-clamp-2 text-center max-w-[95%] leading-relaxed">
                  {book.description || "An epic journey unfolds…"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200 bg-white py-8 mt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} StoryRealm. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/support" className="hover:text-indigo-600 transition-colors">Support</Link>
            <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
