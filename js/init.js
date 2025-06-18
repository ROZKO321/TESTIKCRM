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
      comment: "Interested in demo",
      reminders: [{ datetime: "2025-06-30T10:00", comment: "Call back" }],
      createdAt: new Date().toISOString(),
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
      comment: "Просила перезвонить позже",
      reminders: [],
      createdAt: new Date().toISOString(),
      manager: "manager2"
    }
  ]));
}

if (!localStorage.getItem("crmUsers")) {
  localStorage.setItem("crmUsers", JSON.stringify([
    { login: "admin", password: "admin123", role: "admin" },
    { login: "manager1", password: "manager1", role: "manager" },
    { login: "manager2", password: "manager2", role: "manager" }
  ]));
}

if (!localStorage.getItem("crmLang")) {
  localStorage.setItem("crmLang", "ru");
}
