if (!(window as any)._myExtensionScriptInjected) {
  (window as any)._myExtensionScriptInjected = true;

  let isVisible = true;

  const localStorage = chrome.storage.local;

  const applyVisibility = (visible: boolean) => {
    isVisible = visible;
    const display = isVisible ? "" : "none";

    const elements = document.querySelectorAll(".ytp-ce-element");
    elements.forEach((el) => {
      (el as HTMLElement).style.display = display;
    });

    if (window.top !== window.self) {
      const pauseOvelay = document.querySelector(".ytp-pause-overlay-container");
      if (pauseOvelay instanceof HTMLElement) pauseOvelay.style.display = display;
    }
    const chromeBottom = document.querySelector(".ytp-chrome-bottom");
    const chromeTop = document.querySelector(".ytp-chrome-top");
    const annotation = document.querySelector(".annotation");

    if (chromeBottom instanceof HTMLElement) chromeBottom.style.display = display;
    if (chromeTop instanceof HTMLElement) chromeTop.style.display = display;
    if (annotation instanceof HTMLElement) annotation.style.display = display;
  };

  document.addEventListener("keydown", (event) => {
    const searchInput = document.querySelector("input#search");
    const focusedElement: Element | null = document.activeElement;
    const isInEditableField = focusedElement?.closest("[contenteditable], textarea, input");

    if (event.code === "KeyH" && focusedElement !== searchInput && !isInEditableField) {
      isVisible = !isVisible;
      applyVisibility(isVisible);
      try {
        localStorage.set({ isVisible });
      } catch (err) {
        console.warn("Failed to save visibility state:", err);
      }
    }
  });

  chrome.storage.local.get("isVisible", (result) => {
    if (typeof result.isVisible === "boolean") {
      applyVisibility(result.isVisible);
    }
  });

  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    switch (msg.type) {
      case "TOGGLE_UI":
        isVisible = !isVisible;
        localStorage.set({ isVisible });
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
    let observerTimeout: number | null = null;

    const observer = new MutationObserver(() => {
      if (observerTimeout !== null) return;

      observerTimeout = window.setTimeout(() => {
        if (document.querySelector(".ytp-ce-element")) {
          applyVisibility(isVisible);
        }
        observerTimeout = null;
      }, 300);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  watchForPlayerUI();
}

export {};
