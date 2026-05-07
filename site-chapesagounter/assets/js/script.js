/* ================================================================
   CHAPES AGOUNTER — script.js
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- AOS ---- */
  AOS.init({
    duration: 750,
    once: true,
    easing: 'ease-out-cubic',
    offset: 70
  });

  /* ---- Lucide icons ---- */
  lucide.createIcons();

  /* ---- Navbar scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ---- Active nav link (multi-page) ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ---- Mobile menu ---- */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen   = document.getElementById('icon-open');
  const iconClose  = document.getElementById('icon-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const hidden = mobileMenu.classList.toggle('hidden');
      iconOpen?.classList.toggle('hidden', !hidden);
      iconClose?.classList.toggle('hidden', hidden);
    });
  }

  window.closeMobileMenu = () => {
    mobileMenu?.classList.add('hidden');
    iconOpen?.classList.remove('hidden');
    iconClose?.classList.add('hidden');
  };

  /* ---- Scroll-to-top ---- */
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('hidden-btn', window.scrollY < 400);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Animated counters ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.floor(current).toLocaleString('fr-FR') + suffix;
    }, 16);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => obs.observe(el));
  }

  /* ---- Contact form ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nom    = form.querySelector('[name="nom"]')?.value.trim();
      const tel    = form.querySelector('[name="tel"]')?.value.trim();
      const projet = form.querySelector('[name="projet"]')?.value;
      const rgpd   = form.querySelector('[name="rgpd"]')?.checked;

      if (!nom || !tel || !projet || !rgpd) {
        showFormError('Merci de remplir tous les champs obligatoires et d\'accepter la politique de confidentialité.');
        return;
      }

      /* Disable inputs */
      form.querySelectorAll('input, select, textarea, button[type="submit"]')
          .forEach(el => el.disabled = true);

      /* Show success */
      const success = document.getElementById('form-success');
      if (success) {
        success.classList.remove('hidden');
        success.classList.add('flex');
        lucide.createIcons();
      }
    });
  }

  function showFormError(msg) {
    let errEl = document.getElementById('form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = 'form-error';
      errEl.style.cssText = 'color:#f87171;font-size:.85rem;margin-top:.5rem;';
      document.getElementById('contact-form')?.appendChild(errEl);
    }
    errEl.textContent = msg;
    setTimeout(() => { errEl.textContent = ''; }, 5000);
  }

});
