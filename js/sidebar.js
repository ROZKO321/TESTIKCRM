document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const appWrapper = document.getElementById("appWrapper");
  const logoutBtn = document.getElementById("logoutBtn");
  const toggleBtn = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");

  function loadPage(page) {
    fetch(page)
      .then(res => res.text())
      .then(html => {
        appWrapper.innerHTML = html;

        // Инициализация логики вкладок
        if (page === "leads.html" && typeof initLeads === "function") initLeads();
        if (page === "settings.html" && typeof initSettingsPage === "function") initSettingsPage();
        if (page === "home.html" && typeof initHomePage === "function") initHomePage();
        if (typeof applyTranslations === "function") applyTranslations();
      });
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const page = item.getAttribute("data-page");
      if (page) loadPage(page);
    });
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("crmCurrentUser");
    window.location.href = "login.html";
  });

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  const currentUser = JSON.parse(localStorage.getItem("crmCurrentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const defaultItem = document.querySelector(`[data-page="home.html"]`);
  defaultItem?.classList.add("active");
  loadPage("home.html");
});
