import { tursoClient } from "@/lib/turso";
import { notFound } from "next/navigation";
import Link from "next/link";
import { saveBookDetails, deleteBook, saveChapter, deleteChapter } from "../../actions";

export const revalidate = 0;

async function getAdminBookDetails(id: string) {
  if (id === "new") return { isNew: true, book: null, chapters: [] };

  const client = tursoClient();
  if (!client) return { isNew: false, book: null, chapters: [] };

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
        sql: `SELECT id, chapter_number, chapter_title, content 
              FROM book_chapters 
              WHERE book_id = ? 
              ORDER BY chapter_number ASC`,
        args: [id]
      }
    ];

    const results = await client.batch(queries, "read");
    const bookResult = results[0];
    const chaptersResult = results[1];

    if (bookResult.rows.length === 0) return { isNew: false, book: null, chapters: [] };

    return {
      isNew: false,
      book: bookResult.rows[0],
      chapters: chaptersResult.rows
    };
  } catch (error) {
    console.error(error);
    return { isNew: false, book: null, chapters: [] };
  }
}

export default async function AdminBookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { isNew, book, chapters } = await getAdminBookDetails(resolvedParams.id);

  if (!isNew && !book) return notFound();

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isNew ? "Add New Story" : `Edit Story: ${book?.title}`}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Story Details</h2>
          {!isNew && (
            <form action={deleteBook}>
              <input type="hidden" name="id" value={resolvedParams.id} />
              <button type="submit" className="text-red-600 bg-red-50 hover:bg-red-100 font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                Delete Story
              </button>
            </form>
          )}
        </div>
        <form action={saveBookDetails} className="p-8">
          <input type="hidden" name="isNew" value={isNew.toString()} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Book ID (Unique Slug)</label>
              <input type="text" name="id" defaultValue={isNew ? "" : (book?.id as string)} required readOnly={!isNew} className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isNew && 'bg-slate-100 text-slate-500 cursor-not-allowed'}`} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input type="text" name="title" defaultValue={book?.title as string || ""} required className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
              <input type="text" name="author_name" defaultValue={book?.author_name as string || ""} required className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Publication Date</label>
              <input type="text" name="publication_date" defaultValue={book?.publication_date as string || ""} placeholder="e.g. 2024-05-12" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
              <input type="url" name="cover_page" defaultValue={book?.cover_page as string || ""} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Short Description (Card)</label>
              <textarea name="description" rows={2} defaultValue={book?.description as string || ""} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Synopsis (Page)</label>
              <textarea name="detailed_description" rows={4} defaultValue={book?.detailed_description as string || ""} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            {isNew ? "Create Story" : "Save Changes"}
          </button>
        </form>
      </div>

      {!isNew && (
        <div className="space-y-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mt-12 mb-6 tracking-tight">Chapters</h2>
          
          {chapters.map((chapter) => (
            <div key={chapter.id as string} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Edit Chapter {chapter.chapter_number as number}</h3>
                <form action={deleteChapter}>
                  <input type="hidden" name="id" value={chapter.id as string} />
                  <input type="hidden" name="book_id" value={resolvedParams.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
                </form>
              </div>
              <form action={saveChapter} className="p-6">
                <input type="hidden" name="isNew" value="false" />
                <input type="hidden" name="chapter_id" value={chapter.id as string} />
                <input type="hidden" name="book_id" value={resolvedParams.id} />
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ch. Number</label>
                    <input type="number" name="chapter_number" defaultValue={chapter.chapter_number as number} required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Title</label>
                    <input type="text" name="chapter_title" defaultValue={chapter.chapter_title as string} required className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Content</label>
                    <textarea name="content" rows={6} defaultValue={chapter.content as string || ""} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"></textarea>
                  </div>
                </div>
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm">Save Chapter</button>
              </form>
            </div>
          ))}

          {/* Add New Chapter */}
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 overflow-hidden mt-8">
            <div className="bg-indigo-100/50 border-b border-indigo-100 px-6 py-4">
              <h3 className="font-bold text-indigo-900">Add New Chapter</h3>
            </div>
            <form action={saveChapter} className="p-6">
              <input type="hidden" name="isNew" value="true" />
              <input type="hidden" name="book_id" value={resolvedParams.id} />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-indigo-900 mb-1">Chapter ID (Slug)</label>
                  <input type="text" name="chapter_id" required placeholder="e.g. c4" className="w-full px-3 py-2 rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-indigo-900 mb-1">Ch. Number</label>
                  <input type="number" name="chapter_number" defaultValue={chapters.length + 1} required className="w-full px-3 py-2 rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-indigo-900 mb-1">Chapter Title</label>
                  <input type="text" name="chapter_title" required placeholder="Title..." className="w-full px-3 py-2 rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-indigo-900 mb-1">Content</label>
                  <textarea name="content" rows={4} placeholder="Write story here... (\n for new lines)" className="w-full px-3 py-2 rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"></textarea>
                </div>
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-sm">Add Chapter</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
