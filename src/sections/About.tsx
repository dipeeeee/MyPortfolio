"use client";

import { useMemo, useState, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import MyImage5 from "../assets/MyImage5.jpg";

import type { Variants } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiTailwindcss,
  SiMongodb,
  SiGit,
} from "react-icons/si";
import { FaThreads } from "react-icons/fa6";

/* -------------------------
   Utilities / Motion
   ------------------------- */
const hexA = (hex: string, a: number): string => {
  const v = hex.replace("#", "");
  const b = parseInt(v.length === 3 ? v.split("").map((c) => c + c).join("") : v, 16);
  return `rgba(${(b >> 16) & 255}, ${(b >> 8) & 255}, ${b & 255}, ${a})`;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38 } },
};

const fadeUpDelayed = (d = 0.05): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, delay: d } },
});

const listContainer: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const listItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const barGrow = (w: string, d = 0): Variants => ({
  hidden: { width: 0 },
  show: { width: w, transition: { duration: 0.85, ease: "easeOut", delay: d } },
});

/* Reusable classes */
const cardBase =
  "rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl max-w-full overflow-hidden shadow-[0_10px_30px_rgba(255,255,255,0.06)]";
const tinyMuted = "text-xs text-neutral-100/80";
const sectionP = "px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12";

/* -------------------------
   Main Export
   ------------------------- */
