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
  const headers = ["id","firstName","lastName","email","phone","country","status","manager","comment","reminder","date"];
  const csv = [headers.join(",")].concat(
    leads.map(lead => headers.map(h => `"${(lead[h] || "").replace(/"/g, '""')}"`).join(","))
  ).join("
");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads_export.csv";
  a.click();
  logAction("Экспорт лидов в CSV");
}

// --- 3. Создание менеджера ---
function createManager() {
  const name = document.getElementById("newManagerName").value.trim();
  if (!name) return alert("Введите имя пользователя");

  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[name]) return alert("Пользователь уже существует");

  users[name] = { password: "1234", role: "manager" };
  localStorage.setItem("users", JSON.stringify(users));
  logAction(`Создан менеджер: ${name}`);
  alert("Менеджер создан. Пароль: 1234");
  document.getElementById("newManagerName").value = "";
}

// --- 4. Назначение менеджеров ---
function renderAssignBlock() {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  const managers = Object.entries(JSON.parse(localStorage.getItem("users") || "{}"))
    .filter(([_, val]) => val.role === "manager")
    .map(([name]) => name);

  if (managers.length === 0) {
    document.getElementById("assignBlock").innerHTML = "Нет менеджеров.";
    return;
  }

  const grouped = {};
  leads.forEach(lead => {
    const key = `${lead.firstName} ${lead.lastName} (${lead.email})`;
    grouped[key] = lead;
  });

  let html = "<table class='assign-table'><tr><th>Лид</th><th>Менеджер</th></tr>";
  for (const [label, lead] of Object.entries(grouped)) {
    html += `<tr>
      <td>${label}</td>
      <td>
        <select onchange="assignManager(${lead.id}, this.value)">
          <option value="">-- Не назначен --</option>
          ${managers.map(m => `<option value="${m}" ${lead.manager === m ? "selected" : ""}>${m}</option>`).join("")}
        </select>
      </td>
    </tr>`;
  }
  html += "</table>";
  document.getElementById("assignBlock").innerHTML = html;
}

function assignManager(leadId, manager) {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  const index = leads.findIndex(l => l.id == leadId);
  if (index !== -1) {
    leads[index].manager = manager;
    localStorage.setItem("leads", JSON.stringify(leads));
    logAction(`Назначен менеджер ${manager} на лида ID ${leadId}`);
  }
}

// --- 5. Лог ---
function logAction(message) {
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.unshift({ time: new Date().toISOString(), message });
  localStorage.setItem("logs", JSON.stringify(logs));
}

function loadLogs() {
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  const html = logs.map(log => `<div class="log-item"><b>${new Date(log.time).toLocaleString()}</b> — ${log.message}</div>`).join("");
  document.getElementById("logContainer").innerHTML = html || "Лог пуст";
}
