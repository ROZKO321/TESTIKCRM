// js/navbar.js — навигация по ролям

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.createElement("nav");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const left = document.createElement("div");
  const right = document.createElement("div");

  left.innerHTML = `
    <a href="leads.html">Лиды</a>
    <a href="notifications.html">Напоминания</a>
  `;

  if (user.role === "admin") {
    left.innerHTML += `<a href="admin.html">Админ</a>`;
  }

  if (user.allowSettings) {
    left.innerHTML += `<a href="settings.html">Настройки</a>`;
  }

  right.innerHTML = `
    <span style="margin-right: 10px;">${user.email}</span>
    <a href="#" onclick="logout()">Выход</a>
  `;

  nav.className = "navbar";
  nav.appendChild(left);
  nav.appendChild(right);
  document.body.prepend(nav);
});
