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
  blurb: "An online sports goods brand I built and ran\u2014400+ sales across equipment and apparel, from sourcing to fulfillment.",
  label: "e-commerce",
  icon: "assets/sportaz-icon.png",
  hero: "assets/sportaz-hero.png",
  tagline: "Sports goods, sold online",
  intro: "Sportaz was my sports retail venture: curated gear and apparel sold direct to customers online. I handled branding, product selection, storefront, and orders end to end\u2014and crossed 400+ sales.",
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
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "20px", flexWrap: "wrap",
      padding: "clamp(12px, 2vh, 18px) var(--pad-x)",
      background: "oklch(0.992 var(--tone-c) var(--tone-h) / 0.92)",
      backdropFilter: "saturate(1.2) blur(12px)",
      WebkitBackdropFilter: "saturate(1.2) blur(12px)",
      borderBottom: "1px solid var(--line-soft)"
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

function HoverWeightName({ text, style }) {
  return (
    <div
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
  const scrollToWork = () => {
    const el = document.getElementById("work");
    if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: "smooth" });
  };
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex", alignItems: "flex-start",
        padding: "var(--header-body-gap) var(--pad-x) 0"
      }}>
        <div className="landing-top" style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          columnGap: "var(--landing-menu-text-gap)",
          rowGap: "clamp(2px, 0.4vw, 8px)",
          alignItems: "start",
          width: "100%"
        }}>
          <div className="landing-top__projects" style={{ gridColumn: 1, gridRow: 1 }}>
            <BigLink label="Projects" onClick={scrollToWork} />
          </div>

          <div className="landing-top__photos" style={{ gridColumn: 1, gridRow: 2 }}>
            <BigLink label="Photos" onClick={() => setView("Photography")} />
          </div>

          <div className="landing-top__about" style={{ gridColumn: 1, gridRow: 3 }}>
            <BigLink label="About" onClick={() => setView("About")} />
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
              ...LANDING_TAGLINE,
              fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", lineHeight: 1.3, letterSpacing: "-0.01em",
              whiteSpace: "nowrap"
            }}>
              Data Analytics &amp; <span style={{ color: "var(--accent)" }}>AI enthusiast.</span>
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
      </div>

      <HoverWeightName
        text="Franco Galluzzo"
        style={{
          textTransform: "uppercase",
          lineHeight: 0.86,
          letterSpacing: "-0.045em", whiteSpace: "nowrap", textAlign: "center",
          margin: "var(--landing-text-name-gap) 0 0", padding: "1px 0 0",
          userSelect: "none", color: "var(--accent)",
          fontSize: "clamp(2.85rem, 14.5vw, 10rem)"
        }} />
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
    <div className="project-card-layout" style={{
      display: "flex",
      justifyContent: "flex-end"
    }}>
      <div className="project-card__block" style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        width: "min(100%, var(--project-block-w))",
        maxWidth: "var(--project-block-w)",
        alignSelf: "flex-end"
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

