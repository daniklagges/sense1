// assets/js/app.js

// -------- Helpers
const money = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

const getJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// -------- State keys
const KEY_USER = "wallet_user";
const KEY_BALANCE = "wallet_balance";
const KEY_TX = "wallet_transactions";
const KEY_CONTACTS = "wallet_contacts";

// -------- Init defaults (se ejecuta en cualquier página)
(function initWallet() {
  if (!localStorage.getItem(KEY_BALANCE)) localStorage.setItem(KEY_BALANCE, "250000"); // saldo inicial demo
  if (!localStorage.getItem(KEY_TX)) setJSON(KEY_TX, []);
  if (!localStorage.getItem(KEY_CONTACTS)) {
    setJSON(KEY_CONTACTS, [
      { name: "Mamá", email: "mama@email.com" },
      { name: "Amigo", email: "amigo@email.com" }
    ]);
  }
})();

// -------- Auth guard
function requireLogin() {
  const u = localStorage.getItem(KEY_USER);
  if (!u) window.location.href = "login.html";
}

// -------- Login
function handleLogin(e) {
  e.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const pass = document.querySelector("#password").value.trim();

  if (!email || !pass) {
    alert("Completa email y contraseña.");
    return;
  }
  // Simulación: cualquier credencial válida
  localStorage.setItem(KEY_USER, email);
  window.location.href = "menu.html";
}

function handleLogout() {
  localStorage.removeItem(KEY_USER);
  window.location.href = "login.html";
}

// -------- Balance / Transactions
function getBalance() {
  return Number(localStorage.getItem(KEY_BALANCE) || "0");
}

function setBalance(n) {
  localStorage.setItem(KEY_BALANCE, String(n));
}

function addTransaction(type, amount, meta = {}) {
  const tx = getJSON(KEY_TX, []);
  tx.unshift({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type, // "DEPÓSITO" | "ENVÍO"
    amount,
    meta
  });
  setJSON(KEY_TX, tx.slice(0, 20)); // guarda últimos 20
}

// -------- UI renderers
function renderMenu() {
  requireLogin();
  const email = localStorage.getItem(KEY_USER);
  const balance = getBalance();

  const emailEl = document.querySelector("#userEmail");
  const balanceEl = document.querySelector("#balance");

  if (emailEl) emailEl.textContent = email;
  if (balanceEl) balanceEl.textContent = money(balance);
}

function handleDeposit(e) {
  e.preventDefault();
  requireLogin();

  const amount = Number(document.querySelector("#depositAmount").value);
  if (!amount || amount <= 0) return alert("Ingresa un monto válido.");

  const newBalance = getBalance() + amount;
  setBalance(newBalance);
  addTransaction("DEPÓSITO", amount);

  alert("Depósito realizado ✅");
  window.location.href = "menu.html";
}

function renderTransactions() {
  requireLogin();
  const list = document.querySelector("#txList");
  const tx = getJSON(KEY_TX, []);

  if (!list) return;

  if (tx.length === 0) {
    list.innerHTML = `<li class="list-group-item">Aún no hay movimientos.</li>`;
    return;
  }

  list.innerHTML = tx
    .map((t) => {
      const d = new Date(t.date);
      const dateText = d.toLocaleString("es-CL");
      const subtitle =
        t.type === "ENVÍO" ? `→ ${t.meta.to || "contacto"}` : "Ingreso";
      return `
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">${t.type} <span class="text-muted fw-normal">(${subtitle})</span></div>
            <small class="text-muted">${dateText}</small>
          </div>
          <span class="badge ${t.type === "DEPÓSITO" ? "text-bg-success" : "text-bg-danger"} rounded-pill">
            ${t.type === "DEPÓSITO" ? "+" : "-"} ${money(t.amount)}
          </span>
        </li>
      `;
    })
    .join("");
}

// -------- Contacts / Send money
function renderContacts(results = null) {
  requireLogin();
  const container = document.querySelector("#contactResults");
  if (!container) return;

  const contacts = results ?? getJSON(KEY_CONTACTS, []);
  if (contacts.length === 0) {
    container.innerHTML = `<div class="alert alert-warning mb-0">No hay contactos aún.</div>`;
    return;
  }

  container.innerHTML = contacts
    .map(
      (c) => `
      <div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
        <div>
          <div class="fw-semibold">${c.name}</div>
          <div class="text-muted small">${c.email}</div>
        </div>
        <button class="btn btn-sm btn-outline-primary" onclick="selectContact('${c.email}')">
          Elegir
        </button>
      </div>
    `
    )
    .join("");
}

function handleSearchContact(e) {
  e.preventDefault();
  requireLogin();
  const q = document.querySelector("#searchQuery").value.trim().toLowerCase();
  const contacts = getJSON(KEY_CONTACTS, []);
  const filtered = contacts.filter(
    (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  );
  renderContacts(filtered);
}

function selectContact(email) {
  document.querySelector("#selectedContact").value = email;
}

function handleAddContact(e) {
  e.preventDefault();
  requireLogin();

  const name = document.querySelector("#newName").value.trim();
  const email = document.querySelector("#newEmail").value.trim();

  if (!name || !email) return alert("Completa nombre y email.");

  const contacts = getJSON(KEY_CONTACTS, []);
  const exists = contacts.some((c) => c.email.toLowerCase() === email.toLowerCase());
  if (exists) return alert("Ese email ya existe en la agenda.");

  contacts.unshift({ name, email });
  setJSON(KEY_CONTACTS, contacts);

  document.querySelector("#newName").value = "";
  document.querySelector("#newEmail").value = "";

  alert("Contacto agregado ✅");
  renderContacts();
}

function handleSendMoney(e) {
  e.preventDefault();
  requireLogin();

  const to = document.querySelector("#selectedContact").value.trim();
  const amount = Number(document.querySelector("#sendAmount").value);

  if (!to) return alert("Selecciona un contacto.");
  if (!amount || amount <= 0) return alert("Ingresa un monto válido.");

  const bal = getBalance();
  if (amount > bal) return alert("Saldo insuficiente. No somos banco central 😅");

  setBalance(bal - amount);
  addTransaction("ENVÍO", amount, { to });

  alert("Envío realizado ✅");
  window.location.href = "menu.html";
}
