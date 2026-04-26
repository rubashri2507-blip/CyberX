'use strict';

/* ═══════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════ */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorDot.style.left  = e.clientX + 'px';
    cursorDot.style.top   = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ═══════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor(W / 14);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 204, ${p.a})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 204, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* ═══════════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
═══════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Progress bar
  const scroll  = document.documentElement.scrollTop;
  const height  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('progressBar').style.width = (scroll / height * 100) + '%';
});

/* ═══════════════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ═══════════════════════════════════════════════════
   COUNTER ANIMATION (hero stats)
═══════════════════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();
  const update   = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const countersObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      countersObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => countersObserver.observe(el));

/* ═══════════════════════════════════════════════════
   SCROLL FADE-IN
═══════════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.fade-in'));
      const idx = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('visible'), idx * 100);
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ═══════════════════════════════════════════════════
   RIPPLE EFFECT
═══════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const btn = e.target.closest('button, .tool-btn');
  if (!btn || btn.classList.contains('eye-toggle')) return;
  const rect = btn.getBoundingClientRect();
  const span = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 2;
  span.classList.add('ripple');
  span.style.cssText = `
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top:  ${e.clientY - rect.top  - size / 2}px;
  `;
  btn.appendChild(span);
  span.addEventListener('animationend', () => span.remove());
});

/* ═══════════════════════════════════════════════════
   TOGGLE PASSWORD VISIBILITY
═══════════════════════════════════════════════════ */
function togglePwd(id, btn) {
  const inp = document.getElementById(id);
  const show = inp.type === 'password';
  inp.type   = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}

/* ═══════════════════════════════════════════════════
   PASSWORD STRENGTH
═══════════════════════════════════════════════════ */
function checkStrength() {
  const pass  = document.getElementById('password').value;
  const bar   = document.getElementById('strengthBar');
  const text  = document.getElementById('strengthText');
  const hints = document.getElementById('strengthHints');
  hints.innerHTML = '';

  let score = 0;
  const checks = [
    { test: pass.length >= 8,              msg: '8+ characters',          pass: pass.length >= 8 },
    { test: pass.length >= 12,             msg: '12+ characters (better)' },
    { test: /[A-Z]/.test(pass),            msg: 'Uppercase letter'        },
    { test: /[a-z]/.test(pass),            msg: 'Lowercase letter'        },
    { test: /[0-9]/.test(pass),            msg: 'Number'                  },
    { test: /[@$!%*?&^#~_\-+=]/.test(pass),msg: 'Special character'       },
    { test: pass.length >= 16,             msg: '16+ characters (strong)' },
  ];

  checks.forEach(c => { if (c.test) score++; });

  const pct = Math.min(score / 6 * 100, 100);
  bar.style.width = pct + '%';

  let color, label;
  if (score <= 2) { color = '#f87171'; label = '❌ Very Weak'; }
  else if (score <= 3) { color = '#fb923c'; label = '⚠️ Weak'; }
  else if (score <= 4) { color = '#fbbf24'; label = '⚡ Medium'; }
  else if (score <= 5) { color = '#34d399'; label = '✅ Strong'; }
  else { color = '#00ffcc'; label = '🔒 Very Strong'; }

  bar.style.background = color;
  text.innerHTML = label;
  text.style.color = color;

  // Show missing hints
  checks.forEach(c => {
    if (!c.test && c.msg) {
      const li = document.createElement('li');
      li.textContent = '· Add: ' + c.msg;
      hints.appendChild(li);
    }
  });
}

/* ═══════════════════════════════════════════════════
   PASSWORD GENERATOR
═══════════════════════════════════════════════════ */
function generatePassword() {
  const length  = parseInt(document.getElementById('length').value, 10);
  const useUp   = document.getElementById('useUpper').checked;
  const useLo   = document.getElementById('useLower').checked;
  const useNu   = document.getElementById('useNums').checked;
  const useSy   = document.getElementById('useSyms').checked;
  const output  = document.getElementById('passwordOutput');

  let chars = '';
  if (useUp) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLo) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useNu) chars += '0123456789';
  if (useSy) chars += '!@#$%^&*_+-=?';

  if (!chars) { output.textContent = '⚠️ Select at least one character type'; output.style.color = '#f87171'; return; }

  const arr = new Uint32Array(length);
  window.crypto.getRandomValues(arr);
  const password = Array.from(arr).map(n => chars[n % chars.length]).join('');

  output.textContent = password;
  output.style.color = 'var(--accent)';

  // Animate character reveal
  let i = 0;
  const chars2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  const interval = setInterval(() => {
    output.textContent = password.slice(0, i) +
      Array.from({ length: password.length - i }, () => chars2[Math.floor(Math.random() * chars2.length)]).join('');
    i++;
    if (i > password.length) clearInterval(interval);
  }, 30);
}

