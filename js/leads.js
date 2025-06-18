if (!localStorage.getItem("crmClients")) {
  const sampleLeads = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    firstName: `Имя${i + 1}`,
    lastName: `Фамилия${i + 1}`,
    phone: `+38063${Math.floor(1000000 + Math.random() * 8999999)}`,
    email: `user${i + 1}@example.com`,
    status: ["new", "in-progress", "closed"][i % 3],
    affiliate: ["partnerA", "partnerB"][i % 2],
    manager: i % 2 === 0 ? "manager1" : "manager2",
    comment: `Комментарий к клиенту #${i + 1}`,
    reminder: "",
    country: "Украина"
  }));

  localStorage.setItem("crmClients", JSON.stringify(sampleLeads));
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const limitSelect = document.getElementById("limitSelect");
  const leadList = document.getElementById("leadList");
  const paginationContainer = document.getElementById("pagination");

  const role = localStorage.getItem("role") || "manager";
  const currentUser = localStorage.getItem("user") || "manager1";

  const allLeads = JSON.parse(localStorage.getItem("crmClients")) || [];

  let filteredLeads = [];
  let currentPage = 1;

  function paginate(array, page, limit) {
    const start = (page - 1) * limit;
    return array.slice(start, start + limit);
  }

  function renderPagination(total, limit) {
    const totalPages = Math.ceil(total / limit);
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.style.backgroundColor = "#0056b3";

      btn.addEventListener("click", () => {
        currentPage = i;
        renderLeads();
      });

      paginationContainer.appendChild(btn);
    }
  }

  function renderLeads() {
    const limit = parseInt(limitSelect.value);
    const leadsToRender = paginate(filteredLeads, currentPage, limit);
    leadList.innerHTML = "";

    if (leadsToRender.length === 0) {
      leadList.innerHTML = "<div class='empty-state'>Ничего не найдено</div>";
      paginationContainer.innerHTML = "";
      return;
    }

    leadsToRender.forEach((lead) => {
      const card = document.createElement("div");
      card.className = "lead-card";

      const left = document.createElement("div");
      left.className = "lead-left";

      const name = document.createElement("div");
      name.className = "lead-name";
      name.textContent = `${lead.firstName} ${lead.lastName}`;
      name.style.cursor = "pointer";
      name.onclick = () => {
        window.open(`client.html?id=${lead.id}`, "_blank");
      };

      const phone = document.createElement("div");
      phone.textContent = lead.phone;

      const email = document.createElement("div");
      email.textContent = lead.email;

      left.append(name, phone, email);

      const right = document.createElement("div");
      right.className = "lead-right";

      const status = document.createElement("div");
      status.className = "lead-status";
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

      const comment = document.createElement("div");
      comment.className = "lead-comment";
      comment.textContent = lead.comment ? `💬 ${lead.comment}` : "Комментарий отсутствует";

      card.append(left, right, comment);
      leadList.appendChild(card);
    });

    renderPagination(filteredLeads.length, limit);
  }

  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const affiliate = affiliateFilter.value;

    filteredLeads = allLeads.filter((lead) => {
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

  // Слушатели
  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  affiliateFilter.addEventListener("change", applyFilters);
  limitSelect.addEventListener("change", () => {
    currentPage = 1;
    renderLeads();
    renderPagination(filteredLeads.length, parseInt(limitSelect.value));
  });
// Сохраняем всех лидов для client.html
localStorage.setItem("leads", JSON.stringify(allLeads));

  applyFilters();
});
