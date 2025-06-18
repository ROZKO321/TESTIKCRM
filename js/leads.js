document.addEventListener("DOMContentLoaded", () => {
  const leadsContainer = document.getElementById("leadsContainer");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const paginationControls = document.getElementById("paginationControls");
  const settingsLink = document.getElementById("settingsLink");

  const userRole = localStorage.getItem("userRole");
  const currentUser = localStorage.getItem("username");

  if (!userRole) return (window.location.href = "index.html");
  if (userRole === "admin") settingsLink.style.display = "block";

  let allLeads = [];
  let filteredLeads = [];
  let currentPage = 1;
  const leadsPerPage = 20;

  // Загрузка лидов (заменить на fetch в реальном проекте)
  fetch("data/leads.json")
    .then((res) => res.json())
    .then((data) => {
      allLeads = data.filter((lead) => {
        if (userRole === "admin") return true;
        return lead.manager === currentUser;
      });

      const affiliates = [...new Set(allLeads.map((l) => l.affiliate))];
      affiliates.forEach((a) => {
        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        affiliateFilter.appendChild(opt);
      });

      applyFilters();
    });

  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const affiliate = affiliateFilter.value;

    filteredLeads = allLeads.filter((lead) => {
      const matchesQuery =
        lead.firstName.toLowerCase().includes(query) ||
        lead.lastName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query);

      const matchesStatus = status ? lead.status === status : true;
      const matchesAffiliate = affiliate ? lead.affiliate === affiliate : true;

      return matchesQuery && matchesStatus && matchesAffiliate;
    });

    currentPage = 1;
    renderLeads();
    renderPagination();
  }

  function renderLeads() {
    leadsContainer.innerHTML = "";

    const start = (currentPage - 1) * leadsPerPage;
    const paginatedLeads = filteredLeads.slice(start, start + leadsPerPage);

    if (paginatedLeads.length === 0) {
      leadsContainer.innerHTML = `<p class="no-data">No leads found.</p>`;
      return;
    }

    paginatedLeads.forEach((lead) => {
      const leadEl = document.createElement("div");
      leadEl.className = "lead-item";
      leadEl.innerHTML = `
        <div class="lead-main">
          <strong class="lead-name" data-id="${lead.id}">${lead.firstName} ${lead.lastName}</strong>
          <span>${lead.phone}</span>
          <span>${lead.email}</span>
        </div>
        <div class="lead-meta">
          <span>${lead.country}</span>
          <span>${lead.affiliate}</span>
          <span>${lead.date}</span>
          <span class="lead-status">${lead.status}</span>
        </div>
      `;
      leadsContainer.appendChild(leadEl);
    });

    // Клик по имени — переход в карточку
    document.querySelectorAll(".lead-name").forEach((el) => {
      el.addEventListener("click", () => {
        const leadId = el.getAttribute("data-id");
        localStorage.setItem("selectedLeadId", leadId);
        window.location.href = "client-card.html";
      });
    });
  }

  function renderPagination() {
    paginationControls.innerHTML = "";
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderLeads();
        renderPagination();
      });
      paginationControls.appendChild(btn);
    }
  }

  // Фильтры
  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  affiliateFilter.addEventListener("change", applyFilters);

  // Выход
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
});
const bellButton = document.getElementById("bellButton");
const reminderDropdown = document.getElementById("reminderList");
const reminderItems = document.getElementById("reminderItems");
const noRemindersText = document.querySelector(".no-reminders");

if (bellButton && reminderDropdown && reminderItems && noRemindersText) {
  bellButton.addEventListener("click", () => {
    reminderDropdown.classList.toggle("show");

    reminderItems.innerHTML = "";

    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");

    if (reminders.length === 0) {
      noRemindersText.style.display = "block";
      return;
    }

    noRemindersText.style.display = "none";

    reminders.forEach(rem => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `client-card.html?id=${rem.id}`;
      link.textContent = `${rem.name} — ${rem.date}${rem.comment ? ` (${rem.comment})` : ""}`;
      li.appendChild(link);
      reminderItems.appendChild(li);
    });
  });
}
