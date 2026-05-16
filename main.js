/* ═══════════════════════════════════════════════
   DON FRAN RESTAURANTE — main.js
   Skills: emil-design-eng · cult-ui · claude-webkit
═══════════════════════════════════════════════ */

/* ── 1. NAV SCROLL
   Emil: solo background/border — sin hide/show agresivo ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('up', window.scrollY > 55);
}, { passive: true });

/* ── 2. HAMBURGER MENU
   Emil: spring feel — toggle classes, CSS hace el trabajo ── */
const ham    = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');
let menuOpen = false;

ham.addEventListener('click', () => {
  menuOpen = !menuOpen;
  ham.classList.toggle('on', menuOpen);
  mobNav.classList.toggle('on', menuOpen);
  ham.setAttribute('aria-expanded', menuOpen);
});

// Cerrar al tocar un enlace interno
document.querySelectorAll('.ml').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    ham.classList.remove('on');
    mobNav.classList.remove('on');
    ham.setAttribute('aria-expanded', 'false');
  });
});

/* ── 3. HERO ENTRANCE
   Emil: requestAnimationFrame para el primer frame — evita flash ── */
requestAnimationFrame(() => {
  document.body.classList.add('ready');
});

/* ── 4. SCROLL REVEAL
   Emil: start from translateY(22px) + opacity 0
   NUNCA scale(0) — nada en el mundo real aparece de la nada ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.rv').forEach(el => revealObs.observe(el));

/* ── 5. MENÚ TABS — Direction-Aware (cult-ui inspirado)
   Emil: stagger 55ms entre cards, ease-out cubic ── */
const tabBtns  = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('on')) return;

    // Desactivar todos
    tabBtns.forEach(b => {
      b.classList.remove('on');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => {
      p.classList.remove('on');
      p.setAttribute('hidden', '');
    });

    // Activar el seleccionado
    btn.classList.add('on');
    btn.setAttribute('aria-selected', 'true');
    const target = document.getElementById('p-' + btn.dataset.t);
    target.classList.add('on');
    target.removeAttribute('hidden');

    // Emil: stagger de entrada — no desde scale(0), desde Y(14px)+opacity 0
    target.querySelectorAll('.mc').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(14px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition =
            'opacity 380ms cubic-bezier(0.22,1,0.36,1), transform 380ms cubic-bezier(0.22,1,0.36,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 55 + 20);
      });
    });
  });
});

/* ── 6. FORMULARIO DE RESERVA → WhatsApp
   Redirige con mensaje pre-armado ── */
const resForm = document.getElementById('res-form');
const resBtn  = document.getElementById('res-btn');

resForm.addEventListener('submit', e => {
  e.preventDefault();

  const nombre   = document.getElementById('r-nombre').value.trim();
  const fecha    = document.getElementById('r-fecha').value;
  const hora     = document.getElementById('r-hora').value;
  const personas = document.getElementById('r-personas').value;
  const tel      = document.getElementById('r-tel').value.trim();
  const nota     = document.getElementById('r-nota').value.trim();

  // Validación mínima
  if (!nombre || !fecha || !tel) {
    showToast('Por favor completá los campos requeridos');
    return;
  }

  // Armar mensaje para WhatsApp
  const msg = encodeURIComponent(
    `Hola Don Fran! Quiero hacer una reserva 🙌\n\n` +
    `👤 Nombre: ${nombre}\n` +
    `📅 Fecha: ${fecha}\n` +
    `🕐 Hora: ${hora}\n` +
    `👥 Personas: ${personas}\n` +
    `📞 Teléfono: ${tel}` +
    (nota ? `\n📝 Nota: ${nota}` : '')
  );

  window.open(`https://wa.me/50671082151?text=${msg}`, '_blank');
  showToast('✅ Abriendo WhatsApp…');

  // Feedback visual en el botón
  const originalHTML = resBtn.innerHTML;
  resBtn.textContent = '¡Listo! ✓';
  resBtn.style.background = '#16a34a';

  setTimeout(() => {
    resBtn.innerHTML = originalHTML;
    resBtn.style.background = '';
    resForm.reset();
  }, 3200);
});

/* ── 7. TOAST
   Emil: CSS transition — interruptible, no keyframes ── */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── 8. PREFERS-REDUCED-MOTION
   Si el usuario prefiere menos movimiento, mostramos todo visible ── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.rv').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.classList.add('in');
  });
}
