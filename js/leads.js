// Пример лидов (в проде подгружается с сервера)
let allLeads = JSON.parse(localStorage.getItem("leads")) || [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Иванов",
    phone: "+380501234567",
    email: "ivanov@example.com",
    country: "Украина",
    date: "2025-06-01",
    affiliate: "Site A",
    status: "новый",
    manager: "manager1"
  },
  {
    id: 2,
    firstName: "Ольга",
    lastName: "Петрова",
    phone: "+380931112233",
    email: "petrova@example.com",
    country: "Украина",
    date: "2025-06-03",
    affiliate: "Site B",
    status: "в работе",
    manager: "manager2"
  },
  {
    id: 3,
    firstName: "Алексей",
    lastName: "Сидоров",
    phone: "+380671234567",
    email: "sidorov@example.com",
    country: "Украина",
    date: "2025-06-05",
    affiliate: "Site C",
    status: "успешно",
    manager: "manager1"
  }
];

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || { role: "admin", username: "admin" };
const isAdmin = currentUser.role === "admin";

let filteredLeads = [];
let currentPage = 1;
let leadsPerPage = 10;

const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const affiliateFilter = document.getElementById("affiliate-filter");
const paginationSelect = document.getElementById("pagination");
const leadsList = document.getElementById("leads-list");

searchInput.addEventListener("input", updateView);
statusFilter.addEventListener("change", updateView);
affiliateFilter.addEventListener("change", updateView);
paginationSelect.addEventListener("change", () => {
  leadsPerPage = parseInt(paginationSelect.value);
  currentPage = 1;
  updateView();
});

function filterLeads() {
  const query = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const affiliate = affiliateFilter.value;

  filteredLeads = allLeads.filter((lead) => {
    if (!isAdmin && lead.manager !== currentUser.username) return false;
    const matchesQuery =
      lead.firstName.toLowerCase().includes(query) ||
      lead.lastName.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.includes(query);
    const matchesStatus = !status || lead.status === status;
    const matchesAffiliate = !affiliate || lead.affiliate === affiliate;

    return matchesQuery && matchesStatus && matchesAffiliate;
  });
}

function renderLeads() {
  leadsList.innerHTML = "";
  const start = (currentPage - 1) * leadsPerPage;
  const end = start + leadsPerPage;
  const paginatedLeads = filteredLeads.slice(start, end);

  if (paginatedLeads.length === 0) {
    leadsList.innerHTML = "<p>Нет лидов</p>";
    return;
  }

  paginatedLeads.forEach((lead) => {
    const card = document.createElement("div");
    card.className = "lead-card";
    card.innerHTML = `
      <div class="lead-left">
        <div class="lead-name">${lead.firstName} ${lead.lastName}</div>
        <div class="lead-info">${lead.phone} | ${lead.email}</div>
        <div class="lead-info">Статус: ${lead.status} | Аффилиат: ${lead.affiliate}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(lead));
    leadsList.appendChild(card);
  });
}

function updateView() {
  filterLeads();
  renderLeads();
}

updateView();

// МОДАЛЬНОЕ ОКНО
const modal = document.getElementById("lead-modal");
const modalName = document.getElementById("modal-name");
const modalPhone = document.getElementById("modal-phone");
const modalEmail = document.getElementById("modal-email");
const modalCountry = document.getElementById("modal-country");
const modalAffiliate = document.getElementById("modal-affiliate");
const modalReminder = document.getElementById("modal-reminder-date");
const modalComment = document.getElementById("modal-comment");
const modalStatus = document.getElementById("modal-status");

let activeLeadId = null;

function openModal(lead) {
  activeLeadId = lead.id;
  modalName.textContent = `${lead.firstName} ${lead.lastName}`;
  modalPhone.value = lead.phone;
  modalEmail.value = lead.email;
  modalCountry.value = lead.country;
  modalAffiliate.value = lead.affiliate;
  modalStatus.value = lead.status;

  // Загружаем данные из localStorage
  const reminders = JSON.parse(localStorage.getItem("reminders") || "{}");
  const reminder = reminders[lead.id];
  modalReminder.value = reminder?.date || "";
  modalComment.value = reminder?.comment || "";

  modal.style.display = "flex";
}

window.onclick = function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

function saveLead() {
  const newStatus = modalStatus.value;
  const comment = modalComment.value.trim();
  const date = modalReminder.value;

  // Обновить статус
  const leadIndex = allLeads.findIndex((l) => l.id === activeLeadId);
  if (leadIndex !== -1) {
    allLeads[leadIndex].status = newStatus;
  }

  localStorage.setItem("leads", JSON.stringify(allLeads));

  // Сохранить напоминание
  const reminders = JSON.parse(localStorage.getItem("reminders") || "{}");
  reminders[activeLeadId] = { comment, date };
  localStorage.setItem("reminders", JSON.stringify(reminders));

  modal.style.display = "none";
  updateView();
}