export default function AboutHeroFull() {
  const accents = useMemo(() => ["#22d3ee", "#a78bfa", "#34d399"], []);
  const [activeTab, setActiveTab] = useState<"education" | "achievements">("education");

  return (
    <section
      className="relative w-full max-w-full overflow-x-hidden text-white"
      style={{ minHeight: "100svh" }}
      aria-labelledby="about-title"
    >
      <BackgroundBeams accents={accents} />

      <div className={`relative z-10 mx-auto w-full max-w-full lg:max-w-[1320px] ${sectionP}`}>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)]">
          {/* LEFT */}
          <div className="space-y-4 sm:space-y-5">
            <AnimatedProfile accents={accents} />

            <motion.div
              variants={fadeUpDelayed(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={cardBase}
            >
              <Tabs active={activeTab} onChange={setActiveTab} accents={accents} />
              <div className="p-4 sm:p-5 md:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "education" ? (
                    <EducationTimeline key="education" accents={accents} />
                  ) : (
                    <AchievementsGrid key="achievements" />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 sm:space-y-5">
            <div className="w-full max-w-full lg:max-w-[760px] mx-auto">
              <LeetCodeStats accents={accents} />
            </div>
            <div className="w-full max-w-full lg:max-w-[760px] mx-auto">
              <GitHubStats accents={accents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Animated Profile (with rotating icons + 3D tilt)
   ------------------------- */
const AnimatedProfile = memo(function AnimatedProfile({ accents }: { accents: string[] }) {
  const techIcons = [
    { Icon: SiReact, color: "#61DAFB" },
    { Icon: SiJavascript, color: "#F7DF1E" },
    { Icon: SiTypescript, color: "#3178C6" },
    { Icon: SiNodedotjs, color: "#339933" },
    { Icon: SiPython, color: "#3776AB" },
    { Icon: SiTailwindcss, color: "#06B6D4" },
    { Icon: SiMongodb, color: "#47A248" },
    { Icon: SiGit, color: "#F05032" },
  ];

  // responsive radius to avoid clipping on small screens
  const [radius, setRadius] = useState<number>(180);
  useEffect(() => {
    const compute = (): void => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      const r = Math.round(Math.max(110, Math.min(150, w * 0.12)));
      setRadius(r);
    };
    compute();

    const onResize = (): void => {
      if (typeof window === "undefined") return;
      if ("requestAnimationFrame" in window) {
        window.requestAnimationFrame(compute);
      } else {
        compute();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", onResize);
      }
    };
  }, []);

  const containerSize = radius * 2 + 80;

  // --- 3D tilt motion values
  const mvX = useMotionValue(0); // rotateY
  const mvY = useMotionValue(0); // rotateX
  // convert to degrees strings (framer accepts numbers too)
  const rotateY = useTransform(mvX, (v) => v);
  const rotateX = useTransform(mvY, (v) => v);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // mouse move handler to update mvX/mvY
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRotateY = 12; // degrees
    const maxRotateX = 8; // degrees

    const dx = (e.clientX - cx) / (rect.width / 2); // -1 .. 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 .. 1

    // invert Y so moving up tilts towards user
    const targetY = Math.max(Math.min(dx * maxRotateY, maxRotateY), -maxRotateY);
    const targetX = Math.max(Math.min(-dy * maxRotateX, maxRotateX), -maxRotateX);

    mvX.set(targetY);
    mvY.set(targetX);
  };

  const handlePointerLeave = () => {
    // reset to 0
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative flex items-center justify-center py-12 sm:py-16 md:py-20"
    >
      <div
        ref={wrapperRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative z-20"
        style={{
          paddingTop: 24,
          paddingBottom: 24,
          overflow: "visible",
          perspective: 1000, // important for 3D
          WebkitPerspective: 1000,
        }}
      >
        {/* 3D card wrapper */}
        <motion.div
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            rotateX, // motion value
            rotateY, // motion value
            // keep a tiny 3d feel when device has no pointer by default
          }}
        >
          {/* Outer gradient ring (back-most layer, small translateZ) */}
          <div
            className="absolute inset-0 rounded-full p-[3px] will-change-transform"
            style={{
              background: `linear-gradient(135deg, ${accents[0]}, ${accents[1]})`,
              transform: "translateZ(8px)",
            }}
            aria-hidden
          >
            {/* Avatar image (pops more via translateZ) */}
            <div
              className="w-full h-full rounded-full overflow-hidden bg-center bg-cover"
              style={{
                backgroundImage:
                `url(${MyImage5})`,
                transform: "translateZ(28px) scale(1.02)",
              }}
            />
          </div>

          {/* Pulsing ring (in front, small translateZ) */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: `2px solid ${accents[0]}`,
              opacity: 0.45,
              transform: "translateZ(46px)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.0, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* subtle highlight layer */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.35), inset 0 6px 16px rgba(255,255,255,0.03)",
              transform: "translateZ(6px)",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>

      {/* Circular path for icons (rotating) */}
      <motion.svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        width={containerSize}
        height={containerSize}
        style={{ zIndex: 10, transformStyle: "preserve-3d" }}
      >
        <motion.circle
          cx={containerSize / 2}
          cy={containerSize / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      </motion.svg>

      {/* rotating icons ring — each icon has its own translateZ for depth */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{
          width: containerSize,
          height: containerSize,
          marginLeft: -containerSize / 2,
          marginTop: -containerSize / 2,
          pointerEvents: "none",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {techIcons.map(({ Icon, color }, i) => {
          const angle = (i / techIcons.length) * 360;
          // set depth per icon (front icons pop more)
          const depth = 18 + (i % 3) * 8; // varied depth: 18,26,34
          const size = 48;
          const half = size / 2;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg) translateZ(${depth}px)`,
                width: size,
                height: size,
                marginLeft: -half,
                marginTop: -half,
                pointerEvents: "auto",
                willChange: "transform",
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg"
                style={{
                  background: `${color}22`,
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.18, z: 60 }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.03, duration: 0.28 }}
              >
                <Icon size={20} color={color} />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* caption */}
      <motion.div
        className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 text-center w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-sm sm:text-base md:text-lg text-neutral-100/90 max-w-2xl mx-auto">
          Meticulous web developer with 6+ years of frontend experience
        </p>
      </motion.div>
    </motion.div>
  );
});

/* -------------------------
   Background beams
   ------------------------- */
const BackgroundBeams = memo(function BackgroundBeams({ accents }: { accents: string[] }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-x-hidden">
      <div
        className="absolute inset-0 max-w-full"
        style={{
          background: `radial-gradient(60vw 60vw at 50% 35%, ${hexA(accents[0], 0.12)}, transparent 60%),
                       radial-gradient(40vw 40vw at 85% 80%, ${hexA(accents[1], 0.1)}, transparent 65%),
                       linear-gradient(180deg, #0d0e1a, #161728)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08] max-w-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(60vw 60vw at 50% 45%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(60vw 60vw at 50% 45%, black, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute -left-[20%] top-[10%] h-[160vh] w-[60vw] bg-gradient-to-b from-white/5 to-transparent blur-3xl"
        initial={{ rotate: -18, opacity: 0 }}
        whileInView={{ rotate: -14, opacity: 0.12 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute -right-[20%] bottom-[-10%] h-[160vh] w-[60vw] bg-gradient-to-t from-white/4 to-transparent blur-[64px]"
        initial={{ rotate: 14, opacity: 0 }}
        whileInView={{ rotate: 10, opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.08, ease: "easeOut" }}
      />
    </div>
  );
});

/* -------------------------
   Tabs component
   ------------------------- */
function Tabs({
  active,
  onChange,
  accents,
}: {
  active: "education" | "achievements";
  onChange: (t: "education" | "achievements") => void;
  accents: string[];
}) {
  return (
    <div className="flex border-b border-white/20">
      <TabButton
        active={active === "education"}
        onClick={() => onChange("education")}
        icon="🎓"
        label="Education"
        accents={accents}
      />
      <TabButton
        active={active === "achievements"}
        onClick={() => onChange("achievements")}
        icon="🏆"
        label="Achievements"
        accents={accents}
      />
    </div>
  );
}

const TabButton = memo(function TabButton({
  active,
  onClick,
  icon,
  label,
  accents,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  accents: string[];
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 px-4 py-3 sm:px-5 sm:py-3.5 font-semibold text-sm transition-all duration-300"
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: `linear-gradient(90deg, ${accents[0]}, ${accents[1]})` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
        />
      )}
      <span className={`flex items-center justify-center gap-2 ${active ? "text-white" : "text-neutral-300"}`}>
        <span className="text-xl">{icon}</span>
        {label}
      </span>
    </button>
  );
});

/* -------------------------
   Education Timeline
   ------------------------- */
type EducationItem = {
  period: string;
  degree: string;
  institution: string;
  cgpa: string;
  color: string;
  icon?: string;
};

function EducationTimeline({ accents }: { accents: string[] }) {
  const education: EducationItem[] = [
    {
      period: "2021–2024",
      degree: "B.Tech in Information Technology",
      institution: "Government College of Engineering, Amravati",
      cgpa: "8.09 CGPA",
      color: accents[0],
      icon: "🎓",
    },
    {
      period: "2018-2021",
      degree: "Diploma in Computer Science",
      institution: "Government Polytechnic Amravati",
      cgpa: "96.11 %",
      color: accents[2],
      icon: "📘",
    },
    {
      period: "2008–2018",
      degree: "Secondary Education",
      institution: "Holy Cross English High School",
      cgpa: "94.4 %",
      color: "#f87171",
      icon: "🏫",
    },
  ];

  return (
    <motion.div variants={listContainer} initial="hidden" animate="show" className="relative max-w-full">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-px hidden md:block">
        <div
          className="h-full w-px"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0.35) 88%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      <div className="space-y-4 sm:space-y-5">
        {education.map((e, i) => {
          const leftSide = i % 2 === 0;
          return (
            <motion.div
              key={e.period}
              variants={listItem}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch max-w-full"
            >
              <div className={`${leftSide ? "md:col-start-1" : "md:col-start-2"} max-w-full`}>
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative rounded-xl border border-white/25 bg-white/10 backdrop-blur-xl px-4 sm:px-5 py-4 sm:py-5 shadow-[0_10px_30px_rgba(255,255,255,0.06)] max-w-full overflow-hidden"
                >
                  <span
                    className="absolute top-1/2 -translate-y-1/2 hidden md:block w-2.5 h-2.5 rounded-full border border-white/40"
                    style={{
                      backgroundColor: e.color,
                      left: leftSide ? ("calc(100% + 10px)" as string) : undefined,
                      right: !leftSide ? ("calc(100% + 10px)" as string) : undefined,
                    }}
                  />
                  <span
                    className="absolute top-1/2 -translate-y-1/2 hidden md:block h-[2px]"
                    style={{
                      width: "36px",
                      background: `linear-gradient(90deg, ${leftSide ? `${e.color}99, transparent` : `transparent, ${e.color}99`})`,
                      left: leftSide ? "100%" : undefined,
                      right: !leftSide ? "100%" : undefined,
                    }}
                  />
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div
                      className="shrink-0 rounded-lg p-2 text-lg"
                      style={{ background: `${e.color}1A`, border: "1px solid rgba(255,255,255,0.15)" }}
                      aria-hidden="true"
                    >
                      {e.icon ?? "🎯"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
                          style={{ color: e.color, background: `${e.color}26`, border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                          {e.period}
                        </span>
                        <span className="text-xs text-neutral-200/80">•</span>
                        <span className="text-xs text-neutral-200/80">Secured {e.cgpa}</span>
                      </div>
                      <h4 className="mt-1 text-base sm:text-lg font-bold text-white">{e.degree}</h4>
                      <p className={tinyMuted.replace("100/80", "100/85")}>{e.institution}</p>
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                        <motion.div
                          variants={barGrow("100%")}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${accents[0]}, ${accents[1]})` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* -------------------------
   AchievementsGrid
   ------------------------- */
   const AchievementsGrid = memo(function AchievementsGrid() {
    const achievements: { title: string; subtitle: string; image: string }[] = [
      { title: "Winner of District Innovation Challenge", subtitle: "Won District Innovation Challenge with 1 lakh prize money.", image: "/image1.jpg" },
      { title: "BharatCon'24", subtitle: "Secured 1st Runner Up at BharatCon24.", image: "/image2.jpg" },
      { title: "Esammelan", subtitle: "Secured 1 Prize at Esammelan (GCOEA TechFest24)", image: "/image3.jpg" },
      { title: "TIE Nagpur", subtitle: "Secured 2nd Runner up at TIE Nagpur", image: "/image4.jpg" },
      { title: "CIIA Exhibition", subtitle: "Comes in Top 100 from all India", image: "/image5.jpg" },
      { title: "Published Writer", subtitle: "An AI companion for Visually Impaired and Blind People for Sustainable Development.", image: "/image6.jpg" },
      { title: "Gymkhana Hobby Secretary", subtitle: "For leadership.", image: "/image7.jpg" },
      { title: "Class Representative", subtitle: "", image: "/image8.jpg" },
      { title: "Lila Poonawalla Foundation", subtitle: "Got Scholarship", image: "/image9.jpg" },
    ];
  
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
      if (typeof window === "undefined") return;
      setIsTouch(("ontouchstart" in window) || (navigator.maxTouchPoints ?? 0) > 0);
    }, []);
  
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
    // ===== PAGINATION LOGIC =====
    const ITEMS_PER_PAGE = 4;
    const [page, setPage] = useState(0);
  
    const totalPages = Math.ceil(achievements.length / ITEMS_PER_PAGE);
  
    const paginatedAchievements = achievements.slice(
      page * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  
    useEffect(() => {
      const interval = setInterval(() => {
        setPage((prev) => (prev + 1) % totalPages);
        setOpenIndex(null);
      }, 4000);
  
      return () => clearInterval(interval);
    }, [totalPages]);
  
    const containerRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      const handler = (e: TouchEvent | MouseEvent) => {
        if (!containerRef.current) return;
        const target = e.target as Node | null;
        if (target && !containerRef.current.contains(target)) {
          setOpenIndex(null);
        }
      };
      document.addEventListener("touchstart", handler, { passive: true });
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("touchstart", handler);
        document.removeEventListener("mousedown", handler);
      };
    }, []);
  
    const onItemClick = (idx: number) => {
      if (!isTouch) return;
      setOpenIndex((prev) => (prev === idx ? null : idx));
    };
  
    return (
      <motion.div
        ref={containerRef}
        variants={fadeUp}
        initial="hidden"
        animate="show"   // <--- FIXED: show instantly
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {paginatedAchievements.map((item, idx) => {
          const actualIndex = page * ITEMS_PER_PAGE + idx;
          const isOpen = openIndex === actualIndex;
  
          return (
            <motion.div
              key={item.title}
              initial={{ scale: 1, opacity: 1 }}
              whileHover={!isTouch ? { scale: 1.02 } : {}}
              transition={{ duration: 0.25 }}
              className="group relative rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(255,255,255,0.06)]"
              style={{ minHeight: 140 }}
              onClick={() => onItemClick(actualIndex)}
            >
              <div className="relative z-10 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <div className="text-xs text-neutral-200">🏅</div>
                </div>
                <p className="text-xs text-neutral-100/90">{item.subtitle}</p>
              </div>
  
              <img
                src={item.image}
                alt={`${item.title} certificate`}
                loading="lazy"
                className="
                  hidden md:block
                  pointer-events-none
                  absolute inset-0 w-full h-full object-cover
                  translate-y-full opacity-0
                  transition-all duration-300 ease-out
                  group-hover:translate-y-0 group-hover:opacity-100
                "
              />
  
              <AnimatePresence>
                {isTouch && isOpen && (
                  <motion.div
                    key="mobile-overlay"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 z-20 flex items-end"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.5))" }}
                  >
                    <div className="w-full">
                      <img
                        src={item.image}
                        alt={`${item.title} certificate`}
                        loading="lazy"
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 text-white bg-black/60 backdrop-blur-sm">
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <p className="text-xs text-neutral-100/85 mt-1">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    );
  });
  



/* -------------------------
   LeetCodeStats
   ------------------------- */
const LeetCodeStats = memo(function LeetCodeStats({ accents }: { accents: string[] }) {
  const stats = {
    easy: { solved: 243, total: 400, beats: 98 },
    medium: { solved: 158, total: 400, beats: 91 },
    hard: { solved: 5, total: 400, beats: 46 },
    rank: "253,464",
    badges: "3",
    reputation: "22",
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={`${cardBase} p-5 sm:p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">💻</div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">LeetCode</h3>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mb-4">
        <RadialStat primary={accents[0]} secondary={accents[1]} innerTop="400" innerBottom="3000" />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1">
          <StatBox label="Rank" value={stats.rank} />
          <StatBox label="Badges" value={stats.badges} />
          <StatBox label="Reputation" value={stats.reputation} />
        </div>
      </div>

      <div className="space-y-3">
        <ProgressBar label="Easy" solved={stats.easy.solved} total={stats.easy.total} beats={stats.easy.beats} color="#22d3ee" delay={0.2} />
        <ProgressBar label="Medium" solved={stats.medium.solved} total={stats.medium.total} beats={stats.medium.beats} color="#34d399" delay={0.25} />
        <ProgressBar label="Hard" solved={stats.hard.solved} total={stats.hard.total} beats={stats.hard.beats} color="#f87171" delay={0.3} />
      </div>
    </motion.div>
  );
});

/* -------------------------
   Supporting small components
   ------------------------- */
const RadialStat = memo(function RadialStat({
  primary,
  secondary,
  innerTop,
  innerBottom,
}: {
  primary: string;
  secondary: string;
  innerTop: string;
  innerBottom: string;
}) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96" aria-hidden>
        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          stroke="url(#gradient-leetcode)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 0.75 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
        <defs>
          <linearGradient id="gradient-leetcode" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{innerTop}</span>
        <span className="text-[10px] text-neutral-800/80">{innerBottom}</span>
      </div>
    </div>
  );
});

const StatBox = memo(function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="text-center p-2 rounded-lg bg-white/10 border border-white/20 max-w-full"
    >
      <div className="text-sm sm:text-base font-bold text-white">{value}</div>
      <div className={tinyMuted}>{label}</div>
    </motion.div>
  );
});

function ProgressBar({
  label,
  solved,
  total,
  beats,
  color,
  delay,
}: {
  label: string;
  solved: number;
  total: number;
  beats: number;
  color: string;
  delay: number;
}) {
  const percentage = (solved / total) * 100;
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-neutral-100/90">{label}</span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-100/80">
            {solved}/{total}
          </span>
          <span className="text-neutral-100/70">Beats: {beats}%</span>
        </div>
      </div>
      <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          variants={barGrow(`${percentage}%`, delay)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
/* -------------------------
   GitHubStats (Now SocialStats)
   ------------------------- */
   const GitHubStats = function GitHubStats({ accents }: { accents: string[] }) {
     const statsData = [
       { icon: FaLinkedin, color: "text-blue-600", label: "LinkedIn", value: 1814, suffix: " +  Followers" },
       { icon: FaInstagram, color: "text-pink-500", label: "Instagram", value: 2224, suffix: " +  Followers" },
       { icon: FaGithub, color: "text-purple-600", label: "Github Contributions", value: 444, suffix: " +  Contributions" },
       { icon: FaThreads, color: "text-white", label: "Threads", value: 349, suffix: " +  Followers" },
     ];
   
     const [counts, setCounts] = useState(statsData.map(() => 0));
   
     useEffect(() => {
       const duration = 2000; // animation duration in ms
       const interval = 30; // update interval in ms
       const steps = duration / interval;
   
       statsData.forEach((stat, index) => {
         let current = 0;
         const increment = stat.value / steps;
   
         const timer = setInterval(() => {
           current += increment;
           if (current >= stat.value) {
             current = stat.value;
             clearInterval(timer);
           }
           setCounts((prev) => {
             const updated = [...prev];
             updated[index] = Math.floor(current);
             return updated;
           });
         }, interval);
       });
     }, []);
   
     return (
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className={`${cardBase} w-full p-6 sm:p-8`}
       >
         <div className="flex items-center gap-3 mb-4">
         <div className="text-2xl">🌐</div>
           <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
             Socials
           </h3>
         </div>
         <div className="flex flex-col gap-6">
           {statsData.map((stat, index) => {
             const Icon = stat.icon;
             return (
               <div key={stat.label} className="flex items-center gap-4">
                 <Icon className={`${stat.color} w-8 h-8`} />
                 <div className="flex flex-col">
                   <span className="font-semibold text-lg sm:text-xl text-white">{stat.label}</span>
                   <span className="text-base sm:text-lg text-gray-300">
                     {counts[index].toLocaleString()}
                     {stat.suffix}
                   </span>
                 </div>
               </div>
             );
           })}
         </div>
       </motion.div>
     );
   };
   
  //  export default GitHubStats;
   
  