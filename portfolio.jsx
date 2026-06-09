const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* ============================================================
   TWEAKS
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontPair": "humanist",
  "density": "comfortable",
  "grayTone": "neutral",
  "layout": "minimal",
  "accent": "#F59425"
} /*EDITMODE-END*/;

const FONT_PAIRS = {
  humanist: {
    label: "Warm humanist",
    display: '"Schibsted Grotesk", system-ui, sans-serif',
    body: '"Hanken Grotesk", system-ui, sans-serif',
    meta: '"Hanken Grotesk", system-ui, sans-serif',
    tracking: "0.04em", transform: "none"
  },
  neutral: {
    label: "Plain grotesk",
    display: '"Public Sans", system-ui, sans-serif',
    body: '"Public Sans", system-ui, sans-serif',
    meta: '"Public Sans", system-ui, sans-serif',
    tracking: "0.06em", transform: "uppercase"
  },
  technical: {
    label: "A little technical",
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Hanken Grotesk", system-ui, sans-serif',
    meta: '"IBM Plex Mono", ui-monospace, monospace',
    tracking: "0.02em", transform: "none"
  }
};

const GRAY_TONES = {
  cool: { h: 255, c: 0.012 },
  neutral: { h: 0, c: 0 },
  warm: { h: 75, c: 0.013 }
};

const DENSITY = {
  compact: { padX: "5vw", sectionY: "76px", gap: "20px", hero: "clamp(2.3rem, 5.2vw, 4.4rem)", fs: "16px" },
  comfortable: { padX: "7vw", sectionY: "120px", gap: "28px", hero: "clamp(2.6rem, 6.2vw, 5.6rem)", fs: "17px" },
  airy: { padX: "9vw", sectionY: "168px", gap: "40px", hero: "clamp(3rem, 7vw, 6.6rem)", fs: "18px" }
};

const LANDING_TAGLINE = {
  fontFamily: '"Inter Tight", system-ui, sans-serif',
  fontWeight: 700,
  letterSpacing: "-0.005em",
  lineHeight: 1.5
};

/* ============================================================
   CONTENT  (realistic placeholders — swap for real work)
   ============================================================ */
const PROJECTS = [
{
  n: "01",
  slug: "fovere",
  title: "Fovere",
  year: "2026",
  topic: "Mobile App",
  meta: "Habit tracker · iOS · 2026",
  blurb: "I solo-built Fovere, the first completely free iOS habit tracker featuring full analytics with no ads or paywalls.",
  label: "mobile app",
  icon: "assets/fovere-icon.png",
  hero: "assets/Frame 14.png",
  hero2x: "assets/Frame 14.png",
  detailHero: "assets/Fovere_Screenshots/Frame 11 (1).png",
  detailIntro: [
    "Before building Fovere, I downloaded more than 30 habit tracker apps, started their seven-day trials, and wrote down every paid feature I could find. Then I added those features to Fovere for free to everyone.",
    "I designed the product in Figma Make and built it with Cursor. Fovere runs on React Native and Expo for iOS. The walkthrough below shows how it works in practice: quick daily logging, calendar views from week to year, and habit-by-habit analytics when you want to go deeper."
  ],
  tagline: "Build & Break Habits",
  intro: "Fovere is the habit tracker for building routines you can sustain\u2014and for breaking ones you want to quit or limit. Log in seconds with swipe gestures, see your week and year in Calendar, and go deep in Analytics with trends, heatmaps, and insights. Free, with no ads, and your data stays on your device.",
  buildNote: "I made this app entirely on Cursor with Claude and Figma Make AI.",
  sections: [
    {
      title: "Home & logging",
      body: "Your habits live on one clear Home screen: daily habits power the completion ring; break habits (reduce, cap, or quit) stay separate; weekly and monthly goals have their own sections so schedules are never mixed up. Swipe left to complete, swipe right to pause or delete\u2014with undo when you slip."
    },
    {
      title: "Build & break habits",
      body: "Create build habits (do more) or break habits (stay under a limit or avoid the behavior). Track with simple completion, quantity counts, or timed durations. Set targets or limits, pick an emoji, add notes, and configure reminders\u2014including per-habit times and weekday schedules for weekly habits."
    },
    {
      title: "Daily, weekly & monthly",
      body: "Daily habits are checked every day. Weekly and monthly habits accumulate progress across the week or calendar month\u2014the app explains how streaks treat these fairly so long-window goals do not unfairly break your consistency day by day."
    },
    {
      title: "Scoring you can trust",
      body: "A transparent 0\u2013100 daily score splits 100 points across active habits. Build habits earn their share when completed; break habits start at full credit and lose points only for today overflow past your limit. Optional strict mode counts only full completions, or allows partial progress\u2014your choice."
    },
    {
      title: "Calendar & analytics",
      body: "Calendar shows weekly and monthly completion, streaks, and a yearly view including Year in Beans. Analytics spans from recent days up to long ranges (including 6 months and a year), with habit heatmaps, trend vs prior periods, weekly rhythm (best and toughest days), habit movers, and per-habit completion and break-habit limit history."
    },
    {
      title: "Reminders & control",
      body: "Daily check-in reminders plus habit-specific notifications. Export habits to CSV, recover deleted habits for 30 days, pause without erasing history. Dark mode, English or Spanish, week start Sunday or Monday, haptic feedback."
    },
    {
      title: "Privacy",
      body: "No analytics SDKs, no ads, no tracking. Fovere does not upload your habits to a server; everything you enter is stored locally on your phone."
    }
  ],
  closing: "Download Fovere and start with one habit so easy you cannot say no."
},
{
  n: "02",
  slug: "sportaz",
  title: "Sportaz",
  year: "2024",
  topic: "E-commerce",
  meta: "Sports retail · e-commerce · 2024",
  blurb: "Co-founded a Football Jersey brand, scaled it to 400+ sales, and spent every day doing something I genuinely loved.",
  label: "e-commerce",
  icon: "assets/sportaz-icon.png",
  hero: "assets/sportaz-hero.png",
  detailHero: "assets/Sportaz/Frame 17.png",
  storyImageVariant: "cutout",
  detailIntro: [
    "I grew up obsessed with football. When a friend and I were looking for something to build together, we kept asking the same question: why did buying a shirt in Argentina feel so forgettable?",
    "Sportaz was our answer. Mystery boxes that made the purchase fun, and genuinely useful when you were buying for someone else."
  ],
  tagline: "Dare to surprise yourself",
  intro: "Co-founded a Football Jersey brand, scaled it to 400+ sales, and spent every day doing something I genuinely loved.",
  sections: [
    {
      title: "Brand & storefront",
      body: "Built the Sportaz identity and shopfront around a fast, athletic look\u2014lime green and bold type\u2014so the store felt energetic and trustworthy at first glance."
    },
    {
      title: "Sales & operations",
      body: "Sourced sports goods, listed them online, and fulfilled 400+ orders\u2014managing inventory, customer communication, and shipping."
    }
  ]
}];


const PHOTOS = [
{ cap: "35mm · porto", ratio: 0.78, shade: 0.94 },
{ cap: "rooftop · lisbon", ratio: 1.34, shade: 0.90 },
{ cap: "morning · home", ratio: 1.0, shade: 0.965 },
{ cap: "ferry · setúbal", ratio: 1.5, shade: 0.915 },
{ cap: "stairwell", ratio: 0.82, shade: 0.885 },
{ cap: "kitchen window", ratio: 1.0, shade: 0.945 },
{ cap: "long exposure", ratio: 1.42, shade: 0.90 },
{ cap: "film · expired", ratio: 0.8, shade: 0.925 },
{ cap: "tram, late", ratio: 1.0, shade: 0.955 },
{ cap: "low tide", ratio: 1.5, shade: 0.91 }];


const EDUCATION = [
  {
    degree: "Master\u2019s in Management, Analytics + AI",
    school: "Universidad Torcuato Di Tella",
    logo: "assets/about me/di tella.svg",
    courses: []
  },
  {
    degree: "Bachelor\u2019s Degree in Digital Business",
    school: "Universidad de San Andr\u00e9s",
    logo: "assets/about me/630bd3fd4d041c3b14c3529ba3433fcabc19a30b-5242880-removebg-preview.png",
    courses: []
  }
];

const LINKEDIN_PROFILE = "https://www.linkedin.com/in/franco-galluzzo/";
const CERTIFICATIONS_LINKEDIN = `${LINKEDIN_PROFILE}details/certifications/`;

const CERT_FILTERS = [
  { id: "all", label: "All" },
  { id: "data", label: "Data" },
  { id: "code", label: "Code" },
  { id: "ux", label: "UX/UI" }
];

const CERT_SCHOOL_LOGOS = {
  Microsoft: "assets/about me/microsoft_logo_icon_181372.png",
  Google: "assets/about me/Google.png",
  Coursera: "assets/about me/coursera logo.webp",
  DataCamp: "assets/about me/datacamp logo.png",
  Meta: "assets/about me/meta logo.webp"
};

function certLogoForSchool(school, existing) {
  if (existing) return existing;
  return CERT_SCHOOL_LOGOS[school] || null;
}

const PROFESSIONAL_CERTIFICATIONS = [
  {
    degree: "Power BI Data Analyst Associate (PL-300)",
    school: "Microsoft",
    logo: "assets/about me/microsoft_logo_icon_181372.png",
    courses: []
  },
  {
    degree: "Google Data Analytics Specialization",
    school: "Google",
    logo: "assets/about me/Google.png",
    courses: []
  },
  {
    degree: "Google UX Design Specialization",
    school: "Google",
    logo: "assets/about me/Google.png",
    courses: []
  }
];

function inferCertCategory(degree) {
  const d = degree.toLowerCase();
  if (
    d.includes("ux") || d.includes("ui ") || d.includes("(ui)") ||
    d.includes("figma") || d.includes("wireframe") || d.includes("visual design") ||
    d.includes("augmented reality") || d.includes("mobile ui") ||
    d.includes("diseño de interfaz") || d.includes("experiencia de usuario") ||
    d.includes("user experience") || d.includes("data-driven design")
  ) {
    return "ux";
  }
  if (
    d.includes("python") || d.includes("web development") ||
    d.includes("coding foundations") || d.includes("html and css")
  ) {
    return "code";
  }
  if (
    d.includes("sql") || d.includes("data") || d.includes("power bi") ||
    d.includes("pl-300") || d.includes("analytics") || d.includes("r programming") ||
    d.includes("business intelligence") || d.includes("data engineering") ||
    d.includes("generative ai") || d.includes("google ai") ||
    d.includes("visualization")
  ) {
    return "data";
  }
  return null;
}

const NAV = ["Projects", "Photography", "About"];

/* ============================================================
   HEADER
   ============================================================ */
function SiteHeader({ view, setView }) {
  const go = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="site-header" style={{
      position: "sticky", top: 0, zIndex: 50,
      padding: "clamp(12px, 2vh, 18px) 0",
      background: "oklch(0.992 var(--tone-c) var(--tone-h) / 0.92)",
      backdropFilter: "saturate(1.2) blur(12px)",
      WebkitBackdropFilter: "saturate(1.2) blur(12px)",
      borderBottom: "1px solid var(--line-soft)"
    }}>
      <div className="site-header__inner" style={{
        width: "100%",
        maxWidth: "var(--content-maxw)",
        margin: "0 auto",
        padding: "0 var(--content-pad-x)",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => go("Projects")}
          style={{
            all: "unset", cursor: "pointer",
            fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "0.8rem", letterSpacing: "-0.02em"
          }}>
          Franco Galluzzo
        </button>
        <nav style={{ display: "flex", gap: "clamp(18px, 3vw, 32px)", flexWrap: "wrap" }}>
          {NAV.map((item) => {
            const active = view === item;
            return (
              <button
                key={item}
                onClick={() => go(item)}
                style={{
                  all: "unset", cursor: "pointer",
                  fontFamily: "var(--font-meta)", fontSize: "0.62rem",
                  letterSpacing: "var(--meta-tracking)",
                  textTransform: "var(--meta-transform)",
                  color: active ? "var(--ink)" : "var(--ink-3)",
                  borderBottom: active ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                  paddingBottom: "2px",
                  transition: "color .2s ease, border-color .2s ease"
                }}>
                {item}
              </button>);
          })}
        </nav>
      </div>
    </header>);

}

/* ============================================================
   SMALL PARTS
   ============================================================ */
function Mono({ children, style }) {
  return (
    <span style={{
      fontFamily: "var(--font-meta)", fontSize: "0.72rem",
      letterSpacing: "var(--meta-tracking)", textTransform: "var(--meta-transform)",
      color: "var(--ink-3)", whiteSpace: "nowrap", ...style
    }}>{children}</span>);

}

function ProjectImage({ src, alt, ratio = 16 / 11, natural = false, style }) {
  if (natural) {
    return (
      <div style={{
        width: "100%",
        border: "1px solid var(--line)",
        overflow: "hidden",
        background: "oklch(0.97 var(--tone-c) var(--tone-h))",
        ...style
      }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>);
  }

  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: String(ratio),
      border: "1px solid var(--line)", overflow: "hidden",
      background: "oklch(0.97 var(--tone-c) var(--tone-h))",
      ...style
    }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>);
}

