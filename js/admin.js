document.addEventListener("DOMContentLoaded", () => {
  const clientsTable = document.getElementById("clients-table");
  const uploadInput = document.getElementById("upload-csv");
  const exportBtn = document.getElementById("export-csv");
  const addClientBtn = document.getElementById("add-client-btn");
  const addManagerBtn = document.getElementById("add-manager-btn");
  const logsContainer = document.getElementById("logs");
  const currentRole = localStorage.getItem("role");

  if (currentRole !== "admin") {
    location.href = "index.html";
  }

  // Клиенты из localStorage
  let clients = JSON.parse(localStorage.getItem("crmClients") || "[]");
  let logs = JSON.parse(localStorage.getItem("crmLogs") || "[]");
  let managers = JSON.parse(localStorage.getItem("crmManagers") || "[]");

  function saveClients() {
    localStorage.setItem("crmClients", JSON.stringify(clients));
  }

  function saveLogs(message) {
    const entry = {
      message,
      time: new Date().toLocaleString()
    };
    logs.unshift(entry);
    localStorage.setItem("crmLogs", JSON.stringify(logs));
    renderLogs();
  }

  function renderClients() {
    clientsTable.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Surname</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Country</th>
        <th>Affiliate</th>
        <th>Status</th>
        <th>Manager</th>
        <th>Actions</th>
      </tr>
    `;
    clients.forEach((client, index) => {
      clientsTable.innerHTML += `
        <tr>
          <td>${client.id}</td>
          <td>${client.name}</td>
          <td>${client.surname}</td>
          <td>${client.email}</td>
          <td>${client.phone}</td>
          <td>${client.country}</td>
          <td>${client.affiliate}</td>
          <td>${client.status}</td>
          <td>
            <select onchange="assignManager(${client.id}, this.value)">
              <option value="">None</option>
              ${managers.map(mgr => `
                <option value="${mgr.name}" ${mgr.name === client.manager ? "selected" : ""}>
                  ${mgr.name}
                </option>`).join("")}
            </select>
          </td>
          <td><button onclick="deleteClient(${client.id})">🗑️</button></td>
        </tr>
      `;
    });
  }

  window.assignManager = function(id, managerName) {
    const client = clients.find(c => c.id === id);
    if (client) {
      client.manager = managerName;
      saveClients();
      saveLogs(`Assigned manager "${managerName}" to client ID ${id}`);
    }
  };

  window.deleteClient = function(id) {
    if (confirm("Delete this client?")) {
      clients = clients.filter(c => c.id !== id);
      saveClients();
      saveLogs(`Deleted client with ID ${id}`);
      renderClients();
    }
  };

  exportBtn.addEventListener("click", () => {
    const headers = ["id", "name", "surname", "email", "phone", "country", "affiliate", "status", "manager"];
    const rows = clients.map(c => headers.map(h => `"${c[h] || ""}"`).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    saveLogs("Exported clients to CSV");
  });

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
      const lines = event.target.result.split("\n").filter(Boolean);
      const headers = lines[0].split(",");
      lines.slice(1).forEach(line => {
        const values = line.split(",");
        const client = {};
        headers.forEach((h, i) => {
          client[h.trim()] = values[i]?.replace(/"/g, "").trim();
        });
        client.id = Date.now() + Math.floor(Math.random() * 1000);
        client.createdAt = new Date().toISOString();
        clients.push(client);
      });
      saveClients();
      renderClients();
      saveLogs(`Imported ${lines.length - 1} clients from CSV`);
    };
    reader.readAsText(file);
  });

  addClientBtn.addEventListener("click", () => {
    const name = prompt("Enter name:");
    const surname = prompt("Enter surname:");
    const email = prompt("Enter email:");
    const phone = prompt("Enter phone:");
    const country = prompt("Enter country:");
    const affiliate = prompt("Enter affiliate:");

    if (name && surname) {
      const client = {
        id: Date.now(),
        name,
        surname,
        email,
        phone,
        country,
        affiliate,
        status: "New",
        manager: "",
        createdAt: new Date().toISOString(),
        comment: ""
      };
      clients.push(client);
      saveClients();
      renderClients();
      saveLogs(`Added new client: ${name} ${surname}`);
    }
  });

  addManagerBtn.addEventListener("click", () => {
    const name = prompt("Manager login (ex: mgr1):");
    if (name && !managers.find(m => m.name === name)) {
      managers.push({ name });
      localStorage.setItem("crmManagers", JSON.stringify(managers));
      renderClients();
      saveLogs(`Added new manager: ${name}`);
    } else {
      alert("Manager already exists or name is invalid.");
    }
  });

  function renderLogs() {
    logsContainer.innerHTML = logs.map(log => `
      <div class="log-entry">
        <div>${log.message}</div>
        <small>${log.time}</small>
      </div>
    `).join("");
  }

  renderClients();
  renderLogs();
});
