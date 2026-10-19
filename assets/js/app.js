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

  /* ---------- coverflow ---------- */
  const covers = $("#covers");
  (D.projects || []).forEach((p) => {
    const el = document.createElement("section");
    el.className = "cover";
    el.id = "works";
    el.innerHTML = `
      <img loading="lazy" src="${p.img}" alt="${p.title}">
      <div class="cover__meta">
        <h2>${p.title}</h2>
        <p>${p.client}</p>
      </div>
      <span class="cover__year">${p.year}</span>`;
    covers?.appendChild(el);
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.25 }
  );
  $$(".cover").forEach((c) => io.observe(c));

  /* ---------- films ---------- */
  const filmsGrid = $("#filmsGrid");
  (D.films || []).forEach((f) => {
    const el = document.createElement("div");
    el.className = "film";
    const hasSrc = !!f.src;
    el.innerHTML = `
      <img src="${f.poster}" alt="${f.title}" loading="lazy">
      ${hasSrc ? `<video src="${f.src}" muted loop playsinline preload="none"></video>` : ""}
      <span class="film__cap">${f.title} — ${f.credit}</span>`;
    filmsGrid?.appendChild(el);
    if (hasSrc) {
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
