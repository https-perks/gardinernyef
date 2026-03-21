fetch("/content/annual-reports.json")
  .then(response => response.json())
  .then(data => {
    const grid = document.querySelector("#annual-reports-grid");

    if (!grid) return;

    data.items.forEach(item => {
      const card = document.createElement("a");
      card.className = "press-card";
      card.href = item.file;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      card.innerHTML = `
        <div class="press-card-media">
          <img src="${item.image}" alt="${item.title} ${item.year}">
        </div>
        <div class="press-card-body">
          <h3 class="press-card-title">${item.title}</h3>
          <p class="press-card-meta">${item.year}</p>
          <span class="press-card-link">Open Report</span>
        </div>
      `;

      grid.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error loading annual reports:", error);
  });