/* Copy to clipboard */
async function copyText(id) {
  const txt = document.getElementById(id).textContent;
  if (!txt || txt.includes('⚠️') || txt.includes('generate')) return;
  try {
    await navigator.clipboard.writeText(txt);
    const hint = document.getElementById('copyHint');
    hint.textContent = '✓ Copied to clipboard!';
    setTimeout(() => hint.textContent = '', 2000);
  } catch {}
}

/* ═══════════════════════════════════════════════════
   PHISHING URL CHECK
═══════════════════════════════════════════════════ */
function checkURL() {
  const url    = document.getElementById('url').value.trim();
  const result = document.getElementById('urlResult');
  if (!url) { result.innerHTML = '⚠️ Enter a URL first.'; result.style.color = '#fbbf24'; return; }

  const suspicious = url.includes('@') || url.includes('-secure') ||
    url.match(/\.(xyz|tk|ml|ga|cf|gq)$/) || url.includes('bit.ly') ||
    url.startsWith('http://') || url.includes('//') && url.split('//').length > 2;

  if (suspicious) {
    result.innerHTML = '❌ Suspicious URL! Possible phishing.';
    result.style.color = '#f87171';
  } else {
    result.innerHTML = '✅ Looks safe (always verify manually!)';
    result.style.color = '#34d399';
  }
}

/* ═══════════════════════════════════════════════════
   FAKE LOGIN DEMO
═══════════════════════════════════════════════════ */
function fakeLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const msg      = document.getElementById('loginMsg');

  if (!username || !password) {
    msg.innerHTML = '⚠️ Please fill all fields!';
    msg.style.color = '#fbbf24'; return;
  }
  if (username === 'admin' && password === '1234') {
    msg.innerHTML = '✅ Login successful! (Demo — never use weak credentials)';
    msg.style.color = '#34d399';
  } else {
    msg.innerHTML = '❌ Wrong credentials. (In real phishing, your input would be stolen.)';
    msg.style.color = '#f87171';
  }
}

/* ═══════════════════════════════════════════════════
   EMAIL SCAM ANALYZER
═══════════════════════════════════════════════════ */
function analyzeEmail() {
  const text     = document.getElementById('emailText').value.toLowerCase();
  const result   = document.getElementById('emailResult');
  const warnings = document.getElementById('warningList');
  warnings.innerHTML = '';
  let issues = 0;

  const rules = [
    { match: /urgent|immediately|act now|limited time/,          msg: 'Uses urgent language (pressure tactic)' },
    { match: /win|prize|free money|you.ve been selected/,         msg: 'Too-good-to-be-true offer' },
    { match: /http:\/\/|bit\.ly|tinyurl|goo\.gl/,                msg: 'Contains suspicious or shortened links' },
    { match: /password|otp|one.time|verify your account/,         msg: 'Requests sensitive credentials' },
    { match: /bank|account.*suspend|update.*billing/,             msg: 'Financial threat/account suspension scare' },
    { match: /dear (user|customer|valued member)/,                msg: 'Generic salutation (not personalized)' },
    { match: /click here|download attachment|open the file/,      msg: 'Suspicious call-to-action' },
  ];

  rules.forEach(r => {
    if (r.match.test(text)) { addWarning(warnings, r.msg); issues++; }
  });

  if (issues === 0) { result.innerHTML = '✅ No obvious scam signals found'; result.style.color = '#34d399'; }
  else if (issues <= 2) { result.innerHTML = `⚠️ Possibly suspicious (${issues} signals)`; result.style.color = '#fbbf24'; }
  else { result.innerHTML = `❌ High-risk scam email! (${issues} signals)`; result.style.color = '#f87171'; }
}

/* ═══════════════════════════════════════════════════
   FAKE WEBSITE DETECTOR
═══════════════════════════════════════════════════ */
function detectWebsite() {
  const url      = document.getElementById('siteInput').value.toLowerCase().trim();
  const result   = document.getElementById('siteResult');
  const warnings = document.getElementById('siteWarnings');
  warnings.innerHTML = '';
  let issues = 0;

  if (!url) { result.innerHTML = '⚠️ Enter a URL first.'; result.style.color = '#fbbf24'; return; }

  const rules = [
    { test: url.startsWith('http://'),                             msg: 'Uses HTTP — not encrypted (no padlock)' },
    { test: url.includes('@'),                                     msg: 'Contains @ symbol — likely deceptive' },
    { test: /[0-9]{4,}/.test(url),                                msg: 'Contains many numbers — suspicious domain' },
    { test: url.includes('bit.ly') || url.includes('tinyurl'),    msg: 'Shortened/redirect link detected' },
    { test: /-secure|-login|-verify|-account/.test(url),          msg: 'Keyword stuffing in URL (common phishing)' },
    { test: /\.(xyz|tk|ml|ga|cf|gq|top|icu)/.test(url),          msg: 'High-risk TLD (commonly used in scams)' },
  ];

  rules.forEach(r => { if (r.test) { addWarning(warnings, r.msg); issues++; } });

  if (issues === 0) { result.innerHTML = '✅ Looks legitimate (verify further)'; result.style.color = '#34d399'; }
  else if (issues <= 2) { result.innerHTML = `⚠️ Possibly fake — ${issues} warning(s)`; result.style.color = '#fbbf24'; }
  else { result.innerHTML = `❌ High risk! Likely fake website (${issues} flags)`; result.style.color = '#f87171'; }
}

