document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const limitSelect = document.getElementById("limitSelect");
  const pagination = document.getElementById("pagination");
  const leadList = document.getElementById("leadList");

  const role = localStorage.getItem("role") || "admin";
  const currentUser = localStorage.getItem("user") || "manager1";

  const allLeads = JSON.parse(localStorage.getItem("crmClients") || "[]");

  let filteredLeads = [];
  let currentPage = 1;
  let leadsPerPage = parseInt(limitSelect.value);

  function filterLeads() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const affiliate = affiliateFilter.value;

    filteredLeads = allLeads.filter(lead => {
      const matchesSearch =
        lead.firstName.toLowerCase().includes(search) ||
        lead.lastName.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.phone.toLowerCase().includes(search);

      const matchesStatus = status ? lead.status === status : true;
      const matchesAffiliate = affiliate ? lead.affiliate === affiliate : true;
      const matchesManager = role === "admin" ? true : lead.manager === currentUser;

      return matchesSearch && matchesStatus && matchesAffiliate && matchesManager;
    });

    currentPage = 1;
    renderLeads();
  }

  function renderLeads() {
    leadList.innerHTML = "";
    const start = (currentPage - 1) * leadsPerPage;
    const end = start + leadsPerPage;
    const leadsToShow = filteredLeads.slice(start, end);

    if (leadsToShow.length === 0) {
      leadList.innerHTML = "<div class='empty-state'>Ничего не найдено</div>";
      pagination.innerHTML = "";
      return;
    }

    leadsToShow.forEach(lead => {
      const card = document.createElement("div");
      card.className = "lead-card";

      const left = document.createElement("div");
      left.className = "lead-left";

      const name = document.createElement("div");
      name.className = "lead-name";
      name.textContent = `${lead.firstName} ${lead.lastName}`;
      name.onclick = () => {
        window.open(`client.html?id=${lead.id}`, "_blank");
      };

      const phone = document.createElement("div");
      phone.className = "lead-phone";
      phone.textContent = lead.phone;

      const email = document.createElement("div");
      email.className = "lead-email";
      email.textContent = lead.email;

      const comment = document.createElement("div");
      comment.className = "lead-comment";
      comment.textContent = lead.comment || "Комментариев пока нет";

      left.append(name, phone, email, comment);

      const right = document.createElement("div");
      right.className = "lead-right";

      const status = document.createElement("div");
      status.className = "lead-status";
      status.dataset.status = lead.status;
      status.textContent =
        lead.status === "new"
          ? "Новый"
          : lead.status === "in-progress"
          ? "В работе"
          : "Закрыт";

      const affiliate = document.createElement("div");
      affiliate.className = "lead-affiliate";
      affiliate.textContent = lead.affiliate;

      right.append(status, affiliate);
      card.append(left, right);
      leadList.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.onclick = () => {
        currentPage = i;
        renderLeads();
      };
      pagination.appendChild(btn);
    }
  }

  // Слушатели
  searchInput.addEventListener("input", filterLeads);
  statusFilter.addEventListener("change", filterLeads);
  affiliateFilter.addEventListener("change", filterLeads);
  limitSelect.addEventListener("change", () => {
    leadsPerPage = parseInt(limitSelect.value);
    currentPage = 1;
    renderLeads();
  });

  // Инициализация
  filterLeads();
});
