"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Lock,
  Shield,
  Server,
  Cloud,
  Database,
  HardDrive,
  CheckCircle,
  ArrowRight,
  Clock,
  Cpu,
  Monitor,
  RefreshCw,
  Layers,
  ShieldCheck,
  Zap,
  FileText,
  Users,
  Building2,
  AlertTriangle,
  ChevronDown,
  Download,
  Search,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

const PASSWORD = "Carico2026";
const STORAGE_KEY = "carico-access-granted";

/* ──────────────────────────────────────────────────── */
/*  Password Gate                                       */
/* ──────────────────────────────────────────────────── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/10 mb-6">
          <Lock className="w-8 h-8 text-sky-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Protected Document</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Enter the access code to view this proposal.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Access Code"
              autoFocus
              className="login-input w-full px-4 py-3 pr-12 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-sky-400 transition-colors cursor-pointer"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm">Incorrect access code. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-colors"
          >
            Unlock Document
          </button>
        </form>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  Section Components                                  */
/* ──────────────────────────────────────────────────── */

function SectionHeading({ children, sub, id }: { children: React.ReactNode; sub?: string; id?: string }) {
  return (
    <div className="mb-8 scroll-mt-24" id={id}>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{children}</h2>
      {sub && <p className="text-slate-400 text-lg">{sub}</p>}
      <div className="mt-4 h-px bg-gradient-to-r from-sky-400/40 via-sky-400/10 to-transparent" />
    </div>
  );
}

/* ── Table of Contents data ── */
const TOC_ITEMS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "solution-overview", label: "Solution Overview" },
  { id: "about-ice", label: "About ICE" },
  { id: "drivers", label: "Drivers for Modernization" },
  { id: "current-environment", label: "Current Environment" },
  { id: "lifecycle", label: "Infrastructure Lifecycle" },
  { id: "architecture", label: "Architecture Overview" },
  { id: "strategic-outcomes", label: "Strategic Outcomes" },
  { id: "proposed-solution", label: "Proposed Hosting Solution" },
  { id: "managed-services", label: "IBM i Managed Services" },
  { id: "managed-services-mrs", label: "Managed Services (MRS)" },
  { id: "backup-services", label: "Backup Services (MRS)" },
  { id: "hosting-environment", label: "Hosting Environment" },
  { id: "resource-allocation", label: "Resource Allocation" },
  { id: "dr-resource-allocation", label: "DR Resource Allocation" },
  { id: "nrs", label: "Non-Recurring Services" },
  { id: "migration-timeline", label: "Migration Timeline" },
  { id: "investment-summary", label: "Investment Summary" },
  { id: "implementation", label: "Implementation Approach" },
  { id: "assumptions", label: "Assumptions & Conditions" },
];

