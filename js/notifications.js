// Уведомления — отображение по ролям, сохранение, переход по клиенту
const notificationsContainer = document.getElementById("notifications-list");
const reminders = JSON.parse(localStorage.getItem("reminders") || "{}");
const leads = JSON.parse(localStorage.getItem("leads") || "[]");
const user = JSON.parse(localStorage.getItem("currentUser") || "{ role: 'admin', username: 'admin' }");

function renderNotifications() {
  notificationsContainer.innerHTML = "";

  const entries = Object.entries(reminders).filter(([leadId, data]) => {
    const lead = leads.find((l) => l.id == leadId);
    if (!lead) return false;
    if (user.role === "manager" && lead.manager !== user.username) return false;
    return true;
  });

  if (entries.length === 0) {
    notificationsContainer.innerHTML = "<p>Нет напоминаний</p>";
    return;
  }

  entries.forEach(([leadId, reminder]) => {
    const lead = leads.find((l) => l.id == leadId);
    if (!lead) return;

    const commentText = reminder.comment || getLastCommentForLead(leadId) || "Без комментария";

    const item = document.createElement("div");
    item.className = "notification-item";
    item.innerHTML = `
      <div>
        <strong><a href="leads.html#lead-${leadId}" class="notif-name">${lead.firstName} ${lead.lastName}</a></strong>
        <div class="notif-date">${reminder.date || "Не указано"}</div>
        <div class="notif-comment">${commentText}</div>
      </div>
    `;

    notificationsContainer.appendChild(item);
  });
}

function getLastCommentForLead(leadId) {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "{}");
  return reminders[leadId]?.comment || null;
}

document.addEventListener("DOMContentLoaded", renderNotifications);
