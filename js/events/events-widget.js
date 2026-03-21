async function loadHomepageEvents() {
  const container = document.getElementById("homepage-events");
  if (!container) return;

  try {
    const response = await fetch("/content/events.json");
    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events
      .map(event => ({
        ...event,
        parsedDate: parseLocalDate(event.date)
      }))
      .filter(event => event.parsedDate instanceof Date && !isNaN(event.parsedDate))
      .filter(event => event.parsedDate >= today)
      .sort((a, b) => a.parsedDate - b.parsedDate)
      .slice(0, 3);

    if (upcomingEvents.length === 0) {
      container.innerHTML = `
        <div class="event-item">
          <div class="event-name">No upcoming events right now.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = upcomingEvents.map(event => `
      <div class="event-item">
        <div class="event-date">${formatEventDate(event.date)}</div>
        <div class="event-name">${escapeHtml(event.title)}</div>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error loading homepage events:", error);
    container.innerHTML = `
      <div class="event-item">
        <div class="event-name">Unable to load events right now.</div>
      </div>
    `;
  }
}

function parseLocalDate(dateString) {
  if (!dateString || typeof dateString !== "string") return null;

  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day);
}

function formatEventDate(dateString) {
  const date = parseLocalDate(dateString);
  if (!date || isNaN(date)) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

document.addEventListener("DOMContentLoaded", loadHomepageEvents);