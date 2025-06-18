// navbar.js — генерация меню по ролям
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const nav = document.createElement("nav");
  nav.className = "top-nav";

  const left = document.createElement("div");
  left.className = "nav-left";
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

  const right = document.createElement("div");
  right.className = "nav-right";
  right.innerHTML = `
    <span>${user.email}</span>
    <a href="#" onclick="logout()">Выход</a>
  `;

  nav.appendChild(left);
  nav.appendChild(right);
  document.body.prepend(nav);
});

// Выход
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
