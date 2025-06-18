const sounds = {
  save: new Audio("sounds/save.mp3"),
  add: new Audio("sounds/add.mp3"),
  delete: new Audio("sounds/delete.mp3"),
  error: new Audio("sounds/error.mp3")
};

function playSound(type) {
  const sound = sounds[type];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {}); // Чтобы не было ошибок без взаимодействия
  }
}
