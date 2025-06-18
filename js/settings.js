// js/settings.js

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || (!user.allowSettings && user.role !== "admin")) {
    alert("Доступ запрещён");
    window.location.href = "index.html";
    return;
  }

  const userList = document.getElementById("userList");
  const form = document.getElementById("addUserForm");

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function renderUsers() {
    const users = getUsers();
    userList.innerHTML = "";

    users.forEach((u, index) => {
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <strong>${u.email}</strong> — ${u.role}
        <label>
          <input type="checkbox" data-index="${index}" class="toggle-settings" ${
        u.allowSettings ? "checked" : ""
      } />
          Доступ к настройкам
        </label>
        ${
          u.email !== user.email
            ? `<button data-index="${index}" class="delete-user">Удалить</button>`
            : "<span style='color:gray;'>Это вы</span>"
        }
      `;
      userList.appendChild(div);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newEmail").value.trim();
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newRole").value;
    const allowSettings = document.getElementById("allowSettings").checked;

    if (!email || !password || !role) return;

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      alert("Пользователь с таким email уже существует.");
      return;
    }

    users.push({ email, password, role, allowSettings });
    saveUsers(users);
    form.reset();
    renderUsers();
  });

  userList.addEventListener("change", (e) => {
    if (e.target.classList.contains("toggle-settings")) {
      const users = getUsers();
      const index = parseInt(e.target.dataset.index);
      users[index].allowSettings = e.target.checked;
      saveUsers(users);
      renderUsers();
    }
  });

  userList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-user")) {
      const index = parseInt(e.target.dataset.index);
      if (confirm("Удалить этого пользователя?")) {
        const users = getUsers();
        users.splice(index, 1);
        saveUsers(users);
        renderUsers();
      }
    }
  });

  renderUsers();
});
