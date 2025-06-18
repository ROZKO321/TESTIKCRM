// reminder.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  const today = new Date().toISOString().split("T")[0];

  // Отфильтрованные напоминания
  const myReminders = reminders.filter(reminder => {
    if (reminder.date !== today) return false;
    if (user.role === "admin") return true;
    return reminder.createdBy === user.email;
  });

  if (myReminders.length === 0) return;

  // Создаём колокольчик
  const bell = document.createElement("div");
  bell.className = "reminder-bell";
  bell.innerHTML = `🔔<span class="reminder-count">${myReminders.length}</span>`;
  bell.style.position = "fixed";
  bell.style.top = "20px";
  bell.style.right = "20px";
  bell.style.cursor = "pointer";
  bell.style.fontSize = "20px";
  document.body.appendChild(bell);

  // Всплывающее окно
  const popup = document.createElement("div");
  popup.className = "reminder-popup";
  popup.style.display = "none";
  popup.style.position = "fixed";
  popup.style.top = "60px";
  popup.style.right = "20px";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px";
  popup.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  popup.style.zIndex = "999";

  myReminders.forEach(rem => {
    const el = document.createElement("div");
    el.innerHTML = `
      <p><strong><a href="client.html?id=${rem.clientId}" target="_blank">${rem.name}</a></strong></p>
      <p>${rem.comment}</p>
      <hr>
    `;
    popup.appendChild(el);
  });

  document.body.appendChild(popup);

  bell.addEventListener("click", () => {
    popup.style.display = popup.style.display === "none" ? "block" : "none";
  });
});
