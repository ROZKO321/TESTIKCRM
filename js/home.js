document.addEventListener("DOMContentLoaded", () => {
  const userRole = localStorage.getItem("userRole");

  const welcome = document.getElementById("welcomeMessage");
  const settingsLink = document.getElementById("settingsLink");

  if (userRole === "admin") {
    welcome.textContent = "Welcome to Coldi CRM — Admin";
    settingsLink.style.display = "block";
  } else if (userRole === "manager") {
    welcome.textContent = "Welcome to Coldi CRM — Manager";
    settingsLink.style.display = "none"; // доступ к Settings можно будет открывать отдельно
  } else {
    window.location.href = "index.html";
  }

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
  });

  // 👉 Мотивационные фразы
  const phrases = [
    "Let's achieve greatness together.",
    "Success starts here.",
    "Your next lead is your next win.",
    "Make every connection count.",
    "One step closer to success.",
    "Efficiency meets excellence.",
    "Fueling your growth, one lead at a time."
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  const phraseEl = document.getElementById("motivationPhrase");
  if (phraseEl) {
    phraseEl.textContent = randomPhrase;
  }
});
const bellButton = document.getElementById("bellButton");
const reminderDropdown = document.getElementById("reminderList");
const reminderItems = document.getElementById("reminderItems");
const noRemindersText = document.querySelector(".no-reminders");

if (bellButton && reminderDropdown && reminderItems && noRemindersText) {
  bellButton.addEventListener("click", () => {
    reminderDropdown.classList.toggle("show");

    reminderItems.innerHTML = "";

    const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");

    if (reminders.length === 0) {
      noRemindersText.style.display = "block";
      return;
    }

    noRemindersText.style.display = "none";

    reminders.forEach(rem => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `client-card.html?id=${rem.id}`;
      link.textContent = `${rem.name} — ${rem.date}${rem.comment ? ` (${rem.comment})` : ""}`;
      li.appendChild(link);
      reminderItems.appendChild(li);
    });
  });
}
