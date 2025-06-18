// js/reminder.js — отображение напоминаний

const reminders = [
  {
    id: 1,
    leadId: 1,
    leadName: "Артем Иванов",
    managerId: 2,
    date: "2025-06-19",
    comment: "Перезвонить по поводу договора"
  },
  {
    id: 2,
    leadId: 2,
    leadName: "Светлана Петрова",
    managerId: 3,
    date: "2025-06-20",
    comment: ""
  },
  {
    id: 3,
    leadId: 3,
    leadName: "Максим Козлов",
    managerId: 2,
    date: "2025-06-21",
    comment: "Обсудить условия сотрудничества"
  }
];

const commentsByLeadId = {
  1: "Последний разговор — уточнить сумму",
  2: "Не ответила, пробовать позже",
  3: "Согласен на условия, нужно выставить счёт"
};

function renderReminders() {
  const container = document.getElementById("reminderList");
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const filtered = reminders.filter(r => user.role === "admin" || r.managerId === user.id);

  for (const r of filtered) {
    const div = document.createElement("div");
    div.className = "reminder-item";

    const comment = r.comment || commentsByLeadId[r.leadId] || "(нет комментария)";
    const late = r.date < today;

    div.innerHTML = `
      <div class="reminder-header">
        <strong>
          <a href="client.html?id=${r.leadId}" target="_blank">${r.leadName}</a>
        </strong>
        <span class="${late ? "late" : ""}">${r.date}</span>
      </div>
      <div class="reminder-comment">${comment}</div>
    `;

    container.appendChild(div);
  }
}

document.addEventListener("DOMContentLoaded", renderReminders);
