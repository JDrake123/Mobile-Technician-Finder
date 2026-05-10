// Hero Section image slider
const heroSection = document.querySelector(".heroSection");
const Images = [
  "url(Images/Img1.jpg)",
  "url(Images/Img2.jpg)",
  "url(Images/Img3.jpg)",
  "url(Images/Img4.jpg)",
  "url(Images/Img5.jpg)",
  "url(Images/Img6.jpg)",
];
let i = 0;
function changeBackgroundImage() {
  heroSection.style.backgroundImage = Images[i];
  i++;
  if (i === Images.length) {
    i = 0;
  }
}
setInterval(changeBackgroundImage, 3500);
window.onload = changeBackgroundImage();

// Pricing Estimate

// 1. BRAND LIST (with factor multipliers)
// each factor reflects brand parts / complexity (higher = expensive)
const BRANDS = [
  { name: "Apple", factor: 2.0 },
  { name: "Samsung", factor: 1.7 },
  { name: "Google Pixel", factor: 1.9 },
  { name: "OnePlus", factor: 1.5 },
  { name: "Sony", factor: 1.5 },
  { name: "Xiaomi", factor: 1.3 },
  { name: "Oppo", factor: 1.2 },
  { name: "Vivo", factor: 1.2 },
  { name: "Realme", factor: 1.1 },
  { name: "Motorola", factor: 1.1 },
  { name: "Tecno", factor: 1.0 },
  { name: "Infinix", factor: 1.0 },
  { name: "Itel", factor: 0.9 },
  { name: "Nokia", factor: 1.0 },
  { name: "Asus", factor: 1.3 },
];

// 2. ISSUE LIST : with base cost (UGX before brand factor & ×4)
// baseCostUGX will be multiplied by brandFactor and then by 4
const ISSUES = [
  {
    id: "brokenScreen",
    label: "💔 Broken Screen / LCD",
    baseCostUGX: 18500,
    timeEstimate: "2-3 hours (screen replacement)",
  },
  {
    id: "chargingPort",
    label: "🔌 Charging port not working",
    baseCostUGX: 10500,
    timeEstimate: "1-2 hours",
  },
  {
    id: "battery",
    label: "🔋 Battery draining / not holding charge",
    baseCostUGX: 12000,
    timeEstimate: "1-1.5 hours",
  },
  {
    id: "waterDamage",
    label: "💧 Water / Liquid damage",
    baseCostUGX: 25500,
    timeEstimate: "3-5 days (deep cleaning & repair)",
  },
  {
    id: "camera",
    label: "📸 Camera not working / blurry",
    baseCostUGX: 14200,
    timeEstimate: "1.5-2 hours",
  },
  {
    id: "speaker",
    label: "🔊 Speaker issues / no sound",
    baseCostUGX: 7500,
    timeEstimate: "1 hour",
  },
  {
    id: "microphone",
    label: "🎙️ Microphone not working",
    baseCostUGX: 7500,
    timeEstimate: "1 hour",
  },
  {
    id: "softwareIssues",
    label: "🔄 Software issues / boot loop / freezing",
    baseCostUGX: 6500,
    timeEstimate: "1-3 hours (diagnosis + fix)",
  },
];

// maps for quick lookup
const issueTimeMap = new Map();
const issueBaseCostMap = new Map();
ISSUES.forEach((issue) => {
  issueTimeMap.set(issue.id, issue.timeEstimate);
  issueBaseCostMap.set(issue.id, issue.baseCostUGX);
});

// DOM elements
const brandSelect = document.getElementById("brandSelect");
const issueSelect = document.getElementById("issueSelect");
const priceDisplaySpan = document.getElementById("priceDisplay");
const timeDisplaySpan = document.getElementById("timeDisplay");

// populate brand dropdown
function populateBrands() {
  brandSelect.innerHTML = "";
  BRANDS.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand.name;
    option.textContent = brand.name;
    brandSelect.appendChild(option);
  });
  if (BRANDS.length) {
    brandSelect.value = "Apple";
  }
}

// populate issues dropdown
function populateIssues() {
  issueSelect.innerHTML = "";
  ISSUES.forEach((issue) => {
    const option = document.createElement("option");
    option.value = issue.id;
    option.textContent = issue.label;
    issueSelect.appendChild(option);
  });
  if (ISSUES.length) {
    issueSelect.value = "brokenScreen";
  }
}

// get brand factor
function getBrandFactor(brandName) {
  const foundBrand = BRANDS.find((b) => b.name === brandName);
  return foundBrand ? foundBrand.factor : 1.0;
}

// compute final price: baseCostUGX * brandFactor * 4
function computeFinalPrice(brandName, issueId) {
  const baseCost = issueBaseCostMap.get(issueId);
  if (baseCost === undefined) return 0;
  const brandFactor = getBrandFactor(brandName);
  const rawPrice = baseCost * brandFactor * 4;
  return Math.round(rawPrice);
}

// get repair time from issue id
function getRepairTime(issueId) {
  return issueTimeMap.get(issueId) || "Estimate unavailable";
}

