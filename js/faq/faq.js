fetch("/content/faq.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load FAQ data: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const titleEl = document.querySelector("#faq-page-title");
    const subtitleEl = document.querySelector("#faq-page-subtitle");
    const jumpNavEl = document.querySelector("#faq-jump-nav");
    const contentEl = document.querySelector("#faq-content");

    if (!contentEl) return;

    if (data.intro?.title && titleEl) {
      titleEl.textContent = data.intro.title;
    }

    if (data.intro?.subtitle && subtitleEl) {
      subtitleEl.textContent = data.intro.subtitle;
    }

    if (!Array.isArray(data.categories)) return;

    data.categories.forEach((category, index) => {
      const slug = createSlug(category.title || `section-${index + 1}`);

      // Jump nav link
      if (jumpNavEl && category.title) {
        const jumpLink = document.createElement("a");
        jumpLink.className = "faq-jump-link";
        jumpLink.href = `#${slug}`;
        jumpLink.textContent = category.title;
        jumpNavEl.appendChild(jumpLink);
      }

      // Section wrapper
      const group = document.createElement("section");
      group.className = "faq-group";
      group.id = slug;

      // Section title
      const heading = document.createElement("h2");
      heading.className = "faq-group-title";
      heading.textContent = category.title || `Section ${index + 1}`;
      group.appendChild(heading);

      // FAQ list
      const list = document.createElement("div");
      list.className = "faq-list";

      if (Array.isArray(category.items)) {
        category.items.forEach((item) => {
          const details = document.createElement("details");
          details.className = "faq-item";

          const summary = document.createElement("summary");
          summary.className = "faq-question";
          summary.textContent = item.question || "Untitled question";

          const answer = document.createElement("div");
          answer.className = "faq-answer";
          answer.innerHTML = formatAnswer(item.answer || "");

          details.appendChild(summary);
          details.appendChild(answer);
          list.appendChild(details);
        });
      }

      group.appendChild(list);
      contentEl.appendChild(group);
    });

    // Optional: only allow one open item per section
    document.querySelectorAll(".faq-list").forEach((list) => {
      const items = list.querySelectorAll(".faq-item");

      items.forEach((item) => {
        item.addEventListener("toggle", () => {
          if (!item.open) return;

          items.forEach((other) => {
            if (other !== item) {
              other.open = false;
            }
          });
        });
      });
    });
  })
  .catch((error) => {
    console.error("Error loading FAQ:", error);

    const contentEl = document.querySelector("#faq-content");
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="faq-error">
          <p>Sorry, the FAQ could not be loaded right now.</p>
        </div>
      `;
    }
  });

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function formatAnswer(text) {
  if (!text) return "";

  const escaped = escapeHtml(text);

  // bold markdown-style **text**
  const withBold = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // split paragraphs by blank lines
  const paragraphs = withBold
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return paragraphs;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.querySelectorAll(".faq-list").forEach((list) => {
  const items = list.querySelectorAll(".faq-item");

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      items.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });
});