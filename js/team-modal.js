  const modal = document.getElementById("teamModal");
  const modalClose = document.getElementById("teamModalClose");
  const modalImage = document.getElementById("teamModalImage");
  const modalName = document.getElementById("teamModalName");
  const modalRole = document.getElementById("teamModalRole");
  const modalBio = document.getElementById("teamModalBio");

  const teamCards = document.querySelectorAll(".team-card");

  function openTeamModal(card) {
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.name;
    modalName.textContent = card.dataset.name;
    modalRole.textContent = card.dataset.role;
    modalBio.textContent = card.dataset.bio;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeTeamModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  teamCards.forEach(card => {
    card.addEventListener("click", () => openTeamModal(card));
  });

  modalClose.addEventListener("click", closeTeamModal);

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("team-modal-backdrop")) {
      closeTeamModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeTeamModal();
    }
  });