// ===== პარამეტრები =====
const PARTY_DATE = new Date("2026-12-27T17:00:00+04:00"); // თბილისის დრო
const EMAIL_TO = "m.rukhadze@vr.ge";
const EMAIL_CC = "gelashvilimarya@gmail.com";

// ===== თოვლი =====
(function snow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.querySelector(".snow");
  const chars = ["❄", "❅", "✦", "•"];
  for (let i = 0; i < 140; i++) {
    const f = document.createElement("span");
    f.className = "flake";
    f.textContent = chars[i % chars.length];
    f.style.left = Math.random() * 100 + "vw";
    f.style.fontSize = 7 + Math.random() * 15 + "px";
    f.style.opacity = 0.4 + Math.random() * 0.6;
    f.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
    f.style.animationDuration = 6 + Math.random() * 8 + "s";
    f.style.animationDelay = -Math.random() * 14 + "s";
    box.appendChild(f);
  }
})();

// ===== Countdown =====
const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};
function tick() {
  let diff = Math.max(0, PARTY_DATE - new Date());
  const s = Math.floor(diff / 1000);
  cd.days.textContent = Math.floor(s / 86400);
  cd.hours.textContent = Math.floor((s % 86400) / 3600);
  cd.mins.textContent = Math.floor((s % 3600) / 60);
  cd.secs.textContent = s % 60;
  if (diff === 0) {
    document.querySelector("#countdown-section h2").textContent = "🎉 დღესაა!";
  }
}
tick();
setInterval(tick, 1000);

// ===== RSVP → მეილი (FormSubmit) =====
const form = document.getElementById("rsvp-form");
const msg = document.getElementById("form-msg");
let answer = "yes";

form.querySelectorAll("button[data-answer]").forEach((b) =>
  b.addEventListener("click", () => (answer = b.dataset.answer))
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  if (!name) {
    msg.className = "form-msg err";
    msg.textContent = "გთხოვ, სახელი ჩაწერე 🙂";
    form.name.focus();
    return;
  }
  if (form._honey.value) return; // სპამ-ბოტი

  const coming = answer === "yes";
  const text = coming
    ? `გამარჯობა, მე ვარ ${name} და ვადასტურებ, რომ რეჯის დაბადების დღეზე მოვდივარ.`
    : `გამარჯობა, მე ვარ ${name} და სამწუხაროდ, რეჯის დაბადების დღეზე ვერ მოვდივარ.`;

  const buttons = form.querySelectorAll("button");
  buttons.forEach((b) => (b.disabled = true));
  msg.className = "form-msg";
  msg.textContent = "იგზავნება...";

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL_TO}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: coming ? `✅ ${name} მოდის რეჯის დაბადების დღეზე` : `❌ ${name} ვერ მოდის`,
        _cc: EMAIL_CC,
        _template: "box",
        _captcha: "false",
        "სახელი": name,
        "პასუხი": coming ? "მოვდივარ ✅" : "ვერ მოვდივარ ❌",
        "შეტყობინება": text,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (/activat/i.test(data.message || "")) {
      msg.className = "form-msg err";
      msg.textContent = "ფორმა ჯერ გასააქტიურებელია — გააქტიურების მეილი გაიგზავნა 📩";
      return;
    }
    if (!res.ok || String(data.success) === "false") throw new Error(data.message || res.status);

    msg.className = "form-msg ok";
    msg.textContent = coming
      ? `მადლობა, ${name}! გელოდებით 🎄🎉`
      : `მადლობა, ${name}, რომ შეგვატყობინე 💛`;
    form.reset();
  } catch (err) {
    console.error(err);
    msg.className = "form-msg err";
    msg.textContent = "ვერ გაიგზავნა 😕 სცადე თავიდან.";
    const small = document.createElement("small");
    small.style.cssText = "display:block;font-weight:400;opacity:.7;margin-top:4px";
    small.textContent = String(err.message || err);
    msg.appendChild(small);
  } finally {
    buttons.forEach((b) => (b.disabled = false));
  }
});

// ===== მანქანები (SVG) =====
const WHEEL = (cx, cy, r, rim) => `
  <g class="wheel">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#151515"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.48}" fill="${rim}"/>
    <path d="M${cx} ${cy - r * 0.45}V${cy + r * 0.45}M${cx - r * 0.45} ${cy}H${cx + r * 0.45}" stroke="#333" stroke-width="${r * 0.14}"/>
  </g>`;

