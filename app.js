import { STORY } from "./story.js";

const $ = (q) => document.querySelector(q);

const state = {
  node: "intro",
  vars: {
    name: "İpek",
    align: "ashen",
    trait: null,
    end: 1,
    will: 1,
    aura: 1,
  },
  muted: false,
  allowAutoAdvance: true,
  typing: false,
  typingSkip: false,
};

const el = {
  screen: $("#screen"),
  choices: $("#choices"),
  mute: $("#btnMute"),
  restart: $("#btnRestart"),
  ambience: $("#ambience"),
  uiClick: $("#uiClick"),
  whoosh: $("#whoosh"),
  unlock: $("#unlock"),
  stars: $("#stars"),
};

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function setVars(obj = {}) { Object.assign(state.vars, obj); }
function addStats(add = {}) {
  if (add.end) state.vars.end += add.end;
  if (add.will) state.vars.will += add.will;
  if (add.aura) state.vars.aura += add.aura;
  state.vars.end = clamp(state.vars.end, 1, 10);
  state.vars.will = clamp(state.vars.will, 1, 10);
  state.vars.aura = clamp(state.vars.aura, 1, 10);
}

function fmt(text = "") {
  const name = state.vars.name || "İpek";
  return text
    .replaceAll("{NAME}", name)
    .replaceAll("\n", "<br/>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function play(audioEl, vol = 0.6) {
  if (!audioEl) return;
  if (state.muted) return;
  if (!audioEl.src) return;
  audioEl.volume = vol;
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {});
}
function playClick() { play(el.uiClick, 0.55); }
function playWhoosh() { play(el.whoosh, 0.55); }
function playUnlock() { play(el.unlock, 0.65); }

function initAudio() {
  el.ambience.src = "assets/sfx/ambience.mp3";
  el.uiClick.src = "assets/sfx/ui_click.mp3";
  el.whoosh.src = "assets/sfx/whoosh.mp3";
  el.unlock.src = "assets/sfx/unlock.mp3";

  el.ambience.volume = 0.28;
  el.uiClick.volume = 0.55;
  el.whoosh.volume = 0.55;
  el.unlock.volume = 0.65;

  function tryPlayAmbience() {
    if (state.muted) return;
    el.ambience.play().catch(() => {});
  }

  el.mute.addEventListener("click", () => {
    state.muted = !state.muted;
    el.mute.textContent = state.muted ? "🔇" : "🔊";
    el.ambience.muted = state.muted;
    el.uiClick.muted = state.muted;
    el.whoosh.muted = state.muted;
    el.unlock.muted = state.muted;
    if (!state.muted) tryPlayAmbience();
  });

  window.addEventListener("pointerdown", () => tryPlayAmbience(), { once: true });
}

/* overlays */
function ensureGlitchOverlay() {
  if (el.screen.querySelector(".glitch-overlay")) return;
  const ov = document.createElement("div");
  ov.className = "glitch-overlay";
  el.screen.appendChild(ov);
}
function triggerGlitch() {
  el.screen.classList.add("glitch-on");
  setTimeout(() => el.screen.classList.remove("glitch-on"), 650);
}
function transitionFX() {
  triggerGlitch();
  playWhoosh();
}

/* UI button */
function button(label, onClick) {
  const b = document.createElement("button");
  b.className = "choice";
  b.type = "button";
  b.textContent = label;
  b.addEventListener("click", () => {
    if (!state.muted) {
      el.uiClick.currentTime = 0;
      el.uiClick.play().catch(()=>{});
    }
    onClick();
  });
  return b;
}


/* Typewriter */
async function typewriteHTML(targetEl, html, speedMs = 12) {
  state.typing = true;
  state.typingSkip = false;

  const skipHandler = () => { state.typingSkip = true; };
  targetEl.addEventListener("pointerdown", skipHandler);

  const parts = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === "<") {
      const j = html.indexOf(">", i);
      if (j === -1) break;
      parts.push({ t: "tag", v: html.slice(i, j + 1) });
      i = j + 1;
    } else {
      parts.push({ t: "ch", v: html[i] });
      i++;
    }
  }

  let out = "";
  for (const p of parts) {
    if (state.typingSkip) { out = html; break; }
    out += p.v;
    targetEl.innerHTML = out + `<span class="cursor">▌</span>`;
    if (p.t === "ch" && p.v.trim().length) {
      await new Promise(r => setTimeout(r, speedMs));
    } else if (p.t === "ch") {
      await new Promise(r => setTimeout(r, Math.max(2, speedMs / 2)));
    }
  }

  targetEl.innerHTML = out;
  targetEl.removeEventListener("pointerdown", skipHandler);
  state.typing = false;
}

