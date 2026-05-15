/* ============================================================
   About — "A Private Letter"
   Brand-new layout, same premium theme.
   Reuses Nav/Ticker/Footer + Reveal/HiMark/WordReveal from sections.jsx
   ============================================================ */
const { useState, useEffect, useRef } = React;

const ABOUT_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "saffron",
  "displayFont": "Instrument Serif",
  "showSpotlight": true,
  "tickerOn": true
}/*EDITMODE-END*/;

const ABOUT_PALETTES = {
  saffron:  { accent: "#DC8048", accentSoft: "#E69767", accentDeep: "#3D2418", brass: "#8B2635" },
  regal:    { accent: "#16294D", accentSoft: "#2A3F66", accentDeep: "#0A1530", brass: "#8B2635" },
  oxblood:  { accent: "#1A1A19", accentSoft: "#383836", accentDeep: "#0A0A09", brass: "#7A1F2A" },
  prussian: { accent: "#0E2A47", accentSoft: "#1F4271", accentDeep: "#061A2E", brass: "#A3303F" },
  emerald:  { accent: "#1F3A2E", accentSoft: "#2E5443", accentDeep: "#0F2218", brass: "#A98446" },
};

function AboutSpotlight({ on }) {
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

/* Reveal helper bound to a single ref + .in class */
function useRevealRef(threshold = 0.18) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, { threshold, rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

function R({ children, d = 0, as: As = "div", className = "" }) {
  const ref = useRevealRef();
  const cls = "r-up " + (d ? `d${d} ` : "") + className;
  return <As ref={ref} className={cls.trim()}>{children}</As>;
}

/* ============================================================
   FRONT MATTER — letterhead, not a hero
   ============================================================ */
function Letterhead() {
  return (
    <section className="letterhead" id="top">
      <div className="shell">
        <R as="div" className="crest">
          <span className="name">Sinar Muslim Sejati Indonesia</span>
          <span>The Foundation · Est. MMXIV</span>
          <span>Serpong, Tangerang Selatan</span>
        </R>
        <R d={1} as="div" className="center">
          <div className="seal" aria-hidden="true"><span className="glyph">سَ</span></div>
          <div className="from">From the Foundation — To the Reader</div>
        </R>
        <R d={2} as="div" className="right">
          <span>Folio · A.01 / About</span>
          <span className="date">Serpong, 21 Ramaḍān 1447 H</span>
          <span>17 March 2026 CE</span>
        </R>
      </div>
    </section>
  );
}

function OpeningLine() {
  return (
    <section className="opening-line">
      <div className="shell">
        <R as="div">
          <div className="tag">— Two letters enclosed</div>
        </R>
        <R d={1} as="h1">
          Twelve years of raising <span className="it">other people's</span> children
          as carefully as <span className="red">our own.</span>
        </R>
      </div>
    </section>
  );
}

/* ============================================================
   DIPTYCH LETTER
   ============================================================ */
function LetterSpread({ reverse = false, photo, photoCaption, plateLabel, plateNo, marginNum, marginNote, salutation, children, sigName, sigRole, sigText, slotId }) {
  return (
    <section className={"spread " + (reverse ? "reverse" : "")}>
      <div className="spread-grid">
        <div className="panel-image">
          <div className="plate-label">
            <span>Plate {plateNo} · Founder portrait</span>
            <span className="it">{plateLabel}</span>
          </div>
          <div className="photo-card">
            <image-slot
              id={slotId}
              shape="rect"
              fit="cover"
              src={photo}
              placeholder={photoCaption}
            ></image-slot>
          </div>
          <div className="photo-cap">
            <span className="it">{photoCaption}</span>
            <span>From the foundation archives</span>
          </div>
        </div>

        <div className="panel-letter">
          <div className="margin">
            <span className="num">{marginNum}</span>
            <span>Letter</span>
            <span className="note">{marginNote}</span>
          </div>

          <div>
            <R as="div" className="salutation">{salutation}</R>
            <div className="letter-body">{children}</div>

            <div className="signature-block">
              <span className="sig">{sigText}</span>
              <span className="who">
                <span className="name">{sigName}</span>
                {sigRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LetterOne() {
  return (
    <LetterSpread
      slotId="founder-ervin-portrait"
      photo="uploads/founder-ervin.png"
      photoCaption="Ervin Hidayati Tholib, S.Pd."
      plateNo="I"
      plateLabel="Letter from the chairman"
      marginNum="i"
      marginNote="From the chairman of our foundation — written for parents."
      salutation="To the parents reading this —"
      sigName="Ervin Hidayati Tholib, S.Pd."
      sigRole={<>Foundation Chairman · Sinar Muslim Sejati Indonesia</>}
      sigText="Ervin Hidayati Tholib"
    >
      <p>
        Children are like a blank page. Whatever we write on them in childhood
        will stay — in their character, and in what they are able to do as
        adults. So writing well, with care, is our shared task — yours, as
        parents, and ours, as a school.
      </p>

      <p className="pull-aside">
        Education is the right of every child — and a shared task, from the
        first day of elementary school all the way through university.
      </p>

      <p>
        To survive, and one day to truly thrive, Indonesia needs a new
        generation of leaders. Leaders with integrity. Leaders with vision.
        Young people who can picture a better future and have the skill to
        build it. The world has moved on from old ways of teaching. The
        children in front of us deserve more than that.
      </p>
      <p>
        At Sinar Cendekia, we believe a strong understanding of religion,
        science, and foreign languages is what allows a young person to grow
        into a confident professional in their own field. Our hope is to raise
        leaders and entrepreneurs — Indonesians who can contribute here at
        home, across our region, and around the world.
      </p>
      <p>
        Building a better Indonesia is not the work of one school, or one
        family. It is everyone's work. We are grateful to the partners who
        walk beside us. We hope, after you read this, that you will walk
        beside us too.
      </p>
    </LetterSpread>
  );
}

function PullLine() {
  return (
    <section className="pull-fullbleed">
      <R as="div">
        <blockquote>
          Children are <span className="red">like a blank page.</span>
        </blockquote>
      </R>
      <R d={1} as="cite">— <b>Ervin Hidayati Tholib, S.Pd.</b> &nbsp;·&nbsp; Foundation Chairman</R>
    </section>
  );
}

function LetterTwo() {
  return (
    <LetterSpread
      reverse
      slotId="founder-z-portrait"
      photo="uploads/founder-zulkifli.png"
      photoCaption="Dr. Zulkieflimansyah"
      plateNo="II"
      plateLabel="A note from the adviser"
      marginNum="ii"
      marginNote="From our foundation adviser, the man who first dreamt the school up."
      salutation="And a note from our adviser —"
      sigName="Dr. Zulkieflimansyah"
      sigRole={<>Foundation Adviser · 2014</>}
      sigText="Dr. Zulkieflimansyah"
    >
      <p>
        Sinar Cendekia is a home for useful knowledge — a safe, kind place
        where teachers, students, and families can grow together. That was
        the dream in 2014, and it is still the dream today.
      </p>

      <p className="pull-aside">
        Growing as whole, good human beings — that is the basic premise of
        our school.
      </p>

      <p>
        We want our students, teachers, and staff to grow in mind, in body,
        and in soul — but also in feeling, in empathy, and in the wish to
        make the world a little better. Physically well. Open-minded.
        Soft-hearted. In short: the kind of human beings the world needs
        more of.
      </p>
      <p>
        Time moves quickly. The junior and high school years pass like wind
        over the mountains. By the grace of God, our graduates have grown into
        young men and women who are not perfect — but who are kind, who pray,
        and who carry themselves well, both alone and in company. That is
        because of the love and patient care of our teachers. We are very
        proud of that.
      </p>
      <p>
        This is a long, winding road. We hope it gives your child meaning,
        and your family good company — and that, in the end, it earns us the
        pleasure of the Almighty.
      </p>
    </LetterSpread>
  );
}

/* ============================================================
   ESSAY — "On the integration"
   ============================================================ */
function Essay() {
  return (
    <section className="essay" id="approach">
      <div className="shell">
        <R as="div" className="head-marg u-draw">
          <span className="roman">iii.</span>
          <span>An essay</span>
          <span>On the integration ·  Keterpaduan</span>
        </R>

        <div>
          <R as="h2" className="title">
            On <span className="it">putting things back</span><br/>
            <span className="red">together.</span>
          </R>

          <R d={1} as="div" className="essay-body">
            <p>
              Most schools, at some point, decide what kind of school they will
              be. They tilt toward exams, or toward the qur'ān, or toward sport,
              or toward the arts. We have always been suspicious of that tilt.
              A child is not built in pieces. Faith does not wait outside the
              physics lab. Character does not pause for the maths test. So our
              founding decision was unfashionably ambitious: refuse to choose.
            </p>
            <p>
              What we do, instead, is hold four strands at once. The national
              curriculum (Diknas) gives our students the same exit a child in
              any Indonesian public school would have. Cambridge gives them the
              international standard. The Islamic frame — qur'ān, akhlāq, the
              daily ḥalaqah — is not a fifth subject; it is the lens we read
              the other three through. And the body — long days outside, sports,
              animal husbandry, the river — keeps the whole arrangement honest.
            </p>

            <div className="diagram">
              <div className="line">
                <span className="lhs">Faith</span>
                <span className="op">×</span>
                <span className="rhs">how we see the world</span>
              </div>
              <div className="line">
                <span className="lhs">Knowledge</span>
                <span className="op">×</span>
                <span className="rhs">Diknas · Cambridge · Qur'ānic depth</span>
              </div>
              <div className="line">
                <span className="lhs">Character</span>
                <span className="op">×</span>
                <span className="rhs">manners, service, the daily ḥalaqah</span>
              </div>
              <div className="line">
                <span className="lhs">Body</span>
                <span className="op">×</span>
                <span className="rhs">long days outside, sport, the garden</span>
              </div>
              <div className="result">
                <span className="arrow">→</span>
                A child raised <i>whole.</i>
              </div>
            </div>

            <p>
              Every subject is assessed across three registers — cognitive,
              affective, psychomotor — because we don't trust an exam mark to
              describe a fourteen-year-old. And the work of raising the child
              is not the school's alone. We move in step with parents, the wider
              community, government bodies, and our partner institutions. None
              of this is novel. It is, however, easy to forget. So we set it
              down here, in writing, so we don't.
            </p>
          </R>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONSTELLATION — Faculty universities
   ============================================================ */
function Constellation() {
  const items = [
    { uni: "Universitas Indonesia",          city: "Depok · ID",       flag: "🇮🇩" },
    { uni: "Universitas Pendidikan Indonesia", city: "Bandung · ID",   flag: "🇮🇩" },
    { uni: "Institut Pertanian Bogor",       city: "Bogor · ID",       flag: "🇮🇩" },
    { uni: "Universitas Gadjah Mada",        city: "Yogyakarta · ID",  flag: "🇮🇩" },
    { uni: "UIN Syarif Hidayatullah",        city: "Jakarta · ID",     flag: "🇮🇩" },
    { uni: "LIPIA",                          city: "Jakarta · ID",     flag: "🇮🇩" },
    { uni: "Universitas Andalas",            city: "Padang · ID",      flag: "🇮🇩" },
    { uni: "Tohoku University",              city: "Sendai · JP",      flag: "🇯🇵" },
    { uni: "Wageningen University",          city: "Gelderland · NL",  flag: "🇳🇱" },
    { uni: "University of Abertay Dundee",   city: "Scotland · UK",    flag: "🇬🇧" },
    { uni: "Jacksonville State University",  city: "Alabama · US",     flag: "🇺🇸" },
  ];
  return (
    <section className="constellation" id="faculty">
      <div className="shell">
        <R as="div" className="head u-draw">
          <h2>
            Where your child's teachers <span className="it">went</span><br/>
            <span className="red">before they came here.</span>
          </h2>
          <div className="meta">
            <span className="roman">iv.</span>
            <span>Faculty Origins</span><br/>
            <span>11 institutions · 4 countries</span>
          </div>
        </R>

        <ul className="coords-list">
          {items.map((u, i) => (
            <R as="li" d={(i % 3) + 1} key={u.uni}>
              <span className="lat">— {String(i+1).padStart(2,"0")} / 11</span>
              <span className="uni">{u.uni}</span>
              <span className="city">{u.city}</span>
              <span className="flag">{u.flag}</span>
            </R>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   PARTNER INDEX — vertical list on dark
   ============================================================ */
function PartnerIndex() {
  const items = [
    { name: "Cambridge Education",            role: "Curriculum · UK" },
    { name: "The Japan Foundation",           role: "Cultural · JP" },
    { name: "Nihongo Center, Kyoto",          role: "Language · JP" },
    { name: "English First",                  role: "Language · IDN" },
    { name: "Hikari Nihongo Kyoushitsu",      role: "Language · JP" },
    { name: "Mentari Books",                  role: "Publishing · IDN" },
    { name: "PT Chuhatsu Indonesia",          role: "Industry partner" },
    { name: "British Women's Association",    role: "Community · UK" },
    { name: "The Prestigious",                role: "Education · IDN" },
    { name: "SJJ × Fahima Japan",             role: "Distance learning · JP" },
  ];
  return (
    <section className="partner-index" id="partners">
      <div className="shell">
        <R as="div" className="top-mark">
          <span><span className="roman">v.</span> &nbsp; Chapter V — In good company</span>
          <span>An honest list, no logos</span>
        </R>

        <R d={1} as="h2">
          We have <span className="it">kept good company</span> for twelve years.
        </R>

        <ul className="partners-list">
          {items.map((p, i) => (
            <R as="li" d={(i % 3) + 1} key={p.name}>
              <span className="n">— {String(i+1).padStart(2,"0")}</span>
              <span className="name">{p.name}</span>
              <span className="role">{p.role}</span>
            </R>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   THE GROUNDS — full-bleed aerial with cartographic overlay
   ============================================================ */
function Grounds() {
  return (
    <section className="grounds" id="grounds">
      <div className="bg">
        <image-slot
          id="grounds-aerial"
          shape="rect"
          fit="cover"
          src="uploads/panorama-1.jpg"
          placeholder="Aerial of campus · evening"
        ></image-slot>
      </div>

      {/* Floating cartographic labels */}
      <div className="map-labels">
        <span className="pt" style={{top: "26%", left: "18%"}}>Mushala <em>· dawn ḥalaqah</em></span>
        <span className="pt" style={{top: "42%", left: "62%"}}>Science labs <em>· bio · phys · chem</em></span>
        <span className="pt" style={{top: "58%", left: "30%"}}>Saung-saung <em>· by the river</em></span>
        <span className="pt" style={{top: "70%", left: "70%"}}>Animal husbandry <em>· horses · goats · geese</em></span>
        <span className="pt" style={{top: "34%", left: "78%"}}>Palawija garden</span>
        <span className="pt" style={{top: "52%", left: "10%"}}>Sports hall</span>
      </div>

      <div className="shell">
        <R as="div" className="top">
          <span><span className="roman">vi.</span> &nbsp; Chapter VI · The grounds</span>
          <span>Eight hectares · Lengkong Gudang Timur</span>
        </R>

        <R d={1} as="h2">
          A campus that <span className="it">behaves like a small village.</span>
        </R>

        <R d={2} as="div" className="footer-idx">
          <div><span className="mn">— Wellbeing</span><span className="it">School Health Unit (UKS)</span></div>
          <div><span className="mn">— Spiritual</span><span className="it">Mushala for daily prayer</span></div>
          <div><span className="mn">— Comfort</span><span className="it">AC classrooms · campus wifi</span></div>
          <div><span className="mn">— Learning</span><span className="it">Bimbingan belajar &amp; konseling</span></div>
          <div><span className="mn">— Nourishment</span><span className="it">Kantin &amp; dapur, on site</span></div>
        </R>
      </div>
    </section>
  );
}

/* ============================================================
   POSTSCRIPT — distance learning, written as a P.S.
   ============================================================ */
function Postscript() {
  return (
    <section className="postscript" id="distance">
      <div className="shell">
        <R as="div" className="ps-mark">
          P.S.
          <span className="small">— One more thing</span>
        </R>

        <R d={1} as="div" className="ps-body">
          <p>
            For our families abroad: yes, you can still send your child here —
            even from where you are. We run a full elementary <strong>distance
            learning</strong> programme together with <strong>SJJ Fahima
            Japan</strong>, so children growing up overseas can stay tethered
            to their language, their dīn, and a community of friends in Serpong
            until the day they fly home.
          </p>

          <div className="where">
            <span>Japan</span>
            <span>Korea</span>
            <span>Taiwan</span>
            <span>& beyond</span>
          </div>

          <p style={{marginTop: 32}}>
            Write to us at <strong>sjj.fahima@scislamicschool.com</strong> and
            we'll send the enrolment dossier in the next post.
          </p>

          <div className="signoff">— with warm regards,</div>
        </R>
      </div>
    </section>
  );
}

/* ============================================================
   REPLY CARD — closing
   ============================================================ */
function ReplyCard() {
  return (
    <section className="reply-card" id="visit">
      <div className="shell">
        <R as="div" className="card">
          <div className="stamp">
            Sinar
            <span className="big">Cendekia</span>
            Serpong · 2026
          </div>

          <div className="left">
            <R as="h2">
              If this <span className="it">resonates,</span><br/>
              <span className="red">write back.</span>
            </R>

            <R d={1} as="p" className="lede">
              We don't have a sales funnel. We have an admissions office, two
              tea kettles, and a tour route that takes about an hour. Come and
              see whether this is the right home for your child.
            </R>

            <R d={2} as="div" className="ctas">
              <a href="#" className="btn btn-primary">Request a tour <span className="arrow">→</span></a>
              <a href="Sinar Cendekia.html" className="btn btn-ghost">← Back to home</a>
            </R>
          </div>

          <div className="right">
            <R as="div" className="row">
              <span className="k">From</span>
              <span className="v it">Sinar Muslim Sejati Indonesia Foundation</span>
            </R>
            <R d={1} as="div" className="row">
              <span className="k">Address</span>
              <span className="v">Jl. Raya Lengkong Gudang Timur No. 10<br/>Serpong, Tangerang Selatan</span>
            </R>
            <R d={2} as="div" className="row">
              <span className="k">Telephone</span>
              <span className="v"><a href="tel:+62215383119">+62 (021) 538 3119</a></span>
            </R>
            <R d={3} as="div" className="row">
              <span className="k">Hours</span>
              <span className="v">Mon–Fri · 07:00 – 16:00<br/>Sat · 08:00 – 12:00</span>
            </R>
            <R d={4} as="div" className="row" >
              <span className="k">Email</span>
              <span className="v it"><a href="mailto:hello@scislamicschool.com">hello@scislamicschool.com</a></span>
            </R>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ============================================================
   APP
   ============================================================ */
function AboutApp() {
  const [tweaks, setTweak] = useTweaks(ABOUT_TWEAK_DEFAULTS);

  // tag body for paper styles
  useEffect(() => { document.body.classList.add("about"); return () => document.body.classList.remove("about"); }, []);

  // Apply theme variables based on palette tweak
  useEffect(() => {
    const root = document.documentElement;
    const p = ABOUT_PALETTES[tweaks.palette] || ABOUT_PALETTES.saffron;
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
    document.querySelectorAll(
      ".serif, .h-display, .h-section, .h-kicker, blockquote, .footer-wordmark, .nav-logo .name, .opening-line h1, .panel-letter .salutation, .pull-fullbleed blockquote, .essay .title, .constellation .head h2, .partner-index h2, .grounds h2, .reply-card .left h2, .postscript .ps-mark, .coords-list .uni, .partners-list .name, .diagram .line, .diagram .result"
    ).forEach(el => {
      el.style.fontFamily = `"${tweaks.displayFont}", "Cormorant Garamond", Georgia, serif`;
    });
  }, [tweaks.displayFont]);

  return (
    <>
      <AboutSpotlight on={tweaks.showSpotlight} />
      <Nav />
      {tweaks.tickerOn && <Ticker />}
      <main>
        <Letterhead />
        <OpeningLine />
        <LetterOne />
        <PullLine />
        <LetterTwo />
        <Essay />
        <Constellation />
        <PartnerIndex />
        <Grounds />
        <Postscript />
        <ReplyCard />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakColor
            label="Brand palette"
            value={tweaks.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              ["#DC8048", "#8B2635", "#F1EADD"],
              ["#16294D", "#8B2635", "#F1EADD"],
              ["#1A1A19", "#7A1F2A", "#F1EADD"],
              ["#0E2A47", "#A3303F", "#F1EADD"],
              ["#1F3A2E", "#A98446", "#F1EADD"],
            ]}
          />
          <p style={{fontSize: 11, color: "#82817C", marginTop: 6}}>
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

ReactDOM.createRoot(document.getElementById("root")).render(<AboutApp />);
