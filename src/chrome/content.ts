let isVisible = true;

document.addEventListener("keydown", (e) => {
  const searchInput = document.querySelector("input#search");
  if (e.code === "KeyH" && document.activeElement !== searchInput) {
    toggleUI();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "TOGGLE_UI") {
    toggleUI();
    sendResponse({ visible: isVisible });
  } else if (msg.type === "GET_VISIBILITY") {
    sendResponse({ visible: isVisible });
  }
});

function toggleUI() {
  isVisible = !isVisible;
  const display = isVisible ? "" : "none";

  const elements = document.querySelectorAll(".ytp-ce-element");
  elements.forEach((el) => {
    (el as HTMLElement).style.display = display;
  });

  const chromeBottom = document.querySelector(
    ".ytp-chrome-bottom"
  ) as HTMLElement;
  const chromeTop = document.querySelector(".ytp-chrome-top") as HTMLElement;
  const annotation = document.querySelector(".annotation") as HTMLElement;

  if (chromeBottom) chromeBottom.style.display = display;
  if (chromeTop) chromeTop.style.display = display;
  if (annotation) annotation.style.display = display;
}

export {};