/* striped placeholder block — stands in for an image */
function Placeholder({ shade = 0.94, label, ratio }) {
  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: String(ratio || 16 / 10),
      background: `oklch(${shade} var(--tone-c) var(--tone-h))`,
      backgroundImage:
      "repeating-linear-gradient(135deg, transparent 0 11px, oklch(0.99 0 0 / .55) 11px 12px)",
      border: "1px solid var(--line)", overflow: "hidden",
      display: "flex", alignItems: "flex-end", padding: "12px"
    }}>
      {label && <Mono>{label}</Mono>}
    </div>);

}

function Hero({ layout, setView }) {
  const statement = "I find the patterns that don\u2019t add up.";
  const sub = "Fraud prevention analyst. I work in the noisy middle of payments \u2014 turning messy transaction data into a few clear decisions, and stopping the bad ones before they clear.";

  if (layout === "statement") {
    return (
      <section style={{ padding: "clamp(70px, 13vh, 150px) var(--pad-x) var(--section-y)" }}>
        <h1 style={{
          margin: 0, fontFamily: "var(--font-display)", fontWeight: 600,
          fontSize: "clamp(3rem, 9.5vw, 8.5rem)", lineHeight: 0.98,
          letterSpacing: "-0.03em", maxWidth: "16ch", textWrap: "balance"
        }}>{statement}</h1>
        <p style={{
          margin: "clamp(28px,4vw,52px) 0 0", maxWidth: "46ch",
          fontSize: "1.18rem", color: "var(--ink-2)", lineHeight: 1.55
        }}>{sub}</p>
      </section>);

  }

  if (layout === "editorial") {
    return (
      <section style={{
        padding: "clamp(56px, 9vh, 110px) var(--pad-x) var(--section-y)",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.7fr)",
        gap: "clamp(28px, 5vw, 80px)", alignItems: "start"
      }} className="hero-editorial">
        <div style={{ borderTop: "1.5px solid var(--ink)", paddingTop: "16px" }}>
          <Mono style={{ display: "block", color: "var(--ink)" }}>Index — 2026</Mono>
          <Mono style={{ display: "block", marginTop: "10px", lineHeight: 1.9 }}>
            01&nbsp;&nbsp;Projects<br />02&nbsp;&nbsp;Photography<br />03&nbsp;&nbsp;About
          </Mono>
        </div>
        <div>
          <h1 style={{
            margin: 0, fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "var(--hero-size)", lineHeight: 1.02,
            letterSpacing: "-0.025em", textWrap: "balance"
          }}>{statement}</h1>
          <p style={{
            margin: "clamp(22px,3vw,38px) 0 0", maxWidth: "50ch",
            fontSize: "1.12rem", color: "var(--ink-2)"
          }}>{sub}</p>
        </div>
      </section>);

  }

  /* minimal (default) — the big stacked landing */
  return <LandingHero setView={setView} />;
}

function useFitWidthText(contentRef, containerRef, { minPx = 20, maxPxCap = 160, fillRatio = 0.98, viewportBottomPad = 0 } = {}) {
  useEffect(() => {
    const content = contentRef.current;
    const box = containerRef.current;
    if (!content || !box) return;

    const fit = () => {
      const limit = box.clientWidth * fillRatio - 4;
      if (limit < 8) return;

      const measuredWidth = () => Math.ceil(content.getBoundingClientRect().width);
      const viewportBottom = () =>
        (window.visualViewport?.height ?? window.innerHeight) - viewportBottomPad;
      let hi = Math.min(maxPxCap, Math.max(minPx, Math.floor(limit / 5.5)));
      let lo = minPx;
      let best = minPx;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        content.style.fontSize = `${mid}px`;
        if (measuredWidth() <= limit) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      content.style.fontSize = `${best}px`;
      while (best > minPx && measuredWidth() > limit) {
        best -= 1;
        content.style.fontSize = `${best}px`;
      }

      if (viewportBottomPad > 0) {
        while (best > minPx && content.getBoundingClientRect().bottom > viewportBottom()) {
          best -= 1;
          content.style.fontSize = `${best}px`;
        }
        while (best > minPx && measuredWidth() > limit) {
          best -= 1;
          content.style.fontSize = `${best}px`;
        }
      }
    };

    const scheduleFit = () => requestAnimationFrame(fit);
    const ro = new ResizeObserver(scheduleFit);
    ro.observe(box);
    window.addEventListener("resize", scheduleFit);
    window.visualViewport?.addEventListener("resize", scheduleFit);
    window.visualViewport?.addEventListener("scroll", scheduleFit);
    scheduleFit();
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) scheduleFit();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", scheduleFit);
      window.visualViewport?.removeEventListener("resize", scheduleFit);
      window.visualViewport?.removeEventListener("scroll", scheduleFit);
      content.style.fontSize = "";
    };
  }, [contentRef, containerRef, minPx, maxPxCap, fillRatio, viewportBottomPad]);
}

function HoverWeightName({ text, style, elRef }) {
  return (
    <div
      ref={elRef}
      className="name-display"
      aria-label={text}
      style={style}>
      {text.split("").map((char, i) =>
      char === " " ?
      <span key={i} className="name-display__space" aria-hidden="true">
            &nbsp;
          </span> :

      <span key={i} className="name-display__char" aria-hidden="true">
            {char}
          </span>

      )}
    </div>);

}

function BigLink({ label, onClick }) {
  return (
    <button
      type="button"
      className="big-link"
      onClick={onClick}
      style={{
        display: "inline-block", width: "fit-content", maxWidth: "100%",
        cursor: "pointer", margin: 0, padding: 0,
        background: "none", border: "none", textAlign: "left",
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "clamp(2.4rem, 6.2vw, 6rem)", lineHeight: 1.0,
        letterSpacing: "-0.03em", textTransform: "uppercase"
      }}>
      {label}
    </button>);

}

/* ============================================================
   MINI LINE GRAPH  — self-drawing chart line for the landing hero
   Fills its container; path is generated from measured dimensions.
   ============================================================ */
function MiniLineGraph() {
  const svgRef  = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const svg  = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    let currentAnim = null;

    const setup = () => {
      const { width: W, height: H } = svg.getBoundingClientRect();
      if (W < 10 || H < 10) return;

      /* smooth spline — traced from reference chart (irregular peaks/valleys) */
      const px = (x, y) => `${(x * W).toFixed(1)},${(y * H).toFixed(1)}`;
      const pts = [
        [0.00, 0.64],  /* start — mid height */
        [0.11, 0.52],  /* small rounded hump */
        [0.26, 0.94],  /* deep drop */
        [0.33, 0.40],  /* sharp rise */
        [0.41, 0.73],  /* shallow dip */
        [0.56, 0.16],  /* tall broad peak */
        [0.63, 0.87],  /* sharp deep drop */
        [0.70, 0.28],  /* medium-high peak */
        [0.78, 0.56],  /* mid dip */
        [0.85, 0.07],  /* highest sharp peak */
        [0.93, 0.70],  /* descent */
        [1.00, 0.89]   /* end — low */
      ];
      let d = `M ${px(pts[0][0], pts[0][1])}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(i + 2, pts.length - 1)];
        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${px(cp1x, cp1y)} ${px(cp2x, cp2y)} ${px(p2[0], p2[1])}`;
      }

      path.setAttribute("d", d);

      const len = Math.ceil(path.getTotalLength());
      /* fixed visible segment (~9% of path) — gap hides the rest so only one “worm” shows */
      const seg = Math.max(6, Math.round(len * 0.095));
      path.style.strokeDasharray = `${seg} ${len - seg}`;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        path.style.strokeDashoffset = `${Math.round(len * 0.42)}`;
        return;
      }

      path.style.strokeDashoffset = "0";

      if (currentAnim) currentAnim.cancel();
      currentAnim = path.animate(
        [
          { strokeDashoffset: 0 },
          { strokeDashoffset: -len },
        ],
        { duration: 2000, easing: "linear", iterations: Infinity }
      );
    };

    /* wait one rAF so the flex layout has settled before measuring */
    const raf = requestAnimationFrame(setup);
    const ro  = new ResizeObserver(setup);
    ro.observe(svg);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (currentAnim) currentAnim.cancel();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%" height="100%"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LandingHero({ setView }) {
  const shellRef = useRef(null);
  const nameRef = useRef(null);
  useFitWidthText(nameRef, shellRef, {
    minPx: 24,
    maxPxCap: 160,
    fillRatio: 0.92,
    viewportBottomPad: 16
  });

  const scrollToWork = () => {
    const el = document.getElementById("work");
    if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
  };
  return (
    <section className="landing-hero" style={{
      height: "100svh",
      minHeight: "100svh",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden"
    }}>
      <div ref={shellRef} className="landing-hero__shell">
        <div className="landing-hero__inner">
        <div className="landing-top" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          columnGap: "var(--landing-menu-text-gap)",
          rowGap: "clamp(2px, 0.4vw, 8px)",
          alignItems: "stretch",
          width: "100%",
          minWidth: 0
        }}>
          <div
            className="landing-top__nav"
            style={{
              gridColumn: 1,
              gridRow: "1 / 4",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(2px, 0.4vw, 8px)",
              alignSelf: "end"
            }}>
            <div className="landing-top__projects">
              <BigLink label="Projects" onClick={scrollToWork} />
            </div>
            <div className="landing-top__photos">
              <BigLink label="Photos" onClick={() => setView("Photography")} />
            </div>
            <div className="landing-top__about">
              <BigLink label="About" onClick={() => setView("About")} />
            </div>
          </div>

          <div className="landing-top__side" style={{
            gridColumn: 2,
            gridRow: "1 / 4",
            display: "flex",
            flexDirection: "column",
            gap: "var(--landing-graph-text-gap)",
            alignSelf: "start",
            minWidth: 0
          }}>
            <div className="landing-top__graph" style={{ minHeight: 0 }}>
              <MiniLineGraph />
            </div>

            <p className="landing-top__tagline-headline" style={{
              margin: 0,
              maxWidth: "34ch",
              ...LANDING_TAGLINE,
              fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", lineHeight: 1.3, letterSpacing: "-0.01em"
            }}>
              Data Analytics, UX &amp; <span style={{ color: "var(--accent)" }}>AI enthusiast.</span>
            </p>

            <p className="landing-top__tagline-body" style={{
              margin: 0, maxWidth: "34ch",
              ...LANDING_TAGLINE,
              fontSize: "clamp(1.25rem, 2vw, 1.65rem)"
            }}>
              I like to create digital things that have value to people.
            </p>
          </div>
        </div>

        <div className="landing-hero__name-fit">
          <HoverWeightName
            elRef={nameRef}
            text="Franco Galluzzo"
            style={{
              textTransform: "uppercase",
              lineHeight: 1,
              letterSpacing: "-0.045em", whiteSpace: "nowrap", textAlign: "center",
              padding: "0.06em 0 0.04em",
              userSelect: "none", color: "var(--accent)",
              fontSize: "clamp(2.85rem, 14.5vw, 10rem)"
            }} />
        </div>
        </div>
      </div>
    </section>);

}

/* ============================================================
   PROJECTS
   ============================================================ */
function LandingSectionHead({ title, kicker }) {
  return (
    <div style={{
      marginBottom: "var(--gap)",
      paddingBottom: "18px",
      borderBottom: "1px solid var(--line)"
    }}>
      <div className="landing-top" style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        columnGap: "var(--landing-menu-text-gap)",
        alignItems: "baseline",
        width: "100%"
      }}>
        <h2 style={{
          margin: 0, gridColumn: 1, maxWidth: "34ch",
          ...LANDING_TAGLINE,
          fontSize: "clamp(1.25rem, 2vw, 1.65rem)"
        }}>{title}</h2>
        <Mono style={{ gridColumn: 2, textAlign: "right", justifySelf: "stretch" }}>{kicker}</Mono>
      </div>
    </div>);

}

function SectionHead({ kicker, title }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      gap: "20px", marginBottom: "var(--gap)",
      paddingBottom: "18px", borderBottom: "1px solid var(--line)"
    }}>
      <h2 style={{
        margin: 0, fontFamily: "var(--font-display)", fontWeight: 600,
        fontSize: "clamp(1.3rem, 2.4vw, 1.8rem)", letterSpacing: "-0.01em"
      }}>{title}</h2>
      <Mono>{kicker}</Mono>
    </div>);

}

function ProjectMetaBadge({ children, variant = "solid" }) {
  const outline = variant === "outline";
  return (
    <span style={{
      display: "inline-block",
      padding: outline ? "6px 14px" : "7px 13px",
      borderRadius: outline ? "999px" : "6px",
      background: outline ? "transparent" : "#000",
      color: "#fff",
      border: outline ? "1px solid #fff" : "none",
      fontFamily: "var(--font-body)",
      fontSize: "0.78rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
      lineHeight: 1,
      whiteSpace: "nowrap"
    }}>{children}</span>);

}

