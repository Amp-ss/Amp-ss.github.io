// Renders the page from window.SITE (defined in content.js), wires up the
// navigation, filters, copy-email and theme toggle, and runs the Aerotrack
// tracker sketch. No inline scripts, so the strict CSP in index.html holds.
(function () {
  const S = window.SITE;
  if (!S) return;
  const root = document.documentElement;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Escape, then highlight any [placeholder] text so it is easy to spot.
  const t = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');
  const has = (a) => Array.isArray(a) && a.length > 0;
  const tags = (list) => (has(list) ? `<ul class="tags" aria-label="Tools and topics">${list.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : "");

  const svg = (d, cls = "icon") => `<svg class="${cls}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    doc: svg('<path d="M9.5 1.75H4.25a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5L9.5 1.75Z"/><path d="M9.5 1.75V5h3.25M5.75 8.5h4.5M5.75 11h3"/>'),
    out: svg('<path d="M5 11 11 5m0 0H6.5M11 5v4.5"/>', "icon out"),
    chev: svg('<path d="m4 6 4 4 4-4"/>', "chev"),
    sun: svg('<circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9"/>'),
    moon: svg('<path d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z"/>')
  };
  const links = (S.links || []).filter((l) => l && l.url);
  const ext = (l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${t(l.label)} ${ICON.out}</a>`;
  const cvBtn = (label) => (S.cvFile ? `<a class="btn btn-primary" href="${esc(S.cvFile)}" target="_blank" rel="noopener">${ICON.doc} ${label}</a>` : "");
  const themeBtn = `<button class="btn icon-btn theme-btn" type="button" aria-label="Switch colour theme">${ICON.moon}</button>`;

  const sections = [];
  const section = (id, title, body, extra = "") => {
    sections.push({ id, title });
    return `<section id="${id}" aria-labelledby="${id}-h">
      <div class="sec-h"><h2 id="${id}-h">${title}</h2>${extra}</div>${body}</section>`;
  };
  const count = (n, word) => `<span class="count">${String(n).padStart(2, "0")} ${word}</span>`;
  const filters = (target) => `<span class="rule" aria-hidden="true"></span><div class="filters" role="group" aria-label="Show" data-target="${target}">
      <button type="button" data-stage="all" aria-pressed="true">All</button>
      <button type="button" data-stage="hku" aria-pressed="false">HKU</button>
      <button type="button" data-stage="school" aria-pressed="false">School</button></div>`;
  const rule = '<span class="rule" aria-hidden="true"></span>';

  // ---------- About ----------
  let main = "";
  main += section("about", "About", `
    <p class="lead reveal">${t(S.intro)}</p>
    ${has(S.highlights) ? `<ul class="stats reveal" aria-label="Highlights">${S.highlights.map((h) => `<li><b>${t(h.figure)}</b><span>${t(h.label)}</span></li>`).join("")}</ul>` : ""}
    ${has(S.atAGlance) ? `<dl class="facts reveal">${S.atAGlance.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${t(f.value)}</dd></div>`).join("")}</dl>` : ""}`, rule);

  // ---------- Projects ----------
  if (has(S.caseStudies) || has(S.projects)) {
    const flow = (c) => `<h4>How it works</h4><div class="flow-wrap"><div class="flow" role="img" aria-label="${esc(c.diagram.join(", then "))}">${c.diagram.map((n) => `<div class="node">${t(n)}</div>`).join('<div class="arrow"></div>')}</div></div>
      ${c.loop ? `<p class="loop">↺ ${t(c.loop)}</p>` : ""}`;
    const demo = `<figure class="demo">
        <div class="demo-bar"><span>Gimbal control logic · live sketch</span><span class="live" id="demo-mode">● auto</span></div>
        <canvas id="tracker" aria-label="Animated sketch of the camera view re-centring on a moving person"></canvas>
        <div class="readout">
          <div><span>Error x</span><b id="r-ex">+0 px</b></div>
          <div><span>Error y</span><b id="r-ey">+0 px</b></div>
          <div><span>Pan / tilt</span><b id="r-pt">90° / 90°</b></div>
          <div><span>Servos</span><b id="r-servo">hold</b></div>
        </div>
        <figcaption>The tracker aims 35% down the person's box, holds still inside a 20 × 10 px deadband, and otherwise steps the servos with pan and tilt gains of 0.04 and 0.07 °/px and α = 0.30 smoothing. Move your pointer over the frame to steer the person.</figcaption>
      </figure>`;
    const cases = (S.caseStudies || []).map((c, i) => `
      <article class="case reveal">
        ${i === 0 ? demo : ""}
        <div class="case-main">
          <div class="case-meta">${i === 0 ? '<span class="feat">Featured</span>' : ""}<span>${t(c.year)}</span><span>${t(c.context)}</span></div>
          <h3>${t(c.title)}</h3>
          ${c.summary ? `<p class="summary">${t(c.summary)}</p>` : ""}
          ${c.role ? `<p class="myrole">My role: <b>${t(c.role)}</b></p>` : ""}
          ${has(c.metrics) ? `<div class="metrics">${c.metrics.map((m) => `<div><b>${t(m.figure)}</b><span>${t(m.label)}</span></div>`).join("")}</div>` : ""}
          ${tags(c.tags)}
        </div>
        <details>
          <summary><span class="open-label">Read the case study</span><span class="close-label">Hide the case study</span>${ICON.chev}</summary>
          <div class="write-up">
            <h4>Problem</h4><p>${t(c.problem)}</p>
            ${has(c.diagram) ? flow(c) : ""}
            <h4>Approach</h4><p>${t(c.approach)}</p>
            <h4>Result</h4><p>${t(c.result)}</p>
            ${has(c.gallery) ? `<h4>Design iterations</h4><ol class="gallery">${c.gallery.map((g) => `
              <li><figure><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy" decoding="async"><figcaption>${t(g.caption)}</figcaption></figure></li>`).join("")}</ol>` : ""}
          </div>
        </details>
      </article>`).join("");
    const cards = has(S.projects) ? `<h3 class="more-h">More projects</h3><div class="cards">${S.projects.map((p) => `
      <article class="card reveal">
        <div class="card-top"><span>${t(p.year)}</span>${p.status ? `<span class="status">${t(p.status)}</span>` : ""}</div>
        <h3>${t(p.title)}</h3>
        ${p.role ? `<p class="crole">${t(p.role)}</p>` : ""}
        <p class="sum">${t(p.summary)}</p>
        ${p.outcome ? `<p class="out">${t(p.outcome)}</p>` : ""}
        ${tags(p.tags)}
      </article>`).join("")}</div>` : "";
    const n = (S.caseStudies || []).length + (S.projects || []).length;
    main += section("projects", "Projects", cases + cards, count(n, "selected") + rule);
  }

  // ---------- Education ----------
  if (has(S.education)) {
    main += section("education", "Education", `<div class="rows">${S.education.map((e) => `
      <article class="row reveal">
        <div class="when">${t(e.start)} – ${t(e.end)}</div>
        <div><h3>${t(e.school)}</h3><p class="org">${t(e.degree)}</p>
          ${e.result ? `<p class="grade">${t(e.result)}</p>` : ""}
          ${has(e.details) ? `<ul>${e.details.map((d) => `<li>${t(d)}</li>`).join("")}</ul>` : ""}</div>
        <span class="side"></span>
      </article>`).join("")}</div>`, rule);
  }

  // ---------- Experience ----------
  if (has(S.leadership)) {
    main += section("experience", "Leadership", `<div class="rows" id="leadership-rows">${S.leadership.map((l) => `
      <article class="row reveal" data-stage="${esc(l.stage)}">
        <div class="when">${t(l.years)}</div>
        <div><h3>${t(l.role)}</h3><p class="org">${t(l.org)}</p>${l.note ? `<p class="note">${t(l.note)}</p>` : ""}</div>
        <span class="side"></span>
      </article>`).join("")}</div>`, filters("leadership-rows"));
  }

  // ---------- Honours ----------
  if (has(S.honours)) {
    main += section("awards", "Scholarships &amp; awards", `<div class="rows" id="honours-rows">${S.honours.map((h) => `
      <article class="row reveal" data-stage="${esc(h.stage)}">
        <div class="when">${t(h.year)}</div>
        <div><h3>${t(h.title)}</h3><p class="org">${t(h.by)}</p>${h.note ? `<p class="note">${t(h.note)}</p>` : ""}</div>
        <span class="side">${t(h.kind)}</span>
      </article>`).join("")}</div>`, count(S.honours.length, "total") + filters("honours-rows"));
  }

  // ---------- Skills ----------
  if (has(S.skills)) {
    main += section("skills", "Skills", `<div class="skills">${S.skills.map((g) => `
      <div class="skill-group reveal"><h3>${esc(g.group)}</h3><dl>${g.items.map((i) => `<div><dt>${t(i.name)}</dt><dd>${t(i.where)}</dd></div>`).join("")}</dl></div>`).join("")}</div>`,
      '<span class="count">and where I used them</span>' + rule);
  }

  // ---------- Contact ----------
  main += section("contact", "Contact", `<div class="contact-card reveal">
      <h3>Let's talk.</h3>
      <p>${S.contactNote ? t(S.contactNote) : "Email is the quickest way to reach me."}</p>
      <div class="contact-emails">
        <div><span class="lbl">Email</span><a id="email" href="mailto:${esc(S.email)}">${t(S.email)}</a><button class="copy" type="button" data-copy="${esc(S.email)}">Copy</button></div>
        ${S.emailSecondary ? `<div class="small"><span class="lbl">University</span><a href="mailto:${esc(S.emailSecondary)}">${t(S.emailSecondary)}</a><button class="copy" type="button" data-copy="${esc(S.emailSecondary)}">Copy</button></div>` : ""}
      </div>
      <div class="contact-links">${cvBtn("Download CV")}${links.map(ext).join("")}</div>
    </div>`, rule);

  main += `<footer><span>© ${new Date().getFullYear()} ${t(S.name)}${S.location ? ` · ${t(S.location)}` : ""}</span><span>${S.updated ? `Last updated ${t(S.updated)}` : ""}</span></footer>`;

  // ---------- Identity column + mobile bar ----------
  const nav = sections.map((s) => `<a href="#${s.id}" data-id="${s.id}">${s.title}</a>`).join("");
  const identity = `<header class="id" id="top">
      <div class="id-top">
        ${S.photo ? `<img class="portrait" src="${esc(S.photo)}" alt="Portrait of ${esc(S.name)}" width="144" height="144">` : ""}
        ${S.status ? `<p class="avail"><span class="pulse" aria-hidden="true"></span>${t(S.status)}</p>` : ""}
      </div>
      <h1 class="name">${t(S.name)}</h1>
      <p class="role">${t(S.role)}</p>
      <p class="headline">${t(S.headline)}</p>
      <div class="id-actions">${cvBtn("View CV")}${links.map(ext).join("")}</div>
      <nav class="side-nav" aria-label="Sections">${nav}</nav>
      <div class="id-foot">${themeBtn}<span class="id-email"><a href="mailto:${esc(S.email)}">${t(S.email)}</a></span></div>
    </header>`;

  document.getElementById("app").innerHTML = `
    <div class="mbar" id="mbar">
      <div class="mbar-in"><a class="mbar-name" href="#top">${t(S.name)}</a>${themeBtn}${cvBtn("CV")}</div>
      <nav class="mnav" aria-label="Sections">${nav}</nav>
    </div>
    <div class="shell">${identity}<main id="main">${main}</main></div>`;

  // ---------- Theme toggle ----------
  const store = { get() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }, set(v) { try { localStorage.setItem("theme", v); } catch (e) {} } };
  const dark = window.matchMedia("(prefers-color-scheme: dark)");
  const effective = () => root.dataset.theme || (dark.matches ? "dark" : "light");
  const paintThemeBtns = () => {
    const isDark = effective() === "dark";
    document.querySelectorAll(".theme-btn").forEach((b) => { b.innerHTML = isDark ? ICON.sun : ICON.moon; b.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme"); });
  };
  const saved = store.get();
  if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  paintThemeBtns();
  document.querySelectorAll(".theme-btn").forEach((b) => b.addEventListener("click", () => {
    const next = effective() === "dark" ? "light" : "dark";
    root.dataset.theme = next; store.set(next); paintThemeBtns();
  }));
  dark.addEventListener("change", paintThemeBtns);

  // ---------- Active section + mobile bar border ----------
  const navLinks = [...document.querySelectorAll(".side-nav a, .mnav a")];
  const mbar = document.getElementById("mbar");
  const mnav = mbar.querySelector(".mnav");
  let last = "";
  const onScroll = () => {
    let current = sections[0].id;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) current = s.id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
    if (current !== last) {
      last = current;
      navLinks.forEach((a) => { const on = a.dataset.id === current; a.classList.toggle("active", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
      const chip = mnav.querySelector(`a[data-id="${current}"]`);
      if (chip && mnav.scrollWidth > mnav.clientWidth) mnav.scrollTo({ left: chip.offsetLeft - 16, behavior: "smooth" });
    }
    mbar.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Filters ----------
  document.querySelectorAll(".filters").forEach((group) => {
    const rows = document.getElementById(group.dataset.target);
    group.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      group.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      rows.querySelectorAll(".row").forEach((r) => { r.hidden = b.dataset.stage !== "all" && r.dataset.stage !== b.dataset.stage; });
    });
  });

  // ---------- Copy email ----------
  document.querySelectorAll(".copy").forEach((btn) => btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    const done = (msg) => { btn.textContent = msg; setTimeout(() => (btn.textContent = "Copy"), 1800); };
    const fallback = () => {
      const a = btn.previousElementSibling, r = document.createRange();
      r.selectNodeContents(a); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      done("Selected");
    };
    try { navigator.clipboard.writeText(text).then(() => done("Copied"), fallback); } catch (e) { fallback(); }
  }));

  // ---------- Gentle reveal ----------
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("js");
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  // ---------- Tracker sketch ----------
  // A sketch of Aerotrack's SimpleGimbalTracker. World coordinates run 0..1 and
  // the camera's view is a box centred on `cam`. As in the final code
  // (detect7.2.py): aim at a point 35% down the person's box, align it with an
  // anchor line at 42% of frame height, ignore errors inside a 20 x 10 px
  // deadband, apply gains of 0.04 deg/px (pan) and 0.07 deg/px (tilt), smooth
  // with alpha = 0.30, and only send a command every 0.05 s when the angle
  // change is at least 0.3 degrees.
  const canvas = document.getElementById("tracker");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FOV = 0.42, FW = 640, FH = 480;
  const KP_X = 0.04, KP_Y = 0.07, ALPHA = 0.3, DEAD_X = 20, DEAD_Y = 10;
  const DEG_PER_UNIT = 120, MIN_STEP = 0.3, MIN_DT = 50;
  const cam = { x: 0.5, y: 0.5 }, target = { x: 0.68, y: 0.5 };
  let pointerAt = -1e9, lastCmd = 0, moving = false, visible = true;
  const colors = {};
  const readColors = () => {
    const cs = getComputedStyle(root);
    ["--ink", "--muted", "--line", "--grid", "--signal", "--signal-soft", "--surface", "--bg"].forEach((k) => (colors[k] = cs.getPropertyValue(k).trim()));
  };
  readColors();
  dark.addEventListener("change", () => { readColors(); draw(); });
  new MutationObserver(() => { readColors(); draw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  const monoFont = getComputedStyle(root).getPropertyValue("--font-mono").trim() || "monospace";
  let W = 0, H = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", () => { resize(); draw(); });

  const modeEl = document.getElementById("demo-mode");
  const move = (e) => {
    const r = canvas.getBoundingClientRect();
    target.x = Math.min(0.92, Math.max(0.08, (e.clientX - r.left) / r.width));
    target.y = Math.min(0.85, Math.max(0.2, (e.clientY - r.top) / r.height));
    pointerAt = performance.now();
    if (reduce) { settle(); draw(); }
  };
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerdown", move);

  const rEx = document.getElementById("r-ex"), rEy = document.getElementById("r-ey");
  const rPt = document.getElementById("r-pt"), rServo = document.getElementById("r-servo");
  const sign = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);

  const size = () => Math.min(W, H) * 0.085;
  const box = () => { const s = size(); return { w: (s * 2) / W, h: (s * 2.85) / H }; };
  const aim = () => { const b = box(); return { x: target.x, y: target.y - b.h / 2 + 0.35 * b.h }; };
  const anchorY = () => cam.y - FOV / 2 + 0.42 * FOV;
  const errors = () => {
    const a = aim();
    const ex = Math.round(((a.x - cam.x) / FOV) * FW), ey = Math.round(((a.y - anchorY()) / FOV) * FH);
    return { ex, ey, dx: Math.abs(ex) < DEAD_X ? 0 : ex, dy: Math.abs(ey) < DEAD_Y ? 0 : ey };
  };
  function step(now) {
    if (now - lastCmd < MIN_DT) return;
    const e = errors();
    const desX = cam.x + (KP_X * e.dx) / DEG_PER_UNIT, desY = cam.y + (KP_Y * e.dy) / DEG_PER_UNIT;
    const nx = (1 - ALPHA) * cam.x + ALPHA * desX, ny = (1 - ALPHA) * cam.y + ALPHA * desY;
    const stepDeg = Math.max(Math.abs(nx - cam.x), Math.abs(ny - cam.y)) * DEG_PER_UNIT;
    moving = stepDeg >= MIN_STEP;
    if (moving) { cam.x = Math.min(0.8, Math.max(0.2, nx)); cam.y = Math.min(0.8, Math.max(0.2, ny)); lastCmd = now; }
  }
  // Reduced motion: jump straight to where the loop would settle.
  const settle = () => { for (let i = 0; i < 400; i++) { lastCmd = -Infinity; step(0); } moving = false; };

  function draw() {
    if (!W) return;
    const c = colors;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = c["--grid"]; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 24) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    ctx.font = `11px ${monoFont}`;

    const fw = FOV * W, fh = FOV * H, fx = cam.x * W - fw / 2, fy = cam.y * H - fh / 2;
    ctx.setLineDash([5, 4]); ctx.strokeStyle = c["--muted"]; ctx.strokeRect(fx, fy, fw, fh);
    const ay = anchorY() * H;
    ctx.beginPath(); ctx.moveTo(fx, ay); ctx.lineTo(fx + fw, ay); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = c["--muted"]; ctx.fillText("camera view", fx + 4, fy - 6); ctx.fillText("anchor 42%", fx + 4, ay - 5);
    const dbw = ((DEAD_X * 2) / FW) * fw, dbh = ((DEAD_Y * 2) / FH) * fh;
    ctx.fillStyle = c["--signal-soft"]; ctx.fillRect(cam.x * W - dbw / 2, ay - dbh / 2, dbw, dbh);
    ctx.strokeStyle = c["--signal"]; ctx.strokeRect(cam.x * W - dbw / 2, ay - dbh / 2, dbw, dbh);

    const tx = target.x * W, ty = target.y * H, s = size();
    ctx.fillStyle = c["--ink"];
    ctx.beginPath(); ctx.arc(tx, ty - s * 0.95, s * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tx - s * 0.75, ty + s * 1.15);
    ctx.quadraticCurveTo(tx - s * 0.8, ty - s * 0.35, tx, ty - s * 0.4);
    ctx.quadraticCurveTo(tx + s * 0.8, ty - s * 0.35, tx + s * 0.75, ty + s * 1.15);
    ctx.closePath(); ctx.fill();
    const bw = s * 2, bh = s * 2.85, bx = tx - s, by = ty - bh / 2;
    ctx.strokeStyle = c["--signal"]; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = c["--signal"]; ctx.fillRect(bx - 0.75, by - 16, 70, 16);
    ctx.fillStyle = c["--surface"]; ctx.fillText("person #1", bx + 4, by - 4.5);
    const ax = tx, ayp = by + 0.35 * bh;
    ctx.strokeStyle = c["--signal"]; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax - 6, ayp); ctx.lineTo(ax + 6, ayp); ctx.moveTo(ax, ayp - 6); ctx.lineTo(ax, ayp + 6); ctx.stroke();
    ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cam.x * W, ay); ctx.lineTo(ax, ayp); ctx.stroke(); ctx.setLineDash([]);

    const e = errors();
    const pan = 90 + (cam.x - 0.5) * DEG_PER_UNIT, tilt = 90 - (cam.y - 0.5) * DEG_PER_UNIT * 0.75;
    rEx.textContent = `${sign(e.ex)} px`; rEy.textContent = `${sign(e.ey)} px`;
    rPt.textContent = `${pan.toFixed(1)}° / ${tilt.toFixed(1)}°`;
    rServo.textContent = moving ? "moving" : e.dx === 0 && e.dy === 0 ? "hold · deadband" : "hold · < 0.3°";
  }

  if (reduce) { target.x = 0.62; target.y = 0.5; settle(); draw(); modeEl.textContent = "● still"; return; }

  // Only animate while the figure is on screen.
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(canvas);
  const t0 = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!visible) return;
    const manual = now - pointerAt < 2500;
    if (!manual) {
      // Walk across the room, pause, walk back: shows tracking and the deadband.
      const sec = (now - t0) / 1000, phase = (sec % 12) / 12;
      const walk = phase < 0.4 ? phase / 0.4 : phase < 0.5 ? 1 : phase < 0.9 ? 1 - (phase - 0.5) / 0.4 : 0;
      const ease = walk * walk * (3 - 2 * walk);
      target.x = 0.22 + 0.56 * ease;
      target.y = 0.52 + 0.06 * Math.sin(sec * 1.3);
    }
    modeEl.textContent = manual ? "● you're steering" : "● auto";
    step(now);
    draw();
  })(t0);
})();
