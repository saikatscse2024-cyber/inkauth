import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-stone-700 hover:text-indigo-700 transition-colors font-semibold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to StoryRealm
        </Link>
        <span className="text-stone-400 text-sm font-medium">Support</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex w-16 h-16 bg-indigo-50 rounded-2xl items-center justify-center mb-6 border border-indigo-100">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight mb-4" style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}>
            How can we help?
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto leading-relaxed">
            Find answers to common questions or get in touch with our team below.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-stone-800 hover:text-indigo-700 transition-colors list-none">
                {faq.q}
                <svg className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-stone-600 leading-relaxed text-[0.95rem] border-t border-stone-100 pt-4 mt-1">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-10 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-3" style={{ fontFamily: "var(--font-lora, Georgia, serif)" }}>
            Still need help?
          </h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Our support team is happy to assist you. Reach out and we'll get back to you as soon as possible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@storyrealm.io"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Library
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const faqs = [
  {
    q: "How do I start reading a story?",
    a: "Simply browse the library on the homepage, click on any book cover to view its details, then click 'Start Reading' or choose a specific chapter from the table of contents.",
  },
  {
    q: "Can I read stories on my phone?",
    a: "Yes! StoryRealm is fully responsive and optimized for mobile reading. The comfortable serif font and generous line spacing make it a pleasure to read on any screen size.",
  },
  {
    q: "What Markdown formatting is supported in stories?",
    a: "Stories support full Markdown including **bold**, *italic*, ~~strikethrough~~, `inline code`, code blocks, blockquotes (> quote), headings (## Heading), bullet lists, and links.",
  },
  {
    q: "How do I report an issue with a story?",
    a: "Please use the Email Support button below or reach out via our contact email. Include the story title and chapter number so we can address it quickly.",
  },
  {
    q: "I'm an admin — how do I add a new story?",
    a: "Go to /admin/login and sign in with your Admin ID and Secret Key from your .env file. From the dashboard you can add stories, upload cover URLs, write chapters using the built-in Markdown editor.",
  },
];