// update main display
function updateEstimate() {
  const selectedBrand = brandSelect.value;
  const selectedIssueId = issueSelect.value;

  if (!selectedBrand || !selectedIssueId) {
    priceDisplaySpan.textContent = "— UGX";
    timeDisplaySpan.textContent = "—";
    return;
  }

  const finalUGX = computeFinalPrice(selectedBrand, selectedIssueId);
  const formattedPrice = new Intl.NumberFormat("en-UG").format(finalUGX);
  priceDisplaySpan.textContent = `UGX ${formattedPrice}`;
  const repairTime = getRepairTime(selectedIssueId);
  timeDisplaySpan.textContent = repairTime;
}

// optional brand note for premium brands (high factor)
function refreshExtraNote() {
  const brand = brandSelect.value;
  const factor = getBrandFactor(brand);
  let existingNote = document.querySelector(".brand-note-micro");
  if (existingNote) existingNote.remove();

  if (factor >= 1.6) {
    const resultPanel = document.getElementById("resultPanel");
    const extraDiv = document.createElement("div");
    extraDiv.className = "brand-note-micro";
    extraDiv.innerHTML = `🔧 ${brand} repairs require specialized tools/parts → factor ${factor.toFixed(1)}x applied (then ×4).`;
    resultPanel.appendChild(extraDiv);
  }
}

// attach event listeners
function attachEvents() {
  brandSelect.addEventListener("change", () => {
    updateEstimate();
    refreshExtraNote();
  });
  issueSelect.addEventListener("change", () => {
    updateEstimate();
    refreshExtraNote();
  });
}

// initialization
function init() {
  populateBrands();
  populateIssues();
  attachEvents();
  updateEstimate();
  refreshExtraNote();
}

init();

// Contact Part
// DATABASE OF MOBILE TECHNICIANS (workshops)
const technicians = [
  {
    id: 1,
    workshop: "iFix Masters Kampala",
    technician: "Brian Wasswa",
    phone: "+256 782 123 456",
    email: "ifix@techcare.ug",
    location: "Wandegeya, near Makerere",
    repairs: [
      "Broken Screen",
      "Battery Replacement",
      "Water Damage Repair",
      "Charging Port Fix",
      "Motherboard Repair",
    ],
  },
  {
    id: 2,
    workshop: "Samsung & Apple Pro Center",
    technician: "Aisha Nambi",
    phone: "+256 701 987 654",
    email: "aisha@prorepairs.ug",
    location: "Kampala Road, Jubilee House",
    repairs: [
      "Broken Screen",
      "Battery Issues",
      "Software Troubleshooting",
      "Camera Repair",
      "Speaker Replacement",
    ],
  },
  {
    id: 3,
    workshop: "Tecno/Infinix Care Hub",
    technician: "Robert Kato",
    phone: "+256 752 334 221",
    email: "robert.k@phonemedic.ug",
    location: "Nakivubo, near Ham Shopping",
    repairs: [
      "Charging Port",
      "Screen Replacement",
      "Battery Draining",
      "Microphone Repair",
      "Water Damage",
    ],
  },
  {
    id: 4,
    workshop: "Uganda Phone Surgeons",
    technician: "Grace Mutesi",
    phone: "+256 789 112 233",
    email: "grace@phonesurgeons.ug",
    location: "Ntinda Complex, 2nd floor",
    repairs: [
      "Motherboard Repair",
      "Broken Screen",
      "Battery Not Charging",
      "Software Boot Loop",
      "Camera Issues",
    ],
  },
  {
    id: 5,
    workshop: "Pixel & OnePlus Experts",
    technician: "Derrick Ochieng",
    phone: "+256 703 456 789",
    email: "derrick@pixelex.ug",
    location: "Acacia Mall, Kisementi",
    repairs: [
      "Display Replacement",
      "Battery Calibration",
      "Charging IC",
      "Speaker Crackling",
      "Water Damage Cleanup",
    ],
  },
  {
    id: 6,
    workshop: "Mobile Medic - All Brands",
    technician: "Patricia Namirembe",
    phone: "+256 700 998 887",
    email: "patty@mobilemedic.ug",
    location: "Clock Tower, opposite Total",
    repairs: [
      "Broken Screen",
      "Charging Port",
      "Battery Fix",
      "Audio Problems",
      "Screen Ghost Touch",
    ],
  },
  {
    id: 7,
    workshop: "Xiaomi & Realme Care",
    technician: "Hussein Mukiibi",
    phone: "+256 772 665 544",
    email: "hussein@xiaomirep.ug",
    location: "Kireka, Bweyogerere",
    repairs: [
      "Battery Replacement",
      "Back Glass Repair",
      "USB Port",
      "Software Update Issues",
      "Camera Blur",
    ],
  },
  {
    id: 8,
    workshop: "QuickFix Phone Lab",
    technician: "Shakira Nankya",
    phone: "+256 758 777 333",
    email: "contact@quickfix.ug",
    location: "Makindye, Lukuli Road",
    repairs: [
      "Screen Repair",
      "Microphone/Speaker",
      "Motherboard Faults",
      "Overheating Issues",
      "Charging Problems",
    ],
  },
  {
    id: 9,
    workshop: "Smartphone ER",
    technician: "Emmanuel Okello",
    phone: "+256 783 999 212",
    email: "emma@smarter.ug",
    location: "Najjanankumbi, near Zana",
    repairs: [
      "Water/Liquid Damage",
      "Dead Boot Repair",
      "Earpiece Not Working",
      "Battery Expansion",
      "LCD Replacement",
    ],
  },
];

