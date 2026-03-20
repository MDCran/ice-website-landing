export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ═══ Force dark mode on /access pages ═══
   Use html[data-theme] prefix for specificity >= [data-theme="light"] rules in globals.css */
html { color-scheme: dark !important; }

/* Lock CSS variables to dark values regardless of data-theme */
html, html[data-theme], html[data-theme="dark"], html[data-theme="light"] {
  --bg-primary: #020617 !important; --bg-secondary: #0a1020 !important; --bg-tertiary: #0f1729 !important;
  --text-primary: #e2e8f0 !important; --text-secondary: #94a3b8 !important; --text-muted: #64748b !important;
  --glass-bg: rgba(10,16,32,0.5) !important; --glass-border: rgba(4,155,251,0.08) !important;
  --glass-border-hover: rgba(4,155,251,0.25) !important; --nav-bg: rgba(2,6,23,0.88) !important;
  --card-bg: rgba(255,255,255,0.02) !important; --card-border: rgba(255,255,255,0.06) !important;
}

/* Body */
html[data-theme] body { background: #020617 !important; color: #e2e8f0 !important; }

/* Glass cards — match specificity of [data-theme="light"] .glass-card in globals */
html[data-theme] .glass-card { background: rgba(10,16,32,0.5) !important; border-color: rgba(4,155,251,0.08) !important; box-shadow: 0 1px 2px rgba(0,0,0,0.3) !important; }
html[data-theme] .glass-card:hover { border-color: rgba(4,155,251,0.25) !important; box-shadow: 0 0 30px rgba(4,155,251,0.08), 0 0 60px rgba(4,155,251,0.04), inset 0 1px 0 rgba(255,255,255,0.05) !important; }
html[data-theme] .glass-card-static { background: rgba(10,16,32,0.5) !important; border-color: rgba(4,155,251,0.08) !important; }

/* Icon containers — force dark tinted backgrounds */
html[data-theme] .bg-sky-400\\/10 { background-color: rgb(56 189 248 / 0.1) !important; }
html[data-theme] .bg-sky-500\\/10 { background-color: rgb(14 165 233 / 0.1) !important; }
html[data-theme] .bg-white\\/\\[0\\.02\\] { background-color: rgba(255,255,255,0.02) !important; }
html[data-theme] .bg-white\\/\\[0\\.03\\] { background-color: rgba(255,255,255,0.03) !important; }
html[data-theme] .bg-white\\/\\[0\\.04\\] { background-color: rgba(255,255,255,0.04) !important; }
html[data-theme] .bg-white\\/\\[0\\.06\\] { background-color: rgba(255,255,255,0.06) !important; }

/* Login input */
html[data-theme] .login-input { background-color: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; }
html[data-theme] .login-input::placeholder { color: #64748b !important; }

/* Text colors — prevent any light mode text overrides */
html[data-theme] main .text-white,
html[data-theme] .section-padding .text-white,
html[data-theme] .grid-pattern .text-white,
html[data-theme] main > section .text-white { color: #fff !important; }
html[data-theme] main .text-slate-300, html[data-theme] main > section .text-slate-300 { color: #cbd5e1 !important; }
html[data-theme] main .text-slate-400, html[data-theme] main > section .text-slate-400 { color: #94a3b8 !important; }
html[data-theme] main .text-slate-500, html[data-theme] main > section .text-slate-500 { color: #64748b !important; }
html[data-theme] main .text-slate-600, html[data-theme] main > section .text-slate-600 { color: #475569 !important; }
html[data-theme] main .text-sky-400, html[data-theme] main > section .text-sky-400 { color: #38bdf8 !important; }
html[data-theme] main .text-emerald-400 { color: #34d399 !important; }
html[data-theme] main .text-red-400 { color: #f87171 !important; }
html[data-theme] main .text-amber-400 { color: #fbbf24 !important; }

/* Borders and dividers */
html[data-theme] main .border-white\\/10,
html[data-theme] main .border-white\\/5,
html[data-theme] main .divide-white\\/5 > * + * { border-color: rgba(255,255,255,0.1) !important; }

/* Gradient text */
html[data-theme] .gradient-text { -webkit-text-fill-color: transparent !important; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; }

/* Hero overlay */
html[data-theme] .hero-overlay { background: linear-gradient(180deg, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.85) 60%, #020617 100%) !important; }
html[data-theme] .grid-pattern { opacity: 0.3 !important; }

/* Tables */
html[data-theme] main table { color: inherit !important; }
html[data-theme] main th { color: #94a3b8 !important; }
html[data-theme] main td { color: inherit !important; }
html[data-theme] main .hover\\:bg-white\\/\\[0\\.02\\]:hover { background-color: rgba(255,255,255,0.02) !important; }

/* Buttons */
html[data-theme] .btn-primary { background: linear-gradient(135deg, #0ea5e9, #6366f1) !important; color: #fff !important; }

/* Nav blur (in case header renders) */
html[data-theme] .nav-blur { background: rgba(2,6,23,0.88) !important; }

/* Section backgrounds */
html[data-theme] main > section { background: transparent !important; }
html[data-theme] .bg-\\[\\#020617\\] { background: #020617 !important; }

/* Scan line — keep dark */
html[data-theme] .scan-line::after { background: linear-gradient(transparent 50%, rgba(0,0,0,0.02) 50%) !important; }

/* ═══════════════════════════════════════════════════════
   PRINT STYLES — colored dark-mode PDF
   ═══════════════════════════════════════════════════════ */
@media print {
  /* Force colored backgrounds in print */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }

  /* Top/bottom page margins give per-page spacing; html bg fills them.
     First page (cover) gets no margins so it bleeds edge-to-edge. */
  @page { margin: 2cm 0; size: letter; }
  @page :first { margin: 0; }

  /* ── Hide UI ── */
  button, aside, .fixed, .absolute.z-\\[100\\],
  .cursor-glow, .noise-overlay, .scan-line::after,
  .grid-pattern, .ambient-orb, .animate-float { display: none !important; visibility: hidden !important; }

  /* ── Base — body MUST be transparent so html bg fills page margins ── */
  html, html[data-theme], html[data-theme="dark"], html[data-theme="light"] { background: #020617 !important; }
  body, html[data-theme] body, html[data-theme="dark"] body { background: transparent !important; color: #e2e8f0 !important; overflow: visible !important; height: auto !important; margin: 0 !important; padding: 0 !important; }

  /* ── Layout ── */
  main { min-height: auto !important; }
  main > div.flex { display: block !important; padding: 0 !important; gap: 0 !important; }
  [data-doc-content] { max-width: 100% !important; width: 100% !important; padding: 0 0.76in !important; background: #020617 !important; }
  .mx-auto.max-w-7xl { max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }

  /* ══ COVER PAGE ══ */
  #pdf-cover {
    position: relative !important;
    min-height: 0 !important;
    height: 100vh !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: #020617 !important;
    page-break-after: always !important;
    break-after: page !important;
    overflow: hidden !important;
  }
  /* Hide video, show the print-only cover image */
  #pdf-cover video { display: none !important; }
  .print-cover-bg {
    display: block !important;
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    z-index: 0 !important;
  }
  /* Dark overlay so text is readable over the image */
  #pdf-cover .hero-overlay {
    position: absolute !important; inset: 0 !important; z-index: 1 !important;
    background: linear-gradient(180deg, rgba(2,6,23,0.5) 0%, rgba(2,6,23,0.65) 40%, rgba(2,6,23,0.85) 100%) !important;
    display: block !important;
  }
  /* Cover content wrapper — position relative so we can absolutely place elements */
  .pdf-cover-content {
    position: relative !important; z-index: 10 !important;
    width: 100% !important; height: 100vh !important;
    padding: 0 1in !important; margin: 0 !important;
    text-align: center !important;
  }
  /* Title — absolutely centered vertically and horizontally, ignoring meta/date */
  .pdf-cover-title {
    position: absolute !important;
    top: 50% !important; left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 80% !important;
  }
  .pdf-cover-title h1 { font-size: 3.2rem !important; line-height: 1.15 !important; }
  .pdf-cover-title p { font-size: 0.75rem !important; }
  /* Prepared for/by — positioned near bottom */
  .pdf-cover-meta {
    position: absolute !important;
    bottom: 1.5in !important; left: 0 !important; right: 0 !important;
    margin: 0 !important; padding: 0 1in !important;
  }
  /* Date — at the very bottom center */
  .pdf-cover-date {
    position: absolute !important;
    bottom: 0.75in !important; left: 0 !important; right: 0 !important;
    margin: 0 !important;
  }

  /* ══ CONTENT FLOW ══ */
  section[data-page] { padding: 0.6cm 0 !important; margin: 0 !important; page-break-inside: auto !important; }
  section:not([data-page]):not(#pdf-cover) { padding: 0.4cm 0 !important; margin: 0 !important; }
  .space-y-20 > * + * { margin-top: 1rem !important; }
  .py-16 { padding-top: 0.6cm !important; padding-bottom: 0 !important; }

  /* Headings: NEVER split across pages, always stay with following content */
  h1, h2, h3, h4 { page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: avoid !important; break-after: avoid !important; }
  .mb-8 { page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: avoid !important; break-after: avoid !important; margin-bottom: 0.4rem !important; }
  .mt-8 { margin-top: 0.6rem !important; }
  .scroll-mt-24 { scroll-margin-top: 0 !important; page-break-inside: avoid !important; break-inside: avoid !important; }
  /* SectionHeading wrapper (div with id + h2 + divider) — keep together */
  div.mb-8.scroll-mt-24 { page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: avoid !important; break-after: avoid !important; }
  /* Kill extra spacing from section padding classes */
  .section-padding { padding: 0 !important; }

  /* Glass cards, tables, grids, images: keep together — don't split across pages */
  .glass-card, .glass-card-static { background: rgba(10,16,32,0.8) !important; border: 1px solid rgba(4,155,251,0.15) !important; page-break-inside: avoid !important; break-inside: avoid !important; }
  table { page-break-inside: avoid !important; break-inside: avoid !important; }
  .grid { page-break-inside: avoid !important; break-inside: avoid !important; }
  tr { page-break-inside: avoid !important; break-inside: avoid !important; }
  li { page-break-inside: avoid !important; break-inside: avoid !important; }
  ul { page-break-inside: avoid !important; break-inside: avoid !important; }
  p { orphans: 3 !important; widows: 3 !important; }
  .border-l-amber-400\\/60 { page-break-inside: avoid !important; break-inside: avoid !important; }

  /* Grids: preserve column layout */
  .grid-cols-1.md\\:grid-cols-3, .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
  .grid-cols-1.sm\\:grid-cols-2, .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
  .sm\\:flex-row { flex-direction: row !important; }

  /* Overflow */
  .overflow-x-auto { overflow: visible !important; }

  /* Images */
  img:not(.print-cover-bg) { max-width: 100% !important; page-break-inside: avoid !important; break-inside: avoid !important; }

  /* ── Colors ── */
  .text-white { color: #fff !important; }
  .text-slate-300 { color: #cbd5e1 !important; }
  .text-slate-400 { color: #94a3b8 !important; }
  .text-slate-500 { color: #64748b !important; }
  .text-sky-400 { color: #38bdf8 !important; }
  .text-emerald-400 { color: #34d399 !important; }
  .text-amber-400 { color: #fbbf24 !important; }
  .text-red-400 { color: #f87171 !important; }
  .font-mono { font-family: ui-monospace, monospace !important; }
  .gradient-text { -webkit-text-fill-color: transparent !important; background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc) !important; -webkit-background-clip: text !important; background-clip: text !important; }
  .bg-sky-400\\/10 { background: rgba(56,189,248,0.1) !important; }
  .bg-sky-500\\/10 { background: rgba(14,165,233,0.1) !important; }
  .btn-primary { background: linear-gradient(135deg, #0ea5e9, #6366f1) !important; color: #fff !important; padding: 0.6rem 1.5rem !important; border-radius: 0.75rem !important; display: inline-flex !important; }
  .border-white\\/10, .border-white\\/5 { border-color: rgba(255,255,255,0.1) !important; }
  .divide-white\\/5 > * + * { border-color: rgba(255,255,255,0.1) !important; }
  .border-l-4 { border-left-width: 4px !important; }
  a { text-decoration: none !important; color: inherit !important; }

  /* Show/hide web vs print content */
  .print-hide { display: none !important; }
  .print-show { display: block !important; page-break-inside: avoid !important; break-inside: avoid !important; }
  /* Cover: swap web layout for PDF layout */
  .pdf-cover-meta-web { display: none !important; }
  .pdf-cover-meta-print { display: block !important; }

  /* Signature box in print — keep together, never split across pages */
  .print-show .bg-white { background: #ffffff !important; color: #0f172a !important; }
  .print-show .text-slate-500 { color: #64748b !important; }
  .print-show .border-slate-300 { border-color: #cbd5e1 !important; }
  .print-show .rounded-xl { page-break-inside: avoid !important; break-inside: avoid !important; }

  /* Proposal acceptance section — keep entire section together */
  section[data-page="22"] { page-break-inside: avoid !important; break-inside: avoid !important; }
}
`,
        }}
      />
      {children}
    </>
  );
}