/* Final text */
function getFinalText(vars) {
  const name = vars.name || "İpek";
  const t = vars.trait;
  const a = vars.align;

  const pick = (s) => s.replaceAll("{NAME}", name).replaceAll("\n", "<br/>");

  if (a === "ashen") {
    if (t === "koruyucu") return pick(
`İyi ki doğdun, {NAME}.
Bugün birini korumayı seçtin. Bu “yumuşaklık” değil… omurgadır.
Kalabalıkta bile yalnız kalabilen biri varsa, o sensin.
Ve itiraf edeyim: böyle bir gücü yanında istemek… insanı rahatlatıyor.`
    );
    return pick(
`İyi ki doğdun, {NAME}.
Senin en tehlikeli tarafın öfken değil… kararın.
Bir şey bitti mi, biter. İnsanlar bunu yapamaz.
Ben yapabilenleri severim. (Evet, bu da bir iltifat.)`
    );
  }

  if (a === "crimson") {
    if (t === "kararlı") return pick(
`İyi ki doğdun, {NAME}.
Yönetmeyi seçtin. Bu kibir değil; netlik.
İnsanlar gürültü yapar, sen sonuç çıkarırsın.
Yanında duran biri kendini “güvende” hisseder… ama biraz da çekinir. Güzel denge.`
    );
    return pick(
`İyi ki doğdun, {NAME}.
Kilidi kırmadın… sistemi ikna ettin.
Zekâ, kaba güçten sessizdir ama daha kalıcı iz bırakır.
Ve sen iz bırakıyorsun. İstemeden bile.`
    );
  }

  if (t === "sakin") return pick(
`İyi ki doğdun, {NAME}.
Sükûnetin öyle bir şey ki… ortamı susturuyor.
İnsanlar “ışık” sanır, ama ben biliyorum: bu disiplin.
Yanında konuşmak kolay… çünkü yargılamıyorsun.
Sadece görüyorsun.`
  );

  return pick(
`İyi ki doğdun, {NAME}.
Korkmadığın için değil… korkuya rağmen durduğun için cesursun.
O yüzden sana “iyi biri” demeyeceğim.
Sen daha zor bir şeysin: güvenilir.
Bu galakside az bulunur.`
  );
}

/* render engine */
async function render(nodeId) {
  state.node = nodeId;
  const node = STORY[nodeId];

  el.screen.classList.remove("fade-in");
  void el.screen.offsetWidth;
  el.screen.classList.add("fade-in");

  el.choices.innerHTML = "";

  if (!node) {
    el.screen.innerHTML = `<div class="card"><p>Hata: Sahne bulunamadı (${nodeId})</p></div>`;
    ensureGlitchOverlay();
    return;
  }

  if (node.type === "intro") { renderIntro(node.next); ensureGlitchOverlay(); return; }
  if (node.type === "crawl") { renderCrawl(node.next); ensureGlitchOverlay(); return; }
  if (node.type === "final") { renderFinal(); ensureGlitchOverlay(); return; }
  if (node.type === "input") { renderInput(node); ensureGlitchOverlay(); return; }

  el.screen.innerHTML = `<div class="card typewriter" id="tw"></div>`;
  const tw = $("#tw");
  await typewriteHTML(tw, fmt(node.text), 12);

  (node.choices || []).forEach((c) => {
    el.choices.appendChild(
      button(c.label, () => {
        transitionFX();
        if (c.set) setVars(c.set);
        if (c.add) addStats(c.add);
        render(c.next);
      })
    );
  });

  ensureGlitchOverlay();
}

function renderIntro(nextId) {
  el.screen.innerHTML = `
    <div class="holo">
      <div class="noise"></div>
      <div class="center">
        <div>
          <div class="kicker">INCOMING TRANSMISSION</div>
          <div class="big">Sinyal çözümleniyor…</div>
          <div style="margin-top:10px; color: rgba(232,238,247,.7)">
            Holo-kanal açılıyor.
          </div>
        </div>
      </div>
    </div>
  `;
  ensureGlitchOverlay();

  playWhoosh();

  setTimeout(() => {
    transitionFX();
    render(nextId);
  }, 1500);
}

