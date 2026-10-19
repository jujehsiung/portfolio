/* Behavior — menu, cover, reveals, work grids, films, instagram, lightbox. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.SITE || {};

  /* ---------- year ---------- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- cover load ---------- */
  requestAnimationFrame(() => setTimeout(() => $("#cover")?.classList.add("loaded"), 100));
  $$("#cover .word").forEach((w) => { w.innerHTML = `<span>${w.textContent}</span>`; });

  /* ---------- split-word reveal ---------- */
  $$(".reveal-words").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w" style="transition-delay:${i * 26}ms">${w}</span>`).join(" ");
  });
  function forceReveal() {
    $$(".reveal-words").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("in");
    });
  }
  window.addEventListener("scroll", forceReveal, { passive: true });
  setTimeout(() => $$(".reveal-words").forEach((el) => el.classList.add("in")), 2600);

  /* ---------- overlay menu ---------- */
  const menu = $("#menu"), menuBtn = $("#menuBtn"), menuClose = $("#menuClose");
  const openMenu = () => { menu.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeMenu = () => { menu.classList.remove("open"); document.body.style.overflow = ""; };
  menuBtn?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  $$("#menu a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu?.classList.contains("open")) closeMenu(); });

  /* ---------- work grids ---------- */
  function buildGrid(sel, items, startNum) {
    const grid = $(sel);
    if (!grid) return;
    items.forEach((p, i) => {
      const num = String(startNum + i).padStart(2, "0");
      const ratio = i % 5 === 3 ? "ratio-wide" : "ratio-tall";
      const a = document.createElement("a");
      a.className = `work__item ${ratio}`;
      a.href = "#";
      a.innerHTML = `<img loading="lazy" src="${p.img}" alt="${p.title}"><span class="work__num">${num}</span>`;
      a.addEventListener("click", (e) => { e.preventDefault(); openLightbox(p.img, `${p.title} — ${p.client}`); });
      const cap = document.createElement("div");
      cap.className = "work__cap";
      cap.innerHTML = `<h3>${p.title}</h3><p>${p.client} · ${p.year}</p>`;
      const wrap = document.createElement("div");
      wrap.appendChild(a); wrap.appendChild(cap);
      grid.appendChild(wrap);
    });
  }
  buildGrid("#editorialGrid", D.editorial || [], 1);
  buildGrid("#commercialGrid", D.commercial || [], 1 + (D.editorial || []).length);

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

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  function openLightbox(src, cap) {
    lbImg.src = src; lbCap.textContent = cap || "";
    lb.hidden = false; document.body.style.overflow = "hidden";
  }
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
  $("#lbClose")?.addEventListener("click", closeLb);
  lb?.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  window.__openLightbox = openLightbox;
})();
