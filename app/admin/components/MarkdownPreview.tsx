"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-stone max-w-none text-sm leading-7">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Render spoiler syntax >!text!< as a styled span
          p({ children }) {
            // Convert spoiler >! ... !< in text
            return <p>{children}</p>;
          },
          code({ className, children }) {
            const isBlock = className?.includes("language");
            return isBlock ? (
              <pre className="bg-slate-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                <code className={className}>{children}</code>
              </pre>
            ) : (
              <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded text-[0.85em] font-mono">
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-stone-500 my-4">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
