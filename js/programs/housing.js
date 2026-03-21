fetch("/content/housing.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load housing data: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const linkWrap = document.querySelector("#housing-featured-link");
    if (linkWrap && data.featured_link?.url && data.featured_link?.text) {
      linkWrap.innerHTML = `
        <a class="housing-link" href="${escapeAttribute(data.featured_link.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(data.featured_link.text)}
        </a>
      `;
    }

    const highlightsEl = document.querySelector("#housing-highlights");
    if (highlightsEl && Array.isArray(data.highlights)) {
      data.highlights.forEach((item) => {
        const card = document.createElement("article");
        card.className = "housing-highlight-card";
        card.innerHTML = `
          <h3 class="housing-highlight-title">${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.text || "")}</p>
        `;
        highlightsEl.appendChild(card);
      });
    }

    if (data.video?.enabled && data.video?.embed) {
      const wrap = document.querySelector("#housing-video-wrap");
      if (wrap) {
        wrap.innerHTML = `
          <div class="housing-video-frame">
            <iframe
              src="${escapeAttribute(data.video.embed)}"
              title="Housing Initiative Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen>
            </iframe>
          </div>
        `;
      }

      const captionEl = document.querySelector("#housing-video-caption");
      if (captionEl) captionEl.textContent = data.video.caption || "";
    } else {
      const section = document.querySelector("#housing-video-section");
      if (section) section.style.display = "none";
    }

    setupHousingGallery(Array.isArray(data.gallery) ? data.gallery : []);
  })
  .catch((error) => {
    console.error("Error loading housing page:", error);
  });

function setupHousingGallery(images) {
  const imageA = document.querySelector("#housing-gallery-image-a");
  const imageB = document.querySelector("#housing-gallery-image-b");
  const prevBtn = document.querySelector("#housing-prev");
  const nextBtn = document.querySelector("#housing-next");

  if (!imageA || !imageB || !prevBtn || !nextBtn || !images.length) {
    const gallerySection = document.querySelector(".housing-gallery-section");
    if (gallerySection && !images.length) {
      gallerySection.style.display = "none";
    }
    return;
  }

  let currentIndex = 0;
  let showingA = true;
  let autoSlide;

  imageA.src = images[0].image || "";
  imageA.alt = images[0].alt || "";
  imageA.classList.add("active");

  function showImage(index) {
    const nextImage = images[index];
    const activeImage = showingA ? imageA : imageB;
    const inactiveImage = showingA ? imageB : imageA;

    inactiveImage.src = nextImage.image || "";
    inactiveImage.alt = nextImage.alt || "";

    inactiveImage.classList.add("active");
    activeImage.classList.remove("active");

    showingA = !showingA;
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function goToPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  function startAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      goToNext();
    }, 5000);
  }

  prevBtn.addEventListener("click", () => {
    goToPrev();
    startAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    goToNext();
    startAutoSlide();
  });

  startAutoSlide();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}