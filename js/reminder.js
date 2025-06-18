document.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("notificationIcon");
  const badge = document.getElementById("notificationBadge");
  const popup = document.getElementById("notificationPopup");
  const reminderList = document.getElementById("reminderList"); // для notifications.html

  const role = localStorage.getItem("role") || "manager";
  const currentUser = localStorage.getItem("user") || "manager1";

  function formatDateTime(datetime) {
    const date = new Date(datetime);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getLastComment(lead) {
    return lead.comment || "Комментарий отсутствует";
  }

  function getFilteredReminders() {
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    const now = new Date().toISOString();

    return leads.filter(lead => {
      const belongsToUser = role === "admin" || lead.manager === currentUser;
      return belongsToUser && lead.reminder && lead.reminder <= now;
    });
  }

  function renderPopupReminders() {
    const reminders = getFilteredReminders();

    badge.style.display = reminders.length > 0 ? "block" : "none";
    badge.textContent = reminders.length;

    popup.innerHTML = "<h4>Напоминания</h4>";

    if (reminders.length === 0) {
      popup.innerHTML += `<div class="notification-item">Нет активных напоминаний</div>`;
      return;
    }

    reminders.forEach(lead => {
      const comment = getLastComment(lead);
      const item = document.createElement("div");
      item.className = "notification-item";
      item.innerHTML = `
        <strong><a href="client.html?id=${lead.id}" target="_blank">${lead.firstName} ${lead.lastName}</a></strong><br>
        <span>${formatDateTime(lead.reminder)}</span><br>
        <span class="notification-time">${comment}</span>
      `;
      popup.appendChild(item);
    });
  }

  function renderFullPageReminders() {
    if (!reminderList) return; // если мы не на notifications.html

    const reminders = getFilteredReminders();

    reminderList.innerHTML = "";

    if (reminders.length === 0) {
      reminderList.innerHTML = `<p class="empty-state">Нет активных напоминаний</p>`;
      return;
    }

    reminders.forEach(lead => {
      const comment = getLastComment(lead);
      const card = document.createElement("div");
      card.className = "lead-card";
      card.innerHTML = `
        <div class="lead-left">
          <div class="lead-name"><a href="client.html?id=${lead.id}" target="_blank">${lead.firstName} ${lead.lastName}</a></div>
          <div class="lead-phone">${lead.phone}</div>
          <div class="lead-email">${lead.email}</div>
        </div>
        <div class="lead-right">
          <div class="lead-status" data-status="${lead.status}">${lead.status === "new" ? "Новый" : lead.status === "in-progress" ? "В работе" : "Закрыт"}</div>
          <div class="lead-affiliate">${lead.affiliate}</div>
          <div class="lead-comment">💬 ${comment}</div>
          <div class="lead-reminder">${formatDateTime(lead.reminder)}</div>
        </div>
      `;
      reminderList.appendChild(card);
    });
  }

  bell?.addEventListener("click", () => {
    popup.style.display = popup.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!bell.contains(e.target) && !popup.contains(e.target)) {
      popup.style.display = "none";
    }
  });

  renderPopupReminders();
  renderFullPageReminders();
});
