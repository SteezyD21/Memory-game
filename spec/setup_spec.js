const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

const dom = new JSDOM(html, { url: "http://localhost/" });

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;

const handleClassList = (card, image) => {
  card.querySelector(".front").src = image.imgSource;
  card.setAttribute("name", image.name);
};

function selectGridSize(dropdown, sizeValue) {
  const desiredOptionIndex = Array.from(dropdown.options).findIndex(
    (option) => option.value === sizeValue
  );

  if (desiredOptionIndex === -1) {
    throw new Error(`Option with value "${sizeValue}" not found in dropdown.`);
  }

  dropdown.selectedIndex = desiredOptionIndex;

  const changeEvent = new window.Event("change", {
    bubbles: true,
    cancelable: true,
  });
  dropdown.dispatchEvent(changeEvent);
}

module.exports = { handleClassList, selectGridSize };
