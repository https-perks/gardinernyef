fetch("/content/mental-health.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load mental health data: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data.video?.enabled && data.video?.embed) {
    const wrap = document.querySelector("#mh-video-wrap");

    if (wrap) {
        wrap.innerHTML = `
        <div class="mental-health-video-frame">
            <iframe
            src="${escapeAttribute(data.video.embed)}"
            title="Mental Health Initiative Video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
            </iframe>
        </div>
        `;
    }

    const captionEl = document.querySelector("#mh-video-caption");
    if (captionEl) captionEl.textContent = data.video.caption || "";

    } else {
    const section = document.querySelector("#mh-video-section");
    if (section) section.style.display = "none";
    }

    const highlightsEl = document.querySelector("#mh-highlights");
    if (highlightsEl && Array.isArray(data.highlights)) {
      data.highlights.forEach((item) => {
        const card = document.createElement("article");
        card.className = "mental-health-highlight-card";
        card.innerHTML = `
          <h3 class="mental-health-highlight-title">${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.text || "")}</p>
        `;
        highlightsEl.appendChild(card);
      });
    }

    const featured = data.featured_staff;
    if (featured && (featured.name || featured.bio || featured.image)) {
      const roleEl = document.querySelector("#mh-featured-role");
      const nameEl = document.querySelector("#mh-featured-name");
      const bioEl = document.querySelector("#mh-featured-bio");
      const imageWrap = document.querySelector("#mh-featured-image-wrap");

      if (roleEl) roleEl.textContent = featured.role || "";
      if (nameEl) nameEl.textContent = featured.name || "";
      if (bioEl) bioEl.innerHTML = formatRichText(featured.bio || "");

      if (imageWrap && featured.image) {
        imageWrap.innerHTML = `
          <img
            src="${escapeAttribute(featured.image)}"
            alt="${escapeAttribute(featured.name || "Featured staff member")}"
            loading="lazy">
        `;
      }
    } else {
      const section = document.querySelector("#mh-featured-section");
      if (section) section.style.display = "none";
    }

    const programsEl = document.querySelector("#mh-programs");
    if (programsEl && Array.isArray(data.additional_programs?.items)) {
      data.additional_programs.items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "mental-health-program-card";

        card.innerHTML = `
          ${item.image ? `
            <div class="mental-health-program-image-wrap">
              <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title || "")}" loading="lazy">
            </div>
          ` : ""}
          <div class="mental-health-program-body">
            <h3 class="mental-health-program-title">${escapeHtml(item.title || "")}</h3>
            <div class="mental-health-body">${formatRichText(item.text || "")}</div>
          </div>
        `;

        programsEl.appendChild(card);
      });
    }
  })
  .catch((error) => {
    console.error("Error loading mental health page:", error);
  });

function formatRichText(text) {
  if (!text) return "";

  const escaped = escapeHtml(text);
  const withBold = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return withBold
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}