/* ═══════════════════════════════════════════════════
   SCREEN TIME TRACKER
═══════════════════════════════════════════════════ */
let seconds = 0;
let timerInterval = null;
const MAX_SECONDS = 3600;

function updateTimerDisplay() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById('timeDisplay').textContent =
    String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');

  // SVG arc
  const circumference = 326.7;
  const pct = Math.min(seconds / MAX_SECONDS, 1);
  const offset = circumference * (1 - pct);
  const arc = document.getElementById('timerArc');
  if (arc) arc.style.strokeDashoffset = offset;

  // Color change
  if (pct > 0.8) arc.style.stroke = '#f87171';
  else if (pct > 0.5) arc.style.stroke = '#fbbf24';
  else arc.style.stroke = '#00ffcc';

  const warning = document.getElementById('warningMsg');
  if (seconds >= MAX_SECONDS) {
    warning.innerHTML = '❌ Screen time exceeded 1 hour! Take a break.';
    warning.style.color = '#f87171';
  } else if (seconds >= MAX_SECONDS * 0.75) {
    warning.innerHTML = '⚠️ 45+ minutes — consider a short break.';
    warning.style.color = '#fbbf24';
  } else {
    warning.innerHTML = seconds > 0 ? '✅ Healthy usage' : '';
    warning.style.color = '#34d399';
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
}
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}
function resetTimer() {
  stopTimer();
  seconds = 0;
  updateTimerDisplay();
  document.getElementById('warningMsg').innerHTML = '';
}

function showCurrentTime() {
  const el = document.getElementById('currentTime');
  if (el) el.textContent = 'Local time: ' + new Date().toLocaleTimeString();
}
setInterval(showCurrentTime, 1000);
showCurrentTime();

/* ═══════════════════════════════════════════════════
   WIFI RISK CHECKER
═══════════════════════════════════════════════════ */
function checkWifi() {
  const name   = document.getElementById('wifiName').value.toLowerCase();
  const type   = document.getElementById('securityType').value;
  const result = document.getElementById('wifiResult');
  const tips   = document.getElementById('wifiTips');
  tips.innerHTML = '';

  const configs = {
    open:  { label: '❌ Very High Risk',  color: '#f87171', tips: ['No encryption — your data is visible to anyone nearby', 'Avoid banking, shopping, or login on this network'] },
    wep:   { label: '❌ High Risk',        color: '#f87171', tips: ['WEP is obsolete and crackable in minutes', 'Switch to WPA3 if possible'] },
    wpa2:  { label: '⚠️ Medium Risk',      color: '#fbbf24', tips: ['WPA2 is acceptable but can be brute-forced', 'Use a strong WiFi password (12+ chars)'] },
    wpa3:  { label: '✅ Low Risk',          color: '#34d399', tips: ['WPA3 is the current best standard', 'Still use a VPN for extra privacy'] },
    vpn:   { label: '🔒 Very Safe',         color: '#00ffcc', tips: ['VPN encrypts all your traffic end-to-end', 'Make sure your VPN provider is reputable'] },
  };

  const cfg = configs[type];
  if (!cfg) { result.innerHTML = '⚠️ Please select a security type.'; result.style.color = '#fbbf24'; return; }

  result.innerHTML   = cfg.label;
  result.style.color = cfg.color;
  cfg.tips.forEach(t => addWarning(tips, t));

  if (name.includes('free') || name.includes('public') || name.includes('airport') || name.includes('cafe')) {
    addWarning(tips, 'Public/free WiFi names are commonly spoofed by attackers (Evil Twin attack)');
  }
}

/* ═══════════════════════════════════════════════════
   HELPER
═══════════════════════════════════════════════════ */
function addWarning(container, msg) {
  const li = document.createElement('li');
  li.textContent = '⚠ ' + msg;
  container.appendChild(li);
}

/* ═══════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (keyboard accessible)
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ═══════════════════════════════════════════════════
   TERMINAL TYPING ANIMATION (hero)
═══════════════════════════════════════════════════ */
(function terminalAnim() {
  const lines = document.querySelectorAll('.t-line');
  lines.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 1200 + i * 350);
  });
})();