const translations = {
  en: {
    "Welcome to CRM": "Welcome to CRM",
    "Username": "Username",
    "Password": "Password",
    "Login": "Login",
    "Please enter credentials": "Please enter credentials",
    "Invalid login or password": "Invalid login or password",
  },
  ru: {
    "Welcome to CRM": "Добро пожаловать в CRM",
    "Username": "Логин",
    "Password": "Пароль",
    "Login": "Войти",
    "Please enter credentials": "Пожалуйста, введите данные",
    "Invalid login or password": "Неверный логин или пароль",
  }
};

function translatePage(lang) {
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, button, label, span, option, a");

  elements.forEach(el => {
    const originalText = el.innerText.trim();
    if (translations[lang] && translations[lang][originalText]) {
      el.innerText = translations[lang][originalText];
    }
  });

  // Также placeholder'ы
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  if (lang === "ru") {
    usernameInput.placeholder = "Логин";
    passwordInput.placeholder = "Пароль";
  } else {
    usernameInput.placeholder = "Username";
    passwordInput.placeholder = "Password";
  }
}
