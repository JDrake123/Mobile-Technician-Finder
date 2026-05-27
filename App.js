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

// Contact Section
const technicians = [
  {
    name: "Brian Mobile Fix",
    email: "brianfix@gmail.com",
    phone: "+256 700 123 456",
    repairs: [
      "Screen Replacement",
      "Battery Replacement",
      "Charging Port Repair",
    ],
    location: "Kampala Central, Uganda",
  },
  {
    name: "Smart Repair Hub",
    email: "info@smartrepairhub.com",
    phone: "+256 781 555 230",
    repairs: ["Water Damage Repair", "Software Problems", "Data Recovery"],
    location: "Nansana, Wakiso",
  },
  {
    name: "QuickTech Services",
    email: "quicktechservices@gmail.com",
    phone: "+256 774 908 112",
    repairs: ["Camera Repair", "Speaker Repair", "Microphone Issues"],
    location: "Mbarara City",
  },
  {
    name: "Elite Phone Doctors",
    email: "elitedoctors@yahoo.com",
    phone: "+256 712 334 890",
    repairs: ["Screen Replacement", "Battery Replacement", "Power Issues"],
    location: "Jinja Town",
  },
  {
    name: "FixPro Mobile Center",
    email: "contact@fixpromobile.com",
    phone: "+256 760 223 901",
    repairs: [
      "Charging Port Repair",
      "Software Problems",
      "Unlocking Services",
    ],
    location: "Gulu City",
  },
  {
    name: "TechCare Solutions",
    email: "support@techcareug.com",
    phone: "+256 753 445 120",
    repairs: ["Screen Replacement", "Camera Repair", "Face ID Repair"],
    location: "Mukono",
  },
  {
    name: "Phone Rescue Uganda",
    email: "rescuephones@gmail.com",
    phone: "+256 701 889 332",
    repairs: ["Battery Replacement", "Water Damage Repair", "Speaker Repair"],
    location: "Entebbe",
  },
  {
    name: "Digital Mobile Experts",
    email: "digitalexperts@yahoo.com",
    phone: "+256 785 661 777",
    repairs: ["Software Problems", "Data Recovery", "Unlocking Services"],
    location: "Masaka",
  },
  {
    name: "Prime Gadget Repair",
    email: "primegadgets@gmail.com",
    phone: "+256 750 992 188",
    repairs: ["Charging Port Repair", "Microphone Issues", "Power Issues"],
    location: "Fort Portal",
  },
  {
    name: "Galaxy Phone Clinic",
    email: "galaxyclinic@repairmail.com",
    phone: "+256 709 774 552",
    repairs: ["Screen Replacement", "Battery Replacement", "Software Problems"],
    location: "Mbale",
  },
];

const filterSelect = document.getElementById("repairFilter");
const technicianGrid = document.getElementById("technicianGrid");
const resultCount = document.getElementById("resultCount");

function getUniqueRepairs() {
  const repairs = new Set();

  technicians.forEach((tech) => {
    tech.repairs.forEach((repair) => {
      repairs.add(repair);
    });
  });

  return [...repairs].sort();
}

function populateFilter() {
  const repairs = getUniqueRepairs();

  repairs.forEach((repair) => {
    const option = document.createElement("option");

    option.value = repair;
    option.textContent = repair;

    filterSelect.appendChild(option);
  });
}

function renderTechnicians(filterValue = "all") {
  technicianGrid.innerHTML = "";

  const filteredTechnicians = technicians.filter((tech) => {
    if (filterValue === "all") {
      return true;
    }

    return tech.repairs.includes(filterValue);
  });

  resultCount.textContent = `${filteredTechnicians.length} technician(s) found`;

  if (filteredTechnicians.length === 0) {
    technicianGrid.innerHTML = `
      <div class="empty">
        No technicians found for this repair type.
      </div>
    `;

    return;
  }

  filteredTechnicians.forEach((tech) => {
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <div class="name">${tech.name}</div>

      <div class="badge">
        Mobile Phone Technician
      </div>

      <div class="info">
        <div><span>Email:</span> ${tech.email}</div>

        <div><span>Phone:</span> ${tech.phone}</div>

        <div>
          <span>Repairs:</span>
          ${tech.repairs.join(", ")}
        </div>
      </div>

      <div class="location">
        <span>Location:</span> ${tech.location}
      </div>
    `;

    technicianGrid.appendChild(card);
  });
}

populateFilter();

renderTechnicians();

filterSelect.addEventListener("change", (e) => {
  renderTechnicians(e.target.value);
});


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
  const rawPrice = baseCost * brandFactor * 3;
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

