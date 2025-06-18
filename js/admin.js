// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
    return;
  }

  const csvInput = document.getElementById("csvInput");
  const importBtn = document.getElementById("importBtn");
  const exportBtn = document.getElementById("exportBtn");
  const assignContainer = document.getElementById("assignContainer");
  const logsContainer = document.getElementById("logsContainer");

  // Загрузка CSV
  importBtn.addEventListener("click", () => {
    const file = csvInput.files[0];
    if (!file) return alert("Выберите CSV-файл");

    const reader = new FileReader();
    reader.onload = function (e) {
      const lines = e.target.result.split("\n").filter(line => line.trim());
      const headers = lines[0].split(",");
      const clients = getClients();

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length < headers.length) continue;

        const client = {
          id: generateId(),
          firstName: values[0].trim(),
          lastName: values[1].trim(),
          email: values[2].trim(),
          phone: values[3].trim(),
          country: values[4].trim(),
          date: new Date().toLocaleDateString(),
          affiliate: values[5]?.trim() || "",
          manager: "",
          status: ""
        };
        clients.push(client);
      }

      localStorage.setItem("clients", JSON.stringify(clients));
      alert("Клиенты успешно загружены!");
    };
    reader.readAsText(file);
  });

  // Экспорт CSV
  exportBtn.addEventListener("click", () => {
    const clients = getClients();
    if (!clients.length) return alert("Нет данных для экспорта");

    const headers = ["Имя", "Фамилия", "Email", "Телефон", "Страна", "Дата", "Аффилиат", "Менеджер", "Статус"];
    const rows = clients.map(c => [
      c.firstName, c.lastName, c.email, c.phone, c.country, c.date, c.affiliate, c.manager, c.status
    ]);

    const csv = [headers.join(",")].concat(rows.map(r => r.join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "clients_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Назначение менеджеров
  const users = getUsers().filter(u => u.role === "manager");
  const clients = getClients();

  assignContainer.innerHTML = clients.map(client => `
    <div class="assign-row">
      <span>${client.firstName} ${client.lastName}</span>
      <select data-id="${client.id}">
        <option value="">-- Менеджер --</option>
        ${users.map(u => `
          <option value="${u.email}" ${client.manager === u.email ? "selected" : ""}>${u.email}</option>
        `).join("")}
      </select>
    </div>
  `).join("");

  assignContainer.addEventListener("change", e => {
    if (e.target.tagName === "SELECT") {
      const id = e.target.getAttribute("data-id");
      const selected = e.target.value;
      const clients = getClients();
      const target = clients.find(c => c.id === id);
      if (target) {
        target.manager = selected;
        localStorage.setItem("clients", JSON.stringify(clients));
      }
    }
  });

  // Логи
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logsContainer.innerHTML = logs.map(log => `
    <div class="log">
      <span>${log.date}</span> — <strong>${log.email}</strong> вошёл в систему
    </div>
  `).join("");

  function getClients() {
    return JSON.parse(localStorage.getItem("clients") || "[]");
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }

  function generateId() {
    return "id" + Math.random().toString(36).substr(2, 9);
  }
});
