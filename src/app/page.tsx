"use client";

import { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Cloud,
  Shield,
  Lock,
  Server,
  Phone,
  Mail,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════════════════
   THREE.JS — MAINTENANCE PARTICLE FIELD
   ══════════════════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 200;
const SPREAD = 14;
const CONNECTION_DISTANCE = 2.2;
const WAVE_SPEED = 0.12;
const WAVE_AMPLITUDE = 0.35;
const DRIFT_SPEED = 0.015;

const CYAN = new THREE.Color("#049bfb");
const BLUE = new THREE.Color("#0474bc");

function Particles({ darkMode }: { darkMode: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, colors, basePositions, speeds, phases, particleColors } =
    useMemo(() => {
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const basePositions = new Float32Array(PARTICLE_COUNT * 3);
      const speeds = new Float32Array(PARTICLE_COUNT);
      const phases = new Float32Array(PARTICLE_COUNT);
      const particleColors: THREE.Color[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * SPREAD;
        const y = (Math.random() - 0.5) * SPREAD;
        const z = (Math.random() - 0.5) * SPREAD;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        basePositions[i * 3] = x;
        basePositions[i * 3 + 1] = y;
        basePositions[i * 3 + 2] = z;

        speeds[i] = 0.5 + Math.random() * 1.0;
        phases[i] = Math.random() * Math.PI * 2;

        const t = Math.random();
        const color = CYAN.clone().lerp(BLUE, t);
        particleColors.push(color);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      return { positions, colors, basePositions, speeds, phases, particleColors };
    }, []);

  const maxLines = PARTICLE_COUNT * 6;
  const { linePositions, lineColors } = useMemo(() => {
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    return { linePositions, lineColors };
  }, [maxLines]);

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();
    const pts = pointsRef.current;
    const lines = linesRef.current;
    if (!pts || !lines) return;

    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      const speed = speeds[i];
      const phase = phases[i];

      posArr[i * 3] =
        bx +
        Math.sin(time * WAVE_SPEED * speed + phase) * WAVE_AMPLITUDE +
        Math.sin(time * DRIFT_SPEED + phase) * 0.5;
      posArr[i * 3 + 1] =
        by +
        Math.cos(time * WAVE_SPEED * speed + phase * 1.3) * WAVE_AMPLITUDE +
        Math.cos(time * DRIFT_SPEED * 0.8 + phase) * 0.4;
      posArr[i * 3 + 2] =
        bz +
        Math.sin(time * WAVE_SPEED * speed * 0.7 + phase * 0.9) *
          WAVE_AMPLITUDE *
          0.6;
    }
    posAttr.needsUpdate = true;

    const linePosAttr = lines.geometry.attributes.position as THREE.BufferAttribute;
    const lineColAttr = lines.geometry.attributes.color as THREE.BufferAttribute;
    const lp = linePosAttr.array as Float32Array;
    const lc = lineColAttr.array as Float32Array;
    let lineIndex = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = posArr[i * 3] - posArr[j * 3];
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          if (lineIndex >= maxLines) break;
          const alpha = 1 - dist / CONNECTION_DISTANCE;

          lp[lineIndex * 6] = posArr[i * 3];
          lp[lineIndex * 6 + 1] = posArr[i * 3 + 1];
          lp[lineIndex * 6 + 2] = posArr[i * 3 + 2];
          lp[lineIndex * 6 + 3] = posArr[j * 3];
          lp[lineIndex * 6 + 4] = posArr[j * 3 + 1];
          lp[lineIndex * 6 + 5] = posArr[j * 3 + 2];

          const ci = particleColors[i];
          const cj = particleColors[j];
          lc[lineIndex * 6] = ci.r * alpha;
          lc[lineIndex * 6 + 1] = ci.g * alpha;
          lc[lineIndex * 6 + 2] = ci.b * alpha;
          lc[lineIndex * 6 + 3] = cj.r * alpha;
          lc[lineIndex * 6 + 4] = cj.g * alpha;
          lc[lineIndex * 6 + 5] = cj.b * alpha;

          lineIndex++;
        }
      }
      if (lineIndex >= maxLines) break;
    }

    for (let k = lineIndex * 6; k < lp.length; k++) {
      lp[k] = 0;
      lc[k] = 0;
    }

    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;
    lines.geometry.setDrawRange(0, lineIndex * 2);

    if (pts.parent) {
      const group = pts.parent;
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.3, 0.02);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.3, 0.02);
    }
  });

  const blending = darkMode ? THREE.AdditiveBlending : THREE.NormalBlending;

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={darkMode ? 0.06 : 0.08}
          vertexColors
          transparent
          opacity={darkMode ? 0.85 : 0.7}
          sizeAttenuation
          depthWrite={false}
          blending={blending}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={darkMode ? 0.35 : 0.25}
          depthWrite={false}
          blending={blending}
        />
      </lineSegments>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COUNTDOWN TIMER
   ══════════════════════════════════════════════════════════════════════════ */

