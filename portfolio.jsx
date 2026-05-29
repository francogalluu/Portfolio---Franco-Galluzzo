const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   TWEAKS
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontPair": "humanist",
  "density": "comfortable",
  "gallery": "uniform",
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

/* ============================================================
   CONTENT  (realistic placeholders — swap for real work)
   ============================================================ */
const PROJECTS = [
{
  n: "01",
  title: "Velocity rules for card-not-present fraud",
  meta: "Risk modeling · 2025",
  blurb: "A tunable velocity rule set that cut CNP chargebacks without adding friction for good customers.",
  label: "rule engine",
  shade: 0.955
},
{
  n: "02",
  title: "Real-time transaction risk dashboard",
  meta: "Internal tooling · 2024",
  blurb: "An analyst-facing dashboard that scores transactions live and surfaces the few worth a second look.",
  label: "dashboard UI",
  shade: 0.93
},
{
  n: "03",
  title: "Account-takeover investigation playbook",
  meta: "Process & docs · 2023",
  blurb: "A plain-language playbook so anyone on the team can run an ATO case the same way, start to finish.",
  label: "documentation",
  shade: 0.905
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
      {/* HOME top-left */}
      <div style={{ padding: "clamp(14px, 2vh, 22px) var(--pad-x) 0", fontFamily: "\"Times New Roman\"" }}>
        <button onClick={scrollToWork} style={{
          all: "unset", cursor: "pointer",
          fontSize: "0.72rem",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--ink)", fontFamily: "\"Schibsted Grotesk\"", fontWeight: "600"
        }}>Home</button>
      </div>

      <div style={{
        display: "flex", alignItems: "flex-start",
        padding: "var(--header-body-gap) var(--pad-x) 0"
      }}>
        <div className="landing-top" style={{
          display: "grid", gridTemplateColumns: "1.5fr 1fr",
          gap: "var(--landing-menu-text-gap)", alignItems: "flex-start",
          width: "100%"
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "clamp(2px, 0.4vw, 8px)" }}>
            <BigLink label="Projects" onClick={scrollToWork} />
            <BigLink label="Photos" onClick={() => setView("Photography")} />
            <BigLink label="About" onClick={() => setView("About")} />
          </div>

          <div style={{ paddingTop: "clamp(6px, 1.2vw, 14px)" }}>
            <p style={{
              margin: 0, fontFamily: '"Inter Tight", system-ui, sans-serif', fontWeight: 700,
              fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", lineHeight: 1.3, letterSpacing: "-0.01em",
              whiteSpace: "nowrap"
            }}>
              Data Analytics &amp; <span style={{ color: "var(--accent)" }}>AI enthusiast.</span>
            </p>
            <p style={{
              margin: "clamp(22px, 3vw, 36px) 0 0", maxWidth: "34ch",
              fontFamily: '"Inter Tight", system-ui, sans-serif', fontWeight: 700,
              fontSize: "clamp(1.25rem, 2vw, 1.65rem)", lineHeight: 1.5, letterSpacing: "-0.005em"
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

function ProjectCard({ p, indexed }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}>
      
      <div style={{
        transition: "transform .5s cubic-bezier(.2,.7,.2,1)",
        transform: hover ? "translateY(-4px)" : "none"
      }}>
        <Placeholder shade={p.shade} label={p.label} ratio={16 / 11} />
      </div>
      <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
        {indexed && <Mono style={{ paddingTop: "3px" }}>{p.n}</Mono>}
        <div>
          <h3 style={{
            margin: 0, fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: "1.12rem", letterSpacing: "-0.005em", lineHeight: 1.25,
            color: hover ? "var(--accent)" : "var(--ink)",
            textDecoration: hover ? "underline" : "none",
            textDecorationColor: "var(--accent)",
            textUnderlineOffset: "3px", textDecorationThickness: "1px",
            transition: "color .2s ease"
          }}>{p.title}</h3>
          <Mono style={{ display: "block", marginTop: "7px" }}>{p.meta}</Mono>
          <p style={{ margin: "12px 0 0", maxWidth: "42ch", color: "var(--ink-2)", fontSize: "0.97rem" }}>{p.blurb}</p>
        </div>
      </div>
    </article>);

}

function ProjectsView({ layout }) {
  const indexed = layout === "editorial";
  return (
    <main id="work" style={{
      padding: "clamp(48px, 8vh, 88px) var(--pad-x) var(--section-y)",
      maxWidth: "var(--maxw)"
    }}>
      <SectionHead title="Selected work" kicker={`${PROJECTS.length} projects`} />
      <div style={{
        display: "grid", gap: "calc(var(--gap) + 16px) var(--gap)",
        gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))"
      }}>
        {PROJECTS.map((p) => <ProjectCard key={p.n} p={p} indexed={indexed} />)}
      </div>
    </main>);

}

