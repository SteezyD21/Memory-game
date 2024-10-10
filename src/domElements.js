const elements = {
  startGameButton: document.getElementById("startGameButton"),
  resetGameButton: document.getElementById("resetGameButton"),
  messageDiv: document.getElementById("messageDiv"),
  gridSizeDropdown: document.getElementById("gridSize"),
  section: document.querySelector("section"),
  cards: () => document.querySelectorAll(".card"),
  timerDiv: document.getElementById("timerDiv"),
  flipCountDiv: document.getElementById("flipCountDiv")
};

module.exports = { elements };
