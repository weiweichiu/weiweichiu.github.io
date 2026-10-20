(function () {
  const CATS = [
    { id: "web", label: "網頁與 APP 介面設計" },
    { id: "visual", label: "平面設計與插畫" }
  ];
  const MAIL = "weichiu21@gmail.com";

  const grid = document.getElementById("grid");
  const filters = document.querySelector(".filters");
  const modal = document.getElementById("modal");

  let current = "web";

  CATS.forEach(c => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "filter";
    b.setAttribute("role", "tab");
    b.dataset.cat = c.id;
    b.textContent = c.label;
    b.addEventListener("click", () => { current = c.id; render(); });
    filters.appendChild(b);
  });

  function media(w, big) {
    if (w.img) {
      const src = big ? w.img : (w.thumb || w.img);
      const img = `<img src="assets/works/${src}" alt="${w.title}"${big ? "" : ' loading="lazy"'}>`;
      return w.confidential ? `<div class="locked">${img}<span class="lock-badge">保密專案</span></div>` : img;
    }
    const name = w.title.split("｜")[0];
    return `<div class="placeholder${big ? " big" : ""}"><span>${name}</span>${w.confidential ? '<em>保密專案</em>' : ""}</div>`;
  }

  function render() {
    filters.querySelectorAll(".filter").forEach(b => {
      const on = b.dataset.cat === current;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on);
    });
    const list = window.WORKS.filter(w => w.cat === current);
    grid.innerHTML = list.map((w, i) => `
      <button class="card" type="button" data-i="${window.WORKS.indexOf(w)}">
        <div class="card-media">${media(w)}</div>
        <div class="card-text">
          <h3>${w.title}</h3>
          <p>${[w.year, w.status, w.client].filter(Boolean).join(" · ")}</p>
        </div>
      </button>`).join("");
  }

  grid.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    open(window.WORKS[card.dataset.i]);
  });

  function open(w) {
    document.getElementById("modal-media").innerHTML = media(w, true);
    document.getElementById("modal-meta").textContent =
      [CATS.find(c => c.id === w.cat).label, w.year, w.status].filter(Boolean).join(" · ");
    document.getElementById("modal-title").textContent = w.title;
    document.getElementById("modal-summary").textContent = w.summary;
    const rows = [["客戶", w.client], ["狀態", w.status], ["對象", w.target], ["角色", w.role], ["成果", w.result], ["技術", w.tech], ["心得", w.insight]]
      .filter(r => r[1])
      .map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`);
    if (w.url) rows.push(`<dt>網站</dt><dd><a href="${w.url}" target="_blank" rel="noopener">${w.url}</a></dd>`);
    document.getElementById("modal-details").innerHTML = rows.join("");    modal.showModal();
  }

  modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

  render();
})();
