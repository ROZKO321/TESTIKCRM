document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", function () {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!login || !password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    let role = "";

    if (login === "admin" && password === "admin") {
      role = "admin";
    } else if (login === "manager" && password === "manager") {
      role = "manager";
    } else {
      alert("Неверный логин или пароль");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify({ login, role }));
    window.location.href = "home.html";
  });
});