const SVG = {
  f1: `<svg viewBox="0 0 220 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="7" height="30" fill="#222"/>
    <rect x="2" y="8" width="32" height="8" rx="2" style="fill:var(--body,#c8102e)"/>
    <path d="M14 42 L40 34 L72 30 L88 20 L106 17 L114 27 L150 31 L196 39 L216 45 L216 49 L14 49 Z" style="fill:var(--body,#c8102e)"/>
    <path d="M44 41 L204 44 L204 47 L44 46 Z" style="fill:var(--accent,#fff)"/>
    <rect x="28" y="48" width="176" height="3" fill="#222"/>
    <rect x="196" y="47" width="22" height="5" rx="1" fill="#222"/>
    <circle cx="101" cy="23" r="7" fill="#f5c542"/>
    <rect x="101" y="20" width="7" height="4" rx="1" fill="#222"/>
    <path d="M88 22 Q108 8 124 28" stroke="#222" stroke-width="3" fill="none"/>
    <text x="58" y="42" font-family="Arial,sans-serif" font-size="12" font-weight="900" style="fill:var(--accent,#fff)">4</text>
    ${WHEEL(48, 47, 14, "#bbb")}
    ${WHEEL(172, 48, 12, "#bbb")}
  </svg>`,

  nascar: `<svg viewBox="0 0 220 84" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="30" width="24" height="5" fill="#0d3c8a"/>
    <path d="M10 64 L10 44 Q12 38 30 37 L62 35 L84 17 Q88 13 96 13 L140 13 Q148 13 154 19 L170 35 L200 39 Q212 41 212 51 L212 64 Z" fill="#1565c0"/>
    <path d="M90 19 L118 19 L118 35 L72 35 Z" fill="#a8d4f5"/>
    <path d="M124 19 L146 19 L162 35 L124 35 Z" fill="#a8d4f5"/>
    <rect x="10" y="44" width="202" height="5" fill="#f5c542"/>
    <rect x="10" y="52" width="202" height="3" fill="#c8102e"/>
    <circle cx="112" cy="50" r="11" fill="#fff" stroke="#c8102e" stroke-width="2"/>
    <text x="112" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="900" fill="#1565c0">4</text>
    <path d="M100 13 L112 1 L124 13 Z" fill="#c8102e"/><circle cx="112" cy="2" r="3" fill="#fff"/><rect x="98" y="11" width="28" height="4" rx="2" fill="#fff"/>
    ${WHEEL(52, 64, 15, "#ddd")}
    ${WHEEL(176, 64, 15, "#ddd")}
  </svg>`,

  digger: `<svg viewBox="0 0 230 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="128" width="136" height="38" rx="19" fill="#3a3a3a"/>
    <rect class="tread" x="18" y="128" width="136" height="38" rx="19" fill="none" stroke="#1f1f1f" stroke-width="5" stroke-dasharray="7 6"/>
    ${WHEEL(38, 147, 11, "#777")}${WHEEL(68, 149, 9, "#777")}${WHEEL(102, 149, 9, "#777")}${WHEEL(134, 147, 11, "#777")}
    <rect x="22" y="104" width="128" height="28" rx="6" fill="#f2c230"/>
    <rect x="16" y="82" width="54" height="28" rx="6" fill="#f2c230"/>
    <path d="M24 92 H52 M24 98 H52 M24 104 H52" stroke="#c99a12" stroke-width="2.5"/>
    <rect x="36" y="64" width="9" height="20" rx="3" fill="#444"/>
    <circle class="puff" cx="40" cy="60" r="5" fill="#eee"/><circle class="puff p2" cx="40" cy="60" r="5" fill="#eee"/>
    <rect x="64" y="52" width="60" height="58" rx="9" fill="#f5cc35"/>
    <rect x="72" y="60" width="44" height="40" rx="7" fill="#a8d4f5"/>
    <circle cx="87" cy="76" r="6" fill="#fff"/><circle cx="103" cy="76" r="6" fill="#fff"/>
    <circle cx="88" cy="77" r="3.4" fill="#222"/><circle cx="104" cy="77" r="3.4" fill="#222"/>
    <circle cx="89" cy="75.5" r="1.1" fill="#fff"/><circle cx="105" cy="75.5" r="1.1" fill="#fff"/>
    <path d="M85 87 Q95 98 107 87 Z" fill="#c0392b"/>
    <path d="M80 54 L95 14 L110 54 Z" fill="#fff4c2"/>
    <circle cx="91" cy="44" r="3" fill="#e8574b"/><circle cx="101" cy="40" r="3" fill="#3b6fd8"/>
    <circle cx="95" cy="30" r="2.6" fill="#8fb35a"/><circle cx="88" cy="50" r="2.6" fill="#b28ad6"/>
    <circle cx="104" cy="50" r="2.6" fill="#f39a3d"/>
    <rect x="77" y="51" width="36" height="6" rx="3" fill="#3b6fd8"/>
    <circle cx="95" cy="13" r="5" fill="#3b6fd8"/>
    <g class="arm">
      <path d="M120 98 L166 46 L198 104" stroke="#f2c230" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M128 84 L158 52" stroke="#555" stroke-width="5" stroke-linecap="round"/>
      <path d="M172 58 L192 92" stroke="#555" stroke-width="5" stroke-linecap="round"/>
      <circle cx="166" cy="46" r="5" fill="#555"/><circle cx="198" cy="104" r="4.5" fill="#555"/>
      <path d="M186 104 L216 106 L210 136 L184 128 Z" fill="#f2c230"/>
      <path d="M186 128 l4 7 4 -6 4 7 4 -6 4 7 4 -6" stroke="#c99a12" stroke-width="2.5" fill="none"/>
    </g>
    <circle cx="120" cy="98" r="6" fill="#555"/>
  </svg>`,

  tractor: `<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg">
    <circle class="puff" cx="107" cy="34" r="5" fill="#eee"/>
    <circle class="puff p2" cx="107" cy="34" r="5" fill="#eee"/>
    <path d="M49 0 L57 10 L53 10 L60 18 L38 18 L45 10 L41 10 Z" fill="#0f6b3a"/>
    <circle cx="49" cy="1" r="2.5" fill="#f5c542"/>
    <rect x="16" y="18" width="66" height="7" rx="3" fill="#2e7d32"/>
    <rect x="24" y="24" width="50" height="40" fill="#a8d4f5" opacity=".75"/>
    <path d="M24 24 V66 M74 24 V66" stroke="#2e7d32" stroke-width="6"/>
    <rect x="18" y="60" width="66" height="18" rx="3" fill="#2e7d32"/>
    <rect x="62" y="66" width="80" height="26" rx="6" fill="#2e7d32"/>
    <path d="M132 70 V88 M137 70 V88" stroke="#1b4d1e" stroke-width="2"/>
    <rect x="104" y="38" width="6" height="30" rx="2" fill="#333"/>
    <path d="M10 94 A35 35 0 0 1 80 94" stroke="#2e7d32" stroke-width="7" fill="none"/>
    ${WHEEL(45, 96, 30, "#f5c542")}
    ${WHEEL(128, 110, 17, "#f5c542")}
  </svg>`,
};

