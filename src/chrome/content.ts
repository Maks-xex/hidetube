let isVisible = true;

document.addEventListener("keydown", (event) => {
  const searchInput = document.querySelector("input#search");
  if (event.code === "KeyH" && document.activeElement !== searchInput) {
    isVisible = !isVisible;
    applyVisibility(isVisible);
    chrome.storage.local.set({ isVisible });
  }
});

const applyVisibility = (visible: boolean) => {
  isVisible = visible;
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
};

chrome.storage.local.get("isVisible", (result) => {
  if (typeof result.isVisible === "boolean") {
    applyVisibility(result.isVisible);
  }
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type === "TOGGLE_UI") {
    isVisible = !isVisible;
    chrome.storage.local.set({ isVisible });
    applyVisibility(isVisible);
    sendResponse({ visible: isVisible });
  } else if (msg.type === "GET_VISIBILITY") {
    sendResponse({ visible: isVisible });
  } else if (msg.type === "APPLY_VISIBILITY") {
    if (typeof msg.visible === "boolean") {
      applyVisibility(msg.visible);
    }
  }
});
export {};
