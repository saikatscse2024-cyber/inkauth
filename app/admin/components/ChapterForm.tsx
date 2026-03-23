"use client";

import { useState, useTransition } from "react";
import MarkdownEditor from "./MarkdownEditor";
import Toast from "./Toast";
import { saveChapter, deleteChapter } from "@/app/admin/actions";

export function ChapterForm({
  bookId,
  chapter,
  isNew = false,
  fallbackNumber,
}: {
  bookId: string;
  chapter?: any;
  isNew?: boolean;
  fallbackNumber?: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveChapter(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    });
  };

  return (
    <div
      className={`mt-8 ${isNew ? "bg-indigo-50 border border-indigo-100" : "bg-white border border-slate-200"} rounded-2xl shadow-sm overflow-hidden`}
    >
      {saved && <Toast message={isNew ? "Chapter created!" : "Chapter saved successfully!"} />}

      <div
        className={`${isNew ? "bg-indigo-100/50 border-b border-indigo-100" : "bg-slate-50 border-b border-slate-200"} px-6 py-4 flex justify-between items-center`}
      >
        <h3 className={`font-bold ${isNew ? "text-indigo-900" : "text-slate-800"}`}>
          {isNew ? "Add New Chapter" : `Edit Chapter ${chapter.chapter_number}`}
        </h3>
        {!isNew && (
          <form action={deleteChapter}>
            <input type="hidden" name="id" value={chapter.id} />
            <input type="hidden" name="book_id" value={bookId} />
            <button
              type="submit"
              className="text-red-500 hover:text-red-700 font-semibold text-sm"
              onClick={(e) => !confirm("Delete this chapter?") && e.preventDefault()}
            >
              Delete
            </button>
          </form>
        )}
      </div>

      <form onSubmit={handleSave} className="p-6">
        <input type="hidden" name="isNew" value={isNew.toString()} />
        {!isNew && <input type="hidden" name="chapter_id" value={chapter.id} />}
        <input type="hidden" name="book_id" value={bookId} />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          {isNew && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Chapter ID (Slug)</label>
              <input
                type="text"
                name="chapter_id"
                required
                placeholder="e.g. c4"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          )}
          <div className={`sm:col-span-${isNew ? 2 : 1}`}>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ch. Number</label>
            <input
              type="number"
              name="chapter_number"
              defaultValue={isNew ? fallbackNumber : chapter.chapter_number}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Title</label>
            <input
              type="text"
              name="chapter_title"
              defaultValue={isNew ? "" : chapter.chapter_title}
              required
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-4 mt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Content <span className="font-normal text-slate-400">(Markdown: **bold**, *italic*, `code`, &gt; quote, ## heading)</span>
            </label>
            <MarkdownEditor initialValue={isNew ? "" : chapter.content} name="content" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`mt-2 ${isNew ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-800 hover:bg-slate-900"} text-white font-medium py-3 px-8 rounded-lg transition-all text-sm shadow-md disabled:opacity-70 flex items-center gap-2`}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Saving…
            </>
          ) : isNew ? (
            "Create Chapter"
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
