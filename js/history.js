fetch("/content/history.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load history data: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const timelineEl = document.querySelector("#history-timeline");
    if (!timelineEl) return;

    if (!Array.isArray(data.timeline)) return;

    data.timeline.forEach((item) => {
      const article = document.createElement("article");
      article.className = "history-timeline-item";

      const marker = document.createElement("div");
      marker.className = "history-timeline-marker";
      marker.setAttribute("aria-hidden", "true");

      const content = document.createElement("div");
      content.className = "history-timeline-content";

      const year = document.createElement("p");
      year.className = "history-timeline-year";
      year.textContent = item.year || "";

      const title = document.createElement("h3");
      title.className = "history-timeline-title";
      title.textContent = item.title || "";

      const body = document.createElement("div");
      body.className = "history-timeline-body";
      body.innerHTML = formatHistoryContent(item.content || "");

      content.appendChild(year);
      content.appendChild(title);
      content.appendChild(body);

      article.appendChild(marker);
      article.appendChild(content);

      timelineEl.appendChild(article);
    });
  })
  .catch((error) => {
    console.error("Error loading history timeline:", error);

    const timelineEl = document.querySelector("#history-timeline");
    if (timelineEl) {
      timelineEl.innerHTML = `
        <div class="history-error">
          <p>Sorry, the timeline could not be loaded right now.</p>
        </div>
      `;
    }
  });

function formatHistoryContent(text) {
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