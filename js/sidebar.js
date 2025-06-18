function loadSidebar() {
  const user = JSON.parse(localStorage.getItem("crmCurrentUser"));
  if (!user) return location.href = "login.html";

  const app = document.getElementById("appWrapper");
  app.innerHTML = "";

  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <h2 class="sidebar-title">🧊 Coldi CRM</h2>
    <nav>
      <ul>
        <li onclick="loadContent('home.html')">🏠 <span data-i18n="menu.home">Home</span></li>
        <li onclick="loadContent('leads.html')">📋 <span data-i18n="menu.leads">Leads</span></li>
        ${user.role === "admin" ? `<li onclick="loadContent('settings.html')">⚙️ <span data-i18n="menu.settings">Settings</span></li>` : ""}
        <li onclick="logout()">🚪 <span data-i18n="menu.logout">Logout</span></li>
      </ul>
    </nav>
    <button id="toggleSidebarBtn" title="Toggle Sidebar">☰</button>
  `;

  const content = document.createElement("div");
  content.id = "mainContent";
  content.className = "main-content";

  app.appendChild(sidebar);
  app.appendChild(content);

  document.getElementById("toggleSidebarBtn").onclick = () => {
    sidebar.classList.toggle("collapsed");
  };
}

function loadContent(page) {
  const main = document.getElementById("mainContent");
  main.classList.add("fade-out");

  fetch(page)
    .then(res => res.text())
    .then(html => {
      setTimeout(() => {
        main.innerHTML = html;
        main.classList.remove("fade-out");
        updateTranslations();
      }, 200);
    });
}

function logout() {
  localStorage.removeItem("crmCurrentUser");
  location.href = "login.html";
}
