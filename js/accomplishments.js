fetch("/content/accomplishments.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load accomplishments data: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const titleEl = document.querySelector("#accomplishments-title");
    const subtitleEl = document.querySelector("#accomplishments-subtitle");
    const introEl = document.querySelector("#accomplishments-intro");
    const contentEl = document.querySelector("#accomplishments-content");

    if (!contentEl) return;

    if (data.intro?.title && titleEl) {
      titleEl.textContent = data.intro.title;
    }

    if (data.intro?.subtitle && subtitleEl) {
      subtitleEl.textContent = data.intro.subtitle;
    }

    if (data.intro?.text && introEl) {
      introEl.innerHTML = `<p>${escapeHtml(data.intro.text)}</p>`;
    } else if (introEl) {
      introEl.innerHTML = "";
    }

    if (!Array.isArray(data.sections)) return;

    data.sections.forEach((section) => {
      const card = document.createElement("section");
      card.className = "accomplishments-card";

      const heading = document.createElement("h2");
      heading.className = "accomplishments-card-title";
      heading.textContent = section.title || "Untitled Section";

      card.appendChild(heading);

      if (Array.isArray(section.items) && section.items.length > 0) {
        const list = document.createElement("ul");
        list.className = "accomplishments-list";

        section.items.forEach((item) => {
          const li = document.createElement("li");
          li.className = "accomplishments-item";
          li.textContent = item.text || "";
          list.appendChild(li);
        });

        card.appendChild(list);
      }

      contentEl.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Error loading accomplishments:", error);

    const contentEl = document.querySelector("#accomplishments-content");
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="accomplishments-error">
          <p>Sorry, the accomplishments page could not be loaded right now.</p>
        </div>
      `;
    }
  });

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}