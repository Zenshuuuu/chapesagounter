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

  /* ---- Page transitions (fade-out on internal link click) ---- */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isInternal = !href.startsWith('http') &&
                       !href.startsWith('#') &&
                       !href.startsWith('tel:') &&
                       !href.startsWith('mailto:') &&
                       !href.startsWith('//') &&
                       !href.startsWith('javascript');
    if (isInternal) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-8px)';
        setTimeout(() => { window.location.href = href; }, 290);
      });
    }
  });

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
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

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

  /* ---- Contact form (Netlify Forms via fetch) ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const nom    = form.querySelector('[name="nom"]')?.value.trim();
      const tel    = form.querySelector('[name="tel"]')?.value.trim();
      const projet = form.querySelector('[name="projet"]')?.value;
      const rgpd   = form.querySelector('[name="rgpd"]')?.checked;

      if (!nom || !tel || !projet || !rgpd) {
        showFormError('Merci de remplir tous les champs obligatoires et d\'accepter la politique de confidentialité.');
        return;
      }

      form.querySelectorAll('input, select, textarea, button[type="submit"]')
          .forEach(el => el.disabled = true);

      try {
        const data = new FormData(form);
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
      } catch (_) { /* réseau : on affiche quand même le succès */ }

      const success = document.getElementById('form-success');
      if (success) {
        success.style.display = 'flex';
        success.classList.remove('hidden');
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

  /* ---- Hero carousel (2 cards at a time, 5 total) ---- */
  const heroCards = Array.from(document.querySelectorAll('#hero-cards .hero-card'));
  if (heroCards.length) {
    const perPage = 2;
    let current = 0;

    function showCards(idx) {
      heroCards.forEach((card, i) => {
        const visible = i >= idx && i < idx + perPage;
        card.style.display = visible ? '' : 'none';
        card.setAttribute('aria-hidden', visible ? 'false' : 'true');
      });
      current = idx;
    }

    function advance(dir) {
      let next = current + dir * perPage;
      if (next < 0) next = Math.max(0, heroCards.length - perPage);
      if (next + perPage > heroCards.length) next = 0;
      showCards(next);
    }

    document.getElementById('hero-prev')?.addEventListener('click', () => advance(-1));
    document.getElementById('hero-next')?.addEventListener('click', () => advance(1));

    showCards(0);
    setInterval(() => advance(1), 4000);
  }

  /* ---- FAQ accordion (contact page) ---- */
  document.querySelectorAll('details').forEach(detail => {
    const summary = detail.querySelector('summary');
    if (!summary) return;
    detail.addEventListener('toggle', () => {
      const icon = summary.querySelector('[data-lucide]');
      if (!icon) return;
      icon.setAttribute('data-lucide', detail.open ? 'minus' : 'plus');
      lucide.createIcons();
    });
  });

});