function ProjectCardLayout({ project, as = "h3", showBlurb = true, onOpen }) {
  const TitleTag = as;
  const [mediaHover, setMediaHover] = useState(false);
  const interactive = as !== "h1";
  const overlay = interactive;
  const detailBanner = as === "h1" && project.detailHero;

  const titleEl =
  <TitleTag style={{
    margin: 0,
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: as === "h1" ?
    "clamp(1.9rem, 3vw, 2.35rem)" :
    "clamp(1.75rem, 2.6vw, 2rem)",
    letterSpacing: "-0.02em",
    lineHeight: 1.08,
    color: overlay ? "#fff" : "var(--ink)"
  }}>
    {project.title}
    {interactive &&
    <span
      aria-hidden="true"
      className="project-card__arrow"
      style={{
        display: "inline-block",
        marginLeft: "0.28em",
        opacity: mediaHover ? 1 : 0,
        transform: mediaHover ? "translateX(0)" : "translateX(-5px)",
        transition: "opacity .28s ease, transform .28s ease"
      }}>→</span>
    }
  </TitleTag>;

  const badgesEl =
  <div className="project-card__badges" style={{
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    flexShrink: 0
  }}>
    {project.year && <ProjectMetaBadge variant={overlay ? "outline" : "solid"}>{project.year}</ProjectMetaBadge>}
    {project.topic && <ProjectMetaBadge variant={overlay ? "outline" : "solid"}>{project.topic}</ProjectMetaBadge>}
  </div>;

  return (
    <div
      className={detailBanner ? "project-card-layout project-card-layout--detail-banner" : "project-card-layout"}
      style={{
        display: "flex",
        justifyContent: detailBanner ? "stretch" : "flex-end"
      }}>
      <div
        className={detailBanner ? "project-card__block project-card__block--detail-banner" : "project-card__block"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          width: detailBanner ? "100%" : "min(100%, var(--project-block-w))",
          maxWidth: detailBanner ? "100%" : "var(--project-block-w)",
          alignSelf: detailBanner ? "stretch" : "flex-end"
        }}>
        {!overlay &&
        <div className="project-card__head" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "2px"
        }}>
          {titleEl}
          {badgesEl}
        </div>
        }
        <ProjectMedia
          project={project}
          heroSrc={detailBanner ? project.detailHero : undefined}
          banner={detailBanner}
          interactive={interactive}
          onHoverChange={setMediaHover}
          onOpen={onOpen}
          overlay={overlay ?
          <div className="project-media__overlay" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px"
          }}>
            {titleEl}
            {badgesEl}
          </div> :
          null} />
        {showBlurb && as !== "h1" && (project.blurb || project.tagline) &&
        <p className="project-card__blurb" style={{
          margin: "10px 0 0",
          fontSize: "clamp(0.92rem, 1.4vw, 1rem)",
          lineHeight: 1.55,
          color: "var(--ink-2)"
        }}>{project.blurb || project.tagline}</p>
        }
      </div>
    </div>);

}

function ProjectMedia({ project, heroSrc, banner = false, interactive = false, onHoverChange, onOpen, overlay = null }) {
  const [failed, setFailed] = useState(false);
  const src = heroSrc || project.hero2x || project.hero;

  const wrapProps = interactive ? {
    role: "button",
    tabIndex: 0,
    "aria-label": `Open ${project.title}`,
    onClick: () => onOpen?.(),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen?.();
      }
    },
    onMouseEnter: () => onHoverChange?.(true),
    onMouseLeave: () => onHoverChange?.(false),
    style: { cursor: "pointer" }
  } : {};

  const wrapStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "32px",
    ...wrapProps.style
  };

  const mediaStyle = banner ? {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "14px",
    background: "oklch(0.975 var(--tone-c) var(--tone-h))"
  } : {
    width: "100%",
    height: "var(--project-media-h)",
    display: "block",
    borderRadius: "14px",
    background: "oklch(0.93 var(--tone-c) var(--tone-h))"
  };

  const overlayEl = overlay &&
  <div
    className="project-media__overlay-wrap"
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "clamp(18px, 3vw, 28px)",
      background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)",
      pointerEvents: "none"
    }}>
    {overlay}
  </div>;

  if (src && !failed) {
    const srcSet = !banner && project.hero2x ?
    `${project.hero} 560w, ${project.hero2x} 1024w` :
    undefined;

    return (
      <div
        className={banner ? "project-media-wrap project-media-wrap--banner" : "project-media-wrap"}
        {...wrapProps}
        style={wrapStyle}>
        <img
          src={src.split("/").map((part, i, arr) => i < arr.length - 1 ? part : encodeURIComponent(part)).join("/")}
          srcSet={srcSet}
          sizes={banner ? "(max-width: 720px) 100vw, min(100vw, var(--maxw))" : "(max-width: 720px) 100vw, 560px"}
          alt=""
          onError={() => setFailed(true)}
          className={banner ? "project-media project-media--banner" : "project-media"}
          style={{
            ...mediaStyle,
            objectFit: banner ? "contain" : "cover",
            objectPosition: "center"
          }} />
        {overlayEl}
      </div>);

  }

  return (
    <div
      className="project-media-wrap"
      {...wrapProps}
      style={wrapStyle}>
      <div
        className="project-placeholder"
        aria-hidden="true"
        style={{
          ...mediaStyle,
          border: "1px solid var(--line)"
        }} />
      {overlayEl}
    </div>);

}

function ProjectCard({ p, indexed, onOpen, cardRef, showBlurb = true, className = "" }) {
  return (
    <article
      ref={cardRef}
      className={className || undefined}
      style={{
        display: "grid",
        gap: "clamp(12px, 2vw, 16px)"
      }}>
      {indexed && <Mono style={{ display: "block" }}>{p.n}</Mono>}
      <ProjectCardLayout project={p} showBlurb={showBlurb} onOpen={() => onOpen(p.slug)} />
    </article>);

}

/* ============================================================
   Project detail — scroll story (sticky image, scrolling text)
   ============================================================ */
const PROJECT_STORY = {
  fovere: [
  {
    img: "assets/Fovere_Screenshots/Device.png",
    eyebrow: "Home",
    title: "Built to stay out of your way",
    body: "Fovere is designed around one idea: logging a habit should take seconds, not willpower. A clear home screen, swipe-to-complete gestures, and a light visual language keep daily tracking simple, so you spend less time in the app and more time living the habits you care about."
  },
  {
    img: "assets/Fovere_Screenshots/Device-3.png",
    eyebrow: "Calendar · Weekly",
    title: "See how your week is really going",
    body: "The weekly calendar turns your day-to-day into something you can read at a glance. Bar charts show completion by day, with tooltips that spell out the numbers behind each bar: how much you finished, and what that means for your progress. No digging through menus to understand your week."
  },
  {
    img: "assets/Fovere_Screenshots/Device-2.png",
    eyebrow: "Calendar · Yearly",
    title: "Long-term progress, one view away",
    body: "Switch between months or the full year to see patterns that daily logging alone can\u2019t show. Color-coded days make strong stretches and rough patches obvious, so you can spot trends early and adjust before a habit quietly slips."
  },
  {
    img: "assets/Fovere_Screenshots/Device-1.png",
    eyebrow: "Analytics",
    title: "Insights for every habit",
    body: "Filter analytics by habit and compare trends over 7 days, 30 days, six months, or a year. See which routines are holding steady, which are improving, and which need attention, with clear charts and summaries so you know exactly where to focus next."
  }
  ],
  sportaz: [
  {
    img: "assets/Sportaz/edited-image-1780941151368.png",
    eyebrow: "Origin",
    title: "Two friends who wanted to build something",
    body: "I started Sportaz with a friend from school. We both loved football and wanted something that was ours. Nothing fancy at first. We just felt the experience around shirts did not match how much people actually cared about the game."
  },
  {
    img: "assets/Sportaz/image (1).png",
    eyebrow: "Mystery boxes",
    imageScale: 1.45,
    title: "A twist on buying a shirt",
    body: "Picking a jersey is usually straightforward. You already know what you want. We flipped that. Customers could order a mystery shirt and end up with a kit they never would have chosen on their own. The surprise was half the point."
  },
  {
    img: "assets/Sportaz/edited-image-1780940884682.png",
    eyebrow: "Growth",
    imageScale: 1.45,
    title: "Gifts, ads, and learning on the job",
    body: "The boxes caught on as gifts. If you were not sure what shirt someone would like, you could leave the choice to us. Once we started running ads on Meta, orders started coming in from provinces across the country. We were shipping mystery boxes out of Buenos Aires to places we had never expected, and that is where I first got my hands dirty figuring out what was actually working."
  }
  ]
};

function StoryStepCopy({ step, index, total }) {
  return (
    <div className="project-story__copy">
      <Mono style={{
        display: "block",
        color: "var(--accent)",
        marginBottom: "18px",
        textTransform: "none",
        letterSpacing: "0.04em"
      }}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {step.eyebrow}
      </Mono>
      <h2 style={{
        margin: "0 0 clamp(14px, 2vw, 20px)",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
        letterSpacing: "-0.02em",
        lineHeight: 1.12,
        color: "var(--ink)"
      }}>{step.title}</h2>
      <p style={{
        margin: 0,
        fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
        lineHeight: 1.6,
        color: "var(--ink-2)",
        maxWidth: "44ch"
      }}>{step.body}</p>
    </div>);

}

function StoryStepImage({ step, className = "" }) {
  return (
    <div className={`project-story__crop ${className}`.trim()}>
      <img
        src={step.img}
        alt={step.eyebrow}
        loading="lazy" />
    </div>);

}

function AlternatingScrollStory({ steps }) {
  return (
    <div className="project-story project-story--alternating">
      {steps.map((s, i) => {
        const flip = i % 2 === 1;
        const media = <StoryStepImage key="media" step={s} className="project-story__crop--inline" />;
        const copy = <StoryStepCopy key="copy" step={s} index={i} total={steps.length} />;
        return (
          <section
            key={i}
            className={`project-story__row${flip ? " project-story__row--flip" : ""}`}>
            {flip ? [copy, media] : [media, copy]}
          </section>);

      })}
    </div>);

}

function StickyScrollStory({ steps, imageVariant = "phone" }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);
  const isCutout = imageVariant === "cutout";

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean);
    if (!elements.length) return;

    const update = () => {
      const trigger = window.innerHeight * 0.5;
      let next = 0;
      elements.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= trigger) next = i;
      });
      setActive(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [steps]);

  return (
    <div className="fovere-story" style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 0.92fr) minmax(0, 1fr)",
      columnGap: "clamp(32px, 6vw, 96px)",
      alignItems: "start",
      maxWidth: "var(--maxw)",
      margin: "0 auto",
      padding: "0 var(--pad-x)"
    }}>
      <div className="fovere-story__sticky" style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div
          className={`fovere-story__phone${isCutout ? " fovere-story__phone--cutout" : ""}`}
          style={isCutout ? {
            position: "relative",
            width: "min(44vw, 500px)",
            height: "min(72vh, 540px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          } : {
            position: "relative",
            display: "flex",
            justifyContent: "center"
          }}>
          {steps.map((s, i) => {
            const imgScale = s.imageScale || 1;
            const activeScale = active === i ? imgScale : imgScale * 0.97;
            return (
          <img
            key={s.img}
            src={s.img.split("/").map((part, idx, arr) => idx < arr.length - 1 ? part : encodeURIComponent(part)).join("/")}
            alt={s.eyebrow}
            aria-hidden={active === i ? undefined : true}
            className={isCutout ? "fovere-story__cutout-img" : undefined}
            style={isCutout ? {
              position: "absolute",
              top: "50%",
              left: "50%",
              maxHeight: `${Math.round(100 * imgScale)}%`,
              maxWidth: `${Math.round(100 * imgScale)}%`,
              width: "auto",
              height: "auto",
              display: "block",
              objectFit: "contain",
              transform: `translate(-50%, -50%) scale(${activeScale / imgScale})`,
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.55s ease, transform 0.55s ease",
              filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.16))",
              pointerEvents: "none"
            } : {
              height: "min(78vh, 660px)",
              width: "auto",
              display: "block",
              position: i === 0 ? "relative" : "absolute",
              top: i === 0 ? "auto" : 0,
              left: i === 0 ? "auto" : "50%",
              transform: i === 0 ?
              active === i ? "scale(1)" : "scale(0.97)" :
              `translateX(-50%) ${active === i ? "scale(1)" : "scale(0.97)"}`,
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.55s ease, transform 0.55s ease",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.18))",
              pointerEvents: "none"
            }} />
            );
          })}
        </div>
      </div>

      <div className="fovere-story__steps">
        {steps.map((s, i) =>
        <div
          key={i}
          ref={(el) => stepRefs.current[i] = el}
          className="fovere-story__step"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: active === i ? 1 : 0.32,
            transition: "opacity 0.5s ease"
          }}>
          <img
            className={`fovere-story__step-img${isCutout ? " fovere-story__cutout-img" : ""}`}
            src={s.img.split("/").map((part, idx, arr) => idx < arr.length - 1 ? part : encodeURIComponent(part)).join("/")}
            alt={s.eyebrow}
            style={{
              display: "none",
              ...(isCutout && s.imageScale ? { maxHeight: `${Math.round(72 * s.imageScale)}vh` } : null)
            }} />
          <StoryStepCopy step={s} index={i} total={steps.length} />
        </div>
        )}
      </div>
    </div>);

}

function ProjectScrollStory({ steps, layout = "sticky", imageVariant = "phone" }) {
  if (layout === "alternating") return <AlternatingScrollStory steps={steps} />;
  return <StickyScrollStory steps={steps} imageVariant={imageVariant} />;
}