/* ── Sidebar TOC + Search ── */
function DocSidebar({ activeId }: { activeId: string }) {
  const [query, setQuery] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  // Search through document text and highlight/scroll to matches
  const doSearch = useCallback((searchText: string, jumpToIndex?: number) => {
    // Clear previous highlights
    document.querySelectorAll("mark.doc-search-hl").forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        parent.normalize();
      }
    });

    if (!searchText.trim()) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    const contentEl = document.querySelector("[data-doc-content]");
    if (!contentEl) return;

    const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent && node.textContent.trim()) textNodes.push(node);
    }

    const lower = searchText.toLowerCase();
    let count = 0;
    const marks: HTMLElement[] = [];

    for (const textNode of textNodes) {
      const text = textNode.textContent || "";
      const idx = text.toLowerCase().indexOf(lower);
      if (idx === -1) continue;

      const before = text.substring(0, idx);
      const match = text.substring(idx, idx + searchText.length);
      const after = text.substring(idx + searchText.length);

      const mark = document.createElement("mark");
      mark.className = "doc-search-hl rounded px-0.5 bg-sky-400/30 text-white";
      mark.textContent = match;

      const parent = textNode.parentNode;
      if (!parent) continue;

      if (before) parent.insertBefore(document.createTextNode(before), textNode);
      parent.insertBefore(mark, textNode);
      if (after) parent.insertBefore(document.createTextNode(after), textNode);
      parent.removeChild(textNode);

      marks.push(mark);
      count++;
    }

    setMatchCount(count);
    const targetIdx = jumpToIndex ?? 0;
    setCurrentMatch(Math.min(targetIdx, count - 1));

    if (marks.length > 0) {
      const target = marks[Math.min(targetIdx, marks.length - 1)];
      target.className = "doc-search-hl rounded px-0.5 bg-sky-400/80 text-white";
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Search as user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const nextMatch = () => {
    if (matchCount === 0) return;
    const next = (currentMatch + 1) % matchCount;
    doSearch(query, next);
  };

  const prevMatch = () => {
    if (matchCount === 0) return;
    const prev = (currentMatch - 1 + matchCount) % matchCount;
    doSearch(query, prev);
  };

  // Cleanup highlights on unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll("mark.doc-search-hl").forEach((el) => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ""), el);
          parent.normalize();
        }
      });
    };
  }, []);

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* Search — always visible */}
        <div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search document..."
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg pl-8 pr-8 py-2 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {query && matchCount > 0 && (
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-[10px] text-slate-500">{currentMatch + 1} of {matchCount}</span>
              <div className="flex items-center gap-1">
                <button onClick={prevMatch} className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer">&uarr;</button>
                <button onClick={nextMatch} className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer">&darr;</button>
              </div>
            </div>
          )}
          {query && matchCount === 0 && (
            <p className="text-[10px] text-slate-600 mt-1.5 px-1">No matches</p>
          )}
        </div>

        {/* TOC */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-400 mb-3">Contents</p>
          <nav className="space-y-0.5">
            {TOC_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-[11px] leading-relaxed py-1 border-l-2 pl-3 transition-all duration-200 ${
                  activeId === item.id
                    ? "text-sky-400 border-sky-400 font-semibold"
                    : "text-slate-500 border-white/[0.06] hover:text-sky-400 hover:border-sky-400/40"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold text-sky-400 mb-4 mt-8">{children}</h3>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="text-slate-300 leading-[1.8] text-[15px] space-y-4">{children}</div>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-300 text-[15px]">
          <CheckCircle className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
          <Icon className="h-5 w-5" />
        </div>
        <h4 className="text-white font-semibold">{title}</h4>
      </div>
      <div className="text-slate-400 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ComparisonTable({ rows }: { rows: { category: string; current: string; proposed: string }[] }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-red-400/80 uppercase tracking-wider">Current Environment</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Proposed Platform</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-white font-medium">{r.category}</td>
              <td className="px-4 py-3 text-slate-400">{r.current}</td>
              <td className="px-4 py-3 text-emerald-400">{r.proposed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResourceTable({ title, rows }: { title: string; rows: { qty: string; desc: string }[] }) {
  return (
    <div className="my-6">
      {title && <h4 className="text-white font-semibold mb-3">{title}</h4>}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Qty</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-sky-400 font-mono font-semibold">{r.qty}</td>
                <td className="px-4 py-3 text-slate-300">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  Main Proposal Content                               */
/* ──────────────────────────────────────────────────── */

function ProposalContent() {
  const [activeId, setActiveId] = useState(TOC_ITEMS[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);


  return (
    <main className="min-h-screen">
      {/* ═══ HERO / COVER ═══ */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/data_center.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative z-10 text-center px-6 pt-20 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400 mb-4">Infrastructure Modernization Proposal</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Enterprise IBM i Hosting<br />
              <span className="gradient-text">and Disaster Recovery Platform</span>
            </h1>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-400">
              <span>Prepared For <strong className="text-white">Carico International Inc.</strong></span>
              <span className="hidden sm:block">|</span>
              <span>Prepared By <strong className="text-white">International Computer Exchange</strong></span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span>David Cran &middot; dcran@icesales.com &middot; 561-394-9189</span>
              <span>March 17, 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex gap-10">
        {/* Main content */}
        <div ref={contentRef} data-doc-content className="flex-1 min-w-0 space-y-20">

        {/* ═══ EXECUTIVE SUMMARY ═══ */}
        <section>
          <SectionHeading id="executive-summary" sub="Overview of the Proposed IBM i Infrastructure Modernization">EXECUTIVE SUMMARY</SectionHeading>
          <Prose>
            <p>International Computer Exchange (ICE) proposes transitioning Carico International&apos;s IBM i environment to a fully managed hosted platform that includes production hosting, enterprise-class storage, managed backup services, and a geographically separate disaster recovery system. This architecture delivers enterprise-grade reliability, security, and operational simplicity, supported by ICE&apos;s experienced IBM i specialists responsible for ongoing operations, monitoring, and lifecycle management.</p>
            <p>Carico International currently operates its IBM i environment on-premises using IBM Power9 infrastructure, with a secondary IBM Power9 system located at a nearby disaster recovery facility within the same metropolitan region. IBM has announced that the Power9 9009-41A platform reached the end of its standard service lifecycle on January 31, 2026, requiring planning for future infrastructure replacement.</p>
            <p>The proposed solution replaces the existing environment with a hosted IBM i production platform and a fully provisioned disaster recovery system utilizing near real-time SAN replication. By operating from geographically independent enterprise data centers, the solution strengthens resilience against regional disruptions while improving recovery readiness.</p>
          </Prose>
          <div className="mt-6 mb-4 text-white font-semibold">The solution includes:</div>
          <BulletList items={[
            "Hosted IBM i production environment",
            "Standby IBM Power10 disaster recovery system with near real-time SAN replication",
            "Managed VTL backup infrastructure",
            "Enterprise data center hosting",
            "24x7 monitoring and operational support",
            "Annual disaster recovery testing",
            "Infrastructure lifecycle management",
          ]} />
          <Prose>
            <p>This approach eliminates future IBM Power hardware replacement while providing a scalable platform for growth. By transitioning to a hosted model, Carico International replaces unpredictable hardware investments with a predictable operational service model while improving overall infrastructure resilience and reliability.</p>
            <p>This fully integrated approach delivers consistent performance, simplified management, and cost efficiency that is not achievable when these components are implemented separately. It also reduces the need for internal IT resources to manage infrastructure, backup, and disaster recovery operations.</p>
          </Prose>
        </section>

        {/* ═══ SOLUTION OVERVIEW ═══ */}
        <section>
          <SectionHeading id="solution-overview" sub="IBM i Hosted Platform with Enterprise Disaster Recovery">SOLUTION OVERVIEW</SectionHeading>
          <Prose>
            <p>International Computer Exchange (ICE) delivers a hosted IBM i infrastructure platform designed to support Carico International&apos;s ERP environment on enterprise-class infrastructure while improving resiliency and eliminating future on-premises IBM Power hardware replacement.</p>
            <p>The ICE platform combines Infrastructure-as-a-Service (IaaS) with IBM i Managed Services to deliver a fully managed IBM i platform that includes production infrastructure, enterprise storage, managed backup services, and a standby disaster recovery system provisioned with production-equivalent capacity in a geographically separate enterprise data center.</p>
            <p>Unlike traditional tape-based recovery methods, the ICE platform includes a standby IBM Power10 disaster recovery system with production-equivalent capacity. Production data is continuously replicated using near real-time SAN-to-SAN replication, allowing the disaster recovery system to be brought online using replicated storage volumes in the event of a disruption.</p>
            <p>This architecture modernizes Carico International&apos;s ERP platform, improving resiliency and simplifying long-term infrastructure management.</p>
          </Prose>

          <SubHeading>Platform Components</SubHeading>
          <Prose><p>The hosted platform consists of three primary components designed to deliver resiliency, operational simplicity, and predictable infrastructure performance.</p></Prose>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <InfoCard icon={Server} title="Production Environment">
              <ul className="space-y-1.5 mt-2">
                <li>IBM Power10 hosted IBM i LPAR</li>
                <li>Enterprise SAN storage</li>
                <li>Managed VTL backup system</li>
                <li>Secure network connectivity and firewall infrastructure</li>
                <li>Enterprise data center hosting</li>
              </ul>
            </InfoCard>
            <InfoCard icon={Shield} title="Disaster Recovery Environment">
              <ul className="space-y-1.5 mt-2">
                <li>Standby IBM Power10 system provisioned with identical compute, memory, and storage capacity as production</li>
                <li>SAN-to-SAN replication between production and disaster recovery environments</li>
                <li>Standby IBM Power10 system prepared for disaster recovery using replicated SAN storage volumes</li>
                <li>Annual disaster recovery testing</li>
              </ul>
            </InfoCard>
            <InfoCard icon={Monitor} title="ICE Managed Services">
              <ul className="space-y-1.5 mt-2">
                <li>24&times;7 monitoring and operational support</li>
                <li>IBM i operating system lifecycle management and PTF maintenance</li>
                <li>Backup monitoring and restore support</li>
                <li>Infrastructure and security maintenance</li>
                <li>Disaster recovery readiness management</li>
              </ul>
            </InfoCard>
          </div>

          <SubHeading>Business Outcomes</SubHeading>
          <Prose><p>The proposed ICE IBM i Hosted Platform provides several key operational and infrastructure advantages:</p></Prose>
          <BulletList items={[
            "Improves disaster recovery readiness through near real-time SAN replication",
            "Eliminates future IBM Power hardware purchases",
            "Reduces internal IT workload by transferring infrastructure and operations to ICE specialists",
            "Moves infrastructure to geographically resilient, SOC-aligned enterprise data centers",
            "Provides a fully provisioned standby IBM Power10 system ready for disaster recovery use",
            "Simplifies infrastructure management through managed services",
            "Provides predictable monthly infrastructure costs",
            "Dedicated project management oversight during migration and implementation",
          ]} />

          <SubHeading>Result</SubHeading>
          <Prose><p>Carico International gains a modern IBM i infrastructure platform capable of supporting current business operations while improving disaster recovery resiliency, simplifying infrastructure and operational management, and eliminating the need for future on-premises infrastructure lifecycle and replacement planning.</p></Prose>
        </section>

        {/* ═══ ABOUT ICE ═══ */}
        <section>
          <SectionHeading id="about-ice">ABOUT INTERNATIONAL COMPUTER EXCHANGE</SectionHeading>
          <Prose>
            <p>International Computer Exchange (ICE), established in 1990, is an IBM Business Partner specializing in IBM Power Systems infrastructure, IBM i hosting, disaster recovery, and managed services.</p>
            <p>For more than three decades, ICE has supported organizations that rely on IBM i to operate critical business systems, providing infrastructure platforms designed for reliability, security, and long-term operational stability.</p>
            <p>ICE hosted platforms operate from multiple enterprise-grade data centers designed for high availability and resiliency. These facilities provide redundant power, cooling, and network infrastructure and operate in accordance with SOC-audited standards including SOC 1 and SOC 2.</p>
          </Prose>
        </section>

        {/* ═══ DRIVERS ═══ */}
        <section>
          <SectionHeading id="drivers">DRIVERS FOR INFRASTRUCTURE MODERNIZATION</SectionHeading>
          <Prose><p>Several factors make this an appropriate time for Carico International to modernize its IBM i infrastructure.</p></Prose>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <InfoCard icon={AlertTriangle} title="IBM Power9 Lifecycle Status">
              IBM announced that the Power9 9009-41A platform reached the end of its standard service lifecycle on January 31, 2026. Continuing to operate this infrastructure beyond its supported lifecycle increases operational risk and limits access to hardware service and replacement components.
            </InfoCard>
            <InfoCard icon={RefreshCw} title="Disaster Recovery Architecture Limitations">
              The current disaster recovery architecture relies on manual tape restoration procedures and infrastructure located within the same metropolitan region as the production environment. Modern infrastructure platforms utilize geographically separated data centers and automated replication technologies to improve disaster recovery readiness and reduce regional risk.
            </InfoCard>
            <InfoCard icon={Layers} title="Infrastructure Cost and Operational Model">
              Transitioning to a hosted IBM i platform replaces capital hardware investments, infrastructure maintenance, and colocation facilities with a predictable monthly service model while providing access to enterprise-class infrastructure and managed services.
            </InfoCard>
          </div>
          <Prose><p className="mt-6">Modernizing the platform at this stage allows Carico International to improve resiliency, simplify infrastructure management, and avoid future on-premises hardware replacement projects.</p></Prose>
        </section>

        {/* ═══ CURRENT ENVIRONMENT ═══ */}
        <section>
          <SectionHeading id="current-environment" sub="Overview of Carico International's existing IBM Power infrastructure and disaster recovery model">CURRENT ENVIRONMENT OVERVIEW</SectionHeading>
          <Prose>
            <p>Carico International currently operates its IBM i environment using IBM Power9 systems deployed within its primary production environment and a secondary disaster recovery facility.</p>
            <p>The current disaster recovery model relies on a cold standby system and tape-based recovery processes located at a nearby Flexential colocation facility in the Fort Lauderdale metropolitan area.</p>
            <p>While this configuration provides an off-site recovery location, both the production and disaster recovery environments reside within the same region. In the event of a large-scale regional disruption such as severe weather, power infrastructure failure, or other metropolitan-area incidents, both locations could potentially be impacted simultaneously.</p>
            <p>Additionally, the current infrastructure requires ongoing hardware and software maintenance and will soon require replacement of both production and disaster recovery systems as part of the normal IBM Power lifecycle.</p>
            <p>As infrastructure platforms reach lifecycle milestones, organizations must evaluate the operational and financial impact of maintaining on-premises hardware versus transitioning to modern hosted infrastructure models.</p>
            <p>Modern hosted infrastructure platforms typically utilize geographically separated data centers to reduce regional risk and improve disaster recovery resiliency.</p>
          </Prose>

          <SubHeading>Current Infrastructure vs Hosted Platform</SubHeading>
          <Prose><p>The following section summarizes Carico International&apos;s current IBM Power infrastructure environment and associated operational considerations.</p></Prose>

          <h4 className="text-white font-semibold mt-6 mb-3">Current Environment (On-Premises IBM Power Infrastructure)</h4>
          <Prose><p>Carico International currently operates its IBM i platform on-premises using IBM Power9 infrastructure supported by a secondary disaster recovery system located within a nearby colocation facility.</p></Prose>

          <div className="glass-card rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Component</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Monthly Cost</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="px-4 py-3 text-slate-300">IBM Power9 Hardware Maintenance</td><td className="px-4 py-3 text-white font-mono">~$1,400</td></tr>
                <tr><td className="px-4 py-3 text-slate-300">Disaster Recovery Data Center (Flexential)</td><td className="px-4 py-3 text-white font-mono">~$2,700</td></tr>
                <tr><td className="px-4 py-3 text-slate-300">Tape Backup Infrastructure</td><td className="px-4 py-3 text-slate-400">Existing / Operational</td></tr>
                <tr><td className="px-4 py-3 text-slate-300">Disaster Recovery Process</td><td className="px-4 py-3 text-slate-400">Manual Tape Restore</td></tr>
                <tr><td className="px-4 py-3 text-slate-300">Hardware Lifecycle</td><td className="px-4 py-3 text-slate-400">Customer Responsibility</td></tr>
              </tbody>
            </table>
          </div>

          <div className="glass-card rounded-xl p-5 my-4 border-l-4 border-l-amber-400/60">
            <p className="text-white font-semibold mb-1">Estimated Monthly Infrastructure Cost &asymp; $4,100 per month</p>
            <p className="text-slate-400 text-sm">This estimate reflects primary infrastructure expenses for the current on-premise IBM Power environment, including maintenance and colocation services, but does not represent the fully burdened cost of operations, including internal IT labor and administrative overhead.</p>
            <p className="text-amber-400 font-semibold mt-3">Estimated Hardware Replacement Investment $120,000 &ndash; $200,000</p>
            <p className="text-slate-500 text-xs">(Not included in the $4,100 monthly infrastructure estimate above)</p>
          </div>

          <SubHeading>Current Operational Considerations</SubHeading>
          <BulletList items={[
            "IBM Power9 infrastructure has reached end-of-service lifecycle status (January 31, 2026)",
            "Disaster recovery currently relies on manual tape-based restoration procedures",
            "Disaster recovery infrastructure is located within the same metropolitan region as the production environment",
            "Future capital investment will be required to replace production and disaster recovery systems",
          ]} />
        </section>

        {/* ═══ INFRASTRUCTURE LIFECYCLE ═══ */}
        <section>
          <SectionHeading id="lifecycle">INFRASTRUCTURE LIFECYCLE CONSIDERATIONS</SectionHeading>
          <Prose>
            <p>The current IBM Power infrastructure supporting the environment is based on the IBM Power9 platform (IBM Power Systems 9009-41A). IBM announced that this platform reached the end of its standard service lifecycle on January 31, 2026. In addition, Carico International&apos;s current IBM hardware and software maintenance coverage for both IBM Power systems and the associated tape infrastructure is scheduled to expire on July 15, 2026. At that point, Carico International will need to determine whether to continue operating aging infrastructure beyond its supported lifecycle or transition to a modern supported platform.</p>
            <p>Replacing both the production and disaster recovery IBM Power systems with modern IBM Power infrastructure would require a capital investment estimated between $120,000 and $200,000, depending on system configuration, storage requirements, and implementation services.</p>
            <p>This level of capital investment reinforces the value of transitioning to a hosted infrastructure model that replaces future hardware replacement projects with a predictable monthly service structure.</p>
            <p>In addition to hardware lifecycle considerations, many organizations operating IBM i environments also evaluate how to ensure long-term continuity of platform expertise. IBM i, AS/400, and IBM Power environments often rely on specialized operational knowledge that can be difficult to maintain as internal responsibilities evolve. By transitioning to the ICE hosted platform, Carico International gains access to experienced IBM i infrastructure specialists who work alongside internal IT leadership to support ongoing platform operations, monitoring, and maintenance. This model allows internal staff to remain focused on business systems, application strategy, and organizational priorities while ICE provides additional operational depth and platform expertise.</p>
            <p>Enterprise infrastructure platforms such as IBM Power servers typically operate within a 5&ndash;7 year hardware lifecycle before replacement planning becomes necessary.</p>
            <p>The ICE hosted platform replaces this hardware lifecycle model with a fully managed infrastructure platform, eliminating the need for future hardware purchases and ongoing infrastructure replacement planning. This approach allows Carico International to transition to a modern supported platform while improving long-term infrastructure predictability and reducing lifecycle-related operational risk.</p>
          </Prose>
        </section>

        {/* ═══ ARCHITECTURE OVERVIEW ═══ */}
        <section>
          <SectionHeading id="architecture">IBM i CLOUD PLATFORM ARCHITECTURE OVERVIEW</SectionHeading>
          <Prose><p>The following architecture illustrates the ICE IBM i cloud platform design, including the production IBM Power10 environment, SAN-based replication, and a standby disaster recovery system provisioned with production-equivalent capacity in a geographically separate enterprise data center.</p></Prose>

          <div className="glass-card rounded-xl p-6 my-8">
            <h4 className="text-white font-semibold mb-4">Platform Capabilities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "IBM Power Infrastructure",
                "IBM i Hosting Environment",
                "Standby IBM Power10 Disaster Recovery System (Production-Equivalent Capacity)",
                "SAN-Level Replication Between Production and DR Sites",
                "Managed Backup (VTL)",
                "Enterprise Data Center Infrastructure",
                "Monitoring and Managed Services",
                "Infrastructure Lifecycle Management",
              ].map((cap) => (
                <div key={cap} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">{cap}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-slate-400 text-sm">The platform architecture includes both the production IBM i environment and a standby IBM Power10 disaster recovery system provisioned with equivalent compute, memory, and storage capacity to support full recovery of the production workload.</p>
              <p className="text-2xl font-bold text-sky-400 mt-3">Monthly Platform Investment: $7,700 per month</p>
            </div>
          </div>

          <SubHeading>Disaster Recovery Architecture</SubHeading>
          <Prose>
            <p>The ICE disaster recovery solution utilizes near real-time SAN replication between the primary production environment and a secondary data center location. The disaster recovery system is provisioned with compute, memory, and storage resources equivalent to the production environment, enabling the disaster recovery system to support production workloads during a recovery event.</p>
            <p>Production data is replicated at the storage level using near real-time SAN replication between the production and disaster recovery environments.</p>
            <p>In the event of a disaster, replication is paused and the replicated storage volumes are made available to a pre-configured IBM Power10 system within the disaster recovery environment. The system is then started and brought online to provide access to the replicated applications and data.</p>
            <p>The disaster recovery infrastructure is maintained and administered as part of the hosted environment and includes an annual disaster recovery test to validate failover procedures and recovery readiness.</p>
          </Prose>
        </section>

        {/* ═══ STRATEGIC OUTCOMES ═══ */}
        <section>
          <SectionHeading id="strategic-outcomes">STRATEGIC OUTCOMES OF THE HOSTED INFRASTRUCTURE MODEL</SectionHeading>
          <Prose>
            <p>The proposed hosted IBM i platform replaces the current on-premises infrastructure with a fully managed enterprise platform designed to improve resiliency, simplify operations, and eliminate future hardware lifecycle management.</p>
            <p>The following comparison illustrates the operational and infrastructure improvements achieved by transitioning from the current on-premises IBM Power environment to the ICE hosted IBM i platform.</p>
          </Prose>
          <ComparisonTable rows={[
            { category: "Infrastructure Model", current: "On-premises IBM Power (EOS)", proposed: "Hosted IBM Power platform" },
            { category: "Disaster Recovery", current: "Tape-based recovery / cold standby", proposed: "SAN replication + standby IBM Power10" },
            { category: "Operations", current: "Customer Managed", proposed: "ICE Managed" },
            { category: "Talent Dependency", current: "Reliance on internal IBM i expertise", proposed: "Experienced IBM i specialists" },
            { category: "Hardware Lifecycle", current: "Customer Managed", proposed: "Included" },
            { category: "Capital Investment", current: "Estimated hardware ($120k - $200k)", proposed: "No capital investment required" },
            { category: "Infrastructure Cost", current: "Hardware + Software + Facilities", proposed: "Predictable managed service model" },
          ]} />
          <Prose><p>The ICE hosted platform replaces aging on-premises infrastructure with a fully managed enterprise platform that includes production hosting, SAN-replicated disaster recovery, and predictable infrastructure costs.</p></Prose>

          <SubHeading>Key Benefits of the Hosted Platform</SubHeading>
          <BulletList items={[
            "Transitions aging on-premises infrastructure to a modern hosted IBM Power platform",
            "Eliminates future IBM Power hardware purchases and capital investment",
            "Delivers a fully managed IBM i platform operated by experienced ICE specialists",
            "Improves disaster recovery from manual tape restoration to near real-time SAN replication",
            "Provides a fully provisioned standby IBM Power10 DR system ready for production workloads",
            "Moves infrastructure to geographically resilient, SOC-aligned enterprise data centers",
            "Replaces unpredictable infrastructure costs with a predictable monthly service model",
          ]} />
        </section>

        {/* ═══ PROPOSED HOSTING SOLUTION ═══ */}
        <section>
          <SectionHeading id="proposed-solution">PROPOSED HOSTING SOLUTION</SectionHeading>
          <Prose>
            <p>ICE proposes a fully managed IBM i hosting and disaster recovery platform designed to deliver enterprise-grade availability, security, and operational support.</p>
            <p>The proposed platform utilizes geographically separated enterprise data centers to provide improved disaster recovery resiliency and reduce regional infrastructure risk.</p>
            <p>The disaster recovery environment includes a fully provisioned standby IBM Power10 system located in a geographically separate enterprise data center that can be brought online using replicated SAN storage in the event of a disaster.</p>
          </Prose>
          <div className="mt-4 mb-2 text-white font-semibold">The proposed solution includes:</div>
          <BulletList items={[
            "Hosted IBM i production LPAR",
            "Dedicated standby IBM Power10 disaster recovery system with near real-time SAN replication",
            "Standby disaster recovery system provisioned with compute, memory, and storage resources equivalent to the production environment",
            "Managed VTL backup services",
            "Enterprise data center infrastructure with redundant power, cooling, and network connectivity",
            "24x7 infrastructure monitoring and operational support",
            "Annual disaster recovery testing",
          ]} />

          <SubHeading>Migration Management and Implementation Oversight</SubHeading>
          <Prose>
            <p>ICE assigns a dedicated project manager to coordinate the migration and implementation of the hosted IBM i platform. The project manager serves as the primary point of coordination between Carico International, ICE engineering teams, and supporting infrastructure providers throughout the transition process.</p>
            <p>Project management responsibilities include implementation planning, migration readiness validation, infrastructure provisioning coordination, cutover scheduling, and post-migration validation to ensure a controlled and low-risk transition to the hosted platform.</p>
          </Prose>
        </section>

        {/* ═══ MANAGED SERVICES ═══ */}
        <section>
          <SectionHeading id="managed-services">IBM i MANAGED SERVICES</SectionHeading>
          <Prose>
            <p>The ICE IBM i Managed Services platform provides proactive monitoring, operational management, and lifecycle support for the hosted IBM i platform.</p>
            <p>The service ensures system stability, operational visibility, and ongoing maintenance of the IBM i environment.</p>
          </Prose>
          <SubHeading>Key Managed Services Capabilities</SubHeading>
          <BulletList items={[
            "IBM i operating system and PTF lifecycle management",
            "Dedicated IBM i platform specialists",
            "24x7 monitoring of the IBM i environment",
            "Backup monitoring and management",
            "Disk utilization monitoring and alerting",
            "Job monitoring and operational issue detection",
            "System error monitoring and remediation",
            "Security and vulnerability remediation support",
            "Operational troubleshooting support",
          ]} />
        </section>

        {/* ═══ MANAGED SERVICES TABLE ═══ */}
        <section>
          <SectionHeading id="managed-services-mrs">MANAGED SERVICES (MONTHLY RECURRING SERVICE &ndash; MRS)</SectionHeading>
          <div className="glass-card rounded-xl p-6 space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-2">24x7 monitoring of IBM i LPARs, including:</h4>
              <h5 className="text-sky-400 text-sm font-semibold mt-4 mb-2">System Monitoring:</h5>
              <BulletList items={["Last System Save","Installed OS level","PTF Status","PTFs Installed","Total DASD allocated to ASP","Amount of DASD used in ASP"]} />
              <h5 className="text-sky-400 text-sm font-semibold mt-4 mb-2">Operational Monitoring:</h5>
              <BulletList items={[
                "Error reporting for Disk Errors, System Errors, QSYS Message Errors, and Error Logs",
                "Error review and analysis",
                "Identify and report on scheduled jobs that are running longer than expected",
                "Identify jobs that have ended abnormally",
                "Identify and report on sudden or unexpected increases in disk utilization",
                "Monitor, track, and report disk usage (alert when usage exceeds 85%)",
              ]} />
              <h5 className="text-sky-400 text-sm font-semibold mt-4 mb-2">System Administration and Maintenance:</h5>
              <BulletList items={[
                "Review new IBM i OS releases with Customer",
                "Review IBM PTF and cumulative package releases and determine appropriate update schedule (typically N-1).",
                "Assist with, or install, required PTFs quarterly per Customer approval",
                "Apply remediation updates for high-severity CVE security vulnerabilities as required.",
                "Review IBM i Technology Refresh releases and related functionality with customer personnel.",
                "Updates to HMC code levels in response to CVE security vulnerabilities",
                "Updates to IBM Power server firmware levels as required to address published CVE security vulnerabilities",
                "Services as required for troubleshooting Power Systems, IBM i operating system, general security, and network issues",
                "Monitor BRMS backups (if in use)",
                "Review backup logs in the event of failed backups and escalate findings to determine corrective actions.",
                "Provide Printer OUTQ support (changes, creation, and deletions)",
              ]} />
            </div>
          </div>
        </section>

        {/* ═══ BACKUP SERVICES ═══ */}
        <section>
          <SectionHeading id="backup-services">MANAGED BACKUP SERVICES (MONTHLY RECURRING SERVICE &ndash; MRS)</SectionHeading>
          <ResourceTable title="" rows={[
            { qty: "1", desc: "Managed Backup Base Subscription \u2013 VTL: Proactive monitoring and management of backups, system administration and maintenance of the backup infrastructure, file and directory level restores included, 24x7 phone support (authorized IT contacts only)" },
            { qty: "1", desc: "Managed Backup - VTL - 1 LPAR" },
          ]} />
        </section>

        {/* ═══ HOSTING ENVIRONMENT ═══ */}
        <section>
          <SectionHeading id="hosting-environment">IBM i HOSTING ENVIRONMENT</SectionHeading>
          <Prose><p>The following configuration represents the IBM i licensing structure and supporting software components required for the hosted IBM i production and standby disaster recovery environments.</p></Prose>
          <div className="glass-card rounded-xl p-6 mt-6">
            <h4 className="text-white font-semibold mb-3">IBM i Licensing - 1 LPAR</h4>
            <p className="text-slate-400 text-sm mb-3">IBM i Base OS Licenses V7.4 or V7.5 (Per Core Licensing)</p>
            <h5 className="text-sky-400 text-sm font-semibold mb-2">IBM i License Program Products (LPPs):</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-slate-300">
              {[
                "5770-AF1 IBM Advanced Function Printing",
                "5761-DB1 IBM System/38 Utilities",
                "5770-DG1 IBM HTTP Server for i",
                "5722-IP1 IBM Infoprint Server for iSeries",
                "5770-JS1 IBM Advanced Job Scheduler for i",
                "5770-JV1 IBM Developer Kit for Java",
                "5770-ST1 IBM DB2 Query Manager and SQL Development Kit",
                "5770-TC1 IBM TCP/IP Connectivity Utilities for i",
                "5770-UME IBM Universal Manageability Enablement for i",
                "5722-VI1 IBM Content Manager for iSeries",
                "5722-WE2 IBM Web Enablement",
                "5733-DB2 IBM Web Query for i",
                "5770-BR1 IBM BRMS",
                "5770-XW1 IBM Access Family",
                "5770-WDS IBM Application Development Tools",
                "5770-PT1 IBM Performance Tools for i",
                "5770-QU1 IBM Query for i",
                "IBM Monitoring Agent",
                "LPAR2RRD IBM Performance Tool",
              ].map((lpp) => (
                <div key={lpp} className="flex items-center gap-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400/60 shrink-0" />
                  <span>{lpp}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ RESOURCE ALLOCATION ═══ */}
        <section>
          <SectionHeading id="resource-allocation">IBM i HOSTED INFRASTRUCTURE RESOURCE ALLOCATION ENVIRONMENT</SectionHeading>
          <Prose><p>The following configuration represents the initial resource allocation for the hosted IBM i platform. Capacity values reflect provisioned infrastructure units and can be expanded as business requirements evolve.</p></Prose>
          <ResourceTable title="Production Resources" rows={[
            { qty: "10,000", desc: "IBM i Hosting - Power CPW (1 CPW Unit)" },
            { qty: "64", desc: "IBM i Hosting - Power Memory (1GB Unit)" },
            { qty: "4,600", desc: "IBM i Hosting - Power Storage (1GB Unit)" },
            { qty: "5", desc: "VTL Cloud Backup Storage (1TB Unit)" },
            { qty: "1", desc: "IBM i Hosting - Multitenant Firewall Network" },
            { qty: "1", desc: "Network - 1 Public IPv4 Address" },
            { qty: "25", desc: "Connectivity - Blended Internet (1Mbps Unit)" },
          ]} />
        </section>

        {/* ═══ DR RESOURCE ALLOCATION ═══ */}
        <section>
          <SectionHeading id="dr-resource-allocation">IBM i DISASTER RECOVERY RESOURCE ALLOCATION ENVIRONMENT</SectionHeading>
          <Prose><p>The following configuration represents the initial resource allocation for the hosted IBM i platform. Capacity values reflect provisioned infrastructure units and can be expanded as business requirements evolve.</p></Prose>
          <ResourceTable title="Disaster Recovery Resources" rows={[
            { qty: "10,000", desc: "IBM i Hosting - Power CPW (1 CPW Unit)" },
            { qty: "64", desc: "IBM i Hosting - Power Memory (1GB Unit)" },
            { qty: "4,600", desc: "IBM i Hosting - Power Storage (1GB Unit)" },
            { qty: "1", desc: "IBM i Hosting - Multitenant Firewall Network" },
            { qty: "1", desc: "Network - 1 Public IPv4 Address" },
            { qty: "25", desc: "Connectivity - Blended Internet (1Mbps Unit)" },
            { qty: "1", desc: "Disaster Recovery Base Subscription - SAN Replication: Data replicated in near real-time between the primary and secondary ICE sites via SAN-to-SAN replication, one annual disaster recovery test or failover event (up to 5 contiguous days), system administration and maintenance of DR infrastructure, 24x7 Phone Support (authorized IT contacts only)" },
          ]} />
        </section>

        {/* ═══ NRS ═══ */}
        <section>
          <SectionHeading id="nrs">NON-RECURRING SERVICES (NRS)</SectionHeading>
          <Prose><p>The following non-recurring services represent the initial provisioning, configuration, and migration activities required to deploy the hosted IBM i platform.</p></Prose>
          <div className="glass-card rounded-xl p-6 mt-6 space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-3">LPAR Provisioning and Infrastructure Configuration</h4>
              <BulletList items={[
                "Create LPAR environments on HMC",
                "Assign virtual fiber adapters",
                "Complete zoning to storage and VTL/TAPE",
                "Configure hosts on storage and create/assign volumes",
                "Configure host on VTL and assign backup resources",
                "Create and assign virtual network adapters",
                "Document WWPNs, ports, and partition information",
                "Configure production and disaster recovery environments",
              ]} />
            </div>
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-white font-semibold mb-3">System Migration via Save/Restore</h4>
              <BulletList items={[
                "Migration via one (1) SAVSYS (Save 21) full system save to tape and restore",
                "Base configuration and restore from Customer-provided LTO media",
                "Post-restore troubleshooting",
                "Data refresh via one (1) SAVSYS (Save 21) full system save to tape and restore",
              ]} />
            </div>
          </div>
        </section>

        {/* ═══ MIGRATION TIMELINE ═══ */}
        <section>
          <SectionHeading id="migration-timeline">MIGRATION TIMELINE OVERVIEW</SectionHeading>
          <Prose>
            <p>ICE follows a structured migration methodology designed to ensure a controlled transition while minimizing operational disruption. A high-level migration timeline is outlined below.</p>
            <p>To align with Carico International&apos;s upcoming IBM maintenance renewal timelines, initiating the project within the next 30&ndash;45 days is recommended to ensure a smooth and low-risk transition to the hosted platform.</p>
          </Prose>
          <div className="mt-6 space-y-4">
            {[
              { phase: "Project Kickoff", desc: "Architecture validation and planning", icon: FileText },
              { phase: "Infrastructure Provisioning", desc: "Deploy production and DR systems", icon: Server },
              { phase: "Data Migration", desc: "Initial system restore and validation", icon: Database },
              { phase: "Testing", desc: "Application validation and DR readiness", icon: ShieldCheck },
              { phase: "Production Cutover", desc: "Final migration and go-live", icon: Zap },
            ].map((step, i) => (
              <div key={step.phase} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400 shrink-0">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-sky-400/60">Phase {i + 1}</span>
                    <span className="text-white font-semibold">{step.phase}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ INVESTMENT SUMMARY ═══ */}
        <section>
          <SectionHeading id="investment-summary">PLATFORM INVESTMENT SUMMARY</SectionHeading>
          <Prose><p>The following pricing represents the fully managed IBM i hosting platform, including production hosting, SAN-replicated disaster recovery, managed VTL backup infrastructure and services, and enterprise platform monitoring and operational management.</p></Prose>
          <div className="glass-card rounded-2xl p-8 my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-slate-400">Current Estimated Infrastructure Cost</span>
              <span className="text-white font-mono text-lg">~ $4,100/Month</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-white font-semibold text-lg">Proposed Total Monthly Recurring Service (MRS)*</span>
                <p className="text-slate-400 text-sm mt-1 max-w-lg">This service consolidates production infrastructure, disaster recovery, enterprise backup services, and ongoing operational management into a single predictable managed platform.</p>
                <p className="text-slate-500 text-sm mt-1 max-w-lg">The hosted platform eliminates future IBM Power hardware purchases, infrastructure lifecycle management, and manual tape-based disaster recovery processes.</p>
              </div>
              <span className="text-sky-400 font-mono text-2xl font-bold">$7,700/Month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Estimated Total Non-Recurring Service (NRS)*</span>
              <span className="text-sky-400 font-mono text-lg font-bold">$5,000 - $10,000</span>
            </div>
            <p className="text-xs text-slate-500">(One Time Only)</p>
          </div>
          <Prose>
            <p>The monthly recurring service includes IBM i production infrastructure, disaster recovery with SAN replication, managed backup services, enterprise data center hosting, and ongoing IBM i operational support.</p>
            <p>This pricing includes both the production IBM i environment and a fully provisioned standby disaster recovery system maintained in a geographically separate enterprise data center. The pricing presented reflects a fully integrated platform design. Individual component pricing may vary if evaluated independently.</p>
            <p>This platform-based pricing replaces the need for on-premises hardware purchases, colocation infrastructure, hardware maintenance contracts, and IBM software maintenance associated with maintaining an on-premises IBM Power environment.</p>
            <p>Based on the current infrastructure model, Carico International is already incurring approximately $4,100 per month in hardware maintenance and colocation infrastructure costs before any future IBM Power hardware replacement investments are required.</p>
            <p className="text-xs text-slate-500">* Pricing reflects the current estimated system configuration as outlined in this proposal. Changes in system capacity, resource requirements, or underlying infrastructure may result in adjustments to the Monthly Recurring Service (MRS).</p>
            <p className="text-xs text-slate-500">Monthly Recurring Service (MRS) pricing will be finalized based on the system configuration determined during implementation planning and testing.</p>
            <p className="text-xs text-slate-500">Non-Recurring Service (NRS) represents estimated implementation and migration services. Actual implementation costs may vary depending on final environment configuration, migration complexity, data volumes, and any remediation required during provisioning or migration activities.</p>
            <p className="text-xs text-slate-500">This proposal and associated pricing are valid for 60 days from the date of issue unless otherwise stated.</p>
          </Prose>

          <div className="glass-card rounded-xl overflow-hidden mt-8">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/5">
                <tr><td className="px-4 py-3 text-slate-400 font-medium">Contract Start Date</td><td className="px-4 py-3 text-white"></td></tr>
                <tr><td className="px-4 py-3 text-slate-400 font-medium">Service Term &ndash; Months</td><td className="px-4 py-3 text-white font-semibold">36</td></tr>
                <tr><td className="px-4 py-3 text-slate-400 font-medium">MRS Billing Schedule</td><td className="px-4 py-3 text-white">Monthly or Quarterly</td></tr>
                <tr><td className="px-4 py-3 text-slate-400 font-medium">NRS Billing Schedule</td><td className="px-4 py-3 text-white">One-Time Implementation</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══ IMPLEMENTATION ═══ */}
        <section>
          <SectionHeading id="implementation">IMPLEMENTATION APPROACH</SectionHeading>
          <Prose>
            <p>To ensure a controlled transition prior to the expiration of Carico International&apos;s current IBM Power infrastructure maintenance coverage scheduled for July 2026, ICE recommends initiating implementation planning in early 2026. Beginning planning during this period allows sufficient time to complete environment preparation, testing, and production migration activities while minimizing disruption to ongoing business operations.</p>
            <p>ICE utilizes a structured migration methodology designed to minimize operational risk while ensuring application continuity throughout the transition.</p>
            <p>The implementation approach includes the following phases.</p>
          </Prose>
          <div className="glass-card rounded-xl overflow-hidden mt-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Phase</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Project Initiation", "Kickoff meeting, infrastructure review, migration planning"],
                  ["Infrastructure Setup", "Deployment of IBM Power production + disaster recovery infrastructure"],
                  ["Platform Configuration", "IBM i LPAR configuration, networking, storage allocation"],
                  ["Data Synchronization", "Initial replication and environment validation"],
                  ["Validation & Testing", "Application validation and disaster recovery readiness testing"],
                  ["Production Cutover", "Final migration and production activation"],
                ].map(([phase, desc]) => (
                  <tr key={phase}><td className="px-4 py-3 text-white font-medium">{phase}</td><td className="px-4 py-3 text-slate-400">{desc}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══ ASSUMPTIONS ═══ */}
        <section>
          <SectionHeading id="assumptions">ASSUMPTIONS AND CONDITIONS OF SERVICE</SectionHeading>

          <SubHeading>Service Delivery Model</SubHeading>
          <Prose>
            <p>The ICE platform delivers the services described in this proposal through a combination of ICE managed services and enterprise-class infrastructure providers. ICE serves as the Customer&apos;s primary technology partner and is responsible for the design, delivery, and ongoing management of the solution.</p>
            <p>The hosted infrastructure supporting the ICE solution is delivered through enterprise-class data center facilities, including DataBank and other approved enterprise data center providers. These facilities are designed with redundant power, cooling, and network connectivity to support high-availability production environments and secure enterprise workloads. The ICE solution may include infrastructure, hosting, backup, disaster recovery, and related services delivered through ICE-managed platforms and supporting infrastructure providers.</p>
          </Prose>

          <SubHeading>Billing and Contract Terms</SubHeading>
          <BulletList items={[
            "Monthly recurring fees and the contract start date will begin on the earlier of the following: ICE has delivered the solution, or Sixty (60) days from the customer\u2019s execution date, unless otherwise noted.",
            "All non-recurring or onboarding fees will be invoiced upon execution unless otherwise noted.",
          ]} />

          <SubHeading>Customer Responsibilities</SubHeading>
          <BulletList items={[
            "Customer will designate a primary Customer Point of Contact responsible for communications, issue resolution, and coordination of Customer responsibilities related to the Services.",
            "Customer will provide timely and necessary logical and/or physical access (on-prem or in a datacenter) required for ICE to deliver the services.",
            "Customer will provide ICE with the necessary connectivity, including site-to-site VPN access or ICE RMM access, required for ICE to perform the Services.",
            "Customer will permit ICE to install any software, tools, appliances, etc. required to perform the services.",
            "As available, Customer will provide current state network diagrams, system configurations, and operations procedure documentation such as disaster recovery procedures as they relate to the Services being provided.",
            "Customer remains responsible for the support and maintenance of Customer-owned networks, systems, and devices not explicitly included within the Services described in this Statement of Work.",
            "Customer will provide a list of authorized contacts and their corresponding permissions as they pertain to the ICE Services. For example, this will include contract approvers, critical alert contacts, etc.",
            "As applicable to the Services, Customer will inform ICE of all maintenance scheduled for the systems, including software and hardware upgrades and installations.",
            "Customer is responsible for maintaining manufacturer support and maintenance on all Customer-owned systems related to the Services.",
            "Customer will collaborate with ICE, and as required, assist in issue resolution related to the services.",
          ]} />

          <SubHeading>Service Limitations</SubHeading>
          <BulletList items={[
            "ICE is not responsible or liable for performance or non-performance of the IP transport circuits or any other carrier services.",
            "Customer acknowledges the potential risks (including outages, data loss, etc.) associated with running unsupported Operating Systems. ICE may assist Customer on a best effort basis to troubleshoot issues at the hourly rates identified herein.",
          ]} />

          <SubHeading>Professional Services</SubHeading>
          <BulletList items={[
            "Professional services outside the scope of this Agreement will be billed at ICE\u2019s prevailing professional services rate (currently $295 per hour). Time is tracked and billed in one-hour increments unless otherwise agreed in writing.",
          ]} />

          <SubHeading>Hosting Services</SubHeading>
          <BulletList items={[
            "As applicable, Customer will provide ICE with a list of third-party applications running on each machine, including databases.",
            "Customer is responsible for all testing before go-live in the cloud environment, including application, performance, interface, and network testing.",
            "Customer is responsible for obtaining and applying 3rd party application keys into the cloud environment.",
            "Customer is responsible for purchasing all required licenses and ongoing software maintenance and support for Microsoft, Citrix, VMware and any other 3rd party software applications that will be installed on Service Provider owned servers except where expressly indicated otherwise in this agreement.",
            "Software vendors (e.g., Microsoft, VMware, Citrix) may periodically increase pricing for licensed products included in rental agreements. If vendor pricing changes, ICE will notify Customer and applicable license fees may increase accordingly.",
            "Customer will purchase and maintain the required IP Transit and/or IP Transport connectivity service to ICE\u2019s datacenters.",
            "Customer will notify ICE Support in a timely manner of any change freeze periods required. Customer acknowledges that maintenance and updates delayed due to Customer freeze periods could cause performance and/or security issues. This does not limit ICE\u2019s ability to perform maintenance on multitenant infrastructure.",
            "IBM Hosting - Unless otherwise agreed upon in this SOW, ICE does not include IBM Service Extensions for hosted LPARs running End of Program Support Operating Systems.",
            "IBM Hosting - ICE assumes Customer has a fully functional and correctly configured Simple Mail Transfer Protocol (SMTP) with appropriate Domain Name System (DNS) records in place. Unless otherwise agreed upon in this SOW, ICE is not responsible for any SMTP configuration, troubleshooting, remediation, or integration with external services (i.e. Microsoft 365, Google Workspace, etc.)",
          ]} />

          <SubHeading>Backup and Disaster Recovery</SubHeading>
          <BulletList items={[
            "IBM i Backups - Customer acknowledges that performing full system backups on LPARs is disruptive. Only LPARs with full system flash copies can be backed up without disruption.",
            "IBM i Backups - Full system flash copies are not included unless specifically called out in this SOW.",
            "VTL Backups - For faster restore times, ICE recommends that Customer takes a full system save on a regular basis.",
            "Disaster recovery infrastructure is operated and administered by ICE as part of the hosted platform.",
            "Customers should coordinate infrastructure or application changes with ICE operations to ensure replication and disaster recovery orchestration processes remain functional.",
            "Administrative access to disaster recovery infrastructure components or management consoles may be limited to maintain platform integrity and security.",
          ]} />

          <SubHeading>Security Requirements</SubHeading>
          <BulletList items={[
            "Multi-tenant Firewall - Multi-factor Authentication (\u201CMFA\u201D) is required to be enabled.",
            "Multi-tenant Firewall - By default, email MFA will be turned on. ICE supports more secure MFA options, the cost of which is not included unless otherwise agreed upon in writing in this SOW.",
          ]} />
        </section>

        {/* ═══ DOWNLOAD ═══ */}
        <section className="pt-8">
          <div className="glass-card rounded-2xl p-10 text-center">
            <Download className="h-10 w-10 text-sky-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Download Proposal</h3>
            <p className="text-slate-400 text-sm mb-6">Get this proposal as a PDF document.</p>
            <a
              href="/Carico-IaaS_Hosting.pdf"
              download
              className="btn-primary inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4 relative z-10" />
              <span>Download PDF</span>
            </a>
          </div>
        </section>

        </div>{/* end main content column */}

        {/* ═══ RIGHT SIDEBAR ═══ */}
        <DocSidebar activeId={activeId} />
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────── */
/*  Page Component                                      */
/* ──────────────────────────────────────────────────── */

export default function CaricoProposalPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  // Force dark mode on this page — useLayoutEffect fires before paint
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    return () => {
      const stored = localStorage.getItem("ice-theme");
      document.documentElement.setAttribute("data-theme", stored || "dark");
    };
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) return <div className="min-h-screen bg-[#020617]" />;

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return <ProposalContent />;
}
