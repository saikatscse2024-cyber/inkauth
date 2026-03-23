"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function StoryRenderer({ content }: { content: string }) {
  return (
    <article className="max-w-[68ch] mx-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p({ children }) {
            return (
              <p className="font-serif text-[1.2rem] sm:text-[1.3rem] leading-[2.1] text-[#2e2b28] mb-6">
                {children}
              </p>
            );
          },
          h1({ children }) { return <h1 className="font-serif text-3xl font-bold text-stone-800 mt-10 mb-4">{children}</h1>; },
          h2({ children }) { return <h2 className="font-serif text-2xl font-bold text-stone-800 mt-8 mb-3">{children}</h2>; },
          h3({ children }) { return <h3 className="font-serif text-xl font-semibold text-stone-700 mt-6 mb-2">{children}</h3>; },
          strong({ children }) {
            return <strong className="font-bold text-[#1a1a1a]">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-stone-700">{children}</em>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-300 pl-5 my-6 italic text-stone-500 font-serif text-lg">
                {children}
              </blockquote>
            );
          },
          code({ className, children }) {
            const isBlock = className?.includes("language");
            return isBlock ? (
              <pre className="bg-stone-900 text-emerald-400 rounded-xl p-5 my-6 overflow-x-auto font-mono text-sm leading-relaxed">
                <code>{children}</code>
              </pre>
            ) : (
              <code className="bg-stone-100 text-rose-700 px-1.5 py-0.5 rounded font-mono text-[0.85em]">
                {children}
              </code>
            );
          },
          hr() {
            return <hr className="my-10 border-stone-200" />;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-2 my-4 font-serif text-lg text-stone-700">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-2 my-4 font-serif text-lg text-stone-700">{children}</ol>;
          },
          a({ href, children }) {
            return <a href={href} className="text-indigo-600 underline hover:text-indigo-800 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
