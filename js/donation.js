fetch("/content/donation.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load donation data: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const campaign = data.campaign || {};

    const titleEl = document.querySelector("#donation-campaign-title");
    const imageWrap = document.querySelector("#donation-campaign-image-wrap");
    const letterEl = document.querySelector("#donation-campaign-letter");
    const signatureEl = document.querySelector("#donation-campaign-signature");

    if (titleEl) {
      titleEl.textContent = campaign.title || "Campaign";
    }

    if (imageWrap && campaign.image) {
      imageWrap.innerHTML = `
        <img
          src="${escapeAttribute(campaign.image)}"
          alt="${escapeAttribute(campaign.title || "Campaign image")}"
          loading="lazy">
      `;
    }

    if (letterEl) {
      letterEl.innerHTML = formatRichText(campaign.letter || "");
    }

    if (signatureEl) {
      signatureEl.textContent = campaign.signature || "";
    }

    const optionsEl = document.querySelector("#donation-options");
    if (optionsEl && Array.isArray(data.giving_options)) {
      data.giving_options.forEach((item) => {
        const card = document.createElement("article");
        card.className = "donation-option-card";

        card.innerHTML = `
          ${item.image ? `
            <div class="donation-option-image-wrap">
              <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.title || "")}" loading="lazy">
            </div>
          ` : ""}
          <div class="donation-option-body">
            <h3 class="donation-option-title">${escapeHtml(item.title || "")}</h3>
            <div class="donation-body">${formatRichText(item.text || "")}</div>
            ${item.linkUrl && item.linkText ? `
              <p class="donation-option-link-wrap">
                <a class="donation-link" href="${escapeAttribute(item.linkUrl)}" target="_blank" rel="noopener noreferrer">
                  ${escapeHtml(item.linkText)}
                </a>
              </p>
            ` : ""}
          </div>
        `;

        optionsEl.appendChild(card);
      });
    }
  })
  .catch((error) => {
    console.error("Error loading donation page:", error);
  });

function formatRichText(text) {
  if (!text) return "";

  const escaped = escapeHtml(text);
  const withBold = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return withBold
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
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