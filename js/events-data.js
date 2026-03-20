async function loadEvents() {
  const res = await fetch("/content/events.json");
  const data = await res.json();
  const container = document.getElementById("events-container");

  if (!container) return;

  data.events.forEach(event => {
    const card = document.createElement("article");
    card.className = "event-card";

    const formattedDate = new Date(event.date).toLocaleDateString();

    const linkHtml = event.link
      ? `<p><a href="${event.link}" class="card-link">Learn More →</a></p>`
      : "";

    card.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Location:</strong> ${event.location || "TBA"}</p>
      <p>${event.description}</p>
      ${linkHtml}
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadEvents);