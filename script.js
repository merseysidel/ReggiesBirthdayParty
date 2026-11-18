// ===== პარამეტრები =====
const PARTY_DATE = new Date("2026-12-27T17:00:00+04:00"); // თბილისის დრო
const EMAIL_TO = "merseysidel@yahoo.com";
const EMAIL_CC = "gelashvilimarya@gmail.com";

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
