// ===== პარამეტრები =====
const PARTY_DATE = new Date("2026-12-27T17:00:00+04:00"); // თბილისის დრო
const EMAIL_TO = "merseysidel@yahoo.com";
const EMAIL_CC = "gelashvilimarya@gmail.com";

// ===== ფერადი ნათურები =====
(function lights() {
  const ul = document.querySelector(".lights");
  const colors = ["#ff3b3b", "#ffd23f", "#3ddc84", "#4fc3f7", "#ff7ad9"];
  const count = Math.max(10, Math.round(window.innerWidth / 38));
  for (let i = 0; i < count; i++) {
    const li = document.createElement("li");
    li.style.setProperty("--c", colors[i % colors.length]);
    li.style.setProperty("--d", `${(i % 5) * 0.3}s`);
    ul.appendChild(li);
  }
})();

// ===== თოვლი =====
(function snow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.querySelector(".snow");
  const chars = ["❄", "❅", "✦", "•"];
  for (let i = 0; i < 45; i++) {
    const f = document.createElement("span");
    f.className = "flake";
    f.textContent = chars[i % chars.length];
    f.style.left = Math.random() * 100 + "vw";
    f.style.fontSize = 8 + Math.random() * 16 + "px";
    f.style.opacity = 0.4 + Math.random() * 0.6;
    f.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
    f.style.animationDuration = 7 + Math.random() * 10 + "s";
    f.style.animationDelay = -Math.random() * 15 + "s";
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
    if (!res.ok || data.success === "false") throw new Error(data.message || res.status);

    msg.className = "form-msg ok";
    msg.textContent = coming
      ? `მადლობა, ${name}! გელოდებით 🎄🎉`
      : `მადლობა, ${name}, რომ შეგვატყობინე 💛`;
    form.reset();
  } catch (err) {
    console.error(err);
    msg.className = "form-msg err";
    msg.textContent = "ვერ გაიგზავნა 😕 სცადე თავიდან.";
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
function whoosh(force) {
  if (reduceMotion) return;
  const now = Date.now();
  if (!force && now - lastWhoosh < 1500) return;
  lastWhoosh = now;
  const z = document.createElement("div");
  z.className = "zoomer" + (dir++ % 2 ? " rtl" : "");
  z.style.top = 15 + Math.random() * 60 + "vh";
  const colors = [["#c8102e", "#fff"], ["#0f6b3a", "#f5c542"], ["#f5c542", "#c8102e"], ["#1565c0", "#fff"]];
  const [b, a] = colors[Math.floor(Math.random() * colors.length)];
  z.style.setProperty("--body", b);
  z.style.setProperty("--accent", a);
  z.innerHTML = `<div class="inner"><div class="lines"></div>${SVG.f1}</div>`;
  document.body.appendChild(z);
  z.addEventListener("animationend", () => z.remove());
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
