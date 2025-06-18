const clients = JSON.parse(localStorage.getItem("crmClients")) || [];
const user = JSON.parse(localStorage.getItem("crmCurrentUser"));
const clientId = parseInt(localStorage.getItem("crmOpenClientId"));
const client = clients.find(c => c.id === clientId);

if (!client) {
  alert("Client not found");
  location.href = "index.html";
}

document.getElementById("clientName").textContent = `${client.name} ${client.surname || ""}`;

document.getElementById("cName").value = client.name;
document.getElementById("cSurname").value = client.surname;
document.getElementById("cPhone").value = client.phone;
document.getElementById("cEmail").value = client.email;
document.getElementById("cCountry").value = client.country;
document.getElementById("cAffiliate").value = client.affiliate;
document.getElementById("cStatus").value = client.status;
document.getElementById("cComment").value = client.comment;

function renderReminders() {
  const rList = document.getElementById("reminderList");
  rList.innerHTML = "";
  if (!client.reminders.length) {
    rList.innerHTML = `<small style="color:gray;" data-i18n="reminders.empty">No reminders</small>`;
    return;
  }
  client.reminders.forEach(r => {
    const div = document.createElement("div");
    div.className = "mb-2";
    div.innerHTML = `<strong>${new Date(r.date).toLocaleString()}:</strong> ${r.note}`;
    rList.appendChild(div);
  });
}

document.getElementById("addReminderBtn").onclick = () => {
  const date = document.getElementById("reminderDate").value;
  const note = document.getElementById("reminderNote").value.trim();
  if (!date || !note) return alert("Fill date and note");
  client.reminders.push({ date, note });
  localStorage.setItem("crmClients", JSON.stringify(clients));
  renderReminders();
  updateBellIcon();
  playSound("save");
};

document.getElementById("saveClientBtn").onclick = () => {
  client.name = document.getElementById("cName").value.trim();
  client.surname = document.getElementById("cSurname").value.trim();
  client.phone = document.getElementById("cPhone").value.trim();
  client.email = document.getElementById("cEmail").value.trim();
  client.country = document.getElementById("cCountry").value.trim();
  client.affiliate = document.getElementById("cAffiliate").value.trim();
  client.status = document.getElementById("cStatus").value;
  client.comment = document.getElementById("cComment").value.trim();

  localStorage.setItem("crmClients", JSON.stringify(clients));
  playSound("save");
  showToast("Saved");
};

document.getElementById("deleteClientBtn").onclick = () => {
  if (!confirm("Are you sure?")) return;
  const index = clients.findIndex(c => c.id === clientId);
  if (index !== -1) {
    clients.splice(index, 1);
    localStorage.setItem("crmClients", JSON.stringify(clients));
    logActivity(`${user.login} deleted client`);
    playSound("delete");
    location.href = "index.html";
  }
};

renderReminders();
updateBellIcon();
