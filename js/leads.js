// leads.js
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const leadsContainer = document.getElementById("leadsContainer");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const perPageSelect = document.getElementById("perPage");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  let allLeads = [];
  let filteredLeads = [];
  let currentPage = 1;

  function loadLeads() {
    // Заменить этот блок на загрузку с сервера или базы
    const raw = localStorage.getItem("leads") || "[]";
    let leads = JSON.parse(raw);

    // Менеджер видит только своих
    if (user.role !== "admin") {
      leads = leads.filter(lead => lead.manager === user.login);
    }

    allLeads = leads;
    applyFilters();
    populateFilters();
  }

  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const affiliate = affiliateFilter.value;

    filteredLeads = allLeads.filter(lead => {
      const matchText = [lead.name, lead.email, lead.phone].some(val =>
        val.toLowerCase().includes(query)
      );
      const matchStatus = !status || lead.status === status;
      const matchAff = !affiliate || lead.affiliate === affiliate;
      return matchText && matchStatus && matchAff;
    });

    currentPage = 1;
    renderLeads();
  }

  function renderLeads() {
    leadsContainer.innerHTML = "";
    const perPage = parseInt(perPageSelect.value);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageLeads = filteredLeads.slice(start, end);

    if (pageLeads.length === 0) {
      leadsContainer.innerHTML = "<p>Нет лидов</p>";
      pageInfo.textContent = "";
      return;
    }

    pageLeads.forEach(lead => {
      const card = document.createElement("div");
      card.className = "lead-card";
      card.innerHTML = `
        <div class="lead-left">
          <p><strong>${lead.name}</strong></p>
          <p>${lead.phone}</p>
          <p>${lead.email}</p>
          <p>${lead.country}</p>
          <p>Дата: ${lead.created || "-"}</p>
          <p>Аффилиат: ${lead.affiliate || "-"}</p>
        </div>
        <div class="lead-right">
          <div class="reminder-block">
            <label>Напомнить:</label>
            <input type="date" data-id="${lead.id}" class="reminder-date" value="${lead.reminderDate || ""}">
            <textarea placeholder="Комментарий" data-id="${lead.id}" class="reminder-comment">${lead.reminderComment || ""}</textarea>
          </div>
          <div class="comment-block">
            <label>Комментарий:</label>
            <textarea data-id="${lead.id}" class="lead-comment">${lead.comment || ""}</textarea>
          </div>
          <div class="status-block">
            <label>Статус:</label>
            <select data-id="${lead.id}" class="lead-status">
              <option value="new" ${lead.status === "new" ? "selected" : ""}>Новый</option>
              <option value="in_progress" ${lead.status === "in_progress" ? "selected" : ""}>В работе</option>
              <option value="closed" ${lead.status === "closed" ? "selected" : ""}>Закрыт</option>
            </select>
          </div>
        </div>
      `;
      leadsContainer.appendChild(card);
    });

    const totalPages = Math.ceil(filteredLeads.length / perPage);
    pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function populateFilters() {
    const statuses = [...new Set(allLeads.map(l => l.status))];
    const affiliates = [...new Set(allLeads.map(l => l.affiliate))];

    statusFilter.innerHTML = '<option value="">Все статусы</option>' +
      statuses.map(s => `<option value="${s}">${s}</option>`).join("");

    affiliateFilter.innerHTML = '<option value="">Все аффилиаты</option>' +
      affiliates.map(a => `<option value="${a}">${a}</option>`).join("");
  }

  // События
  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  affiliateFilter.addEventListener("change", applyFilters);
  perPageSelect.addEventListener("change", renderLeads);
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderLeads();
    }
  });
  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredLeads.length / parseInt(perPageSelect.value));
    if (currentPage < totalPages) {
      currentPage++;
      renderLeads();
    }
  });

  // Авто-сохранение
  leadsContainer.addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    const type = e.target.className;

    const lead = allLeads.find(l => l.id === id);
    if (!lead) return;

    if (type.includes("reminder-date")) {
      lead.reminderDate = e.target.value;
    } else if (type.includes("reminder-comment")) {
      lead.reminderComment = e.target.value;
    } else if (type.includes("lead-comment")) {
      lead.comment = e.target.value;
    } else if (type.includes("lead-status")) {
      lead.status = e.target.value;
    }

    localStorage.setItem("leads", JSON.stringify(allLeads));
  });

  loadLeads();
});
