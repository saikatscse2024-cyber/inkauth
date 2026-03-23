"use client";

import { useState, useTransition } from "react";
import Toast from "./Toast";
import { saveBookDetails, deleteBook } from "@/app/admin/actions";

export function BookDetailsForm({
  bookId,
  book,
  isNew = false,
}: {
  bookId: string;
  book?: any;
  isNew?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveBookDetails(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    });
  };

  return (
    <>
      {saved && <Toast message={isNew ? "Story created!" : "Story details saved!"} />}
      <form onSubmit={handleSave} className="p-8">
        <input type="hidden" name="isNew" value={isNew.toString()} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Book ID (Unique Slug)</label>
            <input
              type="text"
              name="id"
              defaultValue={isNew ? "" : (book?.id as string)}
              required
              readOnly={!isNew}
              className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isNew && "bg-slate-100 text-slate-500 cursor-not-allowed"}`}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={book?.title as string || ""}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
            <input
              type="text"
              name="author_name"
              defaultValue={book?.author_name as string || ""}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Publication Date</label>
            <input
              type="text"
              name="publication_date"
              defaultValue={book?.publication_date as string || ""}
              placeholder="e.g. 2024-05-12"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image URL</label>
            <input
              type="url"
              name="cover_page"
              defaultValue={book?.cover_page as string || ""}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Short Description (Card)</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={book?.description as string || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Synopsis (Page)</label>
            <textarea
              name="detailed_description"
              rows={4}
              defaultValue={book?.detailed_description as string || ""}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all disabled:opacity-70"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving…
              </>
            ) : isNew ? "Create Story" : "Save Changes"}
          </button>

          {!isNew && (
            <form action={deleteBook}>
              <input type="hidden" name="id" value={bookId} />
              <button
                type="submit"
                className="text-red-600 bg-red-50 hover:bg-red-100 font-semibold px-4 py-3 rounded-lg transition-colors text-sm"
                onClick={(e) => !confirm("Delete this story and all its chapters?") && e.preventDefault()}
              >
                Delete Story
              </button>
            </form>
          )}
        </div>
      </form>
    </>
  );
}
