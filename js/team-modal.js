const modal = document.getElementById("teamModal");
const modalClose = document.getElementById("teamModalClose");

const modalImage = document.getElementById("teamModalImage");
const modalName = document.getElementById("teamModalName");
const modalRole = document.getElementById("teamModalRole");
const modalBio = document.getElementById("teamModalBio");

function openTeamModal(card) {
  modalImage.src = card.dataset.image || "";
  modalImage.alt = card.dataset.name || "";

  modalName.textContent = card.dataset.name || "";
  modalRole.textContent = card.dataset.role || "";
  modalBio.textContent = card.dataset.bio || "";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeTeamModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("click", (event) => {
  const card = event.target.closest(".team-card");
  if (card) {
    openTeamModal(card);
    return;
  }

  if (
    event.target.classList.contains("team-modal-backdrop") ||
    event.target === modalClose
  ) {
    closeTeamModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeTeamModal();
  }
});