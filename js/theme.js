function applyThemeOnLoad() {
  const theme = localStorage.getItem("crmTheme") || "light";
  document.body.classList.toggle("dark-theme", theme === "dark");
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("crmTheme", isDark ? "dark" : "light");
}

document.getElementById("themeToggle").onclick = toggleTheme;
