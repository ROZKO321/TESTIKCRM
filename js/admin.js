document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  if (role !== "admin") {
    alert("Доступ запрещен");
    window.location.href = "index.html";
    return;
  }

  loadLogs();
  renderAssignBlock();
});

// --- 1. Загрузка CSV лидов ---
function handleCSVUpload() {
  const fileInput = document.getElementById("csvUpload");
  const file = fileInput.files[0];
  if (!file) return alert("Выберите CSV-файл");

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");

    const leads = lines.slice(1).map((line, idx) => {
      const values = line.split(",");
      const lead = {};
      headers.forEach((key, i) => {
        lead[key.trim()] = values[i]?.trim();
      });
      lead.id = Date.now() + idx;
      lead.comment = "";
      lead.reminder = "";
      lead.manager = "";
      lead.status = "new";
      lead.date = new Date().toISOString();
      return lead;
    });

    const existing = JSON.parse(localStorage.getItem("leads") || "[]");
    const allLeads = [...existing, ...leads];
    localStorage.setItem("leads", JSON.stringify(allLeads));
    logAction(`Загружено ${leads.length} лидов из CSV`);
    alert("Лиды успешно загружены");

    renderAssignBlock();
  };
  reader.readAsText(file);
}

// --- 2. Экспорт в CSV ---
function exportLeads() {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  if (leads.length === 0) return alert("Нет данных для экспорта");

  const headers = Object.keys(leads[0]);
  const rows = leads.map(lead => headers.map(key => `"${(lead[key] || "").replace(/"/g, '""')}"`).join(","));
  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "leads_export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logAction("Сделан экспорт лидов");
}

// --- 3. Создание менеджера ---
function createManager() {
  const input = document.getElementById("newManager");
  const login = input.value.trim();
  if (!login || !login.startsWith("mgr")) {
    alert("Введите логин, начинающийся с mgr (например: mgr1)");
    return;
  }

  const users = JSON.parse(localStorage.getItem("crmUsers") || "[]");
  if (users.find(u => u.login === login)) {
    alert("Менеджер с таким логином уже существует");
    return;
  }

  users.push({ login, password: "123", role: "manager" });
  localStorage.setItem("crmUsers", JSON.stringify(users));
  logAction(`Создан новый менеджер: ${login}`);
  alert("Менеджер создан. Пароль по умолчанию: 123");
  input.value = "";
  renderAssignBlock();
}

// --- 4. Логи ---
function logAction(message) {
  const logs = JSON.parse(localStorage.getItem("crmLogs") || "[]");
  logs.push({
    user: localStorage.getItem("user") || "admin",
    action: message,
    timestamp: new Date().toLocaleString("ru-RU")
  });
  localStorage.setItem("crmLogs", JSON.stringify(logs));
  loadLogs();
}

function loadLogs() {
  const logs = JSON.parse(localStorage.getItem("crmLogs") || "[]");
  const container = document.getElementById("logOutput");
  if (!container) return;

  if (logs.length === 0) {
    container.innerHTML = "<em>Логи пока пусты</em>";
    return;
  }

  container.innerHTML = logs
    .reverse()
    .map(log => `<div>🕓 ${log.timestamp} — <strong>${log.user}</strong>: ${log.action}</div>`)
    .join("");
}

// --- 5. Назначение менеджеров ---
function renderAssignBlock() {
  const container = document.getElementById("assignContainer");
  if (!container) return;

  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  const users = JSON.parse(localStorage.getItem("crmUsers") || "[]");
  const managers = users.filter(u => u.role === "manager");

  if (leads.length === 0 || managers.length === 0) {
    container.innerHTML = "<em>Нет лидов или менеджеров для назначения</em>";
    return;
  }

  container.innerHTML = "";

  leads.forEach(lead => {
    const row = document.createElement("div");
    row.className = "assign-row";

    row.innerHTML = `
      <div>
        <strong>${lead.firstName} ${lead.lastName}</strong><br/>
        <small>${lead.email}</small>
      </div>
      <select data-id="${lead.id}">
        <option value="">— Назначить —</option>
        ${managers.map(m => `<option value="${m.login}" ${lead.manager === m.login ? "selected" : ""}>${m.login}</option>`).join("")}
      </select>
    `;

    row.querySelector("select").addEventListener("change", (e) => {
      const selected = e.target.value;
      const id = parseInt(e.target.dataset.id);
      assignManager(id, selected);
    });

    container.appendChild(row);
  });
}

function assignManager(leadId, managerLogin) {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  const index = leads.findIndex(l => l.id === leadId);
  if (index === -1) return;

  leads[index].manager = managerLogin;
  localStorage.setItem("leads", JSON.stringify(leads));
  logAction(`Назначен менеджер ${managerLogin} на лида ${leads[index].firstName} ${leads[index].lastName}`);
}