/* ============================================================
   PHOTOGRAPHY  — hover scales a photo up to fill the screen
   ============================================================ */
function Photo({ photo, focused, dimmed, onEnter, onLeave }) {
  const ref = useRef(null);
  const [tf, setTf] = useState("none");
  const coarseRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  const enter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth,vh = window.innerHeight;
    const targetW = vw * 0.66,targetH = vh * 0.82;
    const scale = Math.min(targetW / r.width, targetH / r.height);
    const dx = vw / 2 - (r.left + r.width / 2);
    const dy = vh / 2 - (r.top + r.height / 2);
    setTf(`translate(${dx}px, ${dy}px) scale(${Math.max(scale, 1)})`);
    onEnter();
  }, [onEnter]);

  const leave = useCallback(() => {
    setTf("none");
    onLeave();
  }, [onLeave]);

  const tap = useCallback(() => {
    if (!coarseRef.current) return;
    if (focused) leave();
    else enter();
  }, [focused, enter, leave]);

  return (
    <div
      ref={ref}
      onMouseEnter={coarseRef.current ? undefined : enter}
      onMouseLeave={coarseRef.current ? undefined : leave}
      onClick={tap}
      style={{
        position: "relative", cursor: "zoom-in",
        zIndex: focused ? 40 : 1,
        opacity: dimmed ? 0.1 : 1,
        transform: tf,
        transformOrigin: "center",
        transition: "transform .62s cubic-bezier(.19,1,.22,1), opacity .45s ease",
        willChange: "transform",
        boxShadow: focused ? "0 30px 80px -30px rgba(0,0,0,.28)" : "none"
      }}>
      
      <Placeholder shade={photo.shade} label={photo.cap} ratio={photo.ratio} />
    </div>);

}

function PhotographyView({ gallery }) {
  const [hovered, setHovered] = useState(null);

  const gridStyle =
  gallery === "single" ?
  { display: "grid", gridTemplateColumns: "minmax(0, 760px)", justifyContent: "center", gap: "calc(var(--gap) + 20px)" } :
  gallery === "masonry" ?
  { columns: "3 240px", columnGap: "var(--gap)" } :
  { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "var(--gap)" };

  return (
    <main style={{ padding: "var(--header-body-gap) var(--pad-x) var(--section-y)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
        <SectionHead title="Photography" kicker="hover or tap to look closer" />
        <div style={gridStyle}>
          {PHOTOS.map((photo, i) => {
            const wrap = gallery === "masonry" ?
            { breakInside: "avoid", marginBottom: "var(--gap)" } :
            {};
            return (
              <div key={i} style={wrap}>
                <Photo
                  photo={photo}
                  focused={hovered === i}
                  dimmed={hovered !== null && hovered !== i}
                  onEnter={() => setHovered(i)}
                  onLeave={() => setHovered((h) => h === i ? null : h)} />
                
              </div>);

          })}
        </div>
      </div>
    </main>);

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

  const setViewAndTop = useCallback((v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showHeader = view !== "Projects";

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
        {view === "Projects" &&
        <React.Fragment>
            <Hero layout={t.layout} setView={setViewAndTop} />
            <ProjectsView layout={t.layout} />
          </React.Fragment>
        }
        {view === "Photography" && <PhotographyView gallery={t.gallery} />}
        {view === "About" && <AboutView />}
      </div>

      <Footer />

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

        <TweakSection label="Photography" />
        <TweakSelect label="Gallery" value={t.gallery}
        options={[
        { value: "uniform", label: "Uniform grid" },
        { value: "masonry", label: "Masonry" },
        { value: "single", label: "Single column" }]
        }
        onChange={(v) => setTweak("gallery", v)} />

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
  @media (max-width: 720px) {
    .hero-editorial { grid-template-columns: 1fr !important; }
    .landing-top { grid-template-columns: 1fr !important; gap: 28px !important; }
  }
`;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);