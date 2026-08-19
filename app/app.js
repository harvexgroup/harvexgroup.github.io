const KEY = "harvex-demo-v1";

const defaultData = {
  listings: [],
  storage: [],
  matches: 0,
  profile: {
    name: "Farmer Account",
    role: "Farmer • HARVEX Hub"
  }
};

const buyers = [
  {
    name: "Seaside Grand Resort",
    type: "Resort",
    produce: "Tomatoes",
    quantity: "250 kg/week",
    location: "South Goa",
    icon: "🏨"
  },
  {
    name: "Green Leaf Restaurant",
    type: "Restaurant",
    produce: "Leafy Greens",
    quantity: "80 kg/week",
    location: "Margao",
    icon: "🍽️"
  },
  {
    name: "FreshMart Retail",
    type: "Retailer",
    produce: "Onions",
    quantity: "400 kg/week",
    location: "Goa",
    icon: "🛒"
  },
  {
    name: "Palm Bay Resort",
    type: "Resort",
    produce: "Bananas",
    quantity: "150 kg/week",
    location: "North Goa",
    icon: "🏨"
  },
  {
    name: "Local Harvest Restaurant",
    type: "Restaurant",
    produce: "Chillies",
    quantity: "50 kg/week",
    location: "Cuncolim",
    icon: "🍽️"
  },
  {
    name: "Goa Fresh Wholesale",
    type: "Retailer",
    produce: "Potatoes",
    quantity: "500 kg/week",
    location: "Goa",
    icon: "📦"
  }
];

let data = loadData();

function loadData() {
  try {
    return {
      ...defaultData,
      ...JSON.parse(localStorage.getItem(KEY) || "{}")
    };
  } catch {
    return { ...defaultData };
  }
}

function saveData() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function toast(message) {
  const el = document.getElementById("toast");

  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, 2300);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav").forEach(nav => {
    nav.classList.toggle(
      "active",
      nav.dataset.go === id
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  renderAll();
}

document.addEventListener("click", event => {

  const goButton = event.target.closest("[data-go]");

  if (goButton) {
    showScreen(goButton.dataset.go);
  }

});


function renderStats() {

  const listings = document.getElementById("statListings");
  const stored = document.getElementById("statStored");
  const matches = document.getElementById("statMatches");

  if (listings) {
    listings.textContent = data.listings.length;
  }

  if (stored) {
    stored.textContent = data.storage.length;
  }

  if (matches) {
    matches.textContent = data.matches;
  }

}


function renderListings() {

  const container = document.getElementById("listingList");

  if (!container) return;

  if (!data.listings.length) {

    container.innerHTML = `
      <div class="info-note">
        <b>No produce listed yet.</b>
        <br><br>
        Start by adding your first crop to the HARVEX marketplace.
      </div>
    `;

    return;
  }

  container.innerHTML = data.listings.map(item => `

    <div class="list-card">

      <div>

        <h3>
          🌾 ${escapeHTML(item.produce)}
        </h3>

        <p>
          ${item.qty} kg • ${escapeHTML(item.quality)}
          <br>
          Available: ${escapeHTML(item.date)}
          <br>
          ${escapeHTML(item.storage)}
        </p>

        <span class="status">
          ${escapeHTML(item.status)}
        </span>

      </div>

      <div>

        <div class="price">
          ${money(item.price)}/kg
        </div>

        <button
          class="secondary small-btn"
          onclick="findMatch(${item.id})"
        >
          Find Match
        </button>

      </div>

    </div>

  `).join("");

}


function renderBuyers(filter = "All") {

  const container = document.getElementById("buyerList");

  if (!container) return;

  const filtered = filter === "All"
    ? buyers
    : buyers.filter(buyer => buyer.type === filter);

  container.innerHTML = filtered.map(buyer => `

    <div class="list-card">

      <div>

        <h3>
          ${buyer.icon} ${escapeHTML(buyer.name)}
        </h3>

        <p>
          <b>${escapeHTML(buyer.produce)}</b>
          <br>
          Demand: ${escapeHTML(buyer.quantity)}
          <br>
          📍 ${escapeHTML(buyer.location)}
        </p>

        <span class="status">
          ${escapeHTML(buyer.type)} • Verified buyer
        </span>

      </div>

      <button
        class="primary small-btn"
        onclick="connectBuyer('${escapeAttr(buyer.name)}')"
      >
        Connect
      </button>

    </div>

  `).join("");

}


function renderDemandPreview() {

  const container = document.getElementById("demandPreview");

  if (!container) return;

  container.innerHTML = buyers.slice(0, 3).map(buyer => `

    <div class="demand">

      <span class="badge">
        ${escapeHTML(buyer.type)}
      </span>

      <h3>
        ${buyer.icon} ${escapeHTML(buyer.produce)}
      </h3>

      <p>
        ${escapeHTML(buyer.name)}
      </p>

      <div class="qty">
        ${escapeHTML(buyer.quantity)}
      </div>

    </div>

  `).join("");

}


