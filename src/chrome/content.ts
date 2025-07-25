if (!(window as any)._myExtensionScriptInjected) {
  (window as any)._myExtensionScriptInjected = true;

  let isVisible = true;

  document.addEventListener("keydown", (event) => {
    const searchInput = document.querySelector("input#search");
    const focusedElement: Element | null = document.activeElement;
    const isInCommentSection = focusedElement?.closest("#contenteditable-root");

    if (event.code === "KeyH" && focusedElement !== searchInput && !isInCommentSection) {
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

    const chromeBottom = document.querySelector(".ytp-chrome-bottom") as HTMLElement;
    const chromeTop = document.querySelector(".ytp-chrome-top") as HTMLElement;
    const annotation = document.querySelector(".annotation") as HTMLElement;

    if (chromeBottom instanceof HTMLElement) chromeBottom.style.display = display;
    if (chromeTop instanceof HTMLElement) chromeTop.style.display = display;
    if (annotation instanceof HTMLElement) annotation.style.display = display;
  };

  chrome.storage.local.get("isVisible", (result) => {
    if (typeof result.isVisible === "boolean") {
      applyVisibility(result.isVisible);
    }
  });

  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    switch (msg.type) {
      case "TOGGLE_UI":
        isVisible = !isVisible;
        chrome.storage.local.set({ isVisible });
        applyVisibility(isVisible);
        sendResponse({ visible: isVisible });
        break;
      case "GET_VISIBILITY":
        sendResponse({ visible: isVisible });
        break;
      case "APPLY_VISIBILITY":
        if (typeof msg.visible === "boolean") {
          applyVisibility(msg.visible);
        }
        sendResponse({ ok: true });
        break;
      case "PING":
        sendResponse("PONG");
        break;
      default:
        break;
    }
  });

  const watchForPlayerUI = () => {
    const observer = new MutationObserver(() => {
      if (document.querySelector(".ytp-ce-element")) {
        applyVisibility(isVisible);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  watchForPlayerUI();
}

export {};