function ProjectDetailView({ project, onBack }) {
  const storySteps = PROJECT_STORY[project.slug];

  if (project.detailHero && storySteps) {
    return (
      <main className="fovere-detail" style={{ padding: "12px 0 clamp(48px, 8vh, 88px)" }}>
        {project.detailHero &&
        <div
          className="fovere-detail__hero"
          style={{
            padding: "0 var(--pad-x)",
            maxWidth: "var(--maxw)",
            margin: "0 auto"
          }}>
          <ProjectMedia
            project={project}
            heroSrc={project.detailHero}
            banner />
        </div>
        }

        {(project.detailIntro || project.tagline) &&
        <div
          className="fovere-detail__intro"
          style={{
            padding: "clamp(20px, 3vw, 32px) var(--pad-x) 0",
            maxWidth: "var(--maxw)",
            margin: "0 auto"
          }}>
          {project.tagline &&
          <p className="fovere-detail__tagline" style={{
            margin: "0 0 10px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "var(--ink)",
            textAlign: "center"
          }}>{project.tagline}</p>
          }
          {project.detailIntro &&
          (Array.isArray(project.detailIntro) ? project.detailIntro : [project.detailIntro]).map((para, i) =>
          <p
            key={i}
            className="fovere-detail__blurb"
            style={{
              margin: i === 0 ? 0 : "14px 0 0",
              width: "100%",
              maxWidth: "none",
              fontSize: "clamp(1rem, 1.5vw, 1.12rem)",
              lineHeight: 1.6,
              color: "var(--ink-2)"
            }}>{para}</p>
          )
          }
        </div>
        }

        <ProjectScrollStory
          steps={storySteps}
          layout={project.storyLayout}
          imageVariant={project.storyImageVariant} />
      </main>);

  }

  return (
    <main style={{ padding: "var(--header-body-gap) 0 var(--section-y)" }}>
      <div style={{
        padding: "0 var(--pad-x)",
        maxWidth: "var(--maxw)",
        margin: "0 auto"
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            all: "unset", cursor: "pointer", display: "inline-flex",
            alignItems: "center", gap: "8px", marginBottom: "clamp(24px, 3vw, 36px)"
          }}>
          <Mono style={{ color: "var(--ink-2)" }}>&larr; Back to projects</Mono>
        </button>

        <div style={{ marginBottom: "clamp(32px, 4vw, 48px)" }}>
          <ProjectCardLayout project={project} as="h1" />
        </div>
      </div>

      <div style={{
        padding: "0 var(--pad-x)",
        maxWidth: "760px",
        margin: "0 auto"
      }}>
        {project.intro &&
        <p style={{
          margin: "0 0 clamp(20px, 3vw, 28px)",
          fontSize: "clamp(1.05rem, 2vw, 1.2rem)", lineHeight: 1.6, color: "var(--ink)"
        }}>{project.intro}</p>
        }

        {project.buildNote &&
        <p style={{
          margin: "0 0 clamp(32px, 4vw, 48px)",
          padding: "16px 18px",
          borderLeft: "3px solid var(--accent)",
          background: "oklch(0.975 var(--tone-c) var(--tone-h))",
          fontSize: "0.98rem", lineHeight: 1.55, color: "var(--ink-2)"
        }}>{project.buildNote}</p>
        }

        {project.sections?.map((section) =>
        <section key={section.title} style={{ marginBottom: "clamp(28px, 4vw, 40px)" }}>
          <h2 style={{
            margin: "0 0 10px", fontFamily: "var(--font-display)", fontWeight: 600,
            fontSize: "1.05rem", letterSpacing: "-0.01em"
          }}>{section.title}</h2>
          <p style={{ margin: 0, color: "var(--ink-2)", lineHeight: 1.65 }}>{section.body}</p>
        </section>
        )}

        {project.closing &&
        <p style={{
          margin: "clamp(32px, 4vw, 48px) 0 0",
          fontSize: "1.05rem", lineHeight: 1.55, color: "var(--ink)"
        }}>{project.closing}</p>
        }
      </div>
    </main>);

}

function ProjectsView({ layout, onOpenProject }) {
  const indexed = layout === "editorial";
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const elements = cardRefs.current.filter(Boolean);
    if (!elements.length) return;

    const updateActive = () => {
      const viewportCenter = window.innerHeight * 0.42;
      let next = 0;
      let bestDistance = Infinity;
      elements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height * 0.35;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          next = i;
        }
      });
      setActiveIndex(next);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const activeProject = PROJECTS[activeIndex];
  const activeBlurb = activeProject?.blurb || activeProject?.tagline || "";

  return (
    <main id="work" style={{
      padding: "clamp(48px, 8vh, 88px) var(--pad-x) var(--section-y)"
    }}>
      <div className="projects-featured" style={{
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1.15fr) minmax(0, 1.85fr)",
        columnGap: "var(--landing-menu-text-gap)",
        alignItems: "start",
        width: "100%",
        maxWidth: "var(--maxw)",
        margin: "0 auto"
      }}>
        <aside className="projects-featured__aside" style={{
          position: "sticky",
          top: "clamp(20px, 4vh, 40px)"
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.35rem, 2.5vw, 2rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.12
          }}>Featured Projects</h2>
          <Mono style={{
            display: "block",
            marginTop: "14px",
            color: "var(--ink-3)",
            textTransform: "none",
            letterSpacing: "0.02em"
          }}>2024 – 2026</Mono>
          {activeBlurb &&
          <p
            key={activeProject?.slug}
            className="projects-featured__blurb"
            style={{
              margin: "clamp(24px, 4vw, 36px) 0 0",
              fontSize: "clamp(1.2rem, 2.4vw, 1.75rem)",
              lineHeight: 1.45,
              letterSpacing: "-0.015em",
              color: "var(--ink-2)",
              maxWidth: "100%",
              width: "100%"
            }}>{activeBlurb}</p>
          }
        </aside>

        <div className="projects-featured__list" style={{
          display: "grid",
          gap: "clamp(48px, 8vw, 80px)",
          minWidth: 0
        }}>
          {PROJECTS.map((p, i) =>
          <ProjectCard
            key={p.n}
            p={p}
            indexed={indexed}
            onOpen={onOpenProject}
            showBlurb={false}
            className="projects-featured__card"
            cardRef={(el) => {
              cardRefs.current[i] = el;
              if (el) el.dataset.projectIndex = String(i);
            }} />
          )}
        </div>
      </div>
    </main>);

}

/* ============================================================
   PHOTOGRAPHY  — horizontal collage, scroll-jacked
   ============================================================ */
const PHOTO_CAMERA_SRC = "assets/sony-cybershot-camera.png";
const PHOTO_CAMERA_LABEL = "Sony Cyber-shot DSC-W320";
const PHOTO_NAV = [PHOTO_CAMERA_LABEL];

const CAMARITA_IMAGES = [
  "Images_camarita/DSC02823.JPG",
  "Images_camarita/DSC02832.JPG",
  "Images_camarita/DSC02840.JPG",
  "Images_camarita/DSC03359.JPG",
  "Images_camarita/DSC03443.JPG",
  "Images_camarita/DSC03536.JPG",
  "Images_camarita/DSC03547.JPG",
  "Images_camarita/DSC03157.JPG",
  "Images_camarita/DSC03550.JPG",
  "Images_camarita/DSC03730.JPG",
  "Images_camarita/DSC03657.JPG",
  "Images_camarita/DSC03762.JPG",
  "Images_camarita/DSC03773.JPG",
  "Images_camarita/DSC03772.JPG",
  "Images_camarita/DSC03769.JPG",
  "Images_camarita/DSC03383.JPG",
  "Images_camarita/DSC03571.JPG",
  "Images_camarita/DSC03658.JPG",
  "Images_camarita/DSC03883.JPG",
];

const PHOTO_LAYOUT_GROUPS = [
  {
    mt: "1vh",
    cols: [[
      { h: "clamp(310px, 44vh, 460px)", ar: "0.76" },
      { h: "clamp(200px, 28vh, 300px)", ar: "1.38" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.66" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(310px, 44vh, 460px)", ar: "0.76" },
      { h: "clamp(225px, 31vh, 340px)", ar: "1.4" },
    ]],
  },
  {
    mt: "0",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.74" },
    ]],
  },
  {
    mt: "1vh",
    cols: [
      [
        { h: "clamp(260px, 38vh, 395px)", ar: "0.74" },
        { h: "clamp(210px, 30vh, 315px)", ar: "1.16" },
      ],
      [
        { h: "clamp(260px, 38vh, 395px)", ar: "0.74" },
        { h: "clamp(210px, 30vh, 315px)", ar: "1.16" },
      ],
    ],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.66" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(310px, 44vh, 460px)", ar: "0.76" },
      { h: "clamp(200px, 28vh, 300px)", ar: "1.33" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.68" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [
      [
        { h: "clamp(260px, 38vh, 395px)", ar: "0.74" },
        { h: "clamp(210px, 30vh, 315px)", ar: "1.16" },
      ],
      [
        { h: "clamp(260px, 38vh, 395px)", ar: "0.74" },
        { h: "clamp(210px, 30vh, 315px)", ar: "1.16" },
      ],
    ],
  },
  {
    mt: "1vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.74" },
    ]],
  },
  {
    mt: "4vh",
    cols: [[
      { h: "clamp(310px, 44vh, 460px)", ar: "0.76" },
      { h: "clamp(200px, 28vh, 300px)", ar: "1.38" },
    ]],
  },
  {
    mt: "4vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.66" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [
      [
        { h: "clamp(260px, 38vh, 395px)", ar: "0.74" },
        { h: "clamp(210px, 30vh, 315px)", ar: "1.16" },
      ],
      [
        { h: "clamp(260px, 38vh, 395px)", ar: "0.74" },
        { h: "clamp(210px, 30vh, 315px)", ar: "1.16" },
      ],
    ],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.68" },
    ]],
  },
  {
    mt: "1vh",
    cols: [[
      { h: "clamp(310px, 44vh, 460px)", ar: "0.76" },
      { h: "clamp(200px, 28vh, 300px)", ar: "1.38" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.74" },
    ]],
  },
  {
    mt: "0.5vh",
    cols: [[
      { h: "clamp(520px, 70vh, 820px)", ar: "0.68" },
    ]],
  },
];

function assignPhotoSources(groups, images) {
  let i = 0;
  return groups
    .map((group) => ({
      ...group,
      cols: group.cols
        .map((col) => {
          const assigned = [];
          for (const photo of col) {
            if (i >= images.length) break;
            assigned.push({
              ...photo,
              src: images[i++],
            });
          }
          if (!assigned.length) return null;
          const colLength = assigned.length;
          return assigned.map((p) => ({ ...p, colLength }));
        })
        .filter(Boolean),
    }))
    .filter((group) => group.cols.length > 0);
}

function buildPhotoGroups(images) {
  return assignPhotoSources(PHOTO_LAYOUT_GROUPS, images);
}

function flattenPhotoList(groups) {
  return groups.flatMap((group) => group.cols.flatMap((col) => col));
}

