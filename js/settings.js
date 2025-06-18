const adminUser = JSON.parse(localStorage.getItem("crmCurrentUser"));
if (!adminUser || adminUser.role !== "admin") {
  location.href = "index.html";
}

let clients = JSON.parse(localStorage.getItem("crmClients")) || [];
let users = JSON.parse(localStorage.getItem("crmUsers")) || [];
let selected = new Set();

const listContainer = document.getElementById("adminClientList");
const selectAllClients = document.getElementById("selectAllClients");
const massManagerSelect = document.getElementById("massManagerSelect");

function renderAdminClients() {
  listContainer.innerHTML = "";
  if (clients.length === 0) {
    listContainer.innerHTML = "<p>No clients found.</p>";
    return;
  }

  clients.forEach(c => {
    const div = document.createElement("div");
    div.className = "client-card";

    div.innerHTML = `
      <input type="checkbox" class="client-checkbox" data-id="${c.id}" style="margin-right: 10px;" />
      <strong>${c.name}</strong>
      <span class="status-label status-${c.status}">${c.status}</span><br />
      ${c.phone || ""} — ${c.email || ""}<br />
      <small>${c.affiliate}</small><br />
      <small>Manager: ${c.manager || "—"}</small>
    `;

    div.querySelector("input").addEventListener("change", (e) => {
      const id = +e.target.dataset.id;
      if (e.target.checked) selected.add(id);
      else selected.delete(id);
    });

    div.onclick = (e) => {
      if (e.target.type === "checkbox") return;
      localStorage.setItem("crmOpenClientId", c.id);
      location.href = "client.html";
    };

    listContainer.appendChild(div);
  });
}

document.getElementById("btnAddClient").onclick = () => {
  const newClient = {
    id: Date.now(),
    name: "New Client",
    surname: "",
    phone: "",
    email: "",
    country: "",
    affiliate: "",
    status: "new",
    comment: "",
    reminders: [],
    manager: ""
  };
  clients.push(newClient);
  localStorage.setItem("crmClients", JSON.stringify(clients));
  renderAdminClients();
  playSound("add");
  logActivity(`${adminUser.login} added a client`);
};

selectAllClients.addEventListener("change", (e) => {
  selected = new Set();
  document.querySelectorAll(".client-checkbox").forEach(cb => {
    cb.checked = e.target.checked;
    if (e.target.checked) selected.add(+cb.dataset.id);
  });
});

document.getElementById("btnMassAssign").onclick = () => {
  const manager = massManagerSelect.value;
  if (!manager) return alert("Select a manager");
  clients.forEach(c => {
    if (selected.has(c.id)) c.manager = manager;
  });
  localStorage.setItem("crmClients", JSON.stringify(clients));
  renderAdminClients();
  logActivity(`${adminUser.login} assigned ${manager} to selected clients`);
};

document.getElementById("btnExport").onclick = () => {
  let rows = [["Name", "Surname", "Phone", "Email", "Country", "Affiliate", "Status", "Manager"]];
  for (const c of clients) {
    rows.push([c.name, c.surname, c.phone, c.email, c.country, c.affiliate, c.status, c.manager]);
  }
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "clients.csv";
  link.click();
};

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("Invalid format");
      imported.forEach(c => c.id = Date.now() + Math.random());
      clients.push(...imported);
      localStorage.setItem("crmClients", JSON.stringify(clients));
      renderAdminClients();
      logActivity(`${adminUser.login} imported clients`);
    } catch {
      playSound("error");
      alert("Import failed");
    }
  };
  reader.readAsText(file);
});

document.getElementById("btnLogs").onclick = () => {
  const log = getActivityLog();
  if (!log.length) return alert("Log is empty.");
  let str = "Activity Log:\n\n";
  log.reverse().forEach(l => {
    str += `• [${new Date(l.time).toLocaleString()}] ${l.user}: ${l.action}\n`;
  });
  alert(str);
};

document.getElementById("btnAddManager").onclick = () => {
  const login = document.getElementById("newLogin").value.trim();
  const pass = document.getElementById("newPass").value.trim();
  if (!login || !pass) return alert("Fill both fields.");
  if (users.find(u => u.login === login)) return alert("User already exists.");

  users.push({ login, password: pass, role: "manager" });
  localStorage.setItem("crmUsers", JSON.stringify(users));
  document.getElementById("newLogin").value = "";
  document.getElementById("newPass").value = "";
  playSound("save");
  logActivity(`${adminUser.login} created manager ${login}`);
  alert("Manager added!");
};

renderAdminClients();
