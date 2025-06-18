// js/admin.js — логика админки

const managers = [
  { id: 2, name: "Игорь Менеджер" },
  { id: 3, name: "Лена Менеджер" }
];

let leads = JSON.parse(localStorage.getItem("leads") || "[]");
let logs = JSON.parse(localStorage.getItem("logs") || "[]");

function saveAll() {
  localStorage.setItem("leads", JSON.stringify(leads));
  localStorage.setItem("logs", JSON.stringify(logs));
}

function importCSV() {
  const input = document.getElementById("csvInput");
  if (!input.files.length) return alert("Выберите CSV файл");

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const lines = reader.result.split("\n").slice(1);
    for (const line of lines) {
      const [firstName, lastName, email, phone, country, affiliate] = line.split(",");
      if (!email) continue;

      leads.push({
        id: Date.now() + Math.random(),
        firstName, lastName, email, phone,
        country, affiliate, status: "new",
        date: new Date().toISOString().split("T")[0],
        managerId: null,
        comments: [],
        reminder: null
      });

      logs.push(`Загружен лид: ${firstName} ${lastName}`);
    }

    saveAll();
    alert("Лиды загружены");
    renderAssign();
    renderLogs();
  };

  reader.readAsText(file);
}

function renderAssign() {
  const container = document.getElementById("assignList");
  container.innerHTML = "";

  leads.forEach((lead, index) => {
    const row = document.createElement("div");
    row.className = "assign-row";
    row.innerHTML = `
      ${lead.firstName} ${lead.lastName} — 
      <select data-index="${index}">
        <option value="">Не назначен</option>
        ${managers.map(m => `
          <option value="${m.id}" ${lead.managerId == m.id ? "selected" : ""}>
            ${m.name}
          </option>`).join("")}
      </select>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", e => {
      const i = e.target.dataset.index;
      leads[i].managerId = parseInt(e.target.value) || null;
      logs.push(`Назначен менеджер лидe ${leads[i].firstName}: ${e.target.value}`);
      saveAll();
    });
  });
}

function exportCSV() {
  const rows = [["First Name", "Last Name", "Email", "Phone", "Country", "Affiliate", "Status"]];
  leads.forEach(l => {
    rows.push([
      l.firstName, l.lastName, l.email, l.phone,
      l.country, l.affiliate, l.status
    ]);
  });

  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "leads_export.csv";
  link.click();
}

function renderLogs() {
  const container = document.getElementById("logList");
  container.innerHTML = logs.slice(-30).reverse().map(l => `<div>${l}</div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAssign();
  renderLogs();
});