document.querySelectorAll(".deco").forEach((el) => {
  el.innerHTML = SVG[el.dataset.v];
  el.addEventListener("click", () => whoosh(true));
});

// ===== F1-ის ჩაშხუილება სქროლზე =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lastWhoosh = 0;
let dir = 0;
let seq = 0;
function whoosh(force, kind) {
  if (reduceMotion) return;
  const now = Date.now();
  if (!force && now - lastWhoosh < 2500) return;
  lastWhoosh = now;
  kind = kind || (seq++ % 2 ? "digger" : "f1");
  const z = document.createElement("div");
  const rtl = dir++ % 2 === 1;
  z.className = (kind === "digger" ? "zoomer crawler" : "zoomer") + (rtl ? " rtl" : "");
  z.style.top = 15 + Math.random() * 60 + "vh";
  if (kind === "f1") {
    const colors = [["#c8102e", "#fff"], ["#0f6b3a", "#f5c542"], ["#f5c542", "#c8102e"], ["#1565c0", "#fff"]];
    const [b, a] = colors[Math.floor(Math.random() * colors.length)];
    z.style.setProperty("--body", b);
    z.style.setProperty("--accent", a);
    z.innerHTML = `<div class="inner"><div class="lines"></div>${SVG.f1}</div>`;
  } else {
    z.innerHTML = `<div class="inner">${SVG.digger}</div>`;
  }
  document.body.appendChild(z);
  z.addEventListener("animationend", (e) => { if (e.target === z) z.remove(); });
}

