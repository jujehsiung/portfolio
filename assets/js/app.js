/* Behavior — nav, reveals, films, index cover-follow, instagram, lightbox. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.SITE || {};

  /* ---------- year ---------- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- robust reveal: scroll-driven + safety timeout ---------- */
  function forceReveal() {
    $$(".reveal-words").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("in");
    });
  }
  window.addEventListener("scroll", forceReveal, { passive: true });
  setTimeout(() => $$(".reveal-words").forEach((el) => el.classList.add("in")), 2600);

  /* ---------- hero title wrap ---------- */
  $$(".hero__title .word").forEach((w) => {
    w.innerHTML = `<span>${w.textContent}</span>`;
  });
  requestAnimationFrame(() => setTimeout(() => $("#hero")?.classList.add("loaded"), 120));

  /* ---------- split-word reveal ---------- */
  $$(".reveal-words").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="w" style="transition-delay:${i * 28}ms">${w}</span>`)
      .join(" ");
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.25 }
  );
  $$(".reveal-words").forEach((el) => io.observe(el));

  /* ---------- mobile menu ---------- */
  const plus = $("#navPlus"), links = $("#navLinks");
  plus?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    plus.classList.toggle("open", open);
    plus.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      plus?.classList.remove("open");
    })
  );

  /* ---------- films ---------- */
  const filmsGrid = $("#filmsGrid");
  (D.films || []).forEach((f) => {
    const el = document.createElement("div");
    el.className = "film";
    const hasSrc = !!f.src;
    el.innerHTML = `
      <img src="${f.poster}" alt="${f.title}" loading="lazy">
      ${hasSrc ? `<video src="${f.src}" muted loop playsinline preload="none"></video>` : ""}
      <span class="film__cap">${f.title} — ${f.client}</span>`;
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

  /* ---------- index list + follow cover ---------- */
  const list = $("#indexList"), cover = $("#indexCover"), coverImg = $("#indexCoverImg");
  (D.projects || []).forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#${p.cat.toLowerCase()}">${p.name}</a><em>${p.cat} · ${p.year}</em>`;
    li.addEventListener("mouseenter", () => {
      if (!cover || !coverImg) return;
      coverImg.src = p.img;
      cover.classList.add("on");
    });
    li.addEventListener("mouseleave", () => cover?.classList.remove("on"));
    list?.appendChild(li);
  });

  /* ---------- instagram grid ---------- */
  const ig = $("#igGrid");
  (D.instagram || []).forEach((src) => {
    const a = document.createElement("a");
    a.href = "https://instagram.com/_pray4juje";
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = `<img src="${src}" alt="Instagram post" loading="lazy">`;
    ig?.appendChild(a);
  });

  /* ---------- lightbox for work images ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  $$(".work__media").forEach((m) =>
    m.addEventListener("click", (e) => {
      e.preventDefault();
      const img = m.querySelector("img");
      const row = m.closest(".work__row");
      lbImg.src = img.src;
      lbCap.textContent = row?.querySelector("h4")?.textContent || "";
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    })
  );
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  $("#lbClose")?.addEventListener("click", close);
  lb?.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) close(); });
})();
