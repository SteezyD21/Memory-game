const { handleClassList, selectGridSize } = require("./setup_spec");
const { attachImages, getImageList } = require("../src/memory_game");
const { elements } = require("../src/domElements");

describe("Memory Game Tests", function () {
  let images, cards;
  const startGameButton = document.getElementById("startGameButton");
  const gridSizeDropdown = document.getElementById("gridSize");
  const timer = document.getElementById("timerDiv");

  beforeEach(function () {
    jasmine.clock().install();

    images = getImageList();
    attachImages(2, 2);
    cards = elements.cards();
    cards.forEach((card) => {
      spyOn(card.classList, "add").and.callThrough();
      spyOn(card.classList, "remove").and.callThrough();
    });
  });

  afterEach(function () {
    jasmine.clock().uninstall();
    document.getElementById("timerDiv").textContent = "";
    cards.forEach((card) => {
      card.classList.add.calls.reset();
      card.classList.remove.calls.reset();
    });
  });

  describe("Initial Game State", function () {
    it("should not have any cards matched initially", function () {
      cards.forEach((card) => {
        expect(card.classList.contains("matched")).toBe(false);
      });
    });
  });
  describe("Game End Condition", function () {
    let message;
    beforeEach(function () {
      message = document.getElementById("messageDiv");
    });

    it("should display a message after matching all pairs of cards", function () {
      handleClassList(cards[0], images[0]);
      handleClassList(cards[1], images[0]);
      handleClassList(cards[2], images[1]);
      handleClassList(cards[3], images[1]);

      cards[0].click();
      cards[1].click();

      jasmine.clock().tick(2000);

      cards[2].click();
      cards[3].click();

      jasmine.clock().tick(300);

      expect(message.textContent).toContain(
        "Congratulations! You matched all the cards!"
      );
      expect(message.textContent).toContain("Time: 00:02 seconds");
      expect(message.textContent).toContain("Flips: 4");
    });
  });

  describe("Grid Selection", function () {
    it("should set grid size based on user selection", function () {
      selectGridSize(gridSizeDropdown, "2x2");

      startGameButton.click();

      expect(cards.length).toBe(4);
    });

    it("should reset the timer and grid size when a new grid is selected mid-game", function () {
      cards[0].click();
      jasmine.clock().tick(1000);
      expect(timer.textContent).toBe("00:01");

      selectGridSize(gridSizeDropdown, "3x4");
      startGameButton.click();

      expect(timer.textContent).toBe("00:00");
      expect(document.querySelectorAll(".card").length).toBe(12);
    });
  });

  describe("Timer Functionality", function () {
    it("should start the timer when the first card is clicked", function () {
      expect(timer.textContent).toBe("00:00");
      cards[0].click();

      jasmine.clock().tick(1000);

      expect(timer.innerHTML).toBe("00:01");
    });

    it("should reset the timer when the game is reset", function () {
      cards[0].click();
      jasmine.clock().tick(1000);

      expect(timer.textContent).toBe("00:01");

      startGameButton.click();
      expect(timer.textContent).toBe("00:00");
    });
  });

  describe("Card Click Events", function () {
    it("should not click the same card twice", function () {
      handleClassList(cards[0], images[0]);
      cards[0].click();
      cards[0].click();

      expect(cards[0].classList.add).toHaveBeenCalledWith("flipped");
    });

    it("should add class name 'flipped' when a card is clicked", function () {
      expect(cards[0].classList.contains("flipped")).toBe(false);
      cards[0].click();
      expect(cards[0].classList.contains("flipped")).toBe(true);
      expect(cards[0].classList.add).toHaveBeenCalledWith("flipped");
    });

    it("should flip cards back when not matched", function () {
      handleClassList(cards[0], images[0]);
      handleClassList(cards[2], images[2]);
      cards[0].click();
      cards[2].click();

      expect(cards[0].classList.add).toHaveBeenCalledWith("flipped");
      expect(cards[2].classList.add).toHaveBeenCalledWith("flipped");

      jasmine.clock().tick(900);

      expect(cards[0].classList.remove).toHaveBeenCalledWith("flipped");
      expect(cards[2].classList.remove).toHaveBeenCalledWith("flipped");
    });

    it("should not allow matched cards to be clickable", function () {
      handleClassList(cards[0], images[0]);
      handleClassList(cards[1], images[0]);

      cards[0].click();
      cards[1].click();

      expect(cards[0].classList.add).toHaveBeenCalledWith("matched");
      expect(cards[1].classList.add).toHaveBeenCalledWith("matched");

      cards[2].click();
      cards[0].click();

      expect(cards[2].classList.add).toHaveBeenCalledWith("flipped");
      expect(cards[0].classList.remove).not.toHaveBeenCalledWith("matched");
    });
  });

  describe("Card Flip Count", function () {
    beforeEach(function () {
      startGameButton.click();
    });

    it("should update the flip count", function () {
      handleClassList(cards[0], images[0]);
      handleClassList(cards[1], images[1]);

      cards[0].click();
      cards[1].click();

      expect(elements.flipCountDiv.textContent).toBe("Flips: 2");
    });

    it("should reset the flip count when the game is reset", function () {
      handleClassList(cards[0], images[0]);

      cards[0].click();

      expect(elements.flipCountDiv.textContent).toBe("Flips: 1");

      startGameButton.click();
      expect(elements.flipCountDiv.textContent).toBe("Flips: 0");
    });
  });
});
