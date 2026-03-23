import { tursoClient } from "@/lib/turso";
import Link from "next/link";

export const revalidate = 0;

async function getBooks() {
  const client = tursoClient();
  if (!client) return [];
  try {
    const result = await client.execute(`
      SELECT b.id, b.title, bd.publication_date, bd.author_name 
      FROM books b 
      LEFT JOIN book_details bd ON b.id = bd.book_id 
      ORDER BY b.id DESC
    `);
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminDashboard() {
  const books = await getBooks();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Stories Management</h1>
          <p className="text-slate-500 mt-1">Manage your library's books and chapters</p>
        </div>
        <Link href="/admin/book/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-xl shadow-md transition-all">
          + Add New Story
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-bold uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 hidden sm:table-cell">Author</th>
              <th className="px-6 py-4 hidden md:table-cell">Published</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No stories found. Create one to get started!
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id as string} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">{book.id as string}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <Link href={`/admin/book/${book.id}`} className="hover:text-indigo-600 transition-colors">{book.title as string}</Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm hidden sm:table-cell font-medium">{book.author_name as string || "-"}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm hidden md:table-cell">{book.publication_date as string || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/book/${book.id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
