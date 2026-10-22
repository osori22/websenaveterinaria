/* ==========================================================================
   Huella Vital - Clinica Veterinaria
   Script principal (JavaScript vanilla, sin frameworks)
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. Utilidades
     ------------------------------------------------------------------ */
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) =>
    Array.from((scope || document).querySelectorAll(selector));

  /* ------------------------------------------------------------------
     2. Marca "js" en <html> (para animaciones de entrada)
     ------------------------------------------------------------------ */
  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     3. Menú móvil
     ------------------------------------------------------------------ */
  function initMenu() {
    const toggle = $(".nav__toggle");
    const nav = $(".nav");
    if (!toggle || !nav) return;

    // Capa oscura de fondo para el menú móvil
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    function open() {
      nav.classList.add("is-open");
      backdrop.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function close() {
      nav.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", function () {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });

    backdrop.addEventListener("click", close);

    // Cerrar al hacer clic en un enlace del menú
    $$(".nav a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });

    // Restaurar el desplazamiento al redimensionar a escritorio
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && nav.classList.contains("is-open")) {
        close();
      }
    });
  }

  /* ------------------------------------------------------------------
     4. Sombra de la cabecera al hacer scroll + botón "volver arriba"
     ------------------------------------------------------------------ */
  function initScroll() {
    const header = $(".site-header");
    const toTop = $(".to-top");

    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;

      if (header) {
        header.classList.toggle("is-scrolled", y > 10);
      }

      if (toTop) {
        toTop.classList.toggle("is-visible", y > 400);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     5. Enlace activo del menú (según la página actual)
     ------------------------------------------------------------------ */
  function initActiveLink() {
    const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__link").forEach(function (link) {
      const href = (link.getAttribute("href") || "").toLowerCase().split("#")[0];
      if (href === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });
  }

  /* ------------------------------------------------------------------
     6. Animaciones al entrar en pantalla (IntersectionObserver)
     ------------------------------------------------------------------ */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     7. Filtros de la galería
     ------------------------------------------------------------------ */
  function initGalleryFilter() {
    const buttons = $$(".filter");
    const items = $$(".gallery__item");
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.dataset.filter || "all";

        buttons.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        let visible = 0;
        items.forEach(function (item) {
          const cat = item.dataset.category || "";
          const show = filter === "all" || cat === filter;
          item.classList.toggle("is-hidden", !show);
          if (show) visible++;
        });

        const counter = $("[data-gallery-count]");
        if (counter) {
          counter.textContent = visible;
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     8. Lightbox de la galería
     ------------------------------------------------------------------ */
  function initLightbox() {
    const items = $$(".gallery__item");
    const lightbox = $("#lightbox");
    if (!items.length || !lightbox) return;

    const imgEl = $(".lightbox__figure img", lightbox);
    const captionEl = $(".lightbox__caption", lightbox);
    let index = 0;

    function visibleItems() {
      return items.filter((item) => !item.classList.contains("is-hidden"));
    }

    function show(i) {
      const list = visibleItems();
      if (!list.length) return;
      index = (i + list.length) % list.length;

      const item = list[index];
      const img = $("img", item);
      const title = item.dataset.title || (img ? img.alt : "");

      imgEl.src = img ? img.getAttribute("src") : "";
      imgEl.alt = img ? img.alt : "";
      captionEl.textContent = title;

      const counter = $(".lightbox__counter", lightbox);
      if (counter) {
        counter.textContent = index + 1 + " / " + list.length;
      }
    }

    function open(i) {
      show(i);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      const closeBtn = $(".lightbox__close", lightbox);
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        const list = visibleItems();
        open(list.indexOf(item));
      });
    });

    const closeBtn = $(".lightbox__close", lightbox);
    if (closeBtn) closeBtn.addEventListener("click", close);

    const prev = $(".lightbox__nav--prev", lightbox);
    const next = $(".lightbox__nav--next", lightbox);
    if (prev) prev.addEventListener("click", () => show(index - 1));
    if (next) next.addEventListener("click", () => show(index + 1));

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && prev) show(index - 1);
      if (e.key === "ArrowRight" && next) show(index + 1);
    });
  }

  /* ------------------------------------------------------------------
     9. Preguntas frecuentes (acordeón)
     ------------------------------------------------------------------ */
  function initFaq() {
    const items = $$(".faq__item");
    if (!items.length) return;

    items.forEach(function (item) {
      const question = $(".faq__question", item);
      const answer = $(".faq__answer", item);
      if (!question || !answer) return;

      // Estado inicial: cerrado
      answer.style.maxHeight = "0px";

      question.setAttribute("aria-expanded", "false");

      question.addEventListener("click", function () {
        const isOpen = item.classList.contains("is-open");

        // Cerrar los demás
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherAnswer = $(".faq__answer", other);
            const otherQuestion = $(".faq__question", other);
            if (otherAnswer) otherAnswer.style.maxHeight = "0px";
            if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
          }
        });

        if (isOpen) {
          item.classList.remove("is-open");
          answer.style.maxHeight = "0px";
          question.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("is-open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Validación del formulario de contacto
     ------------------------------------------------------------------ */
  function initContactForm() {
    const form = $("#contacto-form");
    if (!form) return;

    const success = $("#form-success");
    const errorBox = $("#form-error");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    const phoneRegex = /^[0-9+\s()-]{7,20}$/;

    function setError(field, message) {
      const wrapper = field.closest(".field");
      const errorEl = wrapper ? $(".field__error", wrapper) : null;
      if (!wrapper) return;

      if (message) {
        wrapper.classList.add("has-error");
        field.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = message;
      } else {
        wrapper.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function validateField(field) {
      const value = field.value.trim();

      if (field.type === "checkbox") {
        if (field.required && !field.checked) {
          setError(field, "Debes aceptar la política de privacidad.");
          return false;
        }
        setError(field, "");
        return true;
      }

      if (field.required && value === "") {
        setError(field, "Este campo es obligatorio.");
        return false;
      }

      if (value === "") {
        setError(field, "");
        return true;
      }

      if (field.type === "email" && !emailRegex.test(value)) {
        setError(field, "Escribe un correo electrónico válido.");
        return false;
      }

      if (field.type === "tel" && !phoneRegex.test(value)) {
        setError(field, "Escribe un número de teléfono válido.");
        return false;
      }

      if (field.dataset.minlength) {
        const min = parseInt(field.dataset.minlength, 10);
        if (value.length < min) {
          setError(
            field,
            "Por favor escribe al menos " + min + " caracteres."
          );
          return false;
        }
      }

      setError(field, "");
      return true;
    }

    const fields = $$("input, select, textarea", form).filter(
      (f) => f.type !== "submit" && f.type !== "hidden"
    );

    // Validar mientras el usuario escribe (solo tras un primer intento)
    let attempted = false;

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        if (attempted) validateField(field);
      });
      field.addEventListener("input", function () {
        if (attempted) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      attempted = true;

      let valid = true;
      let firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field) && valid) {
          valid = false;
          firstInvalid = field;
        } else if (!validateField(field)) {
          valid = false;
        }
      });

      if (!valid) {
        if (errorBox) {
          errorBox.classList.add("is-visible");
          errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (errorBox) errorBox.classList.remove("is-visible");

      // Simulación del envío (aquí puedes conectar una API real)
      const submitBtn = $('button[type="submit"]', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
      }

      window.setTimeout(function () {
        form.reset();
        fields.forEach((f) => setError(f, ""));
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar solicitud";
        }
        if (success) {
          success.classList.add("is-visible");
          success.setAttribute("role", "status");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
          window.setTimeout(() => success.classList.remove("is-visible"), 9000);
        }
      }, 900);
    });
  }

  /* ------------------------------------------------------------------
     11. Botón "Reservar cita" desde los planes de servicios
     ------------------------------------------------------------------ */
  function initBookingLinks() {
    $$("[data-booking]").forEach(function (link) {
      link.addEventListener("click", function () {
        const plan = link.dataset.booking || "";
        const select = $("#mascota-interes");
        const note = $("#mensaje");

        if (select && plan) {
          const option = $$("option", select).find(
            (o) => o.value.toLowerCase() === plan.toLowerCase()
          );
          if (option) select.value = option.value;
        }

        if (note && plan && note.value.trim() === "") {
          note.value = "Deseo información sobre el plan: " + plan;
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     12. Año actual en el pie de página
     ------------------------------------------------------------------ */
  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------
     13. Inicialización
     ------------------------------------------------------------------ */
  function init() {
    initMenu();
    initScroll();
    initActiveLink();
    initReveal();
    initGalleryFilter();
    initLightbox();
    initFaq();
    initContactForm();
    initBookingLinks();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
