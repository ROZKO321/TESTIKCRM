// reminder.js
document.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("reminderBell");
  const popup = document.getElementById("reminderPopup");
  const countSpan = document.getElementById("reminderCount");
  const list = document.getElementById("reminderList");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  function loadReminders() {
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    const today = new Date().toISOString().split("T")[0];

    const relevant = leads.filter(lead => {
      if (!lead.reminderDate) return false;
      if (lead.reminderDate > today) return false;
      if (user.role !== "admin" && lead.manager !== user.login) return false;
      return true;
    });

    countSpan.textContent = relevant.length;
    list.innerHTML = "";

    if (relevant.length === 0) {
      list.innerHTML = "<p>Нет напоминаний</p>";
      return;
    }

    relevant.forEach(lead => {
      const comment = lead.reminderComment?.trim() || lead.comment || "Без комментария";
      const div = document.createElement("div");
      div.className = "reminder-item";
      div.innerHTML = `
        <a href="client.html?id=${lead.id}" target="_blank">${lead.name}</a>
        <p>${comment}</p>
      `;
      list.appendChild(div);
    });
  }

  bell.addEventListener("click", () => {
    popup.classList.toggle("show");
  });

  window.addEventListener("click", (e) => {
    if (!bell.contains(e.target) && !popup.contains(e.target)) {
      popup.classList.remove("show");
    }
  });

  loadReminders();
});
