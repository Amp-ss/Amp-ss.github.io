// Renders the page from window.SITE (defined in content.js) and runs the
// tracker demo in the hero.
(function () {
  const S = window.SITE;
  if (!S) return;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Escape, then highlight any [placeholder] text so it is easy to spot.
  const t = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');
  const has = (a) => Array.isArray(a) && a.length > 0;
  const tags = (list) => (has(list) ? `<ul class="tags">${list.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : "");

  const ICON = {
    download: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2.5 13.5h11"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2.5 4.5 8 9l5.5-4.5"/></svg>',
    out: '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 11 11 5m0 0H6m5 0v5"/></svg>',
    arrow: '<svg viewBox="0 0 28 10" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1 5h25m0 0-4-3.5M26 5l-4 3.5"/></svg>'
  };
  const ext = (l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${t(l.label)} ${ICON.out}</a>`;
  const links = (S.links || []).filter((l) => l && l.url);

  const sections = [];
  const section = (id, title, tag, body, extra = "") => {
    sections.push({ id, title });
    return `<section id="${id}" aria-labelledby="${id}-h">
      <div class="sec-head"><h2 id="${id}-h">${title}</h2>${tag ? `<span class="tag">${tag}</span>` : ""}${extra}</div>
      ${body}</section>`;
  };
  const filters = (target) => `<div class="filters" role="group" aria-label="Filter" data-target="${target}">
      <button type="button" data-stage="all" aria-pressed="true">All</button>
      <button type="button" data-stage="hku" aria-pressed="false">HKU</button>
      <button type="button" data-stage="school" aria-pressed="false">High school</button></div>`;

  // ---------- Hero ----------
  const cv = S.cvFile ? `<a class="btn btn-primary" href="${esc(S.cvFile)}" target="_blank" rel="noopener">${ICON.download} Download CV</a>` : "";
  let html = `
  <section class="hero" id="top" aria-label="Introduction">
    <div class="wrap">
      <div class="hero-id">
        <div class="eyebrow"><span><span class="dot"></span>${t(S.role)}</span><span>${t(S.location)}</span></div>
        <div class="id-row">
          ${S.photo ? `<img class="portrait" src="${esc(S.photo)}" alt="Portrait of ${esc(S.name)}" width="640" height="800">` : ""}
          <h1 class="name">${t(S.name)}</h1>
        </div>
        <p class="headline">${t(S.headline)}</p>
        <p class="intro">${t(S.intro)}</p>
        <div class="hero-actions">${cv}<a class="btn" href="#contact">${ICON.mail} Contact</a>${links.map(ext).join("")}</div>
        ${has(S.atAGlance) ? `<dl class="facts">${S.atAGlance.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${t(f.value)}</dd></div>`).join("")}</dl>` : ""}
      </div>
      <figure class="demo" style="margin:0">
        <div class="demo-bar"><span>aerotrack · gimbal control demo</span><span class="live" id="demo-mode">● auto</span></div>
        <canvas id="tracker" aria-label="Animated sketch of a camera re-centring on a moving target"></canvas>
        <div class="readout" aria-live="off">
          <div><span>err x</span><b id="r-ex">+0 px</b></div>
          <div><span>err y</span><b id="r-ey">+0 px</b></div>
          <div><span>pan / tilt</span><b id="r-pt">90° / 90°</b></div>
          <div><span>servo</span><b id="r-pwm">hold</b></div>
        </div>
        <figcaption class="demo-caption">A sketch of Aerotrack's gimbal logic: aim at the upper chest, hold still inside the deadband, otherwise step the servos with separate pan and tilt gains (0.04 and 0.07 °/px) and α = 0.30 smoothing. Move your pointer over the frame to steer the target.</figcaption>
      </figure>
    </div>
  </section>`;

  if (has(S.highlights)) {
    html += `<div class="strip"><ul class="wrap" aria-label="Highlights">${S.highlights.map((h) =>
      `<li><span class="fig">${t(h.figure)}</span><span class="lbl">${t(h.label)}</span></li>`).join("")}</ul></div>`;
  }

  html += `<main id="main" class="wrap">`;

  // ---------- Projects ----------
  if (has(S.caseStudies) || has(S.projects)) {
    const flow = (c) => {
      const nodes = c.diagram.map((n) => `<div class="node">${t(n)}</div>`).join(`<div class="arrow">${ICON.arrow}</div>`);
      return `<div class="flow-wrap"><div style="min-width:min-content">
        <div class="flow" role="img" aria-label="${esc(c.diagram.join(", then "))}">${nodes}</div>
        ${c.loop ? `<div class="loopback"><span>↺ ${t(c.loop)}</span></div><div class="loop-pad"></div>` : ""}
      </div></div>`;
    };
    const cases = (S.caseStudies || []).map((c) => `
      <article class="case">
        <div class="case-head"><h3>${t(c.title)}</h3><span class="meta">${t(c.year)} · ${t(c.context)}</span></div>
        <p class="case-role">My role: <b>${t(c.role)}</b></p>
        ${has(c.diagram) ? flow(c) : ""}
        <div class="case-body">
          <div><h4>Problem</h4><p>${t(c.problem)}</p></div>
          <div><h4>What I did</h4><p>${t(c.approach)}</p></div>
          <div><h4>Result</h4><p>${t(c.result)}</p>
            ${has(c.metrics) ? `<div class="metrics">${c.metrics.map((m) => `<div><b>${t(m.figure)}</b><span>${t(m.label)}</span></div>`).join("")}</div>` : ""}
          </div>
        </div>
        ${has(c.gallery) ? `<div class="gallery-wrap"><h4>Design iterations</h4><ol class="gallery">${c.gallery.map((g, i) => `
          <li><figure><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><figcaption><span>${i + 1}</span>${t(g.caption)}</figcaption></figure></li>`).join("")}</ol></div>` : ""}
        ${has(c.tags) ? `<div class="case-foot">${tags(c.tags)}</div>` : ""}
      </article>`).join("");
    const more = has(S.projects) ? `<div class="more">${S.projects.map((p) => `
      <article class="card">
        <div class="top"><h3>${t(p.title)}</h3><span class="yr">${t(p.year)}</span></div>
        <span class="role">${t(p.role)}</span>
        <p>${t(p.summary)}</p>
        <p class="outcome">${t(p.outcome)}</p>
        ${tags(p.tags)}
      </article>`).join("")}</div>` : "";
    const n = (S.caseStudies || []).length + (S.projects || []).length;
    html += section("projects", "Projects", `${n} selected`, `<div class="cases">${cases}</div>${more}`);
  }

  // ---------- Education ----------
  if (has(S.education)) {
    html += section("education", "Education", "", `<div class="rows">${S.education.map((e) => `
      <article class="row">
        <div class="when">${t(e.start)} – ${t(e.end)}</div>
        <div><h3>${t(e.school)}</h3><p class="org">${t(e.degree)}</p>
          ${has(e.details) ? `<ul>${e.details.map((d) => `<li>${t(d)}</li>`).join("")}</ul>` : ""}</div>
        ${e.result ? `<span class="badge">${t(e.result)}</span>` : "<span></span>"}
      </article>`).join("")}</div>`);
  }

  // ---------- Honours ----------
  if (has(S.honours)) {
    html += section("honours", "Scholarships &amp; awards", `${S.honours.length} total`, `<div class="rows" id="honours-rows">${S.honours.map((h) => `
      <article class="row" data-stage="${esc(h.stage)}">
        <div class="when">${t(h.year)}</div>
        <div><h3>${t(h.title)}</h3><p class="org">${t(h.by)}${h.note ? ` · ${t(h.note)}` : ""}</p></div>
        <span class="kind">${t(h.kind)}</span>
      </article>`).join("")}</div>`, filters("honours-rows"));
  }

  // ---------- Leadership ----------
  if (has(S.leadership)) {
    html += section("leadership", "Leadership", "", `<div class="rows" id="leadership-rows">${S.leadership.map((l) => `
      <article class="row" data-stage="${esc(l.stage)}">
        <div class="when">${t(l.years)}</div>
        <div><h3>${t(l.role)}</h3><p class="org">${t(l.org)}${l.note ? ` · ${t(l.note)}` : ""}</p></div>
        <span></span>
      </article>`).join("")}</div>`, filters("leadership-rows"));
  }

  // ---------- Skills ----------
  if (has(S.skills)) {
    html += section("skills", "Skills", "and where I used them", `<div class="skills">${S.skills.map((g) => `
      <div class="skill-group"><h3>${esc(g.group)}</h3><dl>${g.items.map((i) => `<div><dt>${t(i.name)}</dt><dd>${t(i.where)}</dd></div>`).join("")}</dl></div>`).join("")}</div>`);
  }

  // ---------- Contact ----------
  sections.push({ id: "contact", title: "Contact" });
  html += `<section id="contact" class="contact" aria-labelledby="contact-h">
      <div>
        <h2 id="contact-h">Let's talk</h2>
        <p>${S.contactNote ? t(S.contactNote) : "Email is the quickest way to reach me."}</p>
        <div class="row-links">${links.map(ext).join("")}</div>
      </div>
      <div class="contact-side">
        <a class="email" id="email" href="mailto:${esc(S.email)}">${t(S.email)}</a>
        ${S.emailSecondary ? `<span class="email-2">University: <a href="mailto:${esc(S.emailSecondary)}">${t(S.emailSecondary)}</a></span>` : ""}
        <button class="btn" id="copy-email" type="button">Copy email</button>
      </div>
    </section>`;

  html += `</main><footer><div class="wrap"><span>© ${new Date().getFullYear()} ${t(S.name)}</span><a href="#top">Back to top ↑</a></div></footer>`;
  document.getElementById("app").innerHTML = html;

  // ---------- Top bar ----------
  document.getElementById("topbar").innerHTML = `<div class="wrap">
    <a class="mono-mark" href="#top" aria-label="${esc(S.name)}, back to top">${esc(S.initials)}</a>
    <nav class="nav" aria-label="Sections">${sections.map((s) => `<a href="#${s.id}" data-id="${s.id}">${s.title}</a>`).join("")}</nav>
    ${S.cvFile ? `<a class="btn btn-primary" href="${esc(S.cvFile)}" target="_blank" rel="noopener">${ICON.download}<span class="btn-cv-label">CV</span></a>` : ""}
  </div>`;
  const navLinks = [...document.querySelectorAll(".nav a")];
  const setActive = () => {
    let current = "";
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id;
    }
    navLinks.forEach((a) => a.classList.toggle("active", a.dataset.id === current));
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

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
  const copyBtn = document.getElementById("copy-email");
  copyBtn.addEventListener("click", () => {
    const done = () => { copyBtn.textContent = "Copied"; setTimeout(() => (copyBtn.textContent = "Copy email"), 1600); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(document.getElementById("email"));
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      copyBtn.textContent = "Selected, press Ctrl+C";
    };
    try { navigator.clipboard.writeText(S.email).then(done, fallback); } catch (e) { fallback(); }
  });

  // ---------- Tracker demo ----------
  // A sketch of Aerotrack's SimpleGimbalTracker. World coordinates run 0..1 and
  // the camera's view is a box centred on `cam`. As in the project report:
  // aim at a point 35% down the person's box, align it with an anchor line at
  // 42% of frame height, ignore errors inside a 20 x 10 px deadband, apply
  // proportional gains of 0.04 deg/px (pan) and 0.07 deg/px (tilt), smooth with
  // alpha = 0.30, and only send a command every 0.05 s when the angle change is
  // at least 0.3 degrees. Values from the final code (detect7.2.py).
  const canvas = document.getElementById("tracker");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FOV = 0.42;               // view box size in world units
  const FW = 640, FH = 480;       // camera frame in pixels
  const KP_X = 0.04, KP_Y = 0.07; // proportional gains in degrees per pixel (pan, tilt)
  const ALPHA = 0.3;              // smoothing
  const DEAD_X = 20, DEAD_Y = 10; // deadband in px
  const DEG_PER_UNIT = 120;       // world units to servo degrees
  const MIN_STEP = 0.3, MIN_DT = 50;
  const cam = { x: 0.5, y: 0.5 };
  const target = { x: 0.68, y: 0.5 };
  let pointerAt = -1e9, lastCmd = 0, moving = false;
  const colors = {};
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    ["--ink", "--muted", "--line", "--grid", "--signal", "--signal-soft", "--surface", "--bg"].forEach((k) => (colors[k] = cs.getPropertyValue(k).trim()));
  };
  readColors();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); if (reduce) draw(); });
  new MutationObserver(() => { readColors(); if (reduce) draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const monoFont = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";
  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", () => { resize(); if (reduce) draw(); });

  const modeEl = document.getElementById("demo-mode");
  const move = (e) => {
    const r = canvas.getBoundingClientRect();
    target.x = Math.min(0.92, Math.max(0.08, (e.clientX - r.left) / r.width));
    target.y = Math.min(0.85, Math.max(0.2, (e.clientY - r.top) / r.height));
    pointerAt = performance.now();
    if (reduce) { step(performance.now(), true); draw(); }
  };
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerdown", move);

  const rEx = document.getElementById("r-ex"), rEy = document.getElementById("r-ey");
  const rPt = document.getElementById("r-pt"), rServo = document.getElementById("r-pwm");
  const sign = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);

  // Person box in world units, and the aim point 35% down from its top.
  const box = () => { const s = 0.075 * Math.min(W, H) / W, sh = 0.075 * Math.min(W, H) / H; return { w: s * 2, h: sh * 2.85 }; };
  const aim = () => { const b = box(); return { x: target.x, y: target.y - b.h / 2 + 0.35 * b.h }; };
  const anchorY = () => cam.y - FOV / 2 + 0.42 * FOV;
  const errors = () => {
    const a = aim();
    let ex = Math.round((a.x - cam.x) / FOV * FW), ey = Math.round((a.y - anchorY()) / FOV * FH);
    return { ex, ey, dx: Math.abs(ex) < DEAD_X ? 0 : ex, dy: Math.abs(ey) < DEAD_Y ? 0 : ey };
  };

  function step(now, force) {
    if (!force && now - lastCmd < MIN_DT) return;
    const e = errors();
    const desX = cam.x + KP_X * e.dx / DEG_PER_UNIT, desY = cam.y + KP_Y * e.dy / DEG_PER_UNIT;
    const nx = (1 - ALPHA) * cam.x + ALPHA * desX, ny = (1 - ALPHA) * cam.y + ALPHA * desY;
    const stepDeg = Math.max(Math.abs(nx - cam.x), Math.abs(ny - cam.y)) * DEG_PER_UNIT;
    moving = force ? (e.dx !== 0 || e.dy !== 0) : stepDeg >= MIN_STEP;
    if (force) { // reduced motion: jump straight to the settled position
      for (let i = 0; i < 200; i++) step(Infinity, false), (lastCmd = -Infinity);
      return;
    }
    if (moving) { cam.x = Math.min(0.8, Math.max(0.2, nx)); cam.y = Math.min(0.8, Math.max(0.2, ny)); lastCmd = now; }
  }

  function draw() {
    const c = colors;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = c["--grid"]; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 20) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    ctx.font = `11px ${monoFont}`;

    // Camera view
    const fw = FOV * W, fh = FOV * H, fx = cam.x * W - fw / 2, fy = cam.y * H - fh / 2;
    ctx.setLineDash([5, 4]); ctx.strokeStyle = c["--muted"]; ctx.strokeRect(fx, fy, fw, fh);
    // Anchor line at 42% of frame height
    const ay = anchorY() * H;
    ctx.beginPath(); ctx.moveTo(fx, ay); ctx.lineTo(fx + fw, ay); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = c["--muted"]; ctx.fillText("camera view", fx + 4, fy - 6); ctx.fillText("anchor 42%", fx + 4, ay - 4);
    // Deadband around the anchor point
    const dbw = DEAD_X * 2 / FW * fw, dbh = DEAD_Y * 2 / FH * fh;
    ctx.fillStyle = c["--signal-soft"] || c["--grid"]; ctx.globalAlpha = 0.9;
    ctx.fillRect(cam.x * W - dbw / 2, ay - dbh / 2, dbw, dbh); ctx.globalAlpha = 1;
    ctx.strokeStyle = c["--signal"]; ctx.lineWidth = 1; ctx.strokeRect(cam.x * W - dbw / 2, ay - dbh / 2, dbw, dbh);

    // Person silhouette and detection box
    const tx = target.x * W, ty = target.y * H, s = Math.min(W, H) * 0.075;
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
    // Aim point, 35% down the box
    const ax = tx, ayp = by + 0.35 * bh;
    ctx.strokeStyle = c["--signal"]; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax - 6, ayp); ctx.lineTo(ax + 6, ayp); ctx.moveTo(ax, ayp - 6); ctx.lineTo(ax, ayp + 6); ctx.stroke();
    // Error vector from the anchor point to the aim point
    ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cam.x * W, ay); ctx.lineTo(ax, ayp); ctx.stroke(); ctx.setLineDash([]);

    const e = errors();
    const pan = 90 + (cam.x - 0.5) * DEG_PER_UNIT, tilt = 90 - (cam.y - 0.5) * DEG_PER_UNIT * 0.75;
    rEx.textContent = `${sign(e.ex)} px`; rEy.textContent = `${sign(e.ey)} px`;
    rPt.textContent = `${pan.toFixed(1)}° / ${tilt.toFixed(1)}°`;
    rServo.textContent = moving ? "moving" : (e.dx === 0 && e.dy === 0 ? "hold · deadband" : "hold · < 0.3°");
  }

  if (reduce) { target.x = 0.62; target.y = 0.5; step(0, true); draw(); return; }

  const t0 = performance.now();
  (function loop(now) {
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
    step(now, false);
    draw();
    requestAnimationFrame(loop);
  })(t0);
})();
