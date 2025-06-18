function logActivity(action) {
  if (!localStorage.getItem("crmActivityLog")) {
    localStorage.setItem("crmActivityLog", JSON.stringify([]));
  }

  const log = JSON.parse(localStorage.getItem("crmActivityLog"));
  log.push({
    time: new Date().toISOString(),
    user: (JSON.parse(localStorage.getItem("crmCurrentUser")) || {}).login || "неизвестно",
    action
  });
  localStorage.setItem("crmActivityLog", JSON.stringify(log));
}

function getActivityLog() {
  return JSON.parse(localStorage.getItem("crmActivityLog")) || [];
}

function clearActivityLog() {
  localStorage.removeItem("crmActivityLog");
}
