"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import the preview so it only runs on client
const MarkdownPreview = dynamic(() => import("./MarkdownPreview"), { ssr: false });

type ToolAction = {
  label: string;
  title: string;
  icon: React.ReactNode;
  wrap?: [string, string];
  block?: string;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  setValue: (s: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  const newVal =
    textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
  setValue(newVal);
  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = end + before.length;
  }, 0);
}

function insertLine(
  textarea: HTMLTextAreaElement,
  prefix: string,
  setValue: (s: string) => void
) {
  const start = textarea.selectionStart;
  // Find start of line
  const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1;
  const newVal =
    textarea.value.slice(0, lineStart) + prefix + textarea.value.slice(lineStart);
  setValue(newVal);
  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = textarea.selectionEnd + prefix.length;
  }, 0);
}

const tools: ToolAction[] = [
  {
    label: "B",
    title: "Bold",
    icon: <span className="font-black text-base">B</span>,
    wrap: ["**", "**"],
  },
  {
    label: "I",
    title: "Italic",
    icon: <span className="italic font-semibold text-base">I</span>,
    wrap: ["*", "*"],
  },
  {
    label: "~~",
    title: "Strikethrough",
    icon: <span className="line-through text-sm">S</span>,
    wrap: ["~~", "~~"],
  },
  {
    label: ">!",
    title: "Spoiler",
    icon: <span className="text-xs font-bold bg-slate-800 text-slate-800 hover:text-white px-1 rounded transition-colors">Spoiler</span>,
    wrap: [">!", "!<"],
  },
  {
    label: "`",
    title: "Inline Code",
    icon: <code className="text-xs font-mono bg-slate-200 px-1 rounded">`c`</code>,
    wrap: ["`", "`"],
  },
  {
    label: "```",
    title: "Code Block",
    icon: <code className="text-xs font-mono">{"</>"}  </code>,
    wrap: ["```\n", "\n```"],
  },
  {
    label: "#",
    title: "Heading",
    icon: <span className="font-black text-base">H</span>,
    block: "## ",
  },
  {
    label: "-",
    title: "Bullet list",
    icon: <span className="text-base">• —</span>,
    block: "- ",
  },
  {
    label: ">",
    title: "Quote",
    icon: <span className="text-base font-bold text-slate-400 border-l-2 border-slate-400 pl-1">❝</span>,
    block: "> ",
  },
  {
    label: "---",
    title: "Horizontal Rule",
    icon: <span className="text-xs text-slate-500">— —</span>,
    wrap: ["\n\n---\n\n", ""],
  },
  {
    label: "link",
    title: "Link",
    icon: <span className="text-xs font-bold underline text-blue-600">URL</span>,
    wrap: ["[", "](url)"],
  },
];

export default function MarkdownEditor({
  initialValue = "",
  name = "content",
}: {
  initialValue?: string;
  name?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTool = useCallback(
    (tool: ToolAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (tool.wrap) {
        wrapSelection(textarea, tool.wrap[0], tool.wrap[1], setValue);
      } else if (tool.block) {
        insertLine(textarea, tool.block, setValue);
      }
    },
    []
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            onClick={() => handleTool(tool)}
            className="px-2 py-1.5 rounded-md hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors min-w-[28px] text-center"
          >
            {tool.icon}
          </button>
        ))}
        <div className="ml-auto flex border border-slate-200 rounded-lg overflow-hidden text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`px-3 py-1.5 transition-colors ${tab === "write" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1.5 transition-colors ${tab === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full min-h-[400px] px-5 py-4 text-sm font-mono leading-7 text-slate-800 resize-y focus:outline-none bg-white"
          placeholder="Write your story here... (Markdown supported)&#10;&#10;**bold**, *italic*, `code`, > quote, ## heading, - bullet"
          spellCheck
        />
      ) : (
        <div className="min-h-[400px] px-5 py-4 bg-white">
          {value ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="text-slate-400 italic text-sm">Nothing to preview yet…</p>
          )}
        </div>
      )}

      {/* Hidden input for form */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
