// js/leads.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) window.location.href = "index.html";

  const leadsContainer = document.getElementById("leadsContainer");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const pagination = document.getElementById("pagination");
  const perPageSelect = document.getElementById("perPageSelect");

  let allLeads = [];
  let currentPage = 1;
  let leadsPerPage = parseInt(perPageSelect.value);

  fetchLeads();

  function fetchLeads() {
    fetch("data/leads.json")
      .then(res => res.json())
      .then(data => {
        allLeads = user.role === "admin"
          ? data
          : data.filter(lead => lead.manager === user.email);
        renderFilters(allLeads);
        renderLeads();
      });
  }

  function renderFilters(leads) {
    const statuses = [...new Set(leads.map(lead => lead.status))];
    const affiliates = [...new Set(leads.map(lead => lead.affiliate))];

    statusFilter.innerHTML = `<option value="">Все статусы</option>` +
      statuses.map(s => `<option value="${s}">${s}</option>`).join("");

    affiliateFilter.innerHTML = `<option value="">Все аффилиаты</option>` +
      affiliates.map(a => `<option value="${a}">${a}</option>`).join("");
  }

  function renderLeads() {
    const query = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const affiliate = affiliateFilter.value;

    const filtered = allLeads.filter(lead => {
      const matchQuery =
        lead.name.toLowerCase().includes(query) ||
        lead.surname.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query);

      const matchStatus = status ? lead.status === status : true;
      const matchAffiliate = affiliate ? lead.affiliate === affiliate : true;

      return matchQuery && matchStatus && matchAffiliate;
    });

    const start = (currentPage - 1) * leadsPerPage;
    const paginated = filtered.slice(start, start + leadsPerPage);

    leadsContainer.innerHTML = paginated.map(lead => `
      <div class="card">
        <div class="info">
          <strong>${lead.name} ${lead.surname}</strong><br>
          ${lead.phone} • ${lead.email}<br>
          ${lead.country} • ${lead.date} • <b>${lead.affiliate}</b>
        </div>
        <div class="actions">
          <select class="status-select" onchange="updateStatus('${lead.id}', this.value)">
            ${["Новый", "В работе", "Закрыт"].map(s =>
              `<option value="${s}" ${s === lead.status ? "selected" : ""}>${s}</option>`
            ).join("")}
          </select>

          <textarea placeholder="Комментарий..." onchange="saveComment('${lead.id}', this.value)">${lead.comment || ""}</textarea>

          <div class="reminder-block">
            <input type="date" onchange="saveReminder('${lead.id}', this.value)" value="${lead.reminderDate || ""}">
            <input type="text" placeholder="Напоминание..." onchange="saveReminderComment('${lead.id}', this.value)" value="${lead.reminderComment || ""}">
          </div>
        </div>
      </div>
    `).join("");

    renderPagination(filtered.length);
  }

  function renderPagination(total) {
    const pages = Math.ceil(total / leadsPerPage);
    pagination.innerHTML = "";

    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.toggle("active", i === currentPage);
      btn.addEventListener("click", () => {
        currentPage = i;
        renderLeads();
      });
      pagination.appendChild(btn);
    }
  }

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderLeads();
  });

  statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderLeads();
  });

  affiliateFilter.addEventListener("change", () => {
    currentPage = 1;
    renderLeads();
  });

  perPageSelect.addEventListener("change", () => {
    leadsPerPage = parseInt(perPageSelect.value);
    currentPage = 1;
    renderLeads();
  });
});

// ----------------
// Обновление статуса, комментария и напоминаний:

function updateStatus(id, status) {
  console.log("Обновить статус:", id, status);
  // Здесь будет логика сохранения, если подключен сервер или локальное хранилище
}

function saveComment(id, text) {
  console.log("Комментарий:", id, text);
  // Здесь будет логика сохранения
}

function saveReminder(id, date) {
  console.log("Напоминание дата:", id, date);
  // Здесь будет логика сохранения
}

function saveReminderComment(id, text) {
  console.log("Напоминание текст:", id, text);
  // Здесь будет логика сохранения
}