function ProjectMedia({ project, interactive = false, onHoverChange, onOpen, overlay = null }) {
  const [failed, setFailed] = useState(false);

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

  const mediaStyle = {
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

  if (project.hero && !failed) {
    const srcSet = project.hero2x ?
    `${project.hero} 560w, ${project.hero2x} 1024w` :
    undefined;

    return (
      <div
        className="project-media-wrap"
        {...wrapProps}
        style={wrapStyle}>
        <img
          src={project.hero2x || project.hero}
          srcSet={srcSet}
          sizes="(max-width: 720px) 100vw, 560px"
          alt=""
          onError={() => setFailed(true)}
          className="project-media"
          style={{
            ...mediaStyle,
            objectFit: "cover",
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

function ProjectCard({ p, indexed, onOpen, cardRef, showBlurb = true }) {
  return (
    <article
      ref={cardRef}
      style={{
        display: "grid",
        gap: "clamp(12px, 2vw, 16px)"
      }}>
      {indexed && <Mono style={{ display: "block" }}>{p.n}</Mono>}
      <ProjectCardLayout project={p} showBlurb={showBlurb} onOpen={() => onOpen(p.slug)} />
    </article>);

}

function ProjectDetailView({ project, onBack }) {
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
      const trigger = window.innerHeight * 0.32;
      let next = 0;
      elements.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= trigger) next = i;
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
  "Images_camarita/DSC03658.JPG": { ar: 1.6, posX: 0, posY: 0 },
  "Images_camarita/DSC03883.JPG": { ar: 0.5, posY: 100 },
};

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
    <div style={photoFrameStyle(photo, colLength, null)}>
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
    <div ref={wrapRef} style={frame}>
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

function clampPhotoScroll(el, value) {
  const max = Math.max(0, el.scrollWidth - el.clientWidth);
  return Math.max(0, Math.min(max, value));
}

function PhotographyView({ photoGroups, photoEdits, selectedPhotoSrc, photoPickMode, onSelectPhoto }) {
  const scrollRef = useRef(null);
  const dragRef   = useRef({ active: false, startX: 0, scrollLeft: 0, lastX: 0, lastT: 0, velocity: 0 });
  const smoothRef = useRef({ target: null, raf: null, momentumRaf: null });
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const stopSmooth = useCallback(() => {
    const s = smoothRef.current;
    if (s.raf) cancelAnimationFrame(s.raf);
    if (s.momentumRaf) cancelAnimationFrame(s.momentumRaf);
    s.raf = null;
    s.momentumRaf = null;
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
    if (s.momentumRaf) {
      cancelAnimationFrame(s.momentumRaf);
      s.momentumRaf = null;
    }
    const base = s.target ?? el.scrollLeft;
    s.target = clampPhotoScroll(el, base + next);
    if (reducedMotion.current) {
      el.scrollLeft = s.target;
      return;
    }
    runSmoothScroll();
  }, [runSmoothScroll]);

  const runMomentum = useCallback((velocity) => {
    const el = scrollRef.current;
    if (!el || reducedMotion.current || Math.abs(velocity) < 0.4) return;
    const s = smoothRef.current;
    stopSmooth();
    let v = velocity;
    const friction = 0.92;

    const step = () => {
      if (!scrollRef.current || Math.abs(v) < 0.25) {
        s.momentumRaf = null;
        return;
      }
      const next = clampPhotoScroll(el, el.scrollLeft - v);
      if (next === el.scrollLeft) {
        s.momentumRaf = null;
        s.target = el.scrollLeft;
        return;
      }
      el.scrollLeft = next;
      s.target = next;
      v *= friction;
      s.momentumRaf = requestAnimationFrame(step);
    };
    s.momentumRaf = requestAnimationFrame(step);
  }, [stopSmooth]);

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

  /* click-drag to scroll */
  const onMouseDown = useCallback((e) => {
    if (photoPickMode && e.target.closest(".photo-frame")) return;
    const el = scrollRef.current;
    if (!el) return;
    stopSmooth();
    smoothRef.current.target = el.scrollLeft;
    const now = performance.now();
    dragRef.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      lastX: e.pageX,
      lastT: now,
      velocity: 0,
    };
    el.style.cursor = "grabbing";
  }, [photoPickMode, stopSmooth]);

  const onMouseUp = useCallback(() => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      smoothRef.current.target = scrollRef.current.scrollLeft;
      runMomentum(drag.velocity);
    }
  }, [runMomentum]);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    e.preventDefault();
    const el = scrollRef.current;
    const drag = dragRef.current;
    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    const walk = (e.pageX - drag.startX) * 1.4;
    const next = clampPhotoScroll(el, drag.scrollLeft - walk);
    const instant = next - el.scrollLeft;
    if (dt < 48) drag.velocity = drag.velocity * 0.55 + (instant / dt) * 16;
    drag.lastX = e.pageX;
    drag.lastT = now;
    el.scrollLeft = next;
    smoothRef.current.target = next;
  }, []);

  return (
    <div className="photography-view" style={{ height: "calc(100vh - var(--photo-header-h))", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── horizontal photo strip ── */}
      <div
        ref={scrollRef}
        className="photo-hscroll"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          alignItems: "stretch",
          gap: "clamp(24px, 3.5vw, 52px)",
          padding: "0 clamp(24px, 5vw, 80px) 0 clamp(10px, 1.8vw, 20px)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
          userSelect: "none",
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
                      className={`photo-frame${selected ? " photo-frame--selected" : ""}`}
                      aria-label={photoPickMode ? `Select ${photo.src.split("/").pop()}` : undefined}
                      aria-pressed={photoPickMode ? selected : undefined}
                      onClick={photoPickMode ? (e) => {
                        e.stopPropagation();
                        onSelectPhoto?.(photo.src);
                      } : undefined}
                      style={{
                        padding: 0,
                        border: "none",
                        background: "none",
                        cursor: photoPickMode ? "pointer" : "inherit",
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
}) {
  const [open, setOpen] = useState(true);
  const [swapTarget, setSwapTarget] = useState("");
  const photo = photoList.find((p) => p.src === selectedPhotoSrc) || photoList[0];
  const src = photo?.src;
  const galleryIdx = src ? galleryImages.indexOf(src) : -1;
  const edits = photoEdits || {};
  const cur = photo ? effectivePhotoEdit(photo, edits[src]) : null;

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
function AboutView() {
  return (
    <main style={{
      padding: "var(--header-body-gap) var(--pad-x) var(--section-y)",
      maxWidth: "760px"
    }}>
      <SectionHead title="About" kicker="one paragraph" />
      <p style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)", lineHeight: 1.55, letterSpacing: "-0.01em", margin: 0 }}>
        I&rsquo;m Franco, a fraud prevention analyst. Most days I&rsquo;m reading transaction
        data, writing rules, and figuring out which signals actually mean something and which
        ones are just noise. I like work that&rsquo;s quietly useful &mdash; the kind that
        stops a bad charge or saves a real customer a headache without anyone noticing. Outside
        of that I take photos, mostly on film, mostly of ordinary things. This site is where I
        keep both.
      </p>
    </main>);

}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer style={{
      padding: "40px var(--pad-x)", borderTop: "1px solid var(--line)",
      display: "flex", flexWrap: "wrap", gap: "16px",
      alignItems: "baseline", justifyContent: "space-between"
    }}>
      <Mono>Franco Galluzzo</Mono>
      <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
        <a href="mailto:hello@francogalluzzo.com"><Mono style={{ color: "var(--ink-2)" }}>hello@francogalluzzo.com</Mono></a>
        <Mono>Lisbon</Mono>
        <Mono>&copy; 2026</Mono>
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
  const [photoPickMode, setPhotoPickMode] = useState(true);

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
        />
        }
        {view === "About" && <AboutView />}
      </div>

      {view !== "Photography" && <Footer />}

      {view === "Photography" &&
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
    --photo-header-h: 60px;
    --photo-nav-h: 48px;
    --photo-chrome: calc(var(--photo-header-h) + var(--photo-nav-h));
    --photo-view-h: calc(100vh - var(--photo-chrome));
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

  .name-display {
    font-family: var(--font-display);
    font-weight: 700;
    font-synthesis: none;
  }
  .name-display__char {
    display: inline-block;
    font-weight: inherit;
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
  .landing-top__side {
    grid-column: 2;
    grid-row: 1 / 4;
  }
  @media (max-width: 720px) {
    .hero-editorial { grid-template-columns: 1fr !important; }
    .landing-top {
      grid-template-columns: 1fr !important;
      row-gap: 20px !important;
    }
    .landing-top__side { display: contents; }
    .landing-top__projects { grid-row: 1 !important; }
    .landing-top__graph { grid-column: 1 !important; grid-row: 2 !important; }
    .landing-top__photos { grid-row: 3 !important; }
    .landing-top__tagline-headline { grid-column: 1 !important; grid-row: 4 !important; white-space: normal !important; }
    .landing-top__about { grid-row: 5 !important; }
    .landing-top__tagline-body { grid-column: 1 !important; grid-row: 6 !important; }
    .project-card-layout { justify-content: flex-start !important; }
    .project-card__block { width: 100% !important; max-width: 100% !important; }
    .projects-featured {
      grid-template-columns: 1fr !important;
      row-gap: clamp(28px, 5vw, 40px) !important;
    }
    .projects-featured__aside { position: static !important; }
    .projects-featured__blurb { max-width: none !important; }
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
  .photo-frame { display: block; border-radius: 2px; }
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
`;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);