function moveGalleryImage(images, fromIdx, toIdx) {
  if (toIdx < 0 || toIdx >= images.length || fromIdx === toIdx) return images;
  const next = [...images];
  [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
  return next;
}

function removeGalleryImage(images, idx) {
  return images.filter((_, i) => i !== idx);
}

/* Saved crop & frame adjustments (from photo editor) */
const PHOTO_EDITS = {
  "Images_camarita/DSC02823.JPG": { ar: 1.08 },
  "Images_camarita/DSC02832.JPG": { ar: 1.08, posY: 73 },
  "Images_camarita/DSC02840.JPG": { ar: 0.83, posX: 41, posY: 52 },
  "Images_camarita/DSC03359.JPG": { ar: 1.8, posX: 73, posY: 43 },
  "Images_camarita/DSC03443.JPG": { ar: 1.8 },
  "Images_camarita/DSC03536.JPG": { ar: 1.8 },
  "Images_camarita/DSC03547.JPG": { ar: 1.8 },
  "Images_camarita/DSC03157.JPG": { ar: 1.8 },
  "Images_camarita/DSC03550.JPG": { ar: 1.29, posX: 36 },
  "Images_camarita/DSC03730.JPG": { ar: 1.29, posY: 82 },
  "Images_camarita/DSC03657.JPG": { ar: 1.8 },
  "Images_camarita/DSC03762.JPG": { ar: 1.8 },
  "Images_camarita/DSC03773.JPG": { ar: 1.8, posX: 30, posY: 27 },
  "Images_camarita/DSC03772.JPG": { ar: 1.8 },
  "Images_camarita/DSC03769.JPG": { ar: 1.8 },
  "Images_camarita/DSC03383.JPG": { ar: 1.8 },
  "Images_camarita/DSC03571.JPG": { ar: 1.61, posX: 100, posY: 88 },
  "Images_camarita/DSC03658.JPG": { ar: 1.61, posX: 0, posY: 0 },
  "Images_camarita/DSC03883.JPG": { ar: 0.5, posY: 100 },
};

const PHOTO_GALLERY_STYLE_DEFAULTS = {
  shadow: true,
  shadowAmount: 65,
  rounded: true,
  cornerRadius: 6,
};

function photoGalleryStyleVars(style) {
  const s = { ...PHOTO_GALLERY_STYLE_DEFAULTS, ...style };
  const radius = s.rounded ? `${s.cornerRadius}px` : "0px";
  let shadow = "none";
  let shadowPad = "0px";
  if (s.shadow && s.shadowAmount > 0) {
    const t = s.shadowAmount / 100;
    const y1 = 1 + 2 * t;
    const blur1 = 3 + 5 * t;
    const a1 = 0.06 + 0.1 * t;
    const y2 = 3 + 8 * t;
    const blur2 = 10 + 22 * t;
    const a2 = 0.1 + 0.18 * t;
    shadow =
      `0 ${y1.toFixed(1)}px ${blur1.toFixed(1)}px rgba(0, 0, 0, ${a1.toFixed(3)}), ` +
      `0 ${y2.toFixed(1)}px ${blur2.toFixed(1)}px rgba(0, 0, 0, ${a2.toFixed(3)})`;
    shadowPad = `${Math.round(6 + 20 * t)}px`;
  }
  return {
    "--photo-frame-radius": radius,
    "--photo-frame-shadow": shadow,
    "--photo-frame-shadow-pad": shadowPad,
  };
}

function parseClampHeight(h) {
  const m = String(h).match(/clamp\((\d+)px,\s*([\d.]+)vh,\s*(\d+)px\)/);
  if (!m) return { min: 200, vh: 30, max: 300 };
  return { min: Number(m[1]), vh: Number(m[2]), max: Number(m[3]) };
}

function buildClampHeight({ min, vh, max }) {
  return `clamp(${Math.round(min)}px, ${vh}vh, ${Math.round(max)}px)`;
}

function photoWebSrc(src) {
  return `Images_camarita/web/${src.split("/").pop()}`;
}

function photoFrameHeight(colLength, frameHPct = 100) {
  const base = colLength <= 1
    ? "var(--photo-view-h)"
    : `calc((var(--photo-view-h) - ${(colLength - 1) * 18}px) / ${colLength})`;
  if (frameHPct >= 100) return base;
  return `calc(${base} * ${frameHPct / 100})`;
}

function photoDefaults(photo) {
  return {
    posX: 50,
    posY: 50,
    zoom: 1,
    frameH: 100,
    ar: Number(photo.ar),
  };
}

function effectivePhotoEdit(photo, edits) {
  return { ...photoDefaults(photo), ...(PHOTO_EDITS[photo.src] || {}), ...(edits || {}) };
}

function photoFrameStyle(photo, colLength, edits) {
  const e = effectivePhotoEdit(photo, edits);
  const frameH = e.frameH ?? 100;
  return {
    height: photoFrameHeight(colLength, frameH),
    aspectRatio: String(e.ar),
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
    display: "block",
    alignSelf: frameH < 100 ? "flex-start" : "stretch",
  };
}

function PhotoGalleryFrame({ photo, colLength, runtimeEdits }) {
  const live = runtimeEdits && Object.keys(runtimeEdits).length > 0;
  if (live) {
    return (
      <PhotoCropPreview
        photo={photo}
        colLength={colLength}
        runtimeEdits={runtimeEdits}
      />
    );
  }
  return (
    <div className="photo-frame__media" style={photoFrameStyle(photo, colLength, null)}>
      <img
        src={photoWebSrc(photo.src)}
        alt=""
        loading="lazy"
        draggable="false"
        onError={(e) => {
          if (!e.currentTarget.dataset.fallback) {
            e.currentTarget.dataset.fallback = "1";
            e.currentTarget.src = photo.src;
          }
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}

function PhotoCropPreview({ photo, colLength, runtimeEdits }) {
  const wrapRef = useRef(null);
  const edit = effectivePhotoEdit(photo, runtimeEdits);
  const frame = photoFrameStyle(photo, colLength, runtimeEdits);
  const [crop, setCrop] = useState(null);

  const applyCrop = useCallback(() => {
    const wrap = wrapRef.current;
    const img = wrap?.querySelector("img");
    if (!wrap || !img?.naturalWidth) return;

    const cw = wrap.clientWidth;
    const ch = wrap.clientHeight;
    if (!cw || !ch) return;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const zoom = edit.zoom ?? 1;
    const scale = Math.max(cw / nw, ch / nh) * zoom;
    const sw = nw * scale;
    const sh = nh * scale;
    const maxPanX = Math.max(0, (sw - cw) / 2);
    const maxPanY = Math.max(0, (sh - ch) / 2);
    const tx = ((50 - edit.posX) / 50) * maxPanX;
    const ty = ((50 - edit.posY) / 50) * maxPanY;

    setCrop({ sw, sh, tx, ty });
  }, [edit.posX, edit.posY, edit.zoom, edit.ar, edit.frameH, colLength]);

  useEffect(() => {
    applyCrop();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(applyCrop);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [applyCrop]);

  const imgStyle = crop ? {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: crop.sw,
    height: crop.sh,
    maxWidth: "none",
    transform: `translate(calc(-50% + ${crop.tx}px), calc(-50% + ${crop.ty}px))`,
    display: "block",
  } : {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${edit.posX}% ${edit.posY}%`,
    display: "block",
  };

  return (
    <div ref={wrapRef} className="photo-frame__media" style={frame}>
      <img
        src={photo.src}
        alt=""
        loading="lazy"
        draggable="false"
        onLoad={applyCrop}
        style={imgStyle}
      />
    </div>
  );
}

function PhotoLightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="photo-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <button
        className="photo-lightbox__close"
        onClick={onClose}
        aria-label="Close"
      >✕</button>
      <img
        className="photo-lightbox__img"
        src={src}
        alt=""
        draggable="false"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function clampPhotoScroll(el, value) {
  const max = Math.max(0, el.scrollWidth - el.clientWidth);
  return Math.max(0, Math.min(max, value));
}

function PhotoEyeCursor({ enabled, scrollRef, lightboxOpen }) {
  const nodeRef = useRef(null);
  const motionRef = useRef({
    x: 0, y: 0, tx: 0, ty: 0, opacity: 0, targetOpacity: 0, raf: null, initialized: false
  });
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !enabled) return;

    const onMove = (e) => {
      if (lightboxOpen) return;
      const m = motionRef.current;
      m.tx = e.clientX;
      m.ty = e.clientY;
      m.targetOpacity = e.target.closest(".photo-frame") ? 1 : 0;
      if (!m.initialized) {
        m.x = m.tx;
        m.y = m.ty;
        m.initialized = true;
      }
    };

    const onLeave = () => {
      motionRef.current.targetOpacity = 0;
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, scrollRef, lightboxOpen]);

  useEffect(() => {
    if (!enabled) {
      const m = motionRef.current;
      m.targetOpacity = 0;
      m.initialized = false;
      if (nodeRef.current) nodeRef.current.style.opacity = "0";
      return;
    }

    const posEase = reducedMotion.current ? 1 : 0.14;
    const fadeEase = reducedMotion.current ? 1 : 0.16;

    const tick = () => {
      const m = motionRef.current;
      const el = nodeRef.current;
      const show = !lightboxOpen && m.targetOpacity > 0.01;

      if (show || m.opacity > 0.01) {
        m.x += (m.tx - m.x) * posEase;
        m.y += (m.ty - m.y) * posEase;
      }
      const targetOp = show ? m.targetOpacity : 0;
      m.opacity += (targetOp - m.opacity) * fadeEase;

      if (el) {
        el.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = String(m.opacity);
      }
      m.raf = requestAnimationFrame(tick);
    };

    motionRef.current.raf = requestAnimationFrame(tick);
    return () => {
      if (motionRef.current.raf) cancelAnimationFrame(motionRef.current.raf);
      motionRef.current.raf = null;
    };
  }, [enabled, lightboxOpen]);

  if (!enabled) return null;

  return (
    <div ref={nodeRef} className="photo-eye-cursor" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  );
}

function PhotographyView({ photoGroups, photoEdits, selectedPhotoSrc, photoPickMode, onSelectPhoto, photoGalleryStyle }) {
  const scrollRef = useRef(null);
  const smoothRef = useRef({ target: null, raf: null });
  const showSmoothEye = !photoPickMode;
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const openLightbox = useCallback((src) => setLightboxSrc(src), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const stopSmooth = useCallback(() => {
    const s = smoothRef.current;
    if (s.raf) cancelAnimationFrame(s.raf);
    s.raf = null;
  }, []);

  const runSmoothScroll = useCallback(() => {
    const el = scrollRef.current;
    const s = smoothRef.current;
    if (!el || s.raf) return;
    const ease = reducedMotion.current ? 1 : 0.14;

    const step = () => {
      if (!scrollRef.current) {
        s.raf = null;
        return;
      }
      const target = s.target ?? el.scrollLeft;
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        s.raf = null;
        return;
      }
      el.scrollLeft += diff * ease;
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  }, []);

  const setScrollTarget = useCallback((next) => {
    const el = scrollRef.current;
    if (!el) return;
    const s = smoothRef.current;
    const base = s.target ?? el.scrollLeft;
    s.target = clampPhotoScroll(el, base + next);
    if (reducedMotion.current) {
      el.scrollLeft = s.target;
      return;
    }
    runSmoothScroll();
  }, [runSmoothScroll]);

  /* lock body scroll while this view is mounted */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      stopSmooth();
    };
  }, [stopSmooth]);

  /* vertical wheel → eased horizontal scroll */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        setScrollTarget(e.deltaY * 1.15);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setScrollTarget]);

  return (
    <div
      className={`photography-view${showSmoothEye ? " photography-view--smooth-eye" : ""}`}
      style={{
        ...photoGalleryStyleVars(photoGalleryStyle),
        height: "calc(100vh - var(--photo-header-h))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <PhotoEyeCursor
        enabled={showSmoothEye}
        scrollRef={scrollRef}
        lightboxOpen={!!lightboxSrc}
      />

      {/* ── horizontal photo strip ── */}
      <div
        ref={scrollRef}
        className="photo-hscroll"
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          alignItems: "stretch",
          gap: "clamp(24px, 3.5vw, 52px)",
          paddingTop: "var(--photo-strip-py)",
          paddingBottom: "var(--photo-strip-py)",
          paddingLeft: "clamp(10px, 1.8vw, 20px)",
          paddingRight: "clamp(24px, 5vw, 80px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <figure
          className="photo-camera-intro"
          style={{
            flexShrink: 0,
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            margin: 0,
            paddingRight: "clamp(4px, 0.8vw, 10px)",
          }}
        >
          <img
            src={PHOTO_CAMERA_SRC}
            alt={PHOTO_CAMERA_LABEL}
            draggable="false"
            className="photo-camera-intro__img"
            style={{
              height: "clamp(140px, 28vh, 280px)",
              width: "auto",
              maxWidth: "min(20vw, 240px)",
              display: "block",
              objectFit: "contain",
              marginBottom: "-2px",
            }}
          />
          <figcaption style={{ margin: 0, lineHeight: 1, marginTop: "-4px" }}>
            <Mono>{PHOTO_CAMERA_LABEL}</Mono>
          </figcaption>
        </figure>

        {photoGroups.map((group, gi) => (
          <div
            key={gi}
            style={{
              display: "flex",
              gap: "18px",
              flexShrink: 0,
              alignItems: "stretch",
              alignSelf: "stretch",
            }}
          >
            {group.cols.map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "18px", alignSelf: "stretch" }}>
                {col.map((photo, pi) => {
                  const selected = photo.src === selectedPhotoSrc;
                  return (
                    <button
                      key={pi}
                      type="button"
                      className={`photo-frame${photoPickMode && selected ? " photo-frame--selected" : ""}`}
                      aria-label={photoPickMode ? `Select ${photo.src.split("/").pop()}` : "View photo"}
                      aria-pressed={photoPickMode ? selected : undefined}
                      onClick={photoPickMode ? (e) => {
                        e.stopPropagation();
                        onSelectPhoto?.(photo.src);
                      } : (e) => {
                        e.stopPropagation();
                        openLightbox(photo.src);
                      }}
                      style={{
                        padding: 0,
                        border: "none",
                        background: "none",
                        cursor: photoPickMode ? "pointer" : "none",
                        flexShrink: 0,
                      }}
                    >
                      <PhotoGalleryFrame
                        photo={photo}
                        colLength={photo.colLength || col.length}
                        runtimeEdits={photoEdits?.[photo.src]}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── bottom nav ── */}
      <nav style={{
        padding: "10px clamp(24px, 5vw, 80px)",
        display: "flex",
        gap: "clamp(18px, 3vw, 40px)",
        justifyContent: "center",
        flexWrap: "wrap",
        borderTop: "1px solid var(--line)",
        flexShrink: 0,
      }}>
        {PHOTO_NAV.map((item) => (
          <span key={item} className="photo-nav-item" style={{
            fontFamily: "var(--font-meta)",
            fontSize: "0.62rem",
            letterSpacing: "var(--meta-tracking)",
            textTransform: "var(--meta-transform)",
            color: "var(--ink-3)",
            cursor: "pointer",
          }}>{item}</span>
        ))}
      </nav>

      {lightboxSrc && <PhotoLightbox src={lightboxSrc} onClose={closeLightbox} />}

    </div>
  );
}

/* ============================================================
   PHOTO MODE TOGGLE  (bottom-left View / Edit switch)
   ============================================================ */
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

function PhotoModeToggle({ photoPickMode, setPhotoPickMode }) {
  return (
    <div className="photo-mode-toggle" role="group" aria-label="Gallery mode">
      <button
        type="button"
        className={`photo-mode-btn${!photoPickMode ? " photo-mode-btn--active" : ""}`}
        onClick={() => setPhotoPickMode(false)}
        aria-label="View mode"
        title="View photos"
      >
        <IconEye />
        <span>View</span>
      </button>
      <button
        type="button"
        className={`photo-mode-btn${photoPickMode ? " photo-mode-btn--active" : ""}`}
        onClick={() => setPhotoPickMode(true)}
        aria-label="Edit mode"
        title="Edit photos"
      >
        <IconEdit />
        <span>Edit</span>
      </button>
    </div>
  );
}

/* ============================================================
   PHOTO TWEAKS (Tweaks panel controls)
   ============================================================ */
function photoFileName(src) {
  return src.split("/").pop();
}

function PhotoEditorPanel({
  galleryImages,
  setGalleryImages,
  photoList,
  photoEdits,
  setPhotoEdits,
  photoPickMode,
  setPhotoPickMode,
  selectedPhotoSrc,
  setSelectedPhotoSrc,
  photoGalleryStyle,
  setPhotoGalleryStyle,
}) {
  const [open, setOpen] = useState(true);
  const [swapTarget, setSwapTarget] = useState("");
  const photo = photoList.find((p) => p.src === selectedPhotoSrc) || photoList[0];
  const src = photo?.src;
  const galleryIdx = src ? galleryImages.indexOf(src) : -1;
  const edits = photoEdits || {};
  const cur = photo ? effectivePhotoEdit(photo, edits[src]) : null;
  const galleryStyle = { ...PHOTO_GALLERY_STYLE_DEFAULTS, ...photoGalleryStyle };

  const patchGalleryStyle = (patch) => {
    setPhotoGalleryStyle((prev) => ({ ...prev, ...patch }));
  };

  const movePhoto = (delta) => {
    if (galleryIdx < 0) return;
    const next = moveGalleryImage(galleryImages, galleryIdx, galleryIdx + delta);
    if (next !== galleryImages) setGalleryImages(next);
  };

  const swapPhoto = (otherSrc) => {
    if (!otherSrc || galleryIdx < 0) return;
    const otherIdx = galleryImages.indexOf(otherSrc);
    if (otherIdx < 0) return;
    setGalleryImages(moveGalleryImage(galleryImages, galleryIdx, otherIdx));
    setSwapTarget("");
  };

  const deletePhoto = () => {
    if (galleryIdx < 0 || galleryImages.length <= 1) return;
    const name = photoFileName(src);
    if (!window.confirm(`Remove ${name} from the gallery?`)) return;
    const next = removeGalleryImage(galleryImages, galleryIdx);
    setGalleryImages(next);
    setPhotoEdits((prev) => {
      const cleaned = { ...prev };
      delete cleaned[src];
      return cleaned;
    });
    setSelectedPhotoSrc(next[Math.min(galleryIdx, next.length - 1)]);
  };

  const copyGalleryOrder = () => {
    const text = JSON.stringify(galleryImages, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
    window.prompt("Copy gallery order (Ctrl+C):", text);
  };

  const patchPhoto = (patchOrFn) => {
    if (!src) return;
    setPhotoEdits((prev) => {
      const merged = effectivePhotoEdit(photo, prev[src]);
      const patch = typeof patchOrFn === "function" ? patchOrFn(merged) : patchOrFn;
      return { ...prev, [src]: { ...(prev[src] || {}), ...patch } };
    });
  };

  const resetPhoto = () => {
    if (!src) return;
    setPhotoEdits((prev) => {
      const next = { ...prev };
      delete next[src];
      return next;
    });
  };

  const copyAllEdits = () => {
    const payload = photoList.map((p) => {
      const e = effectivePhotoEdit(p, edits[p.src]);
      const base = photoDefaults(p);
      const changed =
        e.posX !== base.posX || e.posY !== base.posY || (e.zoom ?? 1) !== (base.zoom ?? 1) ||
        (e.frameH ?? 100) !== 100 || e.ar !== base.ar;
      if (!changed) return null;
      const row = { file: photoFileName(p.src), src: p.src, ar: e.ar };
      if (e.posX !== 50) row.posX = e.posX;
      if (e.posY !== 50) row.posY = e.posY;
      if ((e.zoom ?? 1) !== 1) row.zoom = e.zoom ?? 1;
      if ((e.frameH ?? 100) !== 100) row.frameH = e.frameH ?? 100;
      return row;
    }).filter(Boolean);
    const text = JSON.stringify(payload, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
    window.prompt("Copy your photo edits (Ctrl+C):", text);
  };

  if (!photo || !cur || galleryImages.length === 0) return null;

  if (!open) {
    return (
      <button
        type="button"
        className="photo-editor-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open photo editor"
      >
        Edit photos
      </button>
    );
  }

  return (
    <div
      className="photo-editor-panel"
      data-omelette-chrome=""
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="photo-editor-panel__hd">
        <b>Photo editor</b>
        <button
          type="button"
          className="twk-x"
          aria-label="Close photo editor"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="photo-editor-panel__body">
        <p className="photo-editor-panel__hint">
          Frames fill the screen below the header. Adjust crop, then copy edits and run
          <code style={{ fontSize: "10px" }}> npm run bake-photos</code> to save real crops.
        </p>
        <TweakToggle label="Click photo to select" value={photoPickMode}
          onChange={setPhotoPickMode} />

        <TweakSection label="All photos" />
        <TweakToggle label="Shadow" value={galleryStyle.shadow}
          onChange={(v) => patchGalleryStyle({ shadow: v })} />
        {galleryStyle.shadow &&
        <TweakSlider label="Shadow strength" value={galleryStyle.shadowAmount}
          min={0} max={100} unit="%"
          onChange={(v) => patchGalleryStyle({ shadowAmount: v })} />
        }
        <TweakToggle label="Rounded corners" value={galleryStyle.rounded}
          onChange={(v) => patchGalleryStyle({ rounded: v })} />
        {galleryStyle.rounded &&
        <TweakSlider label="Corner radius" value={galleryStyle.cornerRadius}
          min={0} max={24} unit="px"
          onChange={(v) => patchGalleryStyle({ cornerRadius: v })} />
        }

        <TweakSelect label="Photo" value={src}
          options={galleryImages.map((s, i) => ({
            value: s,
            label: `${i + 1}. ${photoFileName(s)}`,
          }))}
          onChange={setSelectedPhotoSrc} />

        <TweakSection label="Gallery order" />
        <p className="photo-editor-panel__hint" style={{ margin: "0 0 4px" }}>
          {galleryIdx >= 0 ? `Position ${galleryIdx + 1} of ${galleryImages.length}` : ""}
        </p>
        <div className="photo-editor-panel__row-btns">
          <TweakButton label="Move earlier" secondary
            onClick={() => movePhoto(-1)} />
          <TweakButton label="Move later" secondary
            onClick={() => movePhoto(1)} />
        </div>
        {galleryImages.length > 1 &&
        <TweakSelect label="Swap with" value={swapTarget}
          options={[
            { value: "", label: "Choose photo…" },
            ...galleryImages
              .flatMap((s, i) => s === src ? [] : [{
                value: s,
                label: `${i + 1}. ${photoFileName(s)}`,
              }]),
          ]}
          onChange={(v) => {
            if (v) swapPhoto(v);
            setSwapTarget("");
          }} />
        }
        <TweakButton label="Delete from gallery" secondary onClick={deletePhoto} />
        <TweakButton label="Copy gallery order" secondary onClick={copyGalleryOrder} />

        <TweakSection label="Crop" />
        <TweakSlider label="Horizontal" value={cur.posX} min={0} max={100} unit="%"
          onChange={(v) => patchPhoto({ posX: v })} />
        <TweakSlider label="Vertical" value={cur.posY} min={0} max={100} unit="%"
          onChange={(v) => patchPhoto({ posY: v })} />
        <TweakSlider label="Zoom" value={Math.round((cur.zoom ?? 1) * 100) / 100} min={1} max={1.4} step={0.01}
          onChange={(v) => patchPhoto({ zoom: v })} />

        <TweakSection label="Frame" />
        <TweakSlider label="Frame height" value={cur.frameH ?? 100} min={40} max={100} unit="%"
          onChange={(v) => patchPhoto({ frameH: v })} />
        <TweakSlider label="Frame width" value={Math.round(cur.ar * 100) / 100} min={0.5} max={1.8} step={0.01}
          onChange={(v) => patchPhoto({ ar: v })} />

        <TweakButton label="Reset this photo" secondary onClick={resetPhoto} />
        <TweakButton label="Copy all edits" onClick={copyAllEdits} />
      </div>
    </div>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function EducationItem({ entry, indent }) {
  return (
    <div className="about-education__item">
      <div className="about-education__row">
        {entry.logo &&
        <div className="about-education__logo">
          <img
            src={entry.logo}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>
        }
        <h3 className="about-education__degree">{entry.degree}</h3>
      </div>
      <Mono className="about-education__school">
        {entry.issued ? `${entry.school} · ${entry.issued}` : entry.school}
      </Mono>
      {entry.courses?.length > 0 &&
      <ul
        className="about-education__courses"
        style={indent ? { paddingLeft: indent } : undefined}
      >
        {entry.courses.map((course) =>
        <li key={course}>{course}</li>
        )}
      </ul>
      }
    </div>);
}

function CertFilterBtn({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "about-cert-filter about-cert-filter--active" : "about-cert-filter"}
      style={{
        all: "unset",
        cursor: "pointer",
        fontFamily: "var(--font-meta)",
        fontSize: "0.6rem",
        letterSpacing: "var(--meta-tracking)",
        textTransform: "var(--meta-transform)",
        padding: "5px 9px",
        borderRadius: "6px",
        border: `1px solid ${active ? "var(--accent)" : "var(--line-soft)"}`,
        background: active ? "oklch(0.97 var(--tone-c) var(--tone-h))" : "transparent",
        color: active ? "var(--ink)" : "var(--ink-3)",
        transition: "border-color .2s ease, color .2s ease, background .2s ease"
      }}
    >{label}</button>);
}

function CertificationsSection() {
  const [certs, setCerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("certifications.json")
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length) {
          setCerts(data.map((c) => ({
            courses: [],
            category: c.category || inferCertCategory(c.degree),
            ...c,
            logo: certLogoForSchool(c.school, c.logo)
          })));
          setLoadError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => { cancelled = true; };
  }, []);

  const filterCounts = useMemo(() => {
    const counts = { all: certs.length, data: 0, code: 0, ux: 0 };
    for (const c of certs) {
      if (c.category === "data") counts.data += 1;
      if (c.category === "code") counts.code += 1;
      if (c.category === "ux") counts.ux += 1;
    }
    return counts;
  }, [certs]);

  const filteredCerts = useMemo(() => {
    if (filter === "all") return certs;
    return certs.filter((c) => c.category === filter);
  }, [certs, filter]);

  return (
    <div className="about-certifications" style={{
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      height: "100%"
    }}>
      <div className="about-certifications__head" style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "clamp(14px, 2.5vw, 18px)",
        flexWrap: "wrap",
        flexShrink: 0
      }}>
        <Mono style={{ color: "var(--ink-3)" }}>
          Certifications{filteredCerts.length > 0 ?
          ` (${filteredCerts.length}${filter !== "all" ? ` · ${CERT_FILTERS.find((f) => f.id === filter)?.label}` : ""})` :
          ""}
        </Mono>
        <a
          href={CERTIFICATIONS_LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Mono style={{ color: "var(--ink-2)" }}>LinkedIn →</Mono>
        </a>
      </div>

      {certs.length > 0 &&
      <div className="about-certifications__filters" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginBottom: "clamp(12px, 2vw, 16px)",
        flexShrink: 0
      }}>
        {CERT_FILTERS.map((f) =>
        <CertFilterBtn
          key={f.id}
          label={`${f.label} (${filterCounts[f.id] ?? 0})`}
          active={filter === f.id}
          onClick={() => setFilter(f.id)}
        />
        )}
      </div>
      }

      {loadError && certs.length === 0 &&
      <p style={{
        margin: 0,
        fontSize: "0.88rem",
        lineHeight: 1.5,
        color: "var(--ink-2)"
      }}>
        Could not load certifications.json. Use a local server or check the file path.
      </p>
      }

      {certs.length === 0 && !loadError &&
      <p style={{
        margin: 0,
        fontSize: "0.88rem",
        lineHeight: 1.5,
        color: "var(--ink-2)"
      }}>Loading certifications…</p>
      }

      {filteredCerts.length === 0 && certs.length > 0 &&
      <p style={{
        margin: 0,
        fontSize: "0.88rem",
        lineHeight: 1.5,
        color: "var(--ink-2)"
      }}>No certifications in this category.</p>
      }

      {filteredCerts.length > 0 &&
      <div
        className="about-certifications__scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "grid",
          gap: "clamp(16px, 2.5vw, 20px)",
          paddingRight: "6px",
          overscrollBehavior: "contain"
        }}
      >
        {filteredCerts.map((entry) =>
        <EducationItem key={entry.degree} entry={entry} />
        )}
      </div>
      }
    </div>);
}

function useFitColumnText(contentRef, containerRef, { minPx = 11, maxPxCap = 140, maxPxRatio = 0.52, minMaxPx = 36, fillRatio = 1 } = {}) {
  useEffect(() => {
    const content = contentRef.current;
    const box = containerRef.current;
    if (!content || !box) return;

    const fit = () => {
      const limit = box.clientHeight * fillRatio;
      if (limit < 8) return;

      const maxPx = Math.min(maxPxCap, Math.max(minMaxPx, limit * maxPxRatio));

      let lo = minPx;
      let hi = Math.ceil(maxPx);
      let best = minPx;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        content.style.fontSize = `${mid}px`;
        if (content.scrollHeight <= limit) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      let size = best;
      content.style.fontSize = `${size}px`;
      while (size + 0.5 <= maxPx) {
        content.style.fontSize = `${size + 0.5}px`;
        if (content.scrollHeight <= limit) size += 0.5;
        else {
          content.style.fontSize = `${size}px`;
          break;
        }
      }
    };

    const scheduleFit = () => requestAnimationFrame(fit);
    const ro = new ResizeObserver(scheduleFit);
    ro.observe(box);
    window.addEventListener("resize", scheduleFit);
    scheduleFit();
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) scheduleFit();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", scheduleFit);
      content.style.fontSize = "";
    };
  }, [contentRef, containerRef, minPx, maxPxCap, maxPxRatio, minMaxPx, fillRatio]);
}

function AboutView() {
  const bioRef = useRef(null);
  const bioWrapRef = useRef(null);
  const educationBoxRef = useRef(null);
  const educationContentRef = useRef(null);
  useFitColumnText(bioRef, bioWrapRef, {
    fillRatio: 0.68,
    maxPxCap: 88,
    maxPxRatio: 0.36,
    minMaxPx: 26,
  });
  useFitColumnText(educationContentRef, educationBoxRef, {
    minPx: 7,
    maxPxCap: 20,
    maxPxRatio: 0.125,
    minMaxPx: 10
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <main className="about-page" style={{
      boxSizing: "border-box",
      height: "calc(100vh - var(--site-header-h))",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      padding: "clamp(12px, 1.8vh, 20px) var(--content-pad-x) clamp(16px, 2.5vh, 28px)",
      maxWidth: "var(--content-maxw)",
      margin: "0 auto"
    }}>
      <div className="about-view" style={{
        flex: 1,
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.65fr) minmax(220px, 1fr) minmax(260px, 1fr)",
        columnGap: "var(--about-col-gap)",
        alignItems: "stretch"
      }}>
        <div className="about-view__bio-col">
          <h2 className="about-page__title">About</h2>
          <div ref={bioWrapRef} className="about-view__bio-wrap">
          <p ref={bioRef} className="about-view__bio">
            I&rsquo;m Franco, a Fraud Prevention Analyst.
            <br /><br />
            I have studied AI, digitalization and how modern businesses are built, but also appreciate the importance of experience design in everything I do.
            <br /><br />
            I also love learning a lot of new stuff.
          </p>
          </div>
        </div>
        <aside className="about-view__education" style={{
          borderLeft: "1px solid var(--line-soft)",
          paddingLeft: "clamp(20px, 3vw, 32px)"
        }}>
          <div ref={educationBoxRef} className="about-view__education-box">
            <div ref={educationContentRef} className="about-view__education-fit">
              <section className="about-view__education-block">
                <Mono className="about-education__section-label">Education</Mono>
                <div className="about-education">
                  {EDUCATION.map((entry) =>
                  <EducationItem
                    key={entry.degree}
                    entry={entry}
                    indent={entry.logo ? "var(--edu-text-indent)" : undefined}
                  />
                  )}
                </div>
              </section>
              <section className="about-view__professional-certs">
                <Mono className="about-education__section-label">Professional certifications</Mono>
                <div className="about-education">
                  {PROFESSIONAL_CERTIFICATIONS.map((entry) =>
                  <EducationItem
                    key={entry.degree}
                    entry={entry}
                    indent={entry.logo ? "var(--edu-text-indent)" : undefined}
                  />
                  )}
                </div>
              </section>
            </div>
          </div>
        </aside>
        <aside className="about-view__certs" style={{
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid var(--line-soft)",
          paddingLeft: "clamp(20px, 3vw, 32px)"
        }}>
          <CertificationsSection />
        </aside>
      </div>
    </main>);

}

/* ============================================================
   FOOTER
   ============================================================ */
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.065 2.065 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "40px var(--pad-x)", borderTop: "1px solid var(--line)",
      display: "flex", flexWrap: "wrap", gap: "16px",
      alignItems: "center", justifyContent: "space-between"
    }}>
      <Mono>Franco Galluzzo</Mono>
      <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", alignItems: "center" }}>
        <a
          href={LINKEDIN_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "var(--ink-2)"
          }}
        >
          <LinkedInIcon />
          <Mono style={{ color: "inherit" }}>LinkedIn</Mono>
        </a>
      </div>
    </footer>);

}

/* ============================================================
   APP
   ============================================================ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("Projects");
  const [activeProject, setActiveProject] = useState(null);
  const [galleryImages, setGalleryImages] = useState(CAMARITA_IMAGES);
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState(CAMARITA_IMAGES[0]);
  const [photoEdits, setPhotoEdits] = useState({});
  const [photoPickMode, setPhotoPickMode] = useState(false);
  const [photoGalleryStyle, setPhotoGalleryStyle] = useState(PHOTO_GALLERY_STYLE_DEFAULTS);

  const photoGroups = useMemo(
    () => buildPhotoGroups(galleryImages),
    [galleryImages]
  );
  const photoList = useMemo(
    () => flattenPhotoList(photoGroups),
    [photoGroups]
  );

  const setViewAndTop = useCallback((v) => {
    setActiveProject(null);
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openProject = useCallback((slug) => {
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) return;
    setActiveProject(project);
    setView("Projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showHeader = view !== "Projects" || activeProject !== null;

  // apply tweaks to CSS variables
  useEffect(() => {
    const root = document.documentElement.style;
    const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS.humanist;
    root.setProperty("--font-display", fp.display);
    root.setProperty("--font-body", fp.body);
    root.setProperty("--font-meta", fp.meta);
    root.setProperty("--meta-tracking", fp.tracking);
    root.setProperty("--meta-transform", fp.transform);

    const gt = GRAY_TONES[t.grayTone] || GRAY_TONES.neutral;
    root.setProperty("--tone-h", gt.h);
    root.setProperty("--tone-c", gt.c);

    const d = DENSITY[t.density] || DENSITY.comfortable;
    root.setProperty("--pad-x", d.padX);
    root.setProperty("--section-y", d.sectionY);
    root.setProperty("--gap", d.gap);
    root.setProperty("--hero-size", d.hero);
    document.body.style.fontSize = d.fs;

    root.setProperty("--accent", t.accent);
  }, [t.fontPair, t.grayTone, t.density, t.accent]);

  return (
    <div>
      {showHeader && <SiteHeader view={view} setView={setViewAndTop} />}
      <div key={view + t.layout} className="view-fade">
        {view === "Projects" && activeProject &&
        <ProjectDetailView project={activeProject} onBack={closeProject} />
        }
        {view === "Projects" && !activeProject &&
        <React.Fragment>
            <Hero layout={t.layout} setView={setViewAndTop} />
            <ProjectsView layout={t.layout} onOpenProject={openProject} />
          </React.Fragment>
        }
        {view === "Photography" &&
        <PhotographyView
          photoGroups={photoGroups}
          photoEdits={photoEdits}
          selectedPhotoSrc={selectedPhotoSrc}
          photoPickMode={photoPickMode}
          onSelectPhoto={setSelectedPhotoSrc}
          photoGalleryStyle={photoGalleryStyle}
        />
        }
        {view === "About" && <AboutView />}
      </div>

      {view !== "Photography" && view !== "About" && <Footer />}

      {view === "Photography" &&
      <PhotoModeToggle photoPickMode={photoPickMode} setPhotoPickMode={setPhotoPickMode} />
      }

      {view === "Photography" && photoPickMode &&
      <PhotoEditorPanel
        galleryImages={galleryImages}
        setGalleryImages={setGalleryImages}
        photoList={photoList}
        photoEdits={photoEdits}
        setPhotoEdits={setPhotoEdits}
        photoPickMode={photoPickMode}
        setPhotoPickMode={setPhotoPickMode}
        selectedPhotoSrc={selectedPhotoSrc}
        setSelectedPhotoSrc={setSelectedPhotoSrc}
        photoGalleryStyle={photoGalleryStyle}
        setPhotoGalleryStyle={setPhotoGalleryStyle}
      />
      }

      <TweaksPanel>
        <TweakSection label="Type" />
        <TweakSelect label="Font pairing" value={t.fontPair}
        options={[
        { value: "humanist", label: "Warm humanist" },
        { value: "neutral", label: "Plain grotesk" },
        { value: "technical", label: "A little technical" }]
        }
        onChange={(v) => setTweak("fontPair", v)} />

        <TweakSection label="Layout" />
        <TweakSelect label="Direction" value={t.layout}
        options={[
        { value: "minimal", label: "Minimal" },
        { value: "editorial", label: "Editorial index" },
        { value: "statement", label: "Big statement" }]
        }
        onChange={(v) => setTweak("layout", v)} />
        <TweakRadio label="Density" value={t.density}
        options={["compact", "comfortable", "airy"]}
        onChange={(v) => setTweak("density", v)} />

        <TweakSection label="Tone" />
        <TweakColor label="Accent" value={t.accent}
        options={["#F59425", "#111111", "#5B6B82", "#B4452F"]}
        onChange={(v) => setTweak("accent", v)} />
        <TweakRadio label="Grays" value={t.grayTone}
        options={["cool", "neutral", "warm"]}
        onChange={(v) => setTweak("grayTone", v)} />
      </TweaksPanel>
    </div>);

}

/* view fade-in */
const styleEl = document.createElement("style");
styleEl.textContent = `
  :root {
    --project-block-w: 560px;
    --project-media-h: clamp(220px, 28vw, 390px);
    --project-detail-banner-max-h: clamp(120px, 18vw, 200px);
    --site-header-h: 56px;
    --content-pad-x: clamp(20px, 3vw, 48px);
    --content-maxw: min(100%, 1520px);
    --about-col-gap: clamp(20px, 3vw, 48px);
    --photo-header-h: 60px;
    --photo-nav-h: 48px;
    --photo-strip-base: clamp(14px, 2.2vh, 28px);
    --photo-frame-shadow-pad: 0px;
    --photo-strip-py: var(--photo-strip-base);
    --photo-chrome: calc(var(--photo-header-h) + var(--photo-nav-h));
    --photo-view-h: calc(100vh - var(--photo-chrome) - 2 * var(--photo-strip-py));
  }
  html, body {
    overflow-x: clip;
  }
  .project-card-layout--detail-banner {
    width: 100%;
  }
  .project-media-wrap--banner .project-media--banner {
    max-height: var(--project-detail-banner-max-h);
    width: 100%;
    height: auto;
  }
  .fovere-detail__hero {
    margin: 0;
    line-height: 0;
  }
  .fovere-detail__intro {
    margin-bottom: clamp(24px, 4vw, 40px);
    width: 100%;
    box-sizing: border-box;
  }
  .fovere-detail__blurb {
    width: 100%;
    max-width: none;
  }
  .fovere-detail__hero .project-media-wrap--banner {
    border-radius: 14px;
  }
  .fovere-story__phone--cutout {
    margin: 0 auto;
  }

  .project-story--alternating {
    max-width: var(--maxw);
    margin: 0 auto;
    padding: 0 var(--pad-x);
  }
  .project-story__row {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    column-gap: clamp(32px, 6vw, 96px);
    align-items: center;
    min-height: min(84vh, 760px);
    padding: clamp(36px, 6vh, 72px) 0;
  }
  .project-story__crop {
    width: 100%;
    aspect-ratio: 4 / 3;
    max-height: min(46vh, 420px);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14);
  }
  .project-story__crop img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    border-radius: 14px;
  }
  .project-story__copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .photography-view {
    --photo-strip-py: max(var(--photo-strip-base), var(--photo-frame-shadow-pad, 0px));
    --photo-view-h: calc(100vh - var(--photo-chrome) - 2 * var(--photo-strip-py));
  }
  .view-fade { animation: viewFade .42s cubic-bezier(.2,.7,.2,1); }
  @keyframes viewFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .big-link {
    width: fit-content;
    max-width: 100%;
    color: var(--ink);
    transition: color 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .big-link:hover,
  .big-link:focus-visible {
    color: var(--accent);
  }

  .landing-hero__shell {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    padding: var(--header-body-gap) var(--pad-x) clamp(24px, 3vh, 40px);
  }
  .landing-hero__inner {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
  .landing-hero__name-fit {
    position: absolute;
    left: var(--pad-x);
    right: var(--pad-x);
    bottom: clamp(24px, 3vh, 40px);
    width: auto;
    min-width: 0;
    overflow: visible;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    pointer-events: none;
  }
  .landing-hero__name-fit .name-display {
    pointer-events: auto;
  }
  .landing-hero__name-fit .name-display {
    width: max-content;
    max-width: none;
    margin-inline: auto;
    text-align: center;
    overflow: visible;
  }
  .name-display {
    font-family: var(--font-display);
    font-weight: 700;
    font-synthesis: none;
    line-height: 1;
    overflow: visible;
  }
  .name-display__char {
    display: inline-block;
    font-weight: inherit;
    line-height: 1;
    cursor: default;
    transition: font-weight 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .name-display__char:hover {
    font-weight: 900;
  }

  @media (prefers-reduced-motion: reduce) {
    .big-link { transition-duration: 0.15s; }
    .name-display__char { transition-duration: 0.12s; }
  }
  .landing-top__graph {
    height: clamp(2.4rem, 6.2vw, 6rem);
  }
  .landing-top__nav {
    grid-column: 1;
    grid-row: 1 / 4;
    display: flex;
    flex-direction: column;
    gap: clamp(2px, 0.4vw, 8px);
    align-self: end;
  }
  .landing-top__side {
    grid-column: 2;
    grid-row: 1 / 4;
  }
  .landing-top {
    min-width: 0;
  }
  .landing-top__tagline-headline,
  .landing-top__tagline-body {
    max-width: min(34ch, 100%);
    overflow-wrap: break-word;
  }
  @media (max-width: 1100px) {
    .landing-top {
      grid-template-columns: 1fr !important;
      row-gap: 20px !important;
    }
    .landing-top__nav {
      grid-column: 1 !important;
      grid-row: 1 !important;
      align-self: start !important;
    }
    .landing-top__side { display: contents; }
    .landing-top__graph { grid-column: 1 !important; grid-row: 2 !important; }
    .landing-top__tagline-headline { grid-column: 1 !important; grid-row: 3 !important; }
    .landing-top__tagline-body { grid-column: 1 !important; grid-row: 4 !important; }
  }
  @media (max-width: 720px) {
    .hero-editorial { grid-template-columns: 1fr !important; }
    .project-card-layout { justify-content: flex-start !important; }
    .project-card__block { width: 100% !important; max-width: 100% !important; }
    .projects-featured {
      grid-template-columns: 1fr !important;
      row-gap: clamp(28px, 5vw, 40px) !important;
    }
    .projects-featured__aside { position: static !important; }
    .projects-featured__blurb { max-width: none !important; }
    .fovere-story { grid-template-columns: 1fr !important; column-gap: 0 !important; }
    .fovere-story__sticky { display: none !important; }
    .fovere-story__step {
      min-height: 0 !important;
      opacity: 1 !important;
      padding: clamp(40px, 9vw, 72px) 0 !important;
    }
    .fovere-story__step-img,
    .fovere-story__cutout-img.fovere-story__step-img {
      display: block !important;
      height: auto !important;
      width: auto !important;
      max-height: 72vh !important;
      max-width: 100% !important;
      margin: 0 auto clamp(20px, 5vw, 32px) !important;
      filter: drop-shadow(0 24px 48px rgba(0,0,0,0.16));
    }
    .fovere-story__step .fovere-story__cutout-img {
      position: static !important;
      transform: none !important;
      opacity: 1 !important;
    }
    .project-story__row {
      grid-template-columns: 1fr !important;
      row-gap: clamp(20px, 5vw, 32px) !important;
      min-height: 0 !important;
      padding: clamp(40px, 9vw, 72px) 0 !important;
    }
    .project-story__row--flip .project-story__copy {
      order: 2;
    }
    .project-story__row--flip .project-story__crop--inline {
      order: 1;
    }
    .project-story__crop {
      max-height: none !important;
      width: 100% !important;
    }
    .about-page {
      height: calc(100dvh - var(--site-header-h)) !important;
      overflow: hidden !important;
    }
    .project-media-wrap { border-radius: 16px !important; }
    .about-view {
      grid-template-columns: 1fr !important;
      grid-template-rows: minmax(0, 34vh) minmax(0, 26vh) minmax(0, 1fr) !important;
      row-gap: clamp(16px, 2.5vh, 24px) !important;
    }
    .about-view__education,
    .about-view__certs {
      border-left: none !important;
      padding-left: 0 !important;
      padding-top: clamp(6px, 1vh, 10px) !important;
      border-top: 1px solid var(--line-soft);
    }
    .about-view__certs {
      min-height: 0 !important;
    }
  }
  .about-page__title {
    margin: 0;
    flex-shrink: 0;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(1.3rem, 2.4vw, 1.8rem);
    letter-spacing: -0.01em;
  }
  .about-view__bio-wrap {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding-top: clamp(28px, 5vh, 56px);
  }
  .about-view__education,
  .about-view__certs {
    padding-top: clamp(4px, 0.6vh, 8px);
    min-height: 0;
  }
  .about-view > * {
    min-height: 0;
  }
  .about-view__bio-col {
    min-height: 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .about-certifications {
    min-height: 0;
    height: 100%;
  }
  .about-view__bio {
    margin: 0;
    font-size: clamp(0.75rem, min(2vw, 3vh), 2.25rem);
    line-height: 1.48;
    letter-spacing: -0.01em;
  }
  .about-view__education {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
  .about-view__education-box {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .about-view__education-fit {
    --edu-logo: 2.75em;
    --edu-text-indent: calc(var(--edu-logo) + 0.75em);
    font-size: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 1.85em;
  }
  .about-view__education-block {
    display: flex;
    flex-direction: column;
    gap: 1.15em;
  }
  .about-view__professional-certs {
    padding-top: 1.35em;
    border-top: 1px solid var(--line-soft);
    display: flex;
    flex-direction: column;
    gap: 1.15em;
  }
  .about-education__section-label {
    display: block;
    color: var(--ink-3);
  }
  .about-view__education-fit .about-education {
    display: grid;
    gap: 1.35em;
  }
  .about-education__row {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 16px);
  }
  .about-education__logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 10px;
    border: 1px solid var(--line-soft);
    background: oklch(0.985 var(--tone-c) var(--tone-h));
    box-sizing: border-box;
  }
  .about-education__logo img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
  .about-view__education-fit .about-education__logo {
    width: var(--edu-logo);
    height: var(--edu-logo);
  }
  .about-certifications__scroll .about-education__logo {
    width: 44px;
    height: 44px;
  }
  .about-education__degree {
    margin: 0;
    min-width: 0;
    flex: 1;
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.35;
  }
  .about-view__education-fit .about-education__degree {
    font-size: 1.05em;
  }
  .about-certifications__scroll .about-education__degree {
    font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  }
  .about-education__school {
    display: block;
    margin-top: 0.5em;
    color: var(--ink-3);
    text-transform: none;
    letter-spacing: 0.02em;
    line-height: 1.45;
    white-space: normal;
  }
  .about-education__courses {
    margin: 0.85em 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.4em;
  }
  .about-certifications__scroll .about-education__item:has(.about-education__logo) .about-education__courses {
    padding-left: calc(44px + clamp(12px, 2vw, 16px));
  }
  .about-education__courses li {
    line-height: 1.45;
    color: var(--ink-2);
  }
  .about-view__education-fit .about-education__courses li {
    font-size: 0.88em;
  }
  .about-certifications__scroll .about-education__courses li {
    font-size: 0.88rem;
  }
  @media (max-height: 820px) {
    .about-page {
      padding-top: clamp(10px, 1.5vh, 16px) !important;
      padding-bottom: clamp(12px, 2vh, 20px) !important;
    }
    .about-page__title {
      margin: 0 !important;
    }
    .about-view__bio-wrap {
      padding-top: clamp(16px, 3vh, 32px);
    }
    .about-view__bio {
      line-height: 1.45;
    }
  }
  @media (max-height: 680px) {
    .about-view__bio {
      line-height: 1.4;
    }
  }
  .about-page .about-certifications__head {
    flex-shrink: 0;
  }
  .about-certifications__scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--line) transparent;
    -webkit-overflow-scrolling: touch;
  }
  .about-certifications__scroll::-webkit-scrollbar { width: 6px; }
  .about-certifications__scroll::-webkit-scrollbar-thumb {
    background: var(--line);
    border-radius: 3px;
  }
  @media (min-width: 721px) {
    .projects-featured__card {
      min-height: calc(58svh - 48px);
      align-content: start;
    }
    .projects-featured__list {
      padding-bottom: clamp(24px, 6vh, 72px);
    }
  }
  .projects-featured__blurb {
    animation: featured-blurb-in .35s ease;
  }
  @keyframes featured-blurb-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .photo-hscroll::-webkit-scrollbar { display: none; }
  .photography-view .photo-hscroll {
    min-height: 0;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    touch-action: pan-x;
  }
  .photo-camera-intro__img {
    pointer-events: none;
    user-select: none;
  }
  .photo-nav-item { transition: color .2s ease; }
  .photo-nav-item:hover { color: var(--ink) !important; }
  .photo-frame {
    display: block;
    overflow: visible;
    border-radius: var(--photo-frame-radius, 6px);
    box-shadow: var(--photo-frame-shadow, 0 2px 6px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.14));
  }
  .photo-frame__media {
    border-radius: inherit;
    overflow: hidden;
  }
  .photography-view--smooth-eye .photo-frame { cursor: none; }
  .photography-view--smooth-eye .photo-frame img { cursor: none; }
  .photo-eye-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    pointer-events: none;
    z-index: 40;
    opacity: 0;
    will-change: transform, opacity;
  }
  .photo-eye-cursor svg {
    display: block;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.45));
  }
  .photo-frame--selected {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
  .photo-frame:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
  .photo-editor-panel {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 2147483645;
    width: 280px;
    max-height: calc(100vh - 32px);
    display: flex;
    flex-direction: column;
    background: rgba(250, 249, 247, .92);
    color: #29261b;
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    backdrop-filter: blur(24px) saturate(160%);
    border: .5px solid rgba(255, 255, 255, .6);
    border-radius: 14px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset, 0 12px 40px rgba(0, 0, 0, .18);
    font: 11.5px/1.4 ui-sans-serif, system-ui, -apple-system, sans-serif;
    overflow: hidden;
  }
  .photo-editor-panel__hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 8px 10px 14px;
    user-select: none;
  }
  .photo-editor-panel__hd b {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .01em;
  }
  .photo-editor-panel__body {
    padding: 2px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    max-height: calc(100vh - 120px);
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, .15) transparent;
  }
  .photo-editor-panel__body .twk-slider {
    pointer-events: auto;
    touch-action: none;
  }
  .photo-editor-panel__row-btns {
    display: flex;
    gap: 8px;
  }
  .photo-editor-panel__row-btns .twk-btn {
    flex: 1;
  }
  .photo-editor-panel__hint {
    margin: 0;
    font-size: 10px;
    line-height: 1.45;
    color: rgba(41, 38, 27, .55);
  }
  .photo-mode-toggle {
    position: fixed;
    left: 16px;
    bottom: 16px;
    z-index: 2147483645;
    display: flex;
    background: rgba(250, 249, 247, .92);
    border: .5px solid rgba(0, 0, 0, .1);
    border-radius: 999px;
    padding: 3px;
    gap: 2px;
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    backdrop-filter: blur(24px) saturate(160%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, .12);
  }
  .photo-mode-btn {
    appearance: none;
    border: none;
    background: transparent;
    color: rgba(41, 38, 27, .45);
    font: 600 11.5px/1 ui-sans-serif, system-ui, -apple-system, sans-serif;
    cursor: pointer;
    border-radius: 999px;
    padding: 7px 13px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background .18s ease, color .18s ease;
  }
  .photo-mode-btn--active {
    background: #fff;
    color: #29261b;
    box-shadow: 0 1px 4px rgba(0,0,0,.1);
  }
  .photo-mode-btn:hover:not(.photo-mode-btn--active) {
    color: rgba(41, 38, 27, .8);
  }
  .photo-editor-toggle {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 2147483645;
    appearance: none;
    border: .5px solid rgba(0, 0, 0, .1);
    border-radius: 999px;
    padding: 10px 16px;
    background: rgba(250, 249, 247, .92);
    color: #29261b;
    font: 600 12px/1 ui-sans-serif, system-ui, -apple-system, sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .12);
  }
  .photo-editor-toggle:hover {
    background: #fff;
  }
  .photo-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.82);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    animation: lightboxIn .22s cubic-bezier(.2,.7,.2,1);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  @keyframes lightboxIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .photo-lightbox__img {
    max-width: 92vw;
    max-height: 90vh;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 3px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.55);
    cursor: default;
    animation: lightboxImgIn .28s cubic-bezier(.2,.7,.2,1);
  }
  @keyframes lightboxImgIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  .photo-lightbox__close {
    position: absolute;
    top: 20px;
    right: 24px;
    appearance: none;
    border: none;
    background: rgba(255,255,255,0.12);
    color: #fff;
    font-size: 18px;
    line-height: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .18s ease;
    z-index: 1;
  }
  .photo-lightbox__close:hover {
    background: rgba(255,255,255,0.22);
  }
  @media (max-height: 900px) {
    :root {
      --header-body-gap: clamp(40px, 5vh, 56px);
      --landing-text-name-gap: clamp(28px, 4vh, 48px);
    }
  }
  @media (max-height: 720px) {
    :root {
      --header-body-gap: clamp(32px, 4vh, 44px);
      --landing-text-name-gap: clamp(20px, 3vh, 32px);
    }
  }
  @media (max-width: 480px) {
    :root {
      --header-body-gap: 40px;
      --landing-text-name-gap: 32px;
    }
    .site-header__inner > button,
    .site-header__inner nav button {
      min-height: 44px !important;
      display: inline-flex !important;
      align-items: center !important;
    }
    .about-page {
      height: calc(100dvh - var(--site-header-h)) !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
    }
    .about-view {
      display: flex !important;
      flex-direction: column !important;
      height: auto !important;
      min-height: 0 !important;
    }
    .about-view__bio-col,
    .about-view__bio-wrap {
      overflow: visible !important;
      height: auto !important;
      min-height: 0 !important;
    }
    .about-view__bio {
      font-size: clamp(1.05rem, 4.2vw, 1.2rem) !important;
    }
    .about-view__education,
    .about-view__education-box {
      overflow: visible !important;
      height: auto !important;
      min-height: 0 !important;
    }
    .about-view__education-fit {
      font-size: 0.875rem !important;
    }
    .about-certifications__scroll {
      max-height: 280px !important;
    }
    .photography-view {
      height: calc(100dvh - var(--photo-header-h)) !important;
    }
    .photo-camera-intro__img {
      max-width: min(36vw, 180px) !important;
    }
    .fovere-story__step-img,
    .fovere-story__cutout-img.fovere-story__step-img {
      max-height: 58vh !important;
    }
  }
`;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);