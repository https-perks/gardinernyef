function buildGrantCarousel(grants, trackId, dotsId) {

  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);

  if (!track) return;

  let currentIndex = 0;

  function renderSlides() {

    track.innerHTML = grants.map(grant => {

      const sponsor = grant.sponsor
        ? `<p><strong>Sponsor:</strong> ${grant.sponsor}</p>`
        : "";

      return `
        <article class="grant-slide">

          <div class="grant-slide-copy">
            <h3 class="grant-slide-title">${grant.title}</h3>
            <p><strong>Awarded To:</strong> ${grant.awardedTo}</p>
            ${sponsor}
            <p>${grant.description}</p>
          </div>
        </article>
      `;
    }).join("");

  }

  function renderDots() {

    dotsContainer.innerHTML = grants.map((_, i) =>
      `<button class="carousel-dot ${i===0?'active':''}" data-index="${i}"></button>`
    ).join("");

  }

  function updateCarousel() {

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    dots.forEach((dot,i)=>{
      dot.classList.toggle("active", i === currentIndex);
    });

  }

  function goToSlide(index){

    if(index < 0) index = grants.length - 1;
    if(index >= grants.length) index = 0;

    currentIndex = index;

    updateCarousel();
  }

  renderSlides();
  renderDots();
  updateCarousel();

  dotsContainer.addEventListener("click", e=>{
    const dot = e.target.closest(".carousel-dot");
    if(!dot) return;
    goToSlide(Number(dot.dataset.index));
  });
let autoScroll = setInterval(() => {
  goToSlide(currentIndex + 1);
}, 7000);
track.addEventListener("mouseenter", () => {
  clearInterval(autoScroll);
});

track.addEventListener("mouseleave", () => {
  autoScroll = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 5000);
});
}