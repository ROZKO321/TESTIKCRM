document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("clientCard");
  const params = new URLSearchParams(window.location.search);
  const clientId = parseInt(params.get("id"));

  const role = localStorage.getItem("role");
  const currentUser = localStorage.getItem("user");

  const clients = JSON.parse(localStorage.getItem("leads") || "[]");
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    
card.innerHTML = `
  <div class="client-view">
    <div class="client-left">
      <p><strong>Имя:</strong> ${client.firstName}</p>
      <p><strong>Фамилия:</strong> ${client.lastName}</p>
      <p><strong>Телефон:</strong> ${client.phone}</p>
      <p><strong>Email:</strong> ${client.email}</p>
      <p><strong>Страна:</strong> ${client.country || "—"}</p>
      <p><strong>Аффилиат:</strong> ${client.affiliate || "—"}</p>
      <p><strong>Менеджер:</strong> ${client.manager}</p>
      <p><strong>Загружен:</strong> ${client.date || "—"}</p>
    </div>

    <div class="client-right">
      <div class="form-group">
        <label for="statusSelect">Статус:</label>
        <select id="statusSelect" ${canEdit ? "" : "disabled"}>
          <option value="Новый"${client.status === "Новый" ? " selected" : ""}>Новый</option>
          <option value="В работе"${client.status === "В работе" ? " selected" : ""}>В работе</option>
          <option value="Закрыт"${client.status === "Закрыт" ? " selected" : ""}>Закрыт</option>
        </select>
      </div>

      <div class="form-group">
        <label for="reminderInput">Напоминание:</label>
        <input type="date" id="reminderInput" value="${client.reminder || ""}" ${canEdit ? "" : "disabled"}>
      </div>

      <div class="form-group">
        <label for="commentTextarea">Комментарий:</label>
        <textarea id="commentTextarea" rows="5" ${canEdit ? "" : "disabled"}>${client.comment || ""}</textarea>
      </div>

      ${canEdit ? '<button id="saveBtn">Сохранить</button>' : ""}
    </div>
  </div>
`;


  document.getElementById("statusSelect").value = client.status;

  if (canEdit) {
    document.getElementById("saveBtn").addEventListener("click", () => {
      client.status = document.getElementById("statusSelect").value;
      client.reminder = document.getElementById("reminderInput").value;
      client.comment = document.getElementById("commentTextarea").value;

      const index = clients.findIndex(c => c.id === client.id);
      if (index !== -1) {
        clients[index] = client;
        localStorage.setItem("leads", JSON.stringify(clients));
        alert("Сохранено");
      }
    });
  }
});

function saveClient(id) {
  const clients = JSON.parse(localStorage.getItem("leads") || "[]");
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return;

  clients[index].status = document.getElementById("statusSelect").value;
  clients[index].comment = document.getElementById("commentText").value;
  clients[index].reminder = document.getElementById("reminderDate").value;

  localStorage.setItem("leads", JSON.stringify(clients));
  alert("Изменения сохранены!");
}
