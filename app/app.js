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
/* ================= DEMO PAYMENT ================= */

const paymentBox = document.createElement("div");

paymentBox.innerHTML = `
  <style>
    #demoPayBtn{
      position:fixed;
      right:20px;
      bottom:90px;
      z-index:9999;
      background:#b8ef45;
      color:#155c3b;
      border:0;
      border-radius:50px;
      padding:14px 20px;
      font-weight:800;
      cursor:pointer;
      box-shadow:0 6px 20px rgba(0,0,0,.18);
    }

    #paymentModal{
      display:none;
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.55);
      z-index:10000;
      align-items:center;
      justify-content:center;
      padding:20px;
    }

    .payment-card{
      background:white;
      width:min(420px,100%);
      border-radius:24px;
      padding:25px;
      box-shadow:0 20px 50px rgba(0,0,0,.25);
      font-family:Arial,sans-serif;
    }

    .payment-card h2{
      color:#155c3b;
      margin-top:0;
    }

    .pay-row{
      display:flex;
      justify-content:space-between;
      padding:12px 0;
      border-bottom:1px solid #eee;
    }

    .pay-total{
      font-size:22px;
      font-weight:800;
      color:#155c3b;
      margin:18px 0;
    }

    .pay-option{
      display:block;
      padding:12px;
      margin:8px 0;
      background:#f3f8ee;
      border-radius:12px;
    }

    .pay-confirm{
      width:100%;
      padding:14px;
      border:0;
      border-radius:12px;
      background:#155c3b;
      color:white;
      font-size:16px;
      font-weight:800;
      cursor:pointer;
      margin-top:12px;
    }

    .pay-close{
      width:100%;
      padding:11px;
      border:1px solid #ddd;
      border-radius:12px;
      background:white;
      margin-top:8px;
      cursor:pointer;
    }

    #paymentSuccess{
      display:none;
      text-align:center;
    }

    .success-circle{
      font-size:55px;
      margin:10px;
    }
  </style>

  <button id="demoPayBtn">💳 Demo Payment</button>

  <div id="paymentModal">

    <div class="payment-card">

      <div id="paymentForm">

        <h2>🧾 Confirm Order</h2>

        <div class="pay-row">
          <span>Buyer</span>
          <b>HARVEX Resort Partner</b>
        </div>

        <div class="pay-row">
          <span>Produce</span>
          <b>Tomatoes</b>
        </div>

        <div class="pay-row">
          <span>Quantity</span>
          <b>100 kg</b>
        </div>

        <div class="pay-row">
          <span>Price</span>
          <b>₹30/kg</b>
        </div>

        <div class="pay-total">
          Total: ₹3,000
        </div>

        <h3>Choose Payment Method</h3>

        <label class="pay-option">
          <input type="radio" name="demoPayment" checked>
          UPI
        </label>

        <label class="pay-option">
          <input type="radio" name="demoPayment">
          Bank Transfer
        </label>

        <label class="pay-option">
          <input type="radio" name="demoPayment">
          Secure Escrow
        </label>

        <button class="pay-confirm" id="confirmDemoPayment">
          💳 Pay ₹3,000
        </button>

        <button class="pay-close" id="closePayment">
          Cancel
        </button>

      </div>


      <div id="paymentSuccess">

        <div class="success-circle">✅</div>

        <h2>Payment Successful!</h2>

        <p>
          Order confirmed successfully.
        </p>

        <div class="pay-total">
          ₹3,000
        </div>

        <p>
          🌾 Produce: Tomatoes<br>
          📦 Quantity: 100 kg<br>
          🏨 Buyer: HARVEX Resort Partner
        </p>

        <button class="pay-confirm" id="finishPayment">
          Done
        </button>

      </div>

    </div>

  </div>
`;


document.body.appendChild(paymentBox);


document.getElementById("demoPayBtn").onclick = function(){

  document.getElementById("paymentModal").style.display = "flex";

};


document.getElementById("closePayment").onclick = function(){

  document.getElementById("paymentModal").style.display = "none";

};


document.getElementById("confirmDemoPayment").onclick = function(){

  document.getElementById("paymentForm").style.display = "none";

  document.getElementById("paymentSuccess").style.display = "block";

};


document.getElementById("finishPayment").onclick = function(){

  document.getElementById("paymentModal").style.display = "none";

  document.getElementById("paymentForm").style.display = "block";

  document.getElementById("paymentSuccess").style.display = "none";

  alert("✅ Sale completed successfully!");

};


renderAll();
