if (!localStorage.getItem("crmClients")) {
  localStorage.setItem("crmClients", JSON.stringify([
    {
      id: 1,
      name: "John",
      surname: "Doe",
      phone: "+123456789",
      email: "john@example.com",
      country: "USA",
      affiliate: "Alpha",
      status: "new",
      comment: "",
      reminders: [],
      manager: "manager1"
    },
    {
      id: 2,
      name: "Elena",
      surname: "Ivanova",
      phone: "+79871234567",
      email: "elena@mail.ru",
      country: "Russia",
      affiliate: "Beta",
      status: "call-back",
      comment: "",
      reminders: [],
      manager: "manager2"
    }
  ]));
}

loadLanguage();
applyThemeOnLoad();

const users = JSON.parse(localStorage.getItem("crmUsers")) || [
  { login: "admin", password: "admin123", role: "admin" },
  { login: "manager1", password: "manager1", role: "manager" },
  { login: "manager2", password: "manager2", role: "manager" }
];

document.getElementById("loginBtn").onclick = () => {
  const login = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();
  const errorBox = document.getElementById("loginError");

  const found = users.find(u => u.login === login && u.password === pass);
  if (!found) {
    errorBox.textContent = "Wrong login or password";
    errorBox.classList.add("shake");
    playSound("error");
    setTimeout(() => errorBox.classList.remove("shake"), 500);
    return;
  }

  localStorage.setItem("crmCurrentUser", JSON.stringify(found));
  location.href = "index.html";
};
