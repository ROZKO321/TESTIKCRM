document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("clientCard");
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("id");

  const leads = JSON.parse(localStorage.getItem("leads")) || [];
  const comments = JSON.parse(localStorage.getItem("comments")) || {};
  const client = leads.find(l => l.id === clientId);

  if (!client) {
    card.innerHTML = "<p>Client not found.</p>";
    return;
  }

  const commentBlock = (comments[client.id] || [])
    .map(c => `<li>${c.date ? new Date(c.date).toLocaleString() : ""}: ${c.text}</li>`)
    .join("");

  card.innerHTML = `
    <div class="lead-left">
      <strong>${client.firstName} ${client.lastName}</strong><br>
      📞 ${client.phone}<br>
      📧 ${client.email}<br>
      🌍 ${client.country}<br>
      🗓️ ${client.uploadDate}<br>
      👤 Affiliate: ${client.affiliate}<br>
      🧑 Manager: ${client.manager}<br>
      📌 Status: ${client.status}
    </div>
    <div class="lead-right">
      <h4>Comments:</h4>
      <ul>${commentBlock || "<i>No comments</i>"}</ul>
    </div>
  `;
});
