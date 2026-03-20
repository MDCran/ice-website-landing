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
/* Force dark mode on access pages — override any light theme leaking from globals */
html { color-scheme: dark !important; }
html[data-theme] { --bg-primary: #020617 !important; --bg-secondary: #0a1020 !important; --bg-tertiary: #0f1729 !important; --text-primary: #e2e8f0 !important; --text-secondary: #94a3b8 !important; --text-muted: #64748b !important; --glass-bg: rgba(10,16,32,0.5) !important; --glass-border: rgba(4,155,251,0.08) !important; --glass-border-hover: rgba(4,155,251,0.25) !important; --nav-bg: rgba(2,6,23,0.88) !important; --card-bg: rgba(255,255,255,0.02) !important; --card-border: rgba(255,255,255,0.06) !important; }
body { background: #020617 !important; color: #e2e8f0 !important; }
.glass-card, .glass-card-static { background: rgba(10,16,32,0.5) !important; border-color: rgba(4,155,251,0.08) !important; }
.glass-card:hover { border-color: rgba(4,155,251,0.25) !important; }
.login-input { background-color: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important; }
.login-input::placeholder { color: #64748b !important; }
/* Text colors — prevent light mode overrides */
main .text-white, .section-padding .text-white, .grid-pattern .text-white { color: #fff !important; }
main .text-slate-300 { color: #cbd5e1 !important; }
main .text-slate-400 { color: #94a3b8 !important; }
main .text-slate-500 { color: #64748b !important; }
main .text-slate-600 { color: #475569 !important; }
main .text-sky-400 { color: #38bdf8 !important; }
main .text-emerald-400 { color: #34d399 !important; }
main .text-red-400 { color: #f87171 !important; }
main .text-amber-400 { color: #fbbf24 !important; }
/* Borders and dividers */
main .border-white\\/10, main .border-white\\/5, main .divide-white\\/5 > * + * { border-color: rgba(255,255,255,0.1) !important; }
/* Gradient text */
.gradient-text { -webkit-text-fill-color: transparent !important; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; }
/* Hero overlay */
.hero-overlay { background: linear-gradient(180deg, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.85) 60%, #020617 100%) !important; }
/* Tables */
main table { color: inherit !important; }
main th { color: #94a3b8 !important; }
main td { color: inherit !important; }
/* Button */
.btn-primary { background: linear-gradient(135deg, #0ea5e9, #6366f1) !important; color: #fff !important; }
`,
        }}
      />
      {children}
    </>
  );
}