const TARGET_DATE = new Date("2026-06-01T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      const diff = Math.max(0, TARGET_DATE - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* Glow behind */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative glass-card rounded-2xl px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-9 min-w-[72px] sm:min-w-[90px] md:min-w-[110px] overflow-hidden">
          {/* Scan line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/[0.03] to-transparent pointer-events-none" />
          <span className="relative block text-center text-3xl sm:text-5xl md:text-6xl font-bold tabular-nums gradient-text-glow tracking-tight">
            {display}
          </span>
        </div>
      </div>
      <span className="mt-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 pb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400/60 animate-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SERVICES DATA
   ══════════════════════════════════════════════════════════════════════════ */

const services = [
  {
    icon: Cloud,
    title: "Managed Cloud",
    description:
      "Scalable cloud hosting, private & hybrid cloud, and seamless migration for enterprise workloads.",
    gradient: "from-sky-500/20 to-blue-500/20",
  },
  {
    icon: Shield,
    title: "Data Protection",
    description:
      "Enterprise backup, disaster recovery, high availability, and ransomware recovery solutions.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Lock,
    title: "Managed Security",
    description:
      "IBM i security, endpoint protection, threat detection, and 24/7 security monitoring.",
    gradient: "from-indigo-500/20 to-sky-500/20",
  },
  {
    icon: Server,
    title: "Managed Services",
    description:
      "Microsoft services, automation, systems management, and IBM Power VS — fully managed.",
    gradient: "from-sky-500/20 to-cyan-500/20",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   THEME TOGGLE
   ══════════════════════════════════════════════════════════════════════════ */

function useThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("ice-theme") as "dark" | "light" | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("ice-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  return { theme, toggle };
}

/* ══════════════════════════════════════════════════════════════════════════
   MAINTENANCE PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function MaintenancePage() {
  const timeLeft = useCountdown();
  const { theme, toggle: toggleTheme } = useThemeToggle();
  const isDark = theme === "dark";

  return (
    <main className="relative min-h-screen overflow-hidden transition-colors duration-300">
      {/* ─── Three.js Background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <Canvas
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: "transparent" }}
          dpr={[1, 1.5]}
        >
          <Particles darkMode={isDark} />
        </Canvas>
      </div>

      {/* ─── Ambient Orbs ────────────────────────────────────────────────── */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] ambient-orb ambient-orb-cyan animate-float z-0" />
      <div
        className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] ambient-orb ambient-orb-blue z-0"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="fixed top-2/3 left-1/2 w-[300px] h-[300px] ambient-orb ambient-orb-cyan z-0"
        style={{ animationDelay: "6s" }}
      />

      {/* ─── Mesh gradient overlay ───────────────────────────────────────── */}
      <div className="fixed inset-0 mesh-gradient-animated opacity-40 z-0 pointer-events-none" />

      {/* ─── Grid pattern ────────────────────────────────────────────────── */}
      <div className="fixed inset-0 grid-pattern z-0 pointer-events-none" />

      {/* ─── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            TOP INFO BAR
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-[var(--glass-border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <div className="hidden sm:flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-sky-400 shrink-0" />
              <span>1279 W Palmetto Park Rd #272415, Boca Raton, FL 33427</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 mx-auto sm:mx-0">
              <a href="tel:5613949188" className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-400">
                <Phone className="h-3 w-3 text-sky-400 shrink-0" />
                561-394-9188
              </a>
              <a href="mailto:sales@icesales.com" className="inline-flex items-center gap-1.5 transition-colors hover:text-sky-400">
                <Mail className="h-3 w-3 text-sky-400 shrink-0" />
                sales@icesales.com
              </a>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-sky-500/10 blur-2xl" />
              <div className="relative rounded-xl bg-[#f8fafc] p-4 shadow-lg shadow-sky-500/10">
                <Image
                  src="/images/logo/ice-full.jpg"
                  alt="International Computer Exchange"
                  width={280}
                  height={100}
                  className="h-16 sm:h-20 w-auto"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Maintenance Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-[var(--text-primary)]">
              Website Under{" "}
              <br className="hidden sm:block" />
              <span className="shimmer-text">Maintenance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              We&apos;re upgrading our systems to serve you better. Our team is
              working hard to bring you an improved experience.
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8"
          >
            <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-sky-400 mb-6">
              Launching June 1, 2026
            </p>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.minutes} label="Minutes" />
              <CountdownSeparator />
              <CountdownUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-[var(--text-muted)]/30 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-sky-400/60" />
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SERVICES SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 sm:py-32">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400 mb-4">
                What We Do
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-[var(--text-primary)]">
                Enterprise-Grade{" "}
                <span className="gradient-text">Solutions</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
                End-to-end technology solutions engineered for reliability,
                security, and performance across every layer of your
                infrastructure.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="glass-card shine-sweep flex h-full flex-col rounded-2xl p-7 group transition-all duration-500 hover:shadow-[0_0_40px_rgba(4,155,251,0.1)] hover:border-sky-500/20">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(4,155,251,0.2)]`}
                    >
                      <s.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      {s.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {s.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTACT / INFO SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 sm:py-32">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400 mb-4">
                Get In Touch
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl text-[var(--text-primary)]">
                We&apos;re Still <span className="gradient-text">Here For You</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[var(--text-secondary)] leading-relaxed">
                While our website is being updated, our team is still available
                to help with all your enterprise technology needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Phone */}
              <motion.a
                href="tel:5613949188"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
                className="glass-card shine-sweep rounded-2xl p-6 sm:p-7 text-center group transition-all duration-500 hover:shadow-[0_0_40px_rgba(4,155,251,0.1)] hover:border-sky-500/20 cursor-pointer block"
              >
                <div className="mb-4 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/15 to-blue-500/15 text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(4,155,251,0.2)]">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Phone
                </h3>
                <p className="text-base sm:text-lg font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                  561-394-9188
                </p>
              </motion.a>

              {/* Email */}
              <motion.a
                href="mailto:sales@icesales.com"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card shine-sweep rounded-2xl p-6 sm:p-7 text-center group transition-all duration-500 hover:shadow-[0_0_40px_rgba(4,155,251,0.1)] hover:border-sky-500/20 cursor-pointer block"
              >
                <div className="mb-4 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15 text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(4,155,251,0.2)]">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Email
                </h3>
                <p className="text-base sm:text-lg font-medium text-sky-400 group-hover:text-sky-300 transition-colors break-all sm:break-normal">
                  sales@icesales.com
                </p>
              </motion.a>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card shine-sweep rounded-2xl p-6 sm:p-7 text-center group transition-all duration-500 hover:shadow-[0_0_40px_rgba(4,155,251,0.1)] hover:border-sky-500/20 sm:col-span-2 lg:col-span-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-sky-500/15 text-sky-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(4,155,251,0.2)]">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Address
                </h3>
                <p className="text-sm font-medium text-[var(--text-muted)] leading-relaxed">
                  1279 W Palmetto Park Rd
                  <br />
                  #272415, Boca Raton, FL 33427
                </p>
              </motion.div>
            </div>

            {/* IBM Partner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 glass-card rounded-2xl p-8 sm:p-10"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Image
                  src="/images/ibm.svg"
                  alt="IBM Business Partner"
                  width={56}
                  height={56}
                  className="h-12 w-auto opacity-60"
                />
                <div className="text-center sm:text-left">
                  <p className="text-base font-semibold text-[var(--text-primary)]">
                    Proud IBM Business Partner
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Delivering enterprise technology solutions since 1990 —
                    cloud hosting, data protection, cybersecurity, and managed
                    services for businesses of all sizes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════════ */}
        <footer className="relative py-12 border-t border-[var(--card-border)]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} International Computer Exchange.
              All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* ─── Floating Theme Toggle (bottom-right) ────────────────────────── */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 glass-card p-3 rounded-full shadow-lg transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_0_20px_rgba(4,155,251,0.15)] cursor-pointer group"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5 text-[var(--text-muted)] group-hover:text-sky-400 transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5 text-[var(--text-muted)] group-hover:text-sky-400 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </main>
  );
}
