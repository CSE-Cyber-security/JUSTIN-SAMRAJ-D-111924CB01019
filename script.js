const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const meter = document.getElementById("meter");
const strengthLabel = document.getElementById("strengthLabel");
const tip = document.getElementById("tip");

const rules = {
  length: value => value.length >= 8,
  lower: value => /[a-z]/.test(value),
  upper: value => /[A-Z]/.test(value),
  number: value => /[0-9]/.test(value),
  symbol: value => /[^A-Za-z0-9]/.test(value)
};

toggleButton.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  toggleButton.textContent = showing ? "Show" : "Hide";
  toggleButton.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  const passed = Object.entries(rules).filter(([, test]) => test(value)).map(([key]) => key);
  Object.entries(rules).forEach(([key]) => {
    const item = document.getElementById(key);
    const ok = testRule(key, value);
    item.classList.toggle("pass", ok);
    item.classList.toggle("pending", !ok);
    item.querySelector(".check").textContent = ok ? "✓" : "○";
  });

  if (!value) {
    meter.style.width = "0";
    strengthLabel.textContent = "Not checked";
    strengthLabel.style.color = "#8791a3";
    tip.textContent = "Start typing to check your password.";
    return;
  }

  // Add a small penalty for very short passwords and common weak patterns.
  let score = passed.length;
  if (value.length >= 12) score += 1;
  if (/^(password|123456|qwerty)/i.test(value)) score = Math.min(score, 1);

  let level, color, width, advice;
  if (score <= 2) {
    level = "Weak"; color = "#df5962"; width = "25%";
    advice = "Try adding more characters, mixed case, numbers and symbols.";
  } else if (score <= 4) {
    level = "Medium"; color = "#e6a23c"; width = "60%";
    advice = "Good start. Add a longer passphrase and meet the remaining checklist items.";
  } else {
    level = "Strong"; color = "#2da879"; width = "100%";
    advice = "Nice! A long, unique password is harder to guess. Avoid reusing it.";
  }
  meter.style.width = width;
  meter.style.background = color;
  strengthLabel.textContent = level;
  strengthLabel.style.color = color;
  tip.textContent = advice;
});

function testRule(key, value) {
  return rules[key](value);
}
