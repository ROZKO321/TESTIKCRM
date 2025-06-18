document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("id");

  if (!clientId) {
    alert("Client not found");
    window.location.href = "leads.html";
    return;
  }

  const nameEl = document.getElementById("clientName");
  const phoneEl = document.getElementById("clientPhone");
  const emailEl = document.getElementById("clientEmail");
  const countryEl = document.getElementById("clientCountry");
  const affiliateEl = document.getElementById("clientAffiliate");
  const dateEl = document.getElementById("clientDate");

  const statusSelect = document.getElementById("statusSelect");
  const reminderDate = document.getElementById("reminderDate");
  const reminderComment = document.getElementById("reminderComment");
  const clientComment = document.getElementById("clientComment");

  const saveStatusBtn = document.getElementById("saveStatus");
  const setReminderBtn = document.getElementById("setReminder");
  const saveCommentBtn = document.getElementById("saveComment");

  const logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
  });

  // Загрузка лидов из localStorage или JSON
  const savedLeads = localStorage.getItem("leads");

  fetch("data/leads.json")
    .then(res => res.json())
    .then(defaultLeads => {
      const leads = savedLeads ? JSON.parse(savedLeads) : defaultLeads;

      const client = leads.find(c => String(c.id) === clientId);
      if (!client) {
        alert("Client not found.");
        return;
      }

      nameEl.textContent = `${client.firstName} ${client.lastName}`;
      phoneEl.textContent = client.phone;
      emailEl.textContent = client.email;
      countryEl.textContent = client.country || "-";
      affiliateEl.textContent = client.affiliate || "-";
      dateEl.textContent = client.uploadDate || "-";

      statusSelect.value = client.status || "new";
      reminderDate.value = client.reminderDate || "";
      reminderComment.value = client.reminderComment || "";
      clientComment.value = client.comment || "";

      // Сохранение изменений
      saveStatusBtn.addEventListener("click", () => {
        client.status = statusSelect.value;
        updateClient(client, leads);
        alert("Status saved!");
      });

      setReminderBtn.addEventListener("click", () => {
        client.reminderDate = reminderDate.value;
        client.reminderComment = reminderComment.value;
        updateClient(client, leads);

        // Добавить в список напоминаний
        const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
        reminders.push({
          id: client.id,
          name: nameEl.textContent,
          date: reminderDate.value,
          comment: reminderComment.value || client.comment || ""
        });
        localStorage.setItem("reminders", JSON.stringify(reminders));

        alert("Reminder saved!");
      });

      saveCommentBtn.addEventListener("click", () => {
        client.comment = clientComment.value;
        updateClient(client, leads);
        alert("Comment saved!");
      });
    });

  // Обновить leads в localStorage
  function updateClient(updatedClient, allLeads) {
    const updatedLeads = allLeads.map(l => String(l.id) === clientId ? updatedClient : l);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
  }
});
const bellButton = document.getElementById("bellButton");
const reminderDropdown = document.getElementById("reminderList");
const reminderItems = document.getElementById("reminderItems");
const noRemindersText = document.querySelector(".no-reminders");

if (bellButton && reminderDropdown && reminderItems && noRemindersText) {
  bellButton.addEventListener("click", () => {
    reminderDropdown.classList.toggle("show");

    reminderItems.innerHTML = "";

    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");

    if (reminders.length === 0) {
      noRemindersText.style.display = "block";
      return;
    }

    noRemindersText.style.display = "none";

    reminders.forEach(rem => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `client-card.html?id=${rem.id}`;
      link.textContent = `${rem.name} — ${rem.date}${rem.comment ? ` (${rem.comment})` : ""}`;
      li.appendChild(link);
      reminderItems.appendChild(li);
    });
  });
}