const seen = new WeakSet();
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !seen.has(e.target)) {
        seen.add(e.target);
        setTimeout(() => whoosh(false), 150);
      }
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll(".card").forEach((c) => io.observe(c));

// ===== ქაღალდის გირლიანდები + წითელი ლენტები =====
const CHAIN_COLORS = ["#e8574b", "#f39a3d", "#f5cf4b", "#8fb35a", "#b28ad6", "#f29bb5"];

function chainLinks(points, k = 1) {
  return points
    .map((p, i) => {
      const c = CHAIN_COLORS[(i + (p.o || 0)) % CHAIN_COLORS.length];
      return i % 2 === 0
        ? `<ellipse cx="${p.x}" cy="${p.y}" rx="${11 * k}" ry="${7.5 * k}" fill="none" stroke="${c}" stroke-width="${5 * k}" transform="rotate(${p.a} ${p.x} ${p.y})" opacity=".93"/>`
        : `<rect x="${p.x - 10 * k}" y="${p.y - 3 * k}" width="${20 * k}" height="${6 * k}" rx="${3 * k}" fill="${c}" transform="rotate(${p.a} ${p.x} ${p.y})" opacity=".93"/>`;
    })
    .join("");
}

function swag(x1, x2, y, sag, step, off = 0) {
  const pts = [];
  const mid = (x1 + x2) / 2, half = (x2 - x1) / 2;
  for (let x = x1; x <= x2; x += step) {
    const t = (x - mid) / half;
    const slope = (-2 * sag * t) / half;
    pts.push({ x, y: y + sag * (1 - t * t), a: (Math.atan(slope) * 180) / Math.PI, o: off });
  }
  return pts;
}

const ribbonPath = (x1, x2, y, sag) => `M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`;

function bow(x, y, k = 1) {
  return `<g transform="translate(${x} ${y}) scale(${k})">
    <path d="M0 0 C-26 -20 -36 8 -4 5 Z" fill="#d93a3a"/>
    <path d="M0 0 C26 -20 36 8 4 5 Z" fill="#d93a3a"/>
    <path d="M-2 4 C-10 24 -16 40 -11 56" stroke="#d93a3a" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M2 4 C10 26 7 40 14 54" stroke="#e85a5a" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="0" cy="3" r="6" fill="#b82828"/>
  </g>`;
}

function hangingChain(x, y0, len, k, off = 0) {
  const pts = [];
  for (let y = y0; y < y0 + len; y += 15 * k) pts.push({ x, y, a: 90, o: off });
  return `<g class="hang" style="transform-origin:${x}px ${y0}px;animation-delay:${-off * 0.7}s">${chainLinks(pts, k)}</g>`;
}

function streamer(x, len, phase) {
  let d = `M${x} 0`;
  for (let y = 0; y < len; y += 40) {
    const dx = (y / 40) % 2 ? -10 : 10;
    d += ` Q${x + dx * phase} ${y + 20} ${x} ${y + 40}`;
  }
  return `<path class="hang" style="transform-origin:${x}px 0px" d="${d}" stroke="#d93a3a" stroke-width="9" fill="none" opacity=".85" stroke-linecap="round"/>`;
}

function buildGarland() {
  const box = document.querySelector(".garland");
  const W = document.documentElement.clientWidth;
  const mobile = W < 700;
  const k = mobile ? 1 : 1.25;
  const n = mobile ? 2 : W < 1200 ? 3 : 4;
  const seg = W / n;
  const photo = document.querySelector(".polaroid");
  const H = photo ? photo.getBoundingClientRect().top + window.scrollY + photo.offsetHeight * 0.75 : 520;
  let out = "";
  // გვერდითი ლენტები და ჯაჭვები — ფოტომდე
  out += streamer(30 * k, H * 0.85, 1) + streamer(W - 30 * k, H * 0.85, -1);
  out += hangingChain(12 * k, 6, H, k, 0) + hangingChain(W - 12 * k, 6, H, k, 3);
  // ზედა თაღები: ორი რიგი ჯაჭვი + ლენტი
  for (let i = 0; i < n; i++) {
    const x1 = i * seg, x2 = (i + 1) * seg;
    out += `<path d="${ribbonPath(x1, x2, 4, 46 * k)}" stroke="#d93a3a" stroke-width="${9 * k}" fill="none" opacity=".85"/>
            <path d="${ribbonPath(x1, x2, 8, 46 * k)}" stroke="#f07a7a" stroke-width="2.5" fill="none" opacity=".7"/>`;
    out += chainLinks(swag(x1 + 8, x2 - 8, 10, 40 * k, 16 * k, i), k);
    out += chainLinks(swag(x1 + 20, x2 - 20, 18, 78 * k, 16 * k, i + 2), k);
    // შუაში ჩამოკიდებული მოკლე ჯაჭვი
    const mid = (x1 + x2) / 2;
    out += hangingChain(mid, 18 + 78 * k, (mobile ? 70 : 110) * k, k, i + 1);
  }
  for (let i = 0; i <= n; i++) out += bow(Math.min(Math.max(i * seg, 26), W - 26), 8, k);
  box.style.height = H + "px";
  box.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}
