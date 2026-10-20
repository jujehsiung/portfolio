/* Behavior — coverflow, menu, films, instagram. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.SITE || {};

  /* ---------- year ---------- */
  const y = $("#year"); if (y) y.textContent = String(new Date().getFullYear()).slice(2);
  const y2 = $("#year2"); if (y2) y2.textContent = new Date().getFullYear();

  /* ---------- overlay menu ---------- */
  const menu = $("#menu"), menuBtn = $("#menuBtn"), menuClose = $("#menuClose");
  const openMenu = () => { menu.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeMenu = () => { menu.classList.remove("open"); document.body.style.overflow = ""; };
  menuBtn?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  $$("#menu a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu?.classList.contains("open")) closeMenu(); });

  /* ---------- works grid (all images, uncropped) ---------- */
  const grid = $("#worksGrid");
  (D.images || []).forEach((im) => {
    const fig = document.createElement("figure");
    fig.className = `works__item works__item--${im.o}`;
    fig.innerHTML = `
      <img loading="lazy" src="${im.src}" alt="${im.title}">
      <figcaption><span>${im.title}</span><span>${im.cat}</span></figcaption>`;
    grid?.appendChild(fig);
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.15 }
  );
  $$(".works__item").forEach((c) => io.observe(c));

  /* ---------- films ---------- */
  const filmsGrid = $("#filmsGrid");
  (D.films || []).forEach((f) => {
    const el = document.createElement("div");
    el.className = "film";
    const hasYT = !!f.youtube;
    const hasSrc = !!f.src;
    const thumb = f.poster || (hasYT ? `https://img.youtube.com/vi/${f.youtube}/maxresdefault.jpg` : "");
    el.innerHTML = `
      ${thumb ? `<img src="${thumb}" alt="${f.title}" loading="lazy">` : ""}
      ${hasSrc ? `<video src="${f.src}" muted loop playsinline preload="none"></video>` : ""}
      <span class="film__play" aria-hidden="true">▶</span>
      <span class="film__cap">${f.title} — ${f.credit}</span>`;
    filmsGrid?.appendChild(el);

    if (hasYT) {
      el.addEventListener("click", () => {
        el.innerHTML = `<iframe src="https://www.youtube.com/embed/${f.youtube}?autoplay=1&rel=0&playsinline=1" title="${f.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          <span class="film__cap">${f.title} — ${f.credit}</span>`;
        el.classList.add("playing");
      });
    } else if (hasSrc) {
      const v = el.querySelector("video");
      const play = () => { el.classList.add("playing"); v.play().catch(() => {}); };
      const stop = () => { el.classList.remove("playing"); v.pause(); };
      el.addEventListener("mouseenter", play);
      el.addEventListener("mouseleave", stop);
      el.addEventListener("click", () => (v.paused ? play() : stop()));
    }
  });

  /* ---------- instagram ---------- */
  const ig = $("#igGrid");
  (D.instagram || []).forEach((src) => {
    const a = document.createElement("a");
    a.href = "https://instagram.com/_pray4juje";
    a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = `<img src="${src}" alt="Instagram post" loading="lazy">`;
    ig?.appendChild(a);
  });
})();
