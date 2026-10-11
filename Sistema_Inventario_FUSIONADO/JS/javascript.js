/* =========================================================
   SIRAME — script compartido
   Cargado por todas las páginas desde JS/javascript.js
   ========================================================= */
   
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menú móvil ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Resaltar el enlace activo según la página actual ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile a').forEach((link) => {
    const linkPath = (link.getAttribute('href') || '').split('#')[0];
    if (linkPath && linkPath === currentPath) {
      link.classList.add('is-active');
    }
  });

  /* ---------- Botón "Volver arriba" ---------- */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Estado del equipo en la ficha (solo existe en index.html) ---------- */
  const tagStatus = document.getElementById('tagStatus');
  const floatStatusText = document.getElementById('floatStatusText');

  if (tagStatus) {
    const estados = [
      { texto: 'Disponible', color: '--green' },
      { texto: 'En mantenimiento', color: '--gold' },
      { texto: 'En traslado', color: '--blue-gray' },
    ];
    let estadoIndex = 0;
    const rootStyles = getComputedStyle(document.documentElement);

    function actualizarEstado() {
      estadoIndex = (estadoIndex + 1) % estados.length;
      const estado = estados[estadoIndex];
      tagStatus.style.opacity = '0';
      if (floatStatusText) floatStatusText.textContent = `Actualizando estado: ${estado.texto}`;
      window.setTimeout(() => {
        tagStatus.textContent = estado.texto;
        tagStatus.style.color = rootStyles.getPropertyValue(estado.color).trim();
        tagStatus.style.opacity = '1';
      }, 250);
    }

    tagStatus.style.setProperty('transition', 'opacity 0.25s ease');
    window.setInterval(actualizarEstado, 3200);
  }

  /* ---------- Formulario de solicitud de acceso (solo existe en acceso.html) ---------- */
  const accessForm = document.getElementById('accessForm');
  const accessCard = document.getElementById('accessCard');
  const accessConfirm = document.getElementById('accessConfirm');
  const accessConfirmText = document.getElementById('accessConfirmText');

  if (accessForm && accessCard && accessConfirm) {
    accessForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!accessForm.checkValidity()) {
        accessForm.reportValidity();
        return;
      }

      const nombre = accessForm.querySelector('#nombre').value.trim();
      const rol = accessForm.querySelector('#rol').value;
      const primerNombre = nombre.split(' ')[0] || '';

      if (accessConfirmText) {
        accessConfirmText.textContent = `Gracias${primerNombre ? ', ' + primerNombre : ''}. Recibimos tu solicitud para el rol de ${rol}. Administración se comunicará a tu correo institucional para habilitar tu acceso.`;
      }

      accessCard.classList.add('is-hidden');
      accessConfirm.classList.remove('is-hidden');
      accessConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Formulario de contacto (solo existe en contacto.html) ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactCard = document.getElementById('contactCard');
  const contactConfirm = document.getElementById('contactConfirm');
  const contactConfirmText = document.getElementById('contactConfirmText');

  if (contactForm && contactCard && contactConfirm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nombre = contactForm.querySelector('#contactoNombre').value.trim();
      const primerNombre = nombre.split(' ')[0] || '';

      if (contactConfirmText) {
        contactConfirmText.textContent = `Gracias${primerNombre ? ', ' + primerNombre : ''}. Recibimos tu mensaje y te responderemos a la brevedad a tu correo.`;
      }

      contactCard.classList.add('is-hidden');
      contactConfirm.classList.remove('is-hidden');
      contactConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Contadores animados de estadísticas ---------- */
  const statNumbers = document.querySelectorAll('.stat__number');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach((el) => observer.observe(el));
  } else {
    statNumbers.forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* =========================================================
     NUEVO — Sistema de reseñas (solo en resenas.html)
     ========================================================= */
  const starInput = document.querySelector('.star-rating-input');
  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');

  if (starInput && reviewForm && reviewsList) {
    let selectedRating = 0;

    starInput.querySelectorAll('span').forEach((star) => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.value, 10);
        starInput.querySelectorAll('span').forEach((s) => {
          s.classList.toggle('is-active', parseInt(s.dataset.value, 10) <= val);
        });
      });
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value, 10);
        starInput.dataset.rating = selectedRating;
        starInput.querySelectorAll('span').forEach((s) => {
          s.classList.toggle('is-active', parseInt(s.dataset.value, 10) <= selectedRating);
        });
      });
    });

    starInput.addEventListener('mouseleave', () => {
      starInput.querySelectorAll('span').forEach((s) => {
        s.classList.toggle('is-active', parseInt(s.dataset.value, 10) <= selectedRating);
      });
    });

    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (selectedRating === 0) {
        alert('Por favor, seleccioná una calificación con las estrellas.');
        return;
      }

      const name = reviewForm.querySelector('#reviewName').value.trim();
      const text = reviewForm.querySelector('#reviewText').value.trim();

      if (!name || !text) {
        reviewForm.reportValidity();
        return;
      }

      const initial = name.charAt(0).toUpperCase();
      const today = new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' });

      const starsHTML = Array.from({ length: 5 }, (_, i) =>
        i < selectedRating ? '★' : '<span class="empty">★</span>'
      ).join('');

      const newReview = document.createElement('article');
      newReview.className = 'review-item';
      newReview.innerHTML = `
        <div class="review-item__avatar">${initial}</div>
        <div class="review-item__body">
          <div class="review-item__header">
            <p class="review-item__name">${name}</p>
            <span class="review-item__date">${today}</span>
          </div>
          <div class="review-item__stars">${starsHTML}</div>
          <p class="review-item__text">${text}</p>
        </div>
      `;
      reviewsList.prepend(newReview);

      // Actualizar contador total
      const totalEl = document.querySelector('.reviews-summary__total');
      if (totalEl) {
        const currentTotal = parseInt(totalEl.textContent.replace(/\D/g, ''), 10) || 0;
        totalEl.textContent = `Basado en ${currentTotal + 1} reseñas`;
      }

      // Resetear formulario
      reviewForm.reset();
      selectedRating = 0;
      starInput.dataset.rating = 0;
      starInput.querySelectorAll('span').forEach((s) => s.classList.remove('is-active'));

      // Scroll a la nueva reseña
      newReview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});