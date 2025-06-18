// js/auth.js — авторизация и роли

const users = [
  { id: 1, login: "admin", pass: "admin123", role: "admin", name: "Администратор" },
  { id: 2, login: "igor", pass: "1234", role: "manager", name: "Игорь Менеджер" },
  { id: 3, login: "lena", pass: "5678", role: "manager", name: "Лена Менеджер" }
];

function requireAuth(roles = []) {
  const stored = localStorage.getItem("user");
  if (!stored) {
    window.location.href = "login.html";
    throw new Error("Not authorized");
  }

  const user = JSON.parse(stored);
  if (roles.length && !roles.includes(user.role)) {
    document.body.innerHTML = "<div class='container'><h2>Доступ запрещён</h2></div>";
    throw new Error("Forbidden");
  }

  return user;
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