// Helper: normalise strings for search (case-insensitive)
function matchesSearch(tech, query) {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();
  return (
    tech.workshop.toLowerCase().includes(lowerQuery) ||
    tech.technician.toLowerCase().includes(lowerQuery) ||
    tech.location.toLowerCase().includes(lowerQuery) ||
    tech.phone.includes(lowerQuery) ||
    tech.email.toLowerCase().includes(lowerQuery)
  );
}

// Helper: filter by repair type
function matchesRepairType(tech, repairFilterValue) {
  if (repairFilterValue === "all") return true;
  const filterMap = {
    screen: [
      "Broken Screen",
      "Screen Replacement",
      "Display Replacement",
      "LCD Replacement",
      "Screen Glass Only",
      "Screen Ghost Touch",
      "Back Glass Repair",
    ],
    battery: [
      "Battery Replacement",
      "Battery Draining",
      "Battery Issues",
      "Battery Not Charging",
      "Battery Calibration",
      "Battery Fix",
      "Battery Expansion",
      "Battery Renew",
    ],
    charging: [
      "Charging Port",
      "Charging Port Fix",
      "USB Port",
      "Charging Port Soldering",
      "Charging IC",
    ],
    water: [
      "Water Damage Repair",
      "Water Damage",
      "Water/Liquid Damage",
      "Water Damage Cleanup",
    ],
    software: [
      "Software Troubleshooting",
      "Software Boot Loop",
      "Software Update Issues",
      "Software Crash",
      "Dead Boot Repair",
    ],
    camera: ["Camera Repair", "Camera Issues", "Camera Blur"],
    audio: [
      "Speaker Replacement",
      "Speaker Crackling",
      "Audio Problems",
      "Microphone Repair",
      "Earpiece Not Working",
    ],
    motherboard: ["Motherboard Repair", "Motherboard Faults", "Motherboard"],
  };
  const keywords = filterMap[repairFilterValue] || [];
  if (keywords.length === 0) return true;
  return tech.repairs.some((repair) =>
    keywords.some((keyword) =>
      repair.toLowerCase().includes(keyword.toLowerCase()),
    ),
  );
}

// render the grid
const gridContainer = document.getElementById("technicianGrid");
const searchInput = document.getElementById("searchInput");
const repairFilterSelect = document.getElementById("repairTypeFilter");

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

function renderTechnicians() {
  const searchTerm = searchInput.value.trim();
  const repairFilter = repairFilterSelect.value;

  const filtered = technicians.filter((tech) => {
    return (
      matchesSearch(tech, searchTerm) && matchesRepairType(tech, repairFilter)
    );
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `<div class="no-results">🔎 No technicians found matching “${escapeHtml(searchTerm) || repairFilter}” <br> Try different keywords or reset filters.</div>`;
    return;
  }

  let cardsHTML = "";
  filtered.forEach((tech) => {
    const repairTags = tech.repairs
      .slice(0, 5)
      .map((rep) => `<span class="repair-tag">${escapeHtml(rep)}</span>`)
      .join("");
    cardsHTML += `
      <div class="tech-card">
        <div class="card-badge">
          <span>📱 certified</span>
          <span>⭐ ${Math.floor(Math.random() * 2) + 4}.${Math.floor(Math.random() * 9)} (${Math.floor(Math.random() * 50) + 20} reviews)</span>
        </div>
        <div class="card-content">
          <div class="workshop-name">
            🔧 ${escapeHtml(tech.workshop)}
          </div>
          <div class="technician-name">
            👤 ${escapeHtml(tech.technician)} • ${escapeHtml(tech.location)}
          </div>
          <div class="contact-info">
            <div class="contact-row">
              <span class="contact-icon">📞</span>
              <span class="contact-detail">${escapeHtml(tech.phone)}</span>
            </div>
            <div class="contact-row">
              <span class="contact-icon">✉️</span>
              <span class="contact-detail">${escapeHtml(tech.email)}</span>
            </div>
            <div class="contact-row">
              <span class="contact-icon">📍</span>
              <span class="contact-detail">${escapeHtml(tech.location)}</span>
            </div>
          </div>
          <div class="repair-list">
            <div class="repair-title">🛠️ WHAT THEY REPAIR</div>
            <div class="repair-types">
              ${repairTags}
              ${tech.repairs.length > 5 ? `<span class="repair-tag">+${tech.repairs.length - 5} more</span>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  gridContainer.innerHTML = cardsHTML;
}

// event listeners
searchInput.addEventListener("input", () => renderTechnicians());
repairFilterSelect.addEventListener("change", () => renderTechnicians());

// initial render
renderTechnicians();
