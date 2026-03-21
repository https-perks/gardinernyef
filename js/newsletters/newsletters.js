fetch("/content/newsletters.json")
  .then(response => response.json())
  .then(data => {
    const grid = document.querySelector(".press-grid");

    data.items.forEach(item => {
      const card = document.createElement("a");
      card.className = "press-card";
      card.href = item.link;
      card.target = "_blank";

      card.innerHTML = `
        <div class="press-card-media">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="press-card-body">
          <h3 class="press-card-title">${item.title}</h3>
          <p class="press-card-meta">${item.label}</p>
        </div>
      `;

      grid.appendChild(card);
    });
  });