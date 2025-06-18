document.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("bell");
  const box = document.getElementById("reminderBox");
  const list = document.getElementById("reminderList");

  if (!bell || !box || !list) return;

  bell.addEventListener("click", () => {
    box.classList.toggle("visible");
    renderReminders();
  });

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && !bell.contains(e.target)) {
      box.classList.remove("visible");
    }
  });
});

function renderReminders() {
  const list = document.getElementById("reminderList");
  const user = JSON.parse(localStorage.getItem("crmCurrentUser"));
  const clients = JSON.parse(localStorage.getItem("crmClients") || "[]");
  let reminders = [];

  clients.forEach(client => {
    if (user.role === "admin" || client.manager === user.login) {
      (client.reminders || []).forEach(rem => {
        const comment = rem.comment?.trim() || client.comment || "Без комментария";

        reminders.push({
          name: `${client.name} ${client.surname}`,
          date: new Date(rem.datetime).toLocaleString(),
          comment: comment,
          id: client.id
        });
      });
    }
  });

  list.innerHTML = reminders.length
    ? reminders.map(rem => `
        <div class="reminder-item">
          <strong class="reminder-link" data-id="${rem.id}">${rem.name}</strong><br/>
          <small>${rem.date}</small><br/>
          <em>${rem.comment}</em>
        </div>
      `).join("")
    : `<div class="reminder-empty" data-i18n="reminder.empty">У вас пока нет активных напоминаний</div>`;

  document.querySelectorAll(".reminder-link").forEach(link => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("data-id");
      localStorage.setItem("openClientId", id);
      window.open("client.html", "_blank");
    });
  });
}
