const currentUser = JSON.parse(localStorage.getItem("crmCurrentUser"));
const clients = JSON.parse(localStorage.getItem("crmClients")) || [];

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const filterAffiliate = document.getElementById("filterAffiliate");
const perPageSelect = document.getElementById("perPageSelect");
const clientList = document.getElementById("clientList");
const pageIndicator = document.getElementById("pageIndicator");

let currentPage = 1;

function renderLeads() {
  let filtered = [...clients];

  if (currentUser.role === "manager") {
    filtered = filtered.filter(c => c.manager === currentUser.login);
  }

  const search = searchInput.value.toLowerCase();
  const status = filterStatus.value;
  const affiliate = filterAffiliate.value;
  const perPage = parseInt(perPageSelect.value);

  if (search) {
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.phone.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search)
    );
  }

  if (status) filtered = filtered.filter(c => c.status === status);
  if (affiliate) filtered = filtered.filter(c => c.affiliate === affiliate);

  const uniqueAffiliates = [...new Set(clients.map(c => c.affiliate).filter(Boolean))];
  filterAffiliate.innerHTML = '<option value="">All affiliates</option>';
  uniqueAffiliates.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    filterAffiliate.appendChild(opt);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const shown = filtered.slice(start, end);

  pageIndicator.textContent = `${currentPage} / ${totalPages || 1}`;
  clientList.innerHTML = "";

  if (shown.length === 0) {
    clientList.innerHTML = "<p>No leads found.</p>";
    return;
  }

  shown.forEach(c => {
    const div = document.createElement("div");
    div.className = "client-card";
    div.innerHTML = `
      <strong>${c.name}</strong>
      <span class="status-label status-${c.status}">${c.status}</span><br />
      ${c.phone || ""} — ${c.email || ""}<br />
      <small>${c.affiliate}</small>
    `;
    div.onclick = () => {
      localStorage.setItem("crmOpenClientId", c.id);
      location.href = "client.html";
    };
    clientList.appendChild(div);
  });
}

searchInput.oninput = filterStatus.onchange = filterAffiliate.onchange = perPageSelect.onchange = () => {
  currentPage = 1;
  renderLeads();
};

document.getElementById("prevPage").onclick = () => {
  currentPage--;
  renderLeads();
};

document.getElementById("nextPage").onclick = () => {
  currentPage++;
  renderLeads();
};

renderLeads();
