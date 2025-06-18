// js/client.js — отображение и работа с карточкой клиента

const leads = [
  {
    id: 1,
    firstName: "Артем",
    lastName: "Иванов",
    email: "artem@example.com",
    phone: "+380501112233",
    country: "Украина",
    date: "2025-06-15",
    affiliate: "aff1",
    status: "new",
    managerId: 2,
    comments: [],
    reminder: null
  },
  {
    id: 2,
    firstName: "Светлана",
    lastName: "Петрова",
    email: "sveta@example.com",
    phone: "+380632223344",
    country: "Украина",
    date: "2025-06-16",
    affiliate: "aff2",
    status: "in_work",
    managerId: 3,
    comments: [],
    reminder: null
  }
];

const urlParams = new URLSearchParams(window.location.search);
const leadId = parseInt(urlParams.get("id"));
const lead = leads.find(l => l.id === leadId);

if (!lead || (user.role !== "admin" && lead.managerId !== user.id)) {
  document.body.innerHTML = "<div class='container'><h2>Доступ запрещён</h2></div>";
  throw new Error("Forbidden");
}

document.getElementById("clientName").textContent = `${lead.firstName} ${lead.lastName}`;

document.getElementById("clientInfo").innerHTML = `
  <p><strong>Email:</strong> ${lead.email}</p>
  <p><strong>Телефон:</strong> ${lead.phone}</p>
  <p><strong>Страна:</strong> ${lead.country}</p>
  <p><strong>Аффилиат:</strong> ${lead.affiliate}</p>
  <p><strong>Дата загрузки:</strong> ${lead.date}</p>
`;

document.getElementById("statusSelect").value = lead.status;

function saveComment() {
  const text = document.getElementById("commentText").value.trim();
  if (!text) return alert("Комментарий пуст");
  lead.comments.push({ date: new Date().toISOString().split("T")[0], text });
  alert("Комментарий сохранён");
  document.getElementById("commentText").value = "";
}

function setReminder() {
  const date = document.getElementById("reminderDate").value;
  const text = document.getElementById("reminderComment").value.trim();
  if (!date) return alert("Укажите дату");
  lead.reminder = { date, text };
  alert("Напоминание установлено");
}

document.getElementById("statusSelect").addEventListener("change", (e) => {
  lead.status = e.target.value;
});
