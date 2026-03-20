function buildGrantCarousel(grants, trackId, dotsId) {
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);

  if (!track || !dotsContainer || !Array.isArray(grants) || grants.length === 0) return;

  let currentIndex = 0;
  let autoScroll;

  const carousel = track.closest(".grants-carousel");
  const prevBtn = carousel?.querySelector(".carousel-btn-prev");
  const nextBtn = carousel?.querySelector(".carousel-btn-next");

  function renderSlides() {
    track.innerHTML = grants.map(grant => {
      const sponsorHtml = grant.sponsor
        ? `<p><strong>Sponsor:</strong> ${grant.sponsor}</p>`
        : "";

      const recipientHtml = grant.awardedTo
        ? `<p><strong>Awarded To:</strong> ${grant.awardedTo}</p>`
        : grant.recipient
          ? `<p><strong>Recipient:</strong> ${grant.recipient}</p>`
          : "";

      const awardHtml = grant.award
        ? `<p><strong>Award:</strong> ${grant.award}</p>`
        : "";

      const servedHtml = grant.totalServed
        ? `<p><strong>Total Served:</strong> ${grant.totalServed}</p>`
        : "";

      const amountHtml = grant.amountAwarded
        ? `<p><strong>Amount Awarded:</strong> ${grant.amountAwarded}</p>`
        : "";

      const imageHtml = grant.image
        ? `
          <div class="grant-slide-media">
            <img src="${grant.image}" alt="${grant.alt || grant.title || "Grant image"}">
          </div>
        `
        : "";

      const slideClass = grant.image
        ? "grant-slide grant-slide-has-image"
        : "grant-slide grant-slide-no-image";

      return `
        <article class="${slideClass}">
          ${imageHtml}
          <div class="grant-slide-copy">
            <h3 class="grant-slide-title">${grant.title || ""}</h3>
            ${recipientHtml}
            ${sponsorHtml}
            ${awardHtml}
            ${servedHtml}
            ${amountHtml}
            <p>${grant.description || ""}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderDots() {
    dotsContainer.innerHTML = grants.map((_, i) => `
      <button
        class="carousel-dot ${i === 0 ? "active" : ""}"
        aria-label="Go to grant ${i + 1}"
        data-index="${i}">
      </button>
    `).join("");
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) index = grants.length - 1;
    if (index >= grants.length) index = 0;
    currentIndex = index;
    updateCarousel();
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScroll = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 9000);
  }

  function stopAutoScroll() {
    if (autoScroll) clearInterval(autoScroll);
  }

  renderSlides();
  renderDots();
  updateCarousel();
  startAutoScroll();

  prevBtn?.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goToSlide(currentIndex + 1));

  dotsContainer.addEventListener("click", (e) => {
    const dot = e.target.closest(".carousel-dot");
    if (!dot) return;
    goToSlide(Number(dot.dataset.index));
  });

  carousel?.addEventListener("mouseenter", stopAutoScroll);
  carousel?.addEventListener("mouseleave", startAutoScroll);
}