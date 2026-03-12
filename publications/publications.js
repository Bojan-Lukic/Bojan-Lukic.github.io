async function loadPublications() {
  const response = await fetch("./publications.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load publications.json");
  }
  return await response.json();
}

function normalize(value) {
  return (value || "").toString().toLowerCase().trim();
}

function uniqueSorted(values, compareFn) {
  return [...new Set(values.filter(Boolean))].sort(compareFn);
}

function escapeHtml(value) {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFilters(publications) {
  const typeSelect = document.getElementById("pub-type");
  const yearSelect = document.getElementById("pub-year");
  const tagSelect = document.getElementById("pub-tag");

  const types = uniqueSorted(publications.map(pub => pub.type), (a, b) => a.localeCompare(b));
  const years = uniqueSorted(publications.map(pub => pub.year), (a, b) => b - a);
  const tags = uniqueSorted(
    publications.flatMap(pub => pub.tags || []),
    (a, b) => a.localeCompare(b)
  );

  for (const type of types) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  }

  for (const year of years) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.appendChild(option);
  }

  for (const tag of tags) {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  }
}

function matchesFilters(pub) {
  const query = normalize(document.getElementById("pub-search").value);
  const role = document.getElementById("pub-role").value;
  const type = document.getElementById("pub-type").value;
  const year = document.getElementById("pub-year").value;
  const tag = document.getElementById("pub-tag").value;

  if (role && pub.role !== role) return false;
  if (type && pub.type !== type) return false;
  if (year && String(pub.year) !== year) return false;
  if (tag && !(pub.tags || []).map(normalize).includes(normalize(tag))) return false; 

  if (!query) return true;

  const haystack = [
    pub.title,
    pub.authors,
    pub.venue,
    pub.note,
    pub.type,
    pub.role === "main" ? "lead author" : "co-author",
    ...(pub.tags || [])
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(query);
}

function renderLinks(links) {
  if (!links || !links.length) return "";

  return links.map(link => {
    const label = escapeHtml(link.label);
    const url = escapeHtml(link.url);
    return `<a class="pub-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }).join("");
}

function renderPdfLink(pdf) {
  if (!pdf) return "";
  const url = escapeHtml(pdf);
  return `<a class="pub-link pub-link-pdf" href="${url}" target="_blank" rel="noopener noreferrer">PDF</a>`;
} 

function renderTags(tags) {
  if (!tags || !tags.length) return "";
  return tags.map(tag => `<span class="pub-tag">${escapeHtml(tag)}</span>`).join("");
}

function renderBibtexControls(pubId, bibtex) {
  if (!bibtex) return "";
  return `<button class="pub-mini-button" type="button" data-bibtex-toggle="${pubId}">BibTeX</button>`;
}

function publicationCard(pub, index) {
  const pubId = `pub-${index}`;
  const noteHtml = pub.note ? `<div class="pub-note">${escapeHtml(pub.note)}</div>` : "";
  const bibtexHtml = pub.bibtex
    ? `
      <div class="pub-bibtex" id="${pubId}" hidden>
        <div class="pub-bibtex-bar">
          <button class="pub-bibtex-copy" type="button" data-bibtex-copy="${pubId}" aria-label="Copy BibTeX" title="Copy BibTeX">⎘</button>
        </div>
        <pre>${escapeHtml(pub.bibtex)}</pre>
      </div>
    `
    : "";

  return `
    <article class="pub-item">
      <div class="pub-meta-col">
        <div class="pub-year">${escapeHtml(String(pub.year || ""))}</div>
        <div class="pub-type-label">${escapeHtml(pub.type || "")}</div>
      </div>
      <div class="pub-content-col">
        <div class="pub-title">${escapeHtml(pub.title || "")}</div>
        <div class="pub-authors">${escapeHtml(pub.authors || "")}</div>
        <div class="pub-venue">${escapeHtml(pub.venue || "")}</div>
        ${noteHtml}
        <div class="pub-links">
          ${renderLinks(pub.links)}
          ${renderPdfLink(pub.pdf)}
          ${renderBibtexControls(pubId, pub.bibtex)}
        </div>
        <div class="pub-tags">${renderTags(pub.tags)}</div>
        ${bibtexHtml}
      </div>
    </article>
  `;
}

function render(publications) {
  const filtered = publications
    .filter(matchesFilters)
    .sort((a, b) => {
      if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
      return (a.title || "").localeCompare(b.title || "");
    });

  const main = filtered.filter(pub => pub.role === "main");
  const co = filtered.filter(pub => pub.role === "co");

  document.getElementById("pub-stats").textContent =
    `${filtered.length} of ${publications.length} publications shown`;

  document.getElementById("pub-list-main").innerHTML =
    main.length
      ? main.map((pub, i) => publicationCard(pub, `main-${i}`)).join("")
      : `<p>No publications match the current filter.</p>`;

  document.getElementById("pub-list-co").innerHTML =
    co.length
      ? co.map((pub, i) => publicationCard(pub, `co-${i}`)).join("")
      : `<p>No publications match the current filter.</p>`;

  bindBibtexActions();
}

function bindBibtexActions() {
  document.querySelectorAll("[data-bibtex-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-bibtex-toggle");
      const box = document.getElementById(targetId);
      if (!box) return;

      const isHidden = box.hasAttribute("hidden");
      if (isHidden) {
        box.removeAttribute("hidden");
        button.textContent = "Hide BibTeX";
      } else {
        box.setAttribute("hidden", "");
        button.textContent = "BibTeX";
      }
    });
  });

  document.querySelectorAll("[data-bibtex-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-bibtex-copy");
      const box = document.getElementById(targetId);
      if (!box) return;

      const pre = box.querySelector("pre");
      if (!pre) return;

      const text = pre.innerText.trim();

      try {
        await navigator.clipboard.writeText(text);
        const old = button.textContent;
        button.textContent = "✔";
        setTimeout(() => {
          button.textContent = old;
        }, 1200);
      } catch (error) {
        button.textContent = "❌";
        setTimeout(() => {
          button.textContent = "⎘";
        }, 1200);
      }
    });
  });
}

(async function initPublicationsPage() {
  try {
    const publications = await loadPublications();
    buildFilters(publications);
    render(publications);

    document.getElementById("pub-search").addEventListener("input", () => render(publications));
    document.getElementById("pub-role").addEventListener("change", () => render(publications));
    document.getElementById("pub-type").addEventListener("change", () => render(publications));
    document.getElementById("pub-year").addEventListener("change", () => render(publications));
    document.getElementById("pub-tag").addEventListener("change", () => render(publications)); 
  } catch (error) {
    document.getElementById("pub-stats").textContent = "Could not load publications.";
    document.getElementById("pub-list-main").innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    document.getElementById("pub-list-co").innerHTML = "";
  }
})(); 