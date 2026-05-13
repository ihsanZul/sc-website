/* ============================================================
   Sinar Cendekia — App entry
   ============================================================ */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "saffron",
  "accentCustom": "#DC8048",
  "displayFont": "Instrument Serif",
  "showSpotlight": true,
  "tickerOn": true
}/*EDITMODE-END*/;

const PALETTES = {
  saffron:  { accent: "#DC8048", accentSoft: "#E69767", accentDeep: "#3D2418", brass: "#8B2635" }, // Soft saffron + espresso + claret
  regal:    { accent: "#16294D", accentSoft: "#2A3F66", accentDeep: "#0A1530", brass: "#8B2635" }, // Oxford navy + claret
  oxblood:  { accent: "#1A1A19", accentSoft: "#383836", accentDeep: "#0A0A09", brass: "#7A1F2A" }, // Ink + oxblood
  prussian: { accent: "#0E2A47", accentSoft: "#1F4271", accentDeep: "#061A2E", brass: "#A3303F" }, // Prussian + scarlet
  emerald:  { accent: "#1F3A2E", accentSoft: "#2E5443", accentDeep: "#0F2218", brass: "#A98446" }, // original
};

function Spotlight({ on }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!on) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.left = x + "px";
      el.style.top = y + "px";
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    loop();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [on]);
  return <div ref={ref} className={"spotlight " + (on ? "on" : "")} />;
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme variables based on palette tweak
  useEffect(() => {
    const root = document.documentElement;
    const p = PALETTES[tweaks.palette] || PALETTES.saffron;
    root.style.setProperty("--accent", p.accent);
    root.style.setProperty("--accent-soft", p.accentSoft);
    root.style.setProperty("--accent-deep", p.accentDeep);
    root.style.setProperty("--accent-2", p.brass);
    root.style.setProperty("--accent-2-soft", p.brass);
    root.style.setProperty("--brass", p.brass);
  }, [tweaks.palette]);

  // Display font tweak
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--display-font", tweaks.displayFont);
    // Apply across all serif elements
    document.querySelectorAll(".serif, .h-display, .h-section, .h-kicker, blockquote, .footer-wordmark, .nav-logo .name b, .quote-block blockquote, .pillar .word, .program .name, .voice .q, .phil-grid .item h4, .cta-card h2, .hero-top .est, .campus-caption .meta, .proof-cell .num").forEach(el => {
      el.style.fontFamily = `"${tweaks.displayFont}", "Cormorant Garamond", Georgia, serif`;
    });
  }, [tweaks.displayFont]);

  return (
    <>
      <Spotlight on={tweaks.showSpotlight} />
      <Nav />
      {tweaks.tickerOn && <Ticker />}
      <main>
        <Hero />
        <Pillars />
        <Programs />
        <DayStrip />
        <ChapterImage />
        <Philosophy />
        <Campus />
        <Proof />
        <Voices />
        <Panorama />
        <Waitlist />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakColor
            label="Brand palette"
            value={tweaks.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              ["#DC8048", "#8B2635", "#F4EFE6"],
              ["#16294D", "#8B2635", "#F4EFE6"],
              ["#1A1A19", "#7A1F2A", "#F4EFE6"],
              ["#0E2A47", "#A3303F", "#F4EFE6"],
              ["#1F3A2E", "#A98446", "#F4EFE6"],
            ]}
          />
          <p className="hint" style={{fontSize: 11, color: "#82817C", marginTop: 6}}>
            Saffron · Regal · Oxblood · Prussian · Emerald
          </p>
        </TweakSection>

        <TweakSection title="Typography">
          <TweakSelect
            label="Display font"
            value={tweaks.displayFont}
            onChange={(v) => setTweak("displayFont", v)}
            options={[
              "Instrument Serif",
              "Cormorant Garamond",
              "DM Serif Display",
              "Newsreader",
              "EB Garamond",
            ]}
          />
        </TweakSection>

        <TweakSection title="Motion & Surface">
          <TweakToggle
            label="Cursor spotlight"
            value={tweaks.showSpotlight}
            onChange={(v) => setTweak("showSpotlight", v)}
          />
          <TweakToggle
            label="Top announcement bar"
            value={tweaks.tickerOn}
            onChange={(v) => setTweak("tickerOn", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