function renderInput(node) {
  el.screen.innerHTML = `
    <div class="card">
      <div class="badge">KAYIT PROTOKOLÜ</div>
      <div>${fmt(node.text)}</div>

      <div class="input-wrap">
        <input id="nameInput" class="text-input" maxlength="18"
          placeholder="${node.placeholder || ""}" value="${state.vars.name || ""}" />
        <button id="btnContinue" class="choice" type="button">Devam</button>
      </div>
    </div>
  `;

  const input = $("#nameInput");
  const cont = $("#btnContinue");

  function go() {
    transitionFX();
    const v = (input.value || "").trim();
    state.vars.name = v.length ? v : (node.placeholder || "İpek");
    render(node.next);
  }

  cont.addEventListener("click", () => { playClick(); go(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { playClick(); go(); }
  });

  input.focus();
  input.select();
}

function renderCrawl(nextId) {
  const name = state.vars.name || "İpek";

  el.screen.innerHTML = `
    <div class="crawl-wrap">
      <div class="crawl-fade"></div>
      <div class="crawl">
        <div class="title">
          <p>BÖLÜM IV</p>
          <h1>DOĞUM GÜNÜ UYANIŞI</h1>
        </div>
        <p>
          Uzak yıldız kümelerinin ötesinde,<br/>
          savaşların iz bıraktığı bir galakside,<br/>
          sessiz ama güçlü bir varlık yükselmektedir.<br/><br/>

          <strong>${name}</strong>…<br/>
          Ne ışığın şövalyesi,<br/>
          ne de karanlığın hizmetkârı.<br/><br/>

          Kaderin her zaman nazik olmadığı yolların içinden geçerek,<br/>
          gücünü kayıptan, iradesini sessizlikten alan biri olarak yürümektedir.<br/><br/>

          Güç onu boyun eğmesi için değil,<br/>
          ayakta kalması için şekillendirdi.<br/><br/>

          Ve bugün…<br/>
          onu adıyla çağırmaktadır.
        </p>
      </div>
    </div>
  `;

  el.choices.appendChild(button("Geç", () => {
    transitionFX();
    state.allowAutoAdvance = false;
    render(nextId);
  }));

  state.allowAutoAdvance = true;
  setTimeout(() => {
    if (state.allowAutoAdvance) {
      transitionFX();
      render(nextId);
    }
  }, 22000);
}

function barPct(v) { return clamp(v, 1, 10) * 10; }

function renderFinal() {
  const { align, end, will, aura } = state.vars;
  const name = state.vars.name || "İpek";

  const badge =
    align === "ashen" ? "KÜL YOLCUSU" :
    align === "crimson" ? "KIZIL AKOLİT" :
    "KIRIK IŞIK";

  el.screen.innerHTML = `
    <div class="card">
      <div class="badge">${badge}</div>
      <h2>İyi ki doğdun, ${name}.</h2>

      <p style="color:rgba(232,238,247,.78); margin-bottom:14px">
        ${getFinalText(state.vars)}
      </p>

      <div class="stats" aria-label="RP İstatistikleri">
        <div class="stat-row">
          <span>Dayanıklılık</span>
          <div class="bar"><i style="width:${barPct(end)}%"></i></div>
          <strong>${end}</strong>
        </div>
        <div class="stat-row">
          <span>İrade</span>
          <div class="bar"><i style="width:${barPct(will)}%"></i></div>
          <strong>${will}</strong>
        </div>
        <div class="stat-row">
          <span>Aura</span>
          <div class="bar"><i style="width:${barPct(aura)}%"></i></div>
          <strong>${aura}</strong>
        </div>
      </div>
    </div>
  `;

  el.choices.innerHTML = "";
}

/* Stars + Warp */
function initStars() {
  const canvas = el.stars;
  const ctx = canvas.getContext("2d", { alpha: true });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  const stars = [];
  const STAR_COUNT = 260;

  const starFX = { warp: 0, warpTarget: 0, boost: 1 };
  window.__STAR_FX__ = starFX;

  function resize() {
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);

    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      const base = (Math.random() * 0.14 + 0.03) * (Math.random() < 0.5 ? -1 : 1);
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.2,
        a: Math.random() * 0.7 + 0.15,
        tw: Math.random() * 0.02 + 0.005,
        vx: base,
      });
    }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function step() {
    starFX.warp = lerp(starFX.warp, starFX.warpTarget, 0.08);
    ctx.clearRect(0, 0, W, H);

    const g = ctx.createRadialGradient(W * 0.5, H * 0.2, 0, W * 0.5, H * 0.2, Math.max(W, H) * 0.8);
    g.addColorStop(0, `rgba(109,214,255,${0.05 + starFX.warp * 0.06})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const speedMul = 1 + starFX.warp * 14;
    const streak = starFX.warp * 16;

    for (const s of stars) {
      s.a += (Math.random() < 0.5 ? -1 : 1) * s.tw;
      if (s.a < 0.08) s.a = 0.08;
      if (s.a > 0.95) s.a = 0.95;

      const dx = s.vx * speedMul * starFX.boost;
      s.x += dx;

      if (s.x < -40) s.x = W + 40;
      if (s.x > W + 40) s.x = -40;

      if (streak > 0.5) {
        ctx.strokeStyle = `rgba(232,238,247,${s.a})`;
        ctx.lineWidth = Math.max(1, s.r * 0.9);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.sign(dx) * streak, s.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.fillStyle = `rgba(232,238,247,${s.a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  step();
}

/* Nebula Parallax */
function initParallaxNebula() {
  const a = document.querySelector(".nebula-a");
  const b = document.querySelector(".nebula-b");
  if (!a || !b) return;

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  const lerp = (x, y, t) => x + (y - x) * t;

  function onMove(e) {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const x = (e.clientX / w) * 2 - 1;
    const y = (e.clientY / h) * 2 - 1;
    tx = x; ty = y;
  }

  function step() {
    cx = lerp(cx, tx, 0.06);
    cy = lerp(cy, ty, 0.06);

    const ax = cx * 14, ay = cy * 10;
    const bx = cx * 22, by = cy * 16;

    a.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
    b.style.transform = `translate3d(${bx}px, ${by}px, 0)`;

    requestAnimationFrame(step);
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  step();
}

/* Random Ship */
function initRandomShip() {
  const ship = document.getElementById("ship");
  if (!ship) return;

  function launch() {
    const side = Math.random() > 0.5 ? "left" : "right";
    const y = Math.random() * window.innerHeight * 0.6;

    ship.style.top = y + "px";
    ship.style.transition = "none";

    if (side === "left") {
      ship.style.left = "-200px";
      ship.style.transform = "rotate(6deg)";
    } else {
      ship.style.left = window.innerWidth + 200 + "px";
      ship.style.transform = "rotate(-6deg)";
    }

    requestAnimationFrame(() => {
      ship.style.transition = "left 2.8s linear, opacity .8s ease";
      ship.style.opacity = "1";
      ship.style.left = side === "left"
        ? window.innerWidth + 200 + "px"
        : "-200px";
    });

    setTimeout(() => ship.style.opacity = "0", 1400);
  }

  function loop() {
    const delay = 30000 + Math.random() * 60000; // 30–90sn
    setTimeout(() => {
      launch();
      loop();
    }, delay);
  }

  loop();
}

/* Easter egg */
function initEasterEgg() {
  const targets = ["VADER", "MAUL"];
  let buffer = "";

  window.addEventListener("keydown", (e) => {
    const k = (e.key || "").toUpperCase();
    if (k.length !== 1 || k < "A" || k > "Z") return;

    buffer = (buffer + k).slice(-10);

    for (const t of targets) {
      if (buffer.endsWith(t)) {
        transitionFX();
        showSecret(t);
        buffer = "";
        break;
      }
    }
  });
}

function showSecret(code) {
  if (window.__STAR_FX__) {
    window.__STAR_FX__.warpTarget = 1;
    setTimeout(() => { window.__STAR_FX__.warpTarget = 0; }, 1200);
  }

  playUnlock();

  const name = state.vars.name || "İpek";
  const msg =
    code === "VADER"
      ? `Bazı güçler korkutucu görünür, ${name}.\nAma asıl tehlikeli olan… o gücü kontrol edebilmek.\n\nKorkma.\nSen kontrol ediyorsun.`
      : `Öfke bir silah değildir, ${name}.\nÖfke bir motordur.\n\nSadece doğru yöne çevir.\nBen bakıyorum.`;

  el.choices.innerHTML = "";
  el.screen.innerHTML = `
    <div class="card secret">
      <div class="badge">GİZLİ KAYIT // ${code}</div>
      <p>${fmt(msg)}</p>
      <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap">
        <button class="choice" type="button" id="backBtn">Geri Dön</button>
        <button class="choice" type="button" id="finalBtn">Finale Git</button>
      </div>
    </div>
  `;
  ensureGlitchOverlay();

  $("#backBtn").onclick = () => render(state.node);
  $("#finalBtn").onclick = () => render("final");
}

function initRestart() {
  el.restart.addEventListener("click", () => {
    playClick();
    state.vars = { name: "İpek", align: "ashen", trait: null, end: 1, will: 1, aura: 1 };
    state.allowAutoAdvance = false;
    transitionFX();
    render("intro");
  });
}

/* BOOT */
initStars();
initAudio();
initRestart();
initEasterEgg();
initParallaxNebula();
initRandomShip();
render("intro");
