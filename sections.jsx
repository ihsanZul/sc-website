/* ============================================================
   Sinar Cendekia — section components
   ============================================================ */
const { useEffect, useRef, useState } = React;

/* ---------- Reveal hook (IntersectionObserver) ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0, as: As = "div" }) {
  const ref = useReveal();
  const cls = "fade-up " + (delay ? `d${delay} ` : "") + className;
  return <As ref={ref} className={cls.trim()}>{children}</As>;
}

/* ---------- Highlight sweep (binus-style marker pill) ---------- */
function HiMark({ children, color }) {
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
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style = color ? { "--hi-color": color } : {};
  return <span ref={ref} className="hi-mark" style={style}>{children}</span>;
}

/* ---------- Word reveal (for hero) ---------- */
function WordReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current?.classList.add("in"), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span ref={ref} className={"reveal-word " + className}>
      <span>{children}</span>
    </span>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navItems = [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    {
      label: "Gallery",
      href: "#gallery",
      children: [
        { label: "The Foundation", href: "#foundation" },
        { label: "High School Teachers", href: "#hs-teachers" },
        { label: "Junior High Teachers", href: "#jh-teachers" },
        { label: "Elementary Teachers", href: "#el-teachers" },
        { label: "SCBS Teachers", href: "#scbs-teachers" },
        { label: "Staff", href: "#staff" },
      ],
    },
    {
      label: "Admission",
      href: "#admissions",
      children: [
        { label: "Online Registration", href: "#registration" },
        { label: "Forms", href: "#forms" },
      ],
    },
    { label: "Events", href: "#events" },
    { label: "Contact", href: "#contact" },
    { label: "Parents Desk", href: "#parents" },
  ];

  return (
    <>
      <div className={"nav-wrap " + (scrolled ? "scrolled" : "")}>
        <div className="shell">
          <nav className="nav">
            <a href="#top" className="nav-logo" aria-label="Sinar Cendekia Islamic School">
              <img src="uploads/sclog.png" alt="Sinar Cendekia" className="logo-img" />
              <span className="name">Sinar Cendekia Islamic School</span>
            </a>
            <div className="nav-links">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={"nav-item " + (item.children ? "has-menu " : "") + (openMenu === item.label ? "open" : "")}
                  onMouseEnter={() => item.children && setOpenMenu(item.label)}
                  onMouseLeave={() => item.children && setOpenMenu(null)}
                >
                  <a href={item.href}>
                    {item.label}
                    {item.children && (
                      <svg className="caret" width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </a>
                  {item.children && (
                    <div className="nav-menu">
                      <div className="nav-menu-inner">
                        {item.children.map((c) => (
                          <a key={c.label} href={c.href} className="nav-menu-item">
                            <span>{c.label}</span>
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                              <path d="M3 9L9 3M9 3H5M9 3V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{display:"flex", alignItems:"center", gap: 0}}>
              <a href="#admissions" className="btn btn-primary">
                Join Waitlist <span className="arrow">→</span>
              </a>
              <button className="nav-burger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M1 1H17M1 7H17M1 13H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>

      <div className={"nav-drawer " + (drawerOpen ? "open" : "")}>
        <button className="nav-drawer-close" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <ul className="nav-drawer-list">
          {navItems.map((item) => (
            <li key={item.label}>
              <a href={item.href} onClick={() => setDrawerOpen(false)}>
                <span>{item.label}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              {item.children && (
                <ul className="sub">
                  {item.children.map((c) => (
                    <li key={c.label}>
                      <a href={c.href} onClick={() => setDrawerOpen(false)}>{c.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="nav-drawer-cta">
          <a href="#admissions" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>
            Join Waitlist <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </>
  );
}

/* ---------- Ticker ---------- */
function Ticker() {
  const items = [
    "Now Accepting Applications · Academic Year 2026–2027",
    "Limited Seats Remaining Across All Levels",
    "Open House · Saturday 21 March · Serpong Campus",
    "Welcoming Cohort XII to High School",
  ];
  // Double for seamless loop
  const all = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {all.map((t, i) => (
          <span key={i} className="ticker-item"><span>{t}</span></span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <image-slot
          id="hero-bg"
          shape="rect"
          fit="contain"
          src="uploads/9085326_orig.jpg"
          placeholder="Campus building · wide"
        ></image-slot>
      </div>

      <div className="shell" style={{width:"100%"}}>
        <div className="hero-top">
          <Reveal>
            <div className="eyebrow"><span className="dot" />Sinar Cendekia · Est. 2014 · Serpong, ID</div>
          </Reveal>
          <Reveal delay={1} className="meta">
            <div className="eyebrow">A school for a</div>
            <div className="est serif italic">
              <span style={{color:"var(--accent-2)"}}>better</span>{" "}
              <span style={{color:"var(--accent)"}}>future</span>.
            </div>
          </Reveal>
        </div>

        <h1 className="h-display hero-title">
          <WordReveal delay={120}>A school</WordReveal>
          <br />
          <WordReveal delay={260}>for a&nbsp;</WordReveal>
          <WordReveal delay={420} className="it"><i className="it-red">better</i></WordReveal>
          <br />
          <WordReveal delay={560} className="it"><i className="it-navy">future</i>.</WordReveal>
        </h1>

        <div className="hero-bottom">
          <Reveal delay={2} className="col-lede">
            <p className="lede">
              An Islamic international school in Serpong raising the next generation
              of leaders — fluent in faith, knowledge, and character.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="hero-stats">
              <span><b>1,200+</b> students across five levels</span>
              <span><b>97%</b> graduates placed in top-tier universities</span>
              <span><b>12</b> years shaping Indonesia's brightest</span>
            </div>
          </Reveal>
          <Reveal delay={4} className="col-cta">
            <a href="#programs" className="btn btn-ghost">Explore programs</a>
            <a href="#admissions" className="btn btn-primary">Apply for 2026 <span className="arrow">→</span></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pillars ---------- */
function Pillars() {
  const pillars = [
    { num: "01", word: "Īmān", t: "Faith", d: "A heart anchored in the deen — taught with sincerity, lived with grace.", img: "pillar-iman", src: "uploads/pillar-iman.png", hint: "Child in moment of prayer · soft window light" },
    { num: "02", word: "Ilmu", t: "Knowledge", d: "Cambridge-aligned rigour woven with Kurikulum Merdeka and Qurʾānic depth.", img: "pillar-ilmu", src: "uploads/pillar-ilmu.png", hint: "Student bent over a book · hands and pages" },
    { num: "03", word: "Adab", t: "Character", d: "Manners before learning. The fragrance of every Sinar Cendekia child.", img: "pillar-adab", src: "uploads/pillar-adab.png", hint: "Teacher leaning in to listen to student" },
    { num: "04", word: "Iḥsān", t: "Excellence", d: "To act as though seen — in study, in service, in every quiet moment.", img: "pillar-ihsan", src: "uploads/pillar-ihsan.png", hint: "Child quietly in service · candid" },
  ];
  return (
    <section className="section-pad pillars-section" id="approach">
      <div className="shell">
        <Reveal>
          <div className="section-header">
            <div>
              <div className="num serif italic">i.</div>
              <div className="eyebrow"><span className="dot" />The Approach</div>
            </div>
            <div>
              <h2 className="h-section">
                Four roots.{" "}
                <HiMark color="#F4D2D6">
                  <span className="serif italic" style={{color:"var(--accent-2)"}}>One child.</span>
                </HiMark>
              </h2>
              <p className="lede" style={{marginTop:24}}>
                Every part of the day — from the morning ḥalaqah to the science lab —
                returns to four pillars we believe shape a whole human being.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="pillars">
            {pillars.map(p => (
              <div className="pillar" key={p.num}>
                <div className="pillar-img">
                  <image-slot
                    id={p.img}
                    shape="rounded"
                    radius="16"
                    src={p.src}
                    placeholder={p.hint}
                  ></image-slot>
                </div>
                <div className="num">{p.num}</div>
                <div className="word">{p.word}</div>
                <div className="translation">{p.t}</div>
                <div className="desc">{p.d}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Programs ---------- */
function Programs() {
  const items = [
    { idx: "01", name: "Daycare & Kindergarten", age: "Ages 2 – 6", blurb: "Play-led discovery, Qur'ān memorisation, and bilingual immersion in a garden campus.", img: "prog-kg", src: "uploads/prog-kg.jpg", hint: "Toddler laughing · play" },
    { idx: "02", name: "Elementary", age: "Grades 1 – 6", blurb: "Project-based learning paired with adab, akhlāq and the early roots of academic ambition.", img: "prog-el", src: "uploads/prog-el.jpg", hint: "Elementary student mid-activity" },
    { idx: "03", name: "Junior High", age: "Grades 7 – 9", blurb: "A formative chapter — STEM, humanities, and selfhood, taught with deep mentorship.", img: "prog-jh", src: "uploads/prog-jh.jpg", hint: "Junior high student in class" },
    { idx: "04", name: "High School", age: "Grades 10 – 12", blurb: "University-grade scholarship. Cohort XII placed across Cambridge, NUS, Al-Azhar, ITB.", img: "prog-hs", src: "uploads/prog-hs.jpg", hint: "High school student presenting" },
    { idx: "05", name: "Boarding · SCBS", age: "Senior Years", blurb: "A residential community of memorisers, scholars, and athletes — disciplined, dignified.", img: "prog-scbs", src: "uploads/prog-scbs.jpg", hint: "Boarders in study circle" },
  ];
  return (
    <section className="section-pad" id="programs">
      <div className="shell">
        <Reveal>
          <div className="section-header">
            <div>
              <div className="num serif italic">ii.</div>
              <div className="eyebrow"><span className="dot" />Programs</div>
            </div>
            <div>
              <h2 className="h-section">
                From first words to{" "}
                <HiMark color="#F2D5B8">
                  <span className="serif italic" style={{color:"var(--accent)"}}>final theses.</span>
                </HiMark>
              </h2>
              <p className="lede" style={{marginTop:24}}>
                Five connected schools, one continuous formation — designed so a child
                can begin at two and graduate ready for the world.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="programs">
            {items.map(p => (
              <a className="program" key={p.idx} href="#admissions">
                <div className="idx">{p.idx} —</div>
                <div className="thumb">
                  <image-slot
                    id={p.img}
                    shape="rounded"
                    radius="14"
                    src={p.src}
                    placeholder={p.hint}
                  ></image-slot>
                </div>
                <div className="name">{p.name}</div>
                <div className="age">{p.age}</div>
                <div className="blurb">{p.blurb}</div>
                <div className="go">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Philosophy / Quote ---------- */
function Philosophy() {
  return (
    <section className="philosophy section-pad">
      <div className="grain" />
      <div className="shell">
        <Reveal>
          <div className="eyebrow"><span className="dot" />Our philosophy</div>
        </Reveal>

        <div className="quote-block">
          <Reveal delay={1}>
            <blockquote>
              <span className="mark">“</span>Do not raise your children the way your
              parents raised you — they were born <i style={{color:"#E2B8BD"}}>for a different time.</i>
            </blockquote>
          </Reveal>
          <Reveal delay={2}>
            <cite>— <b>ʿAlī ibn Abī Ṭālib</b> &nbsp;·&nbsp; the spirit behind our pedagogy</cite>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <div className="phil-grid">
            <div className="item">
              <h4>Faith, fluently</h4>
              <p>Daily ḥalaqah, taḥfīẓ tracks, and integrated Islamic studies — taught as a way of seeing, not a subject to memorise.</p>
            </div>
            <div className="item">
              <h4>Rigour, gently</h4>
              <p>Cambridge-aligned curriculum, project-based learning, and Kurikulum Merdeka — held together by warm, attentive teaching.</p>
            </div>
            <div className="item">
              <h4>Character, daily</h4>
              <p>Manners, service, and reflection are not extras — they're the curriculum the children remember twenty years later.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Campus ---------- */
function Campus() {
  const slots = [
    { id: "campus-1", cls: "cg-1", src: "uploads/campus-1.jpg", hint: "Campus masjid · dawn · wide" },
    { id: "campus-2", cls: "cg-2", src: "uploads/campus-2.jpg", hint: "Library reading nook" },
    { id: "campus-3", cls: "cg-3", src: "uploads/campus-3.jpg", hint: "Science studio · students at work" },
    { id: "campus-4", cls: "cg-4", src: "uploads/campus-4.jpg", hint: "Open courtyard · golden hour" },
    { id: "campus-5", cls: "cg-5", src: "uploads/campus-5.jpg", hint: "Sports field · running" },
    { id: "campus-6", cls: "cg-6", src: "uploads/campus-6.jpg", hint: "Auditorium / assembly" },
  ];
  return (
    <section className="campus" id="campus">
      <div className="shell">
        <Reveal>
          <div className="section-header">
            <div>
              <div className="num serif italic">iii.</div>
              <div className="eyebrow"><span className="dot" />The Campus</div>
            </div>
            <div>
              <h2 className="h-section">
                A garden for{" "}
                <HiMark color="#F4D2D6">
                  <span className="serif italic" style={{color:"var(--accent-2)"}}>growing minds.</span>
                </HiMark>
              </h2>
              <p className="lede" style={{marginTop:24}}>
                Eight hectares in Serpong — open courtyards, science studios, a
                purpose-built masjid, and quiet corners for memorisation.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="campus-grid-rich">
            {slots.map(s => (
              <image-slot
                key={s.id}
                id={s.id}
                class={s.cls}
                shape="rounded"
                radius="16"
                src={s.src}
                placeholder={s.hint}
              ></image-slot>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2}>
          <div className="campus-caption">
            <div className="meta">
              Jl. Raya Lengkong Gudang Timur · Serpong, Tangerang Selatan
            </div>
            <div className="ref">FIG. 03 — CAMPUS OBSERVATIONS, 2026</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Proof / numbers ---------- */
function Proof() {
  const stats = [
    { num: "12", suffix: "yrs", label: "Of formation since 2014" },
    { num: "97", suffix: "%", label: "Graduates to top universities" },
    { num: "5", suffix: ":1", label: "Mushrif to student ratio (boarding)" },
    { num: "30", suffix: "+", label: "International partner schools" },
  ];
  return (
    <section className="section-pad-sm">
      <div className="shell">
        <Reveal>
          <div className="proof">
            {stats.map((s, i) => (
              <div className="proof-cell" key={i}>
                <div className="num">
                  {s.num}<span className="it" style={i % 2 === 0 ? {color:"var(--accent-2)"} : {color:"var(--accent)"}}>{s.suffix}</span>
                </div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Voices ---------- */
function Voices() {
  const voices = [
    {
      q: "My daughter doesn't just recite — she carries the Qur'ān in how she speaks to her brother. That is the difference.",
      name: "Rania Hadiprawira",
      role: "Parent · Elementary, Cohort IX",
      initial: "R",
    },
    {
      q: "The teachers here don't just teach you and let you go. Two years into university, my form teacher still asks how I'm praying.",
      name: "Faisal Anwar",
      role: "Alumnus · High School, Class of 2024",
      initial: "F",
    },
    {
      q: "It is the only school I've toured where rigour and adab are spoken in the same breath. That's rare anywhere.",
      name: "Dr. Halimah Saʿīd",
      role: "Visiting Educator · Singapore",
      initial: "H",
    },
  ];
  return (
    <section className="section-pad" id="voices">
      <div className="shell">
        <Reveal>
          <div className="section-header">
            <div>
              <div className="num serif italic">iv.</div>
              <div className="eyebrow"><span className="dot" />Voices</div>
            </div>
            <div>
              <h2 className="h-section">
                What families{" "}
                <HiMark color="#F2D5B8">
                  <span className="serif italic" style={{color:"var(--accent)"}}>actually say.</span>
                </HiMark>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="voices">
          {voices.map((v, i) => (
            <Reveal key={i} delay={i+1}>
              <div className="voice">
                <p className="q"><span className="mark">“</span>{v.q}</p>
                <div className="person">
                  <div className="avatar">{v.initial}</div>
                  <div className="who">
                    <b>{v.name}</b>
                    <span>{v.role}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Waitlist CTA ---------- */
function Waitlist() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setEmail("");
  };
  return (
    <section className="cta-section" id="admissions">
      <div className="shell">
        <Reveal>
          <div className="cta-card">
            <div>
              <div className="eyebrow" style={{color:"#FFFFFFB0", marginBottom: 24}}>
                <span className="dot" style={{background:"#E2B8BD"}} />Admissions · 2026–2027
              </div>
              <h2>
                The next cohort <br/>
                begins <span className="it">soon.</span>
              </h2>
            </div>
            <div className="right">
              <p>
                Seats are released level by level, starting Kindergarten in September.
                Join the waitlist and we'll reach out personally with a tour invitation
                and admissions pathway.
              </p>
              <form className="cta-form" onSubmit={submit}>
                <input
                  type="email"
                  placeholder="parent@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  {sent ? "Thank you ✓" : "Request a tour"}
                </button>
              </form>
              <div className="cta-meta">
                <span>No fee to apply</span>
                <span>Response in 48h</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer>
      <div className="shell">
        <div className="footer-grid">
          <div>
            <a href="#top" className="nav-logo" style={{marginBottom: 20}}>
              <img src="uploads/sclog.png" alt="Sinar Cendekia" className="logo-img" />
              <span className="name">Sinar Cendekia Islamic School</span>
            </a>
            <p className="body-sm" style={{maxWidth: "32ch", marginTop: 24}}>
              Jl. Raya Lengkong Gudang Timur No. 10<br/>
              Serpong, Tangerang Selatan, Indonesia<br/>
              <br/>
              +62 (021) 538 3119
            </p>
          </div>
          <div>
            <h5>Schools</h5>
            <ul>
              <li><a href="#programs">Daycare & Kindergarten</a></li>
              <li><a href="#programs">Elementary</a></li>
              <li><a href="#programs">Junior High</a></li>
              <li><a href="#programs">High School</a></li>
              <li><a href="#programs">Boarding · SCBS</a></li>
            </ul>
          </div>
          <div>
            <h5>Discover</h5>
            <ul>
              <li><a href="#approach">The Approach</a></li>
              <li><a href="#campus">The Campus</a></li>
              <li><a href="#voices">Voices</a></li>
              <li><a href="#admissions">Admissions</a></li>
              <li><a href="#admissions">Open Days</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href="#">Kindergarten · 0812 2379 6712</a></li>
              <li><a href="#">Elementary · 0812 1347 0856</a></li>
              <li><a href="#">Junior High · 0877 7625 6172</a></li>
              <li><a href="#">High School · 0813 1173 7325</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-wordmark">
          Sinar <span className="it" style={{color:"var(--accent-2)"}}>Cendekia.</span>
        </div>

        <div className="footer-bottom">
          <span>© 2014–2026 Sinar Cendekia Islamic School. All rights reserved.</span>
          <span><a href="#">Privacy</a> &nbsp; · &nbsp; <a href="#">Terms</a> &nbsp; · &nbsp; <a href="#">Careers</a></span>
        </div>
      </div>
    </footer>
  );
}

/* Export to window so app.jsx can use them */
Object.assign(window, {
  Nav, Ticker, Hero, Pillars, Programs, Philosophy, Campus, Proof, Voices, Waitlist, Footer, Reveal, HiMark
});
