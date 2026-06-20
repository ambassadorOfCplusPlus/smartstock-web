// SmartStock site — общий скрипт: бургер-меню, активный пункт, год,
// лайтбокс для скриншотов и единые эмодзи (Twemoji).
(function () {
  "use strict";

  // ── Бургер на мобильных ──────────────────────────────────────────────────
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    // Возврат к десктопной ширине (>1280px) — снимаем .open, чтобы состояние
    // меню не «залипало» после ресайза/поворота экрана.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1280) nav.classList.remove("open");
    });
  }

  // ── Активный пункт меню по имени файла ───────────────────────────────────
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === page) a.classList.add("active");
  });

  // ── Год в подвале ────────────────────────────────────────────────────────
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ── Лайтбокс: скриншоты в полный размер по клику ─────────────────────────
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = '<button class="lb-close" aria-label="Закрыть">&times;</button><img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img");

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    document.body.style.overflow = "hidden";
    // Форсируем перерасчёт, чтобы зум-анимация проигралась с первого открытия.
    void lbImg.offsetWidth;
    lb.classList.add("open");
  }
  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    // Чистим src не сразу, а после анимации закрытия — иначе картинка «мигает».
    setTimeout(function () { if (!lb.classList.contains("open")) lbImg.src = ""; }, 280);
  }
  lb.addEventListener("click", function (e) {
    if (e.target !== lbImg) closeLightbox();   // клик по фону/крестику — закрыть
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox();
  });
  document.querySelectorAll(".shot-img").forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  // ── Появление при прокрутке (scroll-reveal) ──────────────────────────────
  // Прячем элементы только если JS жив и пользователь не просил «меньше движения»
  // — иначе контент остаётся видимым (прогрессивное улучшение).
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");

    // Лёгкий каскад внутри сеток: каждой карточке — свой индекс задержки.
    document.querySelectorAll(".grid").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (ch, i) {
        ch.style.setProperty("--reveal-i", i % 4);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    var revealSel = ".card, .section-head, .step, .price-card, figure, " +
                    ".table-wrap, .pay-box, .doc .note, .contact-list";
    document.querySelectorAll(revealSel).forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  // ── Единые эмодзи (Twemoji): один вид на Windows/Mac/Android ──────────────
  // Грузим библиотеку с CDN динамически; если не загрузилась — остаются
  // системные эмодзи (страница не ломается).
  var TW_VER = "15.1.0";
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@twemoji/api@" + TW_VER + "/dist/twemoji.min.js";
  s.crossOrigin = "anonymous";
  s.onload = function () {
    if (!window.twemoji) return;
    window.twemoji.parse(document.body, {
      folder: "svg",
      ext: ".svg",
      base: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@" + TW_VER + "/assets/"
    });
  };
  document.head.appendChild(s);
})();
