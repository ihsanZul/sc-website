/* ============================================================
   Sinar Cendekia — cinematic gallery sections
   New components: DayStrip, ChapterImage, Panorama
   ============================================================ */
const { useEffect, useRef } = React;

/* ---------- Day in the life — horizontal scrolling strip ---------- */
function DayStrip() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let lastT = performance.now();
    const speed = 28; // px / second — gentle drift

    const tick = (t) => {
      const dt = t - lastT;
      lastT = t;
      const half = wrap.scrollWidth / 2;
      if (half > 0) {
        let next = wrap.scrollLeft + (speed * dt / 1000);
        if (next >= half) next -= half;
        wrap.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  const moments = [
    { id: "day-1", src: "uploads/day-1.jpg", hint: "" },
    { id: "day-2", src: "uploads/day-2.jpg", hint: "" },
    { id: "day-3", src: "uploads/day-3.jpg", hint: "" },
    { id: "day-4", src: "uploads/day-4.jpg", hint: "" },
    { id: "day-5", src: "uploads/day-5.jpg", hint: "" },
    { id: "day-6", src: "uploads/day-6.jpg", hint: "" },
  ];
  // duplicate for seamless infinite scroll
  const all = [...moments, ...moments];

  return (
    <section className="day" id="day">
      <div className="shell">
        <Reveal>
          <div className="day-header">
            <div>
              <div className="num serif italic">a.</div>
              <div className="eyebrow"><span className="dot" />A Day at Sinar Cendekia</div>
            </div>
            <div>
              <h2 className="h-section">
                From{" "}
                <HiMark color="#F4D2D6">
                  <span className="serif italic" style={{color:"var(--accent-2)"}}>fajr</span>
                </HiMark>
                <span style={{padding: "0 0.35em"}}>to</span>
                <HiMark color="#F2D5B8">
                  <span className="serif italic" style={{color:"var(--accent)"}}>sunset</span>
                </HiMark>.
              </h2>
              <p className="lede" style={{marginTop:24}}>
                A day here moves to its own rhythm — quiet, focused, joyful in the
                right places. Hover to scroll through it yourself.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="day-strip-wrap" ref={wrapRef}>
        <Reveal>
          <div className="day-strip">
            {all.map((m, i) => (
              <div className="day-card" key={i + "-" + m.id}>
                <image-slot
                  id={m.id}
                  shape="rounded"
                  radius="16"
                  src={m.src}
                  placeholder={m.hint}
                ></image-slot>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Full-bleed chapter image with parallax ---------- */
function ChapterImage() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.unobserve(el);
        }
      }),
      { threshold: 0.15 }
    );
    io.observe(el);

    // Subtle parallax on scroll
    const slot = el.querySelector("image-slot");
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height); // 0..1
      const y = (progress - 0.5) * 40; // -20..20 px
      if (slot) slot.style.transform = `scale(1.06) translateY(${y}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="chapter" ref={ref}>
      <image-slot
        id="chapter-1"
        shape="rect"
        src="uploads/chapter-1.jpg"
        placeholder="Editorial moment · graduation, masjid, or campus at golden hour · landscape wide"
      ></image-slot>
      <div className="chapter-quote">
        <p>The fragrance of <em>ten thousand mornings</em>.</p>
        <span className="ref">FIG. ii — Twelve years in session</span>
      </div>
    </section>
  );
}

/* ---------- Pre-footer panoramic ---------- */
function Panorama() {
  return (
    <section className="panorama">
      <image-slot
        id="panorama-1"
        shape="rect"
        src="uploads/panorama-1.jpg"
        placeholder="Wide community moment · whole school, graduation, eid · panoramic"
      ></image-slot>
      <div className="caption">
        <span className="line">A community a child can grow up inside.</span>
        <span className="meta">FIG. iv — Sinar Cendekia at large</span>
      </div>
    </section>
  );
}

Object.assign(window, { DayStrip, ChapterImage, Panorama });
