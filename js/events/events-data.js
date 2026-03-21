async function loadEventsPage() {
  const upcomingContainer = document.getElementById("upcoming-events-container");
  const pastContainer = document.getElementById("past-events-container");

  if (!upcomingContainer || !pastContainer) return;

  try {
    const response = await fetch("/content/events.json");
    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parsedEvents = events
      .map(event => ({
        ...event,
        parsedDate: parseLocalDate(event.date)
      }))
      .filter(event => event.parsedDate instanceof Date && !isNaN(event.parsedDate))
      .sort((a, b) => a.parsedDate - b.parsedDate);

    const groupedEvents = groupConsecutiveEvents(parsedEvents);

    const upcomingEvents = groupedEvents.filter(event => event.startDate >= today);
    const pastEvents = groupedEvents.filter(event => event.endDate < today).reverse();

    if (upcomingEvents.length === 0) {
      upcomingContainer.innerHTML = `
        <div class="events-empty-state">
          <p>No upcoming events are posted right now. Check back soon.</p>
        </div>
      `;
    } else {
      upcomingContainer.innerHTML = upcomingEvents.map(buildGroupedEventCard).join("");
    }

    if (pastEvents.length === 0) {
      pastContainer.innerHTML = `
        <div class="events-empty-state">
          <p>No past events to show yet.</p>
        </div>
      `;
    } else {
      pastContainer.innerHTML = pastEvents.map(buildGroupedEventCard).join("");
    }
  } catch (error) {
    console.error("Error loading events page:", error);

    const errorHtml = `
      <div class="events-empty-state">
        <p>Unable to load events right now.</p>
      </div>
    `;

    upcomingContainer.innerHTML = errorHtml;
    pastContainer.innerHTML = errorHtml;
  }
}

function groupConsecutiveEvents(events) {
  if (!events.length) return [];

  const groups = [];
  let currentGroup = createEventGroup(events[0]);

  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    const previous = currentGroup.items[currentGroup.items.length - 1];

    if (shouldMergeEvents(previous, event)) {
      currentGroup.items.push(event);
      currentGroup.endDate = event.parsedDate;
    } else {
      groups.push(currentGroup);
      currentGroup = createEventGroup(event);
    }
  }

  groups.push(currentGroup);
  return groups;
}

function createEventGroup(event) {
  return {
    title: event.title,
    time: event.time || "",
    location: event.location || "",
    description: event.description || "",
    link: event.link || "",
    linkText: event.linkText || "",
    startDate: event.parsedDate,
    endDate: event.parsedDate,
    items: [event]
  };
}

function shouldMergeEvents(a, b) {
  if (a.title !== b.title) return false;
  if ((a.time || "") !== (b.time || "")) return false;
  if ((a.location || "") !== (b.location || "")) return false;
  if ((a.description || "") !== (b.description || "")) return false;
  if ((a.link || "") !== (b.link || "")) return false;
  if ((a.linkText || "") !== (b.linkText || "")) return false;

  const nextDay = new Date(a.parsedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  return (
    b.parsedDate.getFullYear() === nextDay.getFullYear() &&
    b.parsedDate.getMonth() === nextDay.getMonth() &&
    b.parsedDate.getDate() === nextDay.getDate()
  );
}

function buildGroupedEventCard(eventGroup) {
  const formattedDate = formatEventDateRange(eventGroup.startDate, eventGroup.endDate);

  const timeHtml = eventGroup.time
    ? `<p class="event-card-meta"><strong>Time:</strong> ${escapeHtml(eventGroup.time)}</p>`
    : "";

  const locationHtml = eventGroup.location
    ? `<p class="event-card-meta"><strong>Location:</strong> ${escapeHtml(eventGroup.location)}</p>`
    : "";

  const descriptionHtml = eventGroup.description
    ? `<p class="event-card-description">${escapeHtml(eventGroup.description)}</p>`
    : "";

  const linkHtml = eventGroup.link
    ? `
      <a href="${escapeAttribute(eventGroup.link)}" class="card-link">
        ${escapeHtml(eventGroup.linkText || "Learn More")} →
      </a>
    `
    : "";

  return `
    <article class="event-card event-card-full">
      <p class="event-card-date">${formattedDate}</p>
      <h3 class="event-card-title">${escapeHtml(eventGroup.title)}</h3>
      ${timeHtml}
      ${locationHtml}
      ${descriptionHtml}
      ${linkHtml}
    </article>
  `;
}

function parseLocalDate(dateString) {
  if (!dateString || typeof dateString !== "string") return null;

  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day);
}

function formatEventDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "";

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  if (sameDay) {
    return startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  const sameMonth =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric"
    })}–${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  const sameYear =
    startDate.getFullYear() === endDate.getFullYear();

  if (sameYear) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric"
    })} – ${endDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })}`;
  }

  return `${startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })} – ${endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

document.addEventListener("DOMContentLoaded", loadEventsPage);