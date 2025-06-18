document.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("notificationIcon");
  const popup = document.getElementById("notificationPopup");
  const badge = document.getElementById("notificationBadge");

  const role = localStorage.getItem("role") || "manager";
  const user = localStorage.getItem("user") || "manager1";

  const leads = JSON.parse(localStorage.getItem("leads")) || [];

  const reminders = leads.filter((lead) => {
    if (!lead.reminder || !lead.reminder.date) return false;

    const reminderTime = new Date(lead.reminder.date).getTime();
    const now = Date.now();
    const inRange = reminderTime - now <= 10 * 60 * 1000 && reminderTime - now > -60 * 1000;

    const hasAccess = role === "admin" || lead.manager === user;

    return inRange && hasAccess;
  });

  if (reminders.length > 0) {
    badge.textContent = reminders.length;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }

  bell.addEventListener("click", () => {
    popup.innerHTML = `<h4>Напоминания</h4>`;

    if (reminders.length === 0) {
      popup.innerHTML += `<p>Здесь пока пусто</p>`;
    } else {
      reminders.forEach((lead) => {
        const div = document.createElement("div");
        div.className = "notification-item";

        div.innerHTML = `
          <strong>${lead.firstName} ${lead.lastName}</strong><br />
          <span class="notification-time">${new Date(lead.reminder.date).toLocaleString()}</span><br />
          <span>${lead.reminder.note || lead.comment || "Комментарий отсутствует"}</span>
        `;

        div.onclick = () => {
          window.open(`client.html?id=${lead.id}`, "_blank");
        };

        popup.appendChild(div);
      });
    }

    popup.style.display = popup.style.display === "none" ? "block" : "none";
  });

  // Уведомление (всплывающее)
  reminders.forEach((lead) => {
    const show = () => {
      const popup = document.createElement("div");
      popup.className = "popup-toast";
      popup.innerHTML = `
        <div><strong>Напоминание:</strong> ${lead.firstName} ${lead.lastName}</div>
        <div>${lead.reminder.note || lead.comment || "Комментарий отсутствует"}</div>
      `;
      Object.assign(popup.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#fff",
        padding: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        borderRadius: "10px",
        zIndex: 2000,
        minWidth: "250px",
      });

      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 7000);
    };

    const reminderTime = new Date(lead.reminder.date).getTime();
    const now = Date.now();
    const tenMinutes = reminderTime - 10 * 60 * 1000 - now;
    const oneMinute = reminderTime - 1 * 60 * 1000 - now;

    if (tenMinutes > 0) setTimeout(show, tenMinutes);
    if (oneMinute > 0) setTimeout(show, oneMinute);
  });
});
