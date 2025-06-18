// guard.js — защита страниц от неавторизованных и не тех ролей

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Если пользователь не вошёл — редирект на login
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Страница только для админа
  if (location.pathname.includes("admin.html") && user.role !== "admin") {
    alert("Доступ только для администратора");
    window.location.href = "leads.html";
    return;
  }

  // Страница "Настройки" — только если allowSettings = true
  if (location.pathname.includes("settings.html") && !user.allowSettings) {
    alert("Недостаточно прав");
    window.location.href = "leads.html";
    return;
  }
});
