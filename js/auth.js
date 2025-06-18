// auth.js — логика авторизации
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    // Примитивные тестовые пользователи
    const users = [
      {
        username: "admin",
        password: "admin123",
        role: "admin",
        email: "admin@coldicrm.com",
        allowSettings: true
      },
      {
        username: "manager",
        password: "manager123",
        role: "manager",
        email: "manager@coldicrm.com",
        allowSettings: false
      }
    ];

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      window.location.href = "leads.html";
    } else {
      error.style.display = "block";
    }
  });
});
