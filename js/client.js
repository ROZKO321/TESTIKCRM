// js/client.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const clientId = params.get("id");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !clientId) {
    window.location.href = "login.html";
    return;
  }

  const client = getClients().find(c => c.id === clientId);
  if (!client || (user.role !== "admin" && client.manager !== user.email)) {
    document.body.innerHTML = "<p>Нет доступа к этому клиенту</p>";
    return;
  }

  document.getElementById("clientName").textContent = `${client.firstName} ${client.lastName}`;
  document.getElementById("clientInfo").innerHTML = `
    <p><strong>Email:</strong> ${client.email}</p>
    <p><strong>Телефон:</strong> ${client.phone}</p>
    <p><strong>Страна:</strong> ${client.country}</p>
    <p><strong>Дата:</strong> ${client.date}</p>
    <p><strong>Аффилиат:</strong> ${client.affiliate}</p>
  `;

  // Комментарии
  const commentBlock = document.getElementById("comments");
  const commentInput = document.getElementById("commentInput");
  const commentButton = document.getElementById("commentButton");

  const comments = getComments();
  const clientComments = comments.filter(c => c.clientId === clientId);
  renderComments(clientComments);

  commentButton.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (text) {
      const newComment = {
        clientId,
        text,
        author: user.email,
        date: new Date().toLocaleString()
      };
      comments.push(newComment);
      localStorage.setItem("comments", JSON.stringify(comments));
      commentInput.value = "";
      renderComments(comments.filter(c => c.clientId === clientId));
    }
  });

  function renderComments(list) {
    commentBlock.innerHTML = list.map(c => `
      <div class="comment">
        <p><strong>${c.author}</strong> <span>${c.date}</span></p>
        <p>${c.text}</p>
      </div>
    `).join("");
  }

  // Напоминание
  const reminderDate = document.getElementById("reminderDate");
  const reminderText = document.getElementById("reminderText");
  const reminderButton = document.getElementById("reminderButton");

  reminderButton.addEventListener("click", () => {
    const reminders = getReminders();
    reminders.push({
      clientId,
      manager: client.manager,
      date: reminderDate.value,
      comment: reminderText.value.trim()
    });
    localStorage.setItem("reminders", JSON.stringify(reminders));
    alert("Напоминание установлено!");
    reminderDate.value = "";
    reminderText.value = "";
  });

  // Статус
  const statusSelect = document.getElementById("statusSelect");
  statusSelect.value = client.status || "";

  statusSelect.addEventListener("change", () => {
    const clients = getClients();
    const target = clients.find(c => c.id === clientId);
    target.status = statusSelect.value;
    localStorage.setItem("clients", JSON.stringify(clients));
    alert("Статус обновлён");
  });

  function getClients() {
    return JSON.parse(localStorage.getItem("clients") || "[]");
  }

  function getReminders() {
    return JSON.parse(localStorage.getItem("reminders") || "[]");
  }

  function getComments() {
    return JSON.parse(localStorage.getItem("comments") || "[]");
  }
});
