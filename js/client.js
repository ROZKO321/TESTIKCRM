document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("clientCard");
  const params = new URLSearchParams(window.location.search);
  const clientId = parseInt(params.get("id"));
  const role = localStorage.getItem("role");
  const currentUser = localStorage.getItem("user");

  const clients = JSON.parse(localStorage.getItem("leads") || "[]");
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    card.innerHTML = "<p class='empty-state'>Клиент не найден</p>";
    return;
  }

  const canEdit = role === "admin" || client.manager === currentUser;

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
          <label>Статус:</label>
          <select id="statusSelect" ${canEdit ? "" : "disabled"}>
            <option value="new">Новый</option>
            <option value="in-progress">В работе</option>
            <option value="closed">Закрыт</option>
          </select>
        </div>

        <div class="form-group">
          <label>Комментарий:</label>
          <textarea id="commentText" ${canEdit ? "" : "readonly"} placeholder="Комментарий...">${client.comment || ""}</textarea>
        </div>

        <div class="form-group">
          <label>Напоминание:</label>
          <input type="datetime-local" id="reminderDate" value="${client.reminder || ""}" ${canEdit ? "" : "disabled"}>
        </div>

        ${canEdit ? `
          <div class="form-actions">
            <button class="save-btn" onclick="saveClient(${client.id})">💾 Сохранить</button>
          </div>
        ` : ""}
      </div>
    </div>
  `;

  // Установим выбранный статус в select
  const statusSelect = document.getElementById("statusSelect");
  if (statusSelect) {
    statusSelect.value = client.status;
  }
});

function saveClient(id) {
  const leads = JSON.parse(localStorage.getItem("leads") || "[]");
  const index = leads.findIndex(c => c.id === id);
  if (index === -1) return;

  leads[index].status = document.getElementById("statusSelect").value;
  leads[index].comment = document.getElementById("commentText").value;
  leads[index].reminder = document.getElementById("reminderDate").value;

  localStorage.setItem("leads", JSON.stringify(leads));
  alert("Изменения сохранены!");
}
