const images = require("./data.json");
const { elements } = require("./domElements");

const gameControllers = {
  lockBoard: false,
  matchedCardsCount: 0,
  countdown: null,
  elapsedTime: 0,
  timerStarted: false,
  flipsCount: 0,
};

function toggleClassList(element, classesToAdd = [], classesToRemove = []) {
  classesToRemove.forEach((className) => element.classList.remove(className));
  classesToAdd.forEach((className) => element.classList.add(className));
}

function getImageList(numberOfPairs) {
  const selectedImages = images.slice(0, numberOfPairs);
  return [...selectedImages, ...selectedImages].sort(() => Math.random() - 0.5);
}

function createCard(image) {
  const card = document.createElement("div");
  const front = document.createElement("img");
  const back = document.createElement("div");

  card.classList = "card";
  front.classList = "front";
  back.classList = "back";

  front.src = image.imgSource;
  card.setAttribute("name", image.name);

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", handleCardClick);

  return card;
}

function attachImages(rows, columns) {
  const numberOfPairs = (rows * columns) / 2;
  const images = getImageList(numberOfPairs);

  elements.section.style.gridTemplateRows = `repeat(${rows}, 7rem)`;
  elements.section.style.gridTemplateColumns = `repeat(${columns}, 7rem)`;

  elements.section.innerHTML = "";
  elements.messageDiv.textContent = "";
  timer.resetTimer();

  images.forEach((image) => {
    const card = createCard(image);
    elements.section.appendChild(card);
  });

  elements.section.style.display = "grid";
  elements.messageDiv.style.display = "none";
}

function handleCardClick(tempCard) {
  const card = tempCard.currentTarget;

  if (!gameControllers.timerStarted) {
    timer.startTimer();
    elements.timerDiv.style.display = "block";
    gameControllers.timerStarted = true;
  }

  if (gameControllers.lockBoard) return;
  if (card.classList.contains("lockedFlip" || "matched")) return;

  toggleClassList(card, ["flipped", "lockedFlip"]);
  updateFlipCount();

  if (gameControllers.matchedCardsCount === 0) {
    elements.startGameButton.innerHTML = "Restart Game";
    elements.startGameButton.style.display = "block";
  }
  matchCards();
}

function updateFlipCount() {
  gameControllers.flipsCount += 1;
  elements.flipCountDiv.textContent = `Flips: ${gameControllers.flipsCount}`;
}

function matchCards() {
  const flippedCards = Array.from(elements.cards()).filter((card) =>
    card.classList.contains("flipped")
  );

  if (flippedCards.length === 2) {
    gameControllers.lockBoard = true;
    const [firstCard, secondCard] = flippedCards;
    const isMatch =
      firstCard.getAttribute("name") === secondCard.getAttribute("name");

    isMatch ? handleMatch(flippedCards) : unFlipCards(flippedCards);
  }
}

function handleMatch(flippedCards) {
  flippedCards.forEach((card) => {
    toggleClassList(card, ["matched"], ["flipped"]);
  });

  gameControllers.matchedCardsCount += 2;

  if (gameControllers.matchedCardsCount === elements.cards().length) {
    clearInterval(gameControllers.countdown);
    endGameCondition.displayEndMessage(
      `Congratulations! You matched all the cards!`
    );
  }

  gameControllers.lockBoard = false;
}

function unFlipCards(flippedCards) {
  setTimeout(() => {
    flippedCards.forEach((card) => {
      toggleClassList(card, [], ["flipped", "lockedFlip"]);
    });
    gameControllers.lockBoard = false;
  }, 900);
}

const endGameCondition = {
  displayEndMessage(message) {
    setTimeout(() => {
      const formattedTime = timer.formatTime(gameControllers.elapsedTime);
      const secondsLabel =
        gameControllers.elapsedTime === 1 ? "second" : "seconds";

      const congratsMessage = document.createElement("p");
      congratsMessage.textContent = message;

      const timeMessage = document.createElement("p");
      timeMessage.textContent = `Time: ${formattedTime} ${secondsLabel}`;

      const flipsMessage = document.createElement("p");
      flipsMessage.textContent = `Flips: ${gameControllers.flipsCount}`;

      elements.messageDiv.innerHTML = "";
      elements.messageDiv.appendChild(congratsMessage);
      elements.messageDiv.appendChild(timeMessage);
      elements.messageDiv.appendChild(flipsMessage);

      elements.messageDiv.style.display = "block";
    }, 300);
  },
};

function startGame() {
  gameControllers.matchedCardsCount = 0;
  gameControllers.timerStarted = false;
  gameControllers.flipsCount = 0;

  elements.timerDiv.style.display = "none";
  elements.flipCountDiv.style.display = "block";
  elements.flipCountDiv.textContent = "Flips: 0";

  timer.resetTimer();

  const [rows, columns] = elements.gridSizeDropdown.value
    .split("x")
    .map(Number);
  attachImages(rows, columns);
  elements.startGameButton.style.display = "none";
}

const timer = {
  startTimer() {
    if (!gameControllers.timerStarted) {
      gameControllers.timerStarted = true;
      elements.timerDiv.style.display = "block";
      gameControllers.countdown = setInterval(() => {
        gameControllers.elapsedTime++;
        this.updateTimerDisplay();
      }, 1000);
    }
  },

  resetTimer() {
    clearInterval(gameControllers.countdown);
    gameControllers.elapsedTime = 0;
    this.updateTimerDisplay();
    gameControllers.timerStarted = false;
  },

  updateTimerDisplay() {
    elements.timerDiv.textContent = this.formatTime(
      gameControllers.elapsedTime
    );
  },

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const formattedSeconds = seconds % 60;
    const displayMinutes = minutes.toString().padStart(2, "0");
    const displaySeconds = formattedSeconds.toString().padStart(2, "0");

    return `${displayMinutes}:${displaySeconds}`;
  },
};

elements.startGameButton.addEventListener("click", startGame);
elements.gridSizeDropdown.addEventListener("change", () => {
  elements.startGameButton.style.display = "block";
  elements.startGameButton.innerHTML = "Start Game";
});

module.exports = {
  attachImages,
  createCard,
  handleCardClick,
  getImageList,
  matchCards,
  handleMatch,
  unFlipCards,
  endGameCondition,
};
