document.addEventListener("DOMContentLoaded", () => {
  const bellBtn = document.querySelector(".icon-btn");
  const reminderCount = document.getElementById("reminder-count");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const now = new Date().toISOString();

  // Получаем все напоминания
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");

  // Фильтруем по роли
  const filtered = reminders.filter(rem => {
    if (!rem.date) return false;
    if (new Date(rem.date) < new Date()) return false; // Устаревшие не показываем
    if (role === "admin") return true;
    return rem.manager === username;
  });

  // Обновляем бейдж
  if (filtered.length > 0) {
    reminderCount.style.display = "inline-block";
    reminderCount.innerText = filtered.length;
  } else {
    reminderCount.style.display = "none";
  }

  // Отображение списка (при клике)
  bellBtn.addEventListener("click", () => {
    const containerId = "reminder-dropdown";
    let dropdown = document.getElementById(containerId);

    if (dropdown) {
      dropdown.remove();
      return;
    }

    dropdown = document.createElement("div");
    dropdown.id = containerId;
    dropdown.style.position = "absolute";
    dropdown.style.top = "60px";
    dropdown.style.right = "20px";
    dropdown.style.width = "320px";
    dropdown.style.maxHeight = "400px";
    dropdown.style.overflowY = "auto";
    dropdown.style.background = "#fff";
    dropdown.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    dropdown.style.borderRadius = "8px";
    dropdown.style.padding = "10px";
    dropdown.style.zIndex = "999";

    if (filtered.length === 0) {
      dropdown.innerHTML = `<p style="margin: 10px;">No reminders</p>`;
    } else {
      dropdown.innerHTML = filtered.map(rem => `
        <div style="padding: 8px; border-bottom: 1px solid #eee;">
          <a href="#" onclick="openClient(${rem.clientId})" style="font-weight: bold; color: #1a73e8;">${rem.clientName}</a><br/>
          <small>🕒 ${new Date(rem.date).toLocaleString()}</small><br/>
          <small>💬 ${rem.comment || rem.lastComment || "-"}</small>
        </div>
      `).join("");
    }

    document.body.appendChild(dropdown);

    // Закрытие при клике вне
    const closeOnClickOutside = (e) => {
      if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutside);
    }, 0);
  });
});

// Функция перехода к карточке клиента
function openClient(id) {
  localStorage.setItem("openClientId", id);
  window.open("client.html", "_blank");
}
