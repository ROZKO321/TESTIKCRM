const translations = {
  en: {
    "welcome": "Welcome to the CRM!",
    "adminPanel": "Admin Panel",
    "importLeads": "Import Leads (CSV)",
    "exportLeads": "Export Leads",
    "addClient": "Add New Client",
    "manageManagers": "Manage Managers",
    "logs": "Logs",
    "reminders": "Reminders",
    "noReminders": "No reminders",
    "clientDetails": "Client Details",
    "backToLeads": "← Back to leads",
    "comments": "Comments",
    "accessDenied": "Access Denied.",
    "add": "Add",
    "remove": "Remove",
    "status": "Status"
  },
  ru: {
    "welcome": "Добро пожаловать в CRM!",
    "adminPanel": "Панель администратора",
    "importLeads": "Импорт лидов (CSV)",
    "exportLeads": "Экспорт лидов",
    "addClient": "Добавить клиента",
    "manageManagers": "Управление менеджерами",
    "logs": "Логи",
    "reminders": "Напоминания",
    "noReminders": "Нет напоминаний",
    "clientDetails": "Карточка клиента",
    "backToLeads": "← Назад к лидам",
    "comments": "Комментарии",
    "accessDenied": "Доступ запрещен.",
    "add": "Добавить",
    "remove": "Удалить",
    "status": "Статус"
  }
};

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

function getLanguage() {
  return localStorage.getItem("lang") || "en";
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = getLanguage();
  setLanguage(lang);

  const switcher = document.getElementById("langSwitcher");
  if (switcher) {
    switcher.value = lang;
    switcher.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }
});
