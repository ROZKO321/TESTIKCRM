let translations = {};

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) el.innerText = translations[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[key]) el.setAttribute("placeholder", translations[key]);
  });
}

function loadLanguage(lang = "ru") {
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      translations = data;
      applyTranslations();
    });
  localStorage.setItem("crmLang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("languageToggle");
  const savedLang = localStorage.getItem("crmLang") || "ru";
  if (langSelect) langSelect.value = savedLang;
  loadLanguage(savedLang);

  langSelect?.addEventListener("change", () => {
    const newLang = langSelect.value;
    loadLanguage(newLang);
  });
});
