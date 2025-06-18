// leads.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const leads = JSON.parse(localStorage.getItem("leads")) || [];
  const container = document.getElementById("leadsContainer");
  const pagination = document.getElementById("pagination");

  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const affiliateFilter = document.getElementById("affiliateFilter");
  const perPageSelect = document.getElementById("perPage");

  let currentPage = 1;

  // Заполняем аффилиаты
  const affiliates = [...new Set(leads.map(l => l.affiliate))];
  affiliates.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    affiliateFilter.appendChild(opt);
  });

  function renderLeads() {
    let filtered = leads.filter(l => {
      if (user.role !== "admin" && l.manager !== user.email) return false;

      const query = searchInput.value.toLowerCase();
      const matchesSearch =
        l.firstName.toLowerCase().includes(query) ||
        l.lastName.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.phone.includes(query);

      const statusMatch = !statusFilter.value || l.status === statusFilter.value;
      const affMatch = !affiliateFilter.value || l.affiliate === affiliateFilter.value;

      return matchesSearch && statusMatch && affMatch;
    });

    const perPage = parseInt(perPageSelect.value);
    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const pageItems = filtered.slice(start, start + perPage);

    container.innerHTML = "";
    pageItems.forEach(lead => {
      const card = document.createElement("div");
      card.className = "lead-card";

      card.innerHTML = `
        <div class="lead-left">
          <p><strong>${lead.firstName} ${lead.lastName}</strong></p>
          <p>${lead.phone}</p>
          <p>${lead.email}</p>
          <p>${lead.country}</p>
          <p>Загружено: ${lead.createdAt}</p>
          <p>Аффилиат: ${lead.affiliate}</p>
        </div>

        <div class="lead-right">
          <div>
            <label>Напоминание:</label>
            <input type="date" value="${lead.reminderDate || ""}" data-id="${lead.id}" class="reminder-date">
            <input type="text" placeholder="Комментарий" value="${lead.reminderComment || ""}" data-id="${lead.id}" class="reminder-comment">
          </div>
          <div>
            <label>Комментарий:</label>
            <textarea data-id="${lead.id}" class="lead-comment">${lead.comment || ""}</textarea>
          </div>
          <div>
            <label>Статус:</label>
            <select data-id="${lead.id}" class="lead-status">
              <option ${lead.status === "Новый" ? "selected" : ""}>Новый</option>
              <option ${lead.status === "В работе" ? "selected" : ""}>В работе</option>
              <option ${lead.status === "Успешно" ? "selected" : ""}>Успешно</option>
              <option ${lead.status === "Отказ" ? "selected" : ""}>Отказ</option>
            </select>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    renderPagination(totalPages);
    bindEvents();
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderLeads();
      });
      pagination.appendChild(btn);
    }
  }

  function bindEvents() {
    document.querySelectorAll(".reminder-date").forEach(input => {
      input.addEventListener("change", e => {
        const id = input.dataset.id;
        updateLead(id, "reminderDate", e.target.value);
      });
    });

    document.querySelectorAll(".reminder-comment").forEach(input => {
      input.addEventListener("change", e => {
        const id = input.dataset.id;
        updateLead(id, "reminderComment", e.target.value);
      });
    });

    document.querySelectorAll(".lead-comment").forEach(textarea => {
      textarea.addEventListener("change", e => {
        const id = textarea.dataset.id;
        updateLead(id, "comment", e.target.value);
      });
    });

    document.querySelectorAll(".lead-status").forEach(select => {
      select.addEventListener("change", e => {
        const id = select.dataset.id;
        updateLead(id, "status", e.target.value);
      });
    });
  }

  function updateLead(id, field, value) {
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return;
    leads[idx][field] = value;
    localStorage.setItem("leads", JSON.stringify(leads));

    // Обновим reminders
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    const lead = leads[idx];

    const rIdx = reminders.findIndex(r => r.clientId === id);
    const newReminder = {
      clientId: id,
      name: lead.firstName + " " + lead.lastName,
      date: lead.reminderDate || null,
      comment: lead.reminderComment || lead.comment || "",
      createdBy: lead.manager,
    };

    if (newReminder.date) {
      if (rIdx >= 0) {
        reminders[rIdx] = newReminder;
      } else {
        reminders.push(newReminder);
      }
    } else {
      if (rIdx >= 0) reminders.splice(rIdx, 1);
    }

    localStorage.setItem("reminders", JSON.stringify(reminders));
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
    currentPage = 1;
    renderLeads();
  });

  renderLeads();
});