function renderStorage() {

  const container = document.getElementById("storageHistory");

  if (!container) return;

  if (!data.storage.length) {

    container.innerHTML = `
      <div class="info-note">
        No storage requests yet.
      </div>
    `;

    return;
  }

  container.innerHTML = `

    <div class="history-title">
      Recent Storage Requests
    </div>

    ${data.storage.map(item => `

      <div class="history-item">

        📦 <b>${escapeHTML(item.produce)}</b>

        <br>

        ${item.qty} kg • ${item.days} days

        <br>

        <span class="status">
          ${escapeHTML(item.status)}
        </span>

      </div>

    `).join("")}

  `;

}


function renderProfile() {

  const name = document.getElementById("profileName");
  const role = document.getElementById("profileRole");

  if (name) {
    name.textContent = data.profile.name;
  }

  if (role) {
    role.textContent = data.profile.role;
  }

}


function renderAll() {

  renderStats();
  renderListings();
  renderDemandPreview();
  renderStorage();
  renderProfile();

}


document.addEventListener("submit", event => {

  if (event.target.id === "produceForm") {

    event.preventDefault();

    const item = {

      id: Date.now(),

      produce:
        document.getElementById("produce").value,

      qty:
        Number(document.getElementById("qty").value),

      price:
        Number(document.getElementById("price").value),

      quality:
        document.getElementById("quality").value,

      storage:
        document.getElementById("storage").value,

      date:
        document.getElementById("date").value,

      notes:
        document.getElementById("notes").value,

      status:
        "Published"

    };

    data.listings.unshift(item);

    saveData();

    event.target.reset();

    toast("🌾 Produce listed successfully!");

    showScreen("listings");

  }


  if (event.target.id === "storageForm") {

    event.preventDefault();

    const item = {

      id: Date.now(),

      produce:
        document.getElementById("sProduce").value,

      qty:
        Number(document.getElementById("sQty").value),

      days:
        Number(document.getElementById("sDays").value),

      status:
        "Storage requested"

    };

    data.storage.unshift(item);

    saveData();

    event.target.reset();

    toast("📦 Storage request sent to HARVEX Hub!");

    renderAll();

  }

});


document.addEventListener("click", event => {

  const filter = event.target.closest(".filter");

  if (filter) {

    document.querySelectorAll(".filter")
      .forEach(button =>
        button.classList.remove("active")
      );

    filter.classList.add("active");

    renderBuyers(filter.dataset.filter);

  }


  if (event.target.id === "editProfile") {

    const name = prompt(
      "Enter farmer name:",
      data.profile.name
    );

    if (name && name.trim()) {

      data.profile.name = name.trim();

      saveData();

      renderProfile();

      toast("Profile updated!");

    }

  }


  if (event.target.id === "languageBtn") {

    alert(
      "HARVEX can provide assisted local-language support for farmers who are not comfortable with technology."
    );

  }


  if (event.target.id === "clearData") {

    const confirmReset = confirm(
      "Reset all HARVEX demo data?"
    );

    if (confirmReset) {

      localStorage.removeItem(KEY);

      data = loadData();

      renderAll();

      toast("Demo data reset.");

    }

  }

});


function connectBuyer(name) {

  data.matches += 1;

  saveData();

  toast(
    "🤝 Connection request sent to " + name
  );

  renderStats();

}


function findMatch(id) {

  const item = data.listings.find(
    listing => listing.id === id
  );

  if (!item) return;

  const matches = buyers.filter(
    buyer =>
      buyer.produce.toLowerCase() ===
      item.produce.toLowerCase()
  );

  if (matches.length) {

    data.matches += 1;

    saveData();

    alert(
      "🤝 Potential buyer match found!\n\n" +
      matches[0].name +
      "\nDemand: " +
      matches[0].quantity +
      "\nLocation: " +
      matches[0].location
    );

    renderStats();

  } else {

    alert(
      "No direct buyer match found yet. HARVEX can continue searching across its buyer network."
    );

  }

}


function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function escapeAttr(value) {

  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");

}


/* PWA INSTALL */

let deferredPrompt;

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt = event;

    const button =
      document.getElementById("installBtn");

    if (button) {
      button.classList.remove("hidden");
    }

  }
);


document.addEventListener("click", async event => {

  if (event.target.id !== "installBtn") return;

  if (!deferredPrompt) {

    toast(
      "Use your browser menu to add HARVEX to your home screen."
    );

    return;

  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

  event.target.classList.add("hidden");

});


/* SERVICE WORKER */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("sw.js")
        .catch(() => {});

    }
  );

}


renderAll();
