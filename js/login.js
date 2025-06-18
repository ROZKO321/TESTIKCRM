document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Пример логики проверки:
  if ((username === "admin" && password === "admin123") ||
      (username === "manager" && password === "manager123")) {
    localStorage.setItem("userRole", username === "admin" ? "admin" : "manager");
    window.location.href = "home.html";
  } else {
    document.getElementById("loginError").innerText = "Invalid login or password!";
  }
});
