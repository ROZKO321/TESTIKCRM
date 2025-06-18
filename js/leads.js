document.addEventListener("DOMContentLoaded", () => {
  const leadList = document.getElementById("leadList");
  const pagination = document.getElementById("pagination");

  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const perPageSelect = document.getElementById("perPage");

  const role = localStorage.getItem("role") || "manager";
  const currentUser = localStorage.getItem("user") || "manager1";

  let leads = JSON.parse(localStorage.getItem("leads") || "[]");
  let filteredLeads = [];
  let currentPage = 1;
  let perPage = parseInt(perPageSelect.value);

  function filterLeads() {
    const search = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const affiliate = affiliateFilter.value;

    filteredLeads = leads.filter((lead) => {
      const belongsToUser = role === "admin" || lead.manager === currentUser;
      if (!belongsToUser) return false;

      const matchesSearch =
        lead.firstName.toLowerCase().includes(search) ||
        lead.lastName.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.phone.includes(search);

      const matchesStatus = !status || lead.status === status;
      const matchesAffiliate = !affiliate || lead.affiliate === affiliate;

      return matchesSearch && matchesStatus && matchesAffiliate;
    });

    currentPage = 1;
    renderLeads();
    renderPagination();
  }

  function renderLeads() {
    leadList.innerHTML = "";

    if (filteredLeads.length === 0) {
      leadList.innerHTML = `<div class="empty-state">Нет лидов по заданным параметрам</div>`;
      return;
    }

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageLeads = filteredLeads.slice(start, end);

    pageLeads.forEach((lead) => {
      const leadCard = document.createElement("div");
      leadCard.className = "lead-card";

      leadCard.innerHTML = `
        <div class="lead-left">
          <a href="client.html?id=${lead.id}" class="lead-name" target="_blank">${lead.firstName} ${lead.lastName}</a>
          <div class="lead-phone">${lead.phone}</div>
          <div class="lead-email">${lead.email}</div>
        </div>
        <div class="lead-right">
          <div class="lead-status" data-status="${lead.status}">${getStatusLabel(lead.status)}</div>
          <div class="lead-affiliate">${lead.affiliate || "Без аффилиата"}</div>
          <div class="lead-comment">💬 ${lead.comment || "Комментарий отсутствует"}</div>
        </div>
      `;

      leadList.appendChild(leadCard);
    });
  }

  function getStatusLabel(status) {
    switch (status) {
      case "new": return "Новый";
      case "in-progress": return "В работе";
      case "closed": return "Закрыт";
      default: return "—";
    }
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const pages = Math.ceil(filteredLeads.length / perPage);
    if (pages <= 1) return;

    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderLeads();
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }

  function populateAffiliateFilter() {
    const affiliates = new Set();
    leads.forEach((lead) => {
      if (lead.affiliate) affiliates.add(lead.affiliate);
    });

    affiliateFilter.innerHTML = `<option value="">Все аффилиаты</option>`;
    [...affiliates].sort().forEach((a) => {
      affiliateFilter.innerHTML += `<option value="${a}">${a}</option>`;
    });
  }

  // Слушатели
  searchInput.addEventListener("input", filterLeads);
  statusFilter.addEventListener("change", filterLeads);
  affiliateFilter.addEventListener("change", filterLeads);
  perPageSelect.addEventListener("change", () => {
    perPage = parseInt(perPageSelect.value);
    currentPage = 1;
    renderLeads();
    renderPagination();
  });

  // Инициализация
  populateAffiliateFilter();
  filterLeads();
});
