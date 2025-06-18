let currentLang = localStorage.getItem("crmLang") || "en";
let langData = {};

function loadLanguage() {
  fetch(`lang/${currentLang}.json`)
    .then(res => res.json())
    .then(data => {
      langData = data;
      updateTranslations();
    });
}

function updateTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (langData[key]) el.textContent = langData[key];
  });
}

document.getElementById("languageToggle").value = currentLang;
document.getElementById("languageToggle").onchange = (e) => {
  currentLang = e.target.value;
  localStorage.setItem("crmLang", currentLang);
  loadLanguage();
};
