// ===============================
//  NAV ACTIVE HIGHLIGHT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});

// ===============================
//  PACKAGE DATA (Assignment 6 Requirement)
// ===============================
const packagesData = [
  { id: 1, destination: "Paris", durationDays: 7, basePrice: 1200, season: "peak" },
  { id: 2, destination: "Maldives", durationDays: 5, basePrice: 950, season: "mid" },
  { id: 3, destination: "Dubai", durationDays: 4, basePrice: 800, season: "off" },
  { id: 4, destination: "Switzerland", durationDays: 10, basePrice: 2500, season: "peak" }
];

// Seasonal multipliers
function getSeasonMultiplier(season) {
  switch (season) {
    case "peak": return 1.5;
    case "mid": return 1.2;
    case "off": return 1.0;
    default: return 1.0;
  }
}

// Weekend surcharge
function weekendSurcharge() {
  const today = new Date();
  return (today.getDay() === 6 || today.getDay() === 0) ? 1.1 : 1.0;
}

// Render packages table (Assignment 6 requirement)
function renderPackages() {
  const tableBody = document.getElementById("packages-body");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  packagesData.forEach(pkg => {
    const finalPrice = pkg.basePrice * getSeasonMultiplier(pkg.season) * weekendSurcharge();

    const row = `
      <tr>
        <td>${pkg.destination}</td>
        <td>${pkg.durationDays} Days</td>
        <td>$${pkg.basePrice}</td>
        <td>$${finalPrice.toFixed(2)}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

renderPackages();


// ===============================
//  BOOKING PRICE CALCULATION
// ===============================
const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
  const destinationSelect = document.getElementById("destination");
  const packageSelect = document.getElementById("packageType");
  const startDate = document.getElementById("start-date");
  const endDate = document.getElementById("end-date");
  const guestsInput = document.getElementById("guests");
  const promoInput = document.getElementById("promo");
  const totalPriceEl = document.getElementById("totalPrice");
  const submitBtn = document.getElementById("submitBtn");

  function calculatePrice() {
    const dest = destinationSelect.value;
    const pkgType = packageSelect.value;
    const guests = parseInt(guestsInput.value) || 1;

    if (!dest || !pkgType || !startDate.value || !endDate.value) {
      totalPriceEl.textContent = 0;
      submitBtn.disabled = true;
      return;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    const nights = Math.ceil((end - start) / (1000 * 3600 * 24));
    if (nights <= 0) {
      totalPriceEl.textContent = 0;
      submitBtn.disabled = true;
      return;
    }

    const pkg = packagesData.find(p => p.destination === dest);
    let pricePerNight = pkg.basePrice / pkg.durationDays;

    // Package type multiplier
    switch (pkgType) {
      case "Economy": break;
      case "Standard": pricePerNight *= 1.3; break;
      case "Luxury": pricePerNight *= 1.6; break;
    }

    // Guests multiplier
    if (guests > 2) pricePerNight *= 1.2;

    let total = pricePerNight * nights;

    // Promo code
    switch (promoInput.value.trim().toUpperCase()) {
      case "EARLYBIRD": total *= 0.9; break;
      case "NEWUSER": total *= 0.85; break;
      case "FESTIVE": total *= 0.8; break;
    }

    totalPriceEl.textContent = total.toFixed(2);
    submitBtn.disabled = false;
  }

  bookingForm.addEventListener("input", calculatePrice);
}


// ===============================
//  GALLERY MODAL (data-large attribute)
// ===============================
const images = document.querySelectorAll("[data-large]");
const modal = document.createElement("div");
modal.id = "imageModal";
modal.innerHTML = `
  <div class="modal-content">
    <span id="closeModal">&times;</span>
    <img id="modalImg" src="">
    <p id="modalCaption"></p>
  </div>
`;
document.body.appendChild(modal);

const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const closeModal = document.getElementById("closeModal");

images.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.dataset.large;
    modalCaption.textContent = img.alt;
  });
});

closeModal.onclick = () => modal.style.display = "none";

window.onclick = e => {
  if (e.target == modal) modal.style.display = "none";
};