window.addEventListener("load", buildGarland);
buildGarland();
let gT;
window.addEventListener("resize", () => { clearTimeout(gT); gT = setTimeout(buildGarland, 200); });

// ===== ოქროსფერი ვარსკვლავები =====
(function sparkles() {
  const box = document.querySelector(".sparkles");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    const size = 8 + Math.random() * 12;
    s.style.cssText = `left:${Math.random() * 100}vw;top:${Math.random() * 100}vh;width:${size}px;height:${size}px;animation-delay:${-Math.random() * 3}s;animation-duration:${1.4 + Math.random() * 1.8}s`;
    box.appendChild(s);
  }
})();

// ===== წითელი მანქანა ნაძვის ხით =====
document.querySelector(".tree-car").innerHTML = `<svg viewBox="0 0 170 120" xmlns="http://www.w3.org/2000/svg">
  <!-- ნაძვის ხე -->
  <g transform="rotate(-8 85 40)">
    <rect x="28" y="38" width="12" height="7" rx="2" fill="#8a5a3c"/>
    <path d="M38 41 L140 33 L150 41 L140 49 Z" fill="#2f7d3b"/>
    <path d="M50 41 L132 30 L132 52 Z" fill="#3f9a4a"/>
    <path d="M62 41 L118 26 L118 56 Z" fill="#4fae55"/>
    <path d="M76 41 L104 30 L104 52 Z" fill="#5fbf62"/>
    <circle cx="70" cy="37" r="2.6" fill="#e8574b"/><circle cx="92" cy="46" r="2.6" fill="#f5cf4b"/>
    <circle cx="112" cy="35" r="2.6" fill="#b28ad6"/><circle cx="126" cy="45" r="2.6" fill="#e8574b"/>
    <circle cx="100" cy="38" r="2.2" fill="#f39a3d"/><circle cx="58" cy="44" r="2.2" fill="#f29bb5"/>
    <path d="M151 34 l2.5 5 5.5 .8 -4 3.8 1 5.4 -5 -2.6 -5 2.6 1 -5.4 -4 -3.8 5.5 -.8z" fill="#f5c542"/>
  </g>
  <path d="M60 48 L60 60 M110 46 L110 60" stroke="#c8a676" stroke-width="2"/>
  <!-- ძარა -->
  <path d="M46 62 Q50 46 70 45 L104 45 Q118 45 124 62 Z" fill="#f5d36b"/>
  <path d="M72 50 L100 50 Q110 50 114 61 L72 61 Z" fill="#cfe7f2"/>
  <path d="M20 86 Q18 64 40 62 L136 62 Q156 63 158 84 L158 90 Q158 96 150 96 L26 96 Q20 96 20 90 Z" fill="#d93a3a"/>
  <path d="M26 74 L152 74" stroke="#f07a7a" stroke-width="2" opacity=".7"/>
  <circle cx="154" cy="78" r="4" fill="#f5cf4b"/>
  <rect x="18" y="80" width="6" height="6" rx="2" fill="#f39a3d"/>
  ${WHEEL(52, 96, 15, "#c9a27a")}
  ${WHEEL(126, 96, 15, "#c9a27a")}
</svg>`;

// ===== სათაურის ასოები ცალ-ცალკე ფერებად =====
(function colorTitle() {
  const h = document.querySelector(".kid-title");
  const wrap = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach((ch) => {
          if (ch.trim() === "") { frag.appendChild(document.createTextNode(ch)); return; }
          const s = document.createElement("span");
          s.className = "l";
          s.textContent = ch;
          frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") wrap(n);
    });
  };
  wrap(h);
  h.querySelectorAll(".l").forEach((s) => s.setAttribute("aria-hidden", "true"));
  buildGarland();
})();
