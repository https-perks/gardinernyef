async function loadTeamData() {
  const boardGrid = document.getElementById("board-grid");
  const advisoryGrid = document.getElementById("advisory-grid");

  if (!boardGrid && !advisoryGrid) return;

  try {
    const [boardRes, advisoryRes] = await Promise.all([
      fetch("/content/board.json"),
      fetch("/content/advisory.json")
    ]);

    const boardData = await boardRes.json();
    const advisoryData = await advisoryRes.json();

    if (boardGrid) {
      boardGrid.innerHTML = "";
      (boardData.members || []).forEach(member => {
        const card = document.createElement("button");
        card.className = "team-card";
        card.type = "button";

        card.dataset.name = member.name || "";
        card.dataset.role = member.title || "";
        card.dataset.image = member.photo || "/images/placeholder-person.jpg";
        card.dataset.bio = member.bio || "";

        card.innerHTML = `
          <img src="${member.photo || "/images/placeholder-person.jpg"}" alt="${member.name || "Board member"}" class="team-photo">
          <span class="team-name">${member.name || ""}</span>
          <span class="team-role">${member.title || ""}</span>
        `;

        boardGrid.appendChild(card);
      });
    }

    if (advisoryGrid) {
      advisoryGrid.innerHTML = "";
      (advisoryData.members || []).forEach(member => {
        const card = document.createElement("button");
        card.className = "team-card";
        card.type = "button";

        card.dataset.name = member.name || "";
        card.dataset.role = member.title || "";
        card.dataset.image = member.photo || "/images/placeholder-person.jpg";
        card.dataset.bio = member.bio || "";

        card.innerHTML = `
          <img src="${member.photo || "/images/placeholder-person.jpg"}" alt="${member.name || "Advisory staff member"}" class="team-photo">
          <span class="team-name">${member.name || ""}</span>
          <span class="team-role">${member.title || ""}</span>
        `;

        advisoryGrid.appendChild(card);
      });
    }

    document.dispatchEvent(new CustomEvent("teamDataLoaded"));
  } catch (error) {
    console.error("Error loading board/advisory data:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadTeamData);