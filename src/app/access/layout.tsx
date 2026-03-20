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
`,
        }}
      />
      {children}
    </>
  );
}
