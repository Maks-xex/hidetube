if (!(window as any)._myExtensionScriptInjected) {
  (window as any)._myExtensionScriptInjected = true;

  let isVisible = true;

  const chromeStorage = chrome.storage.local;

  const applyVisibility = (visible: boolean) => {
    isVisible = visible;
    const display = isVisible ? "" : "none";

    const elements = [
      ...document.querySelectorAll(".ytp-ce-element"),
      document.querySelector(".ytp-chrome-bottom"),
      document.querySelector(".ytp-chrome-top"),
      document.querySelector(".annotation"),
    ];

    if (window.top !== window.self) {
      const pauseOvelay = document.querySelector(".ytp-pause-overlay-container");
      if (pauseOvelay instanceof HTMLElement) pauseOvelay.style.display = display;
    }

    elements.forEach((element) => {
      if (element instanceof HTMLElement) element.style.display = display;
    });
  };

  document.addEventListener("keydown", (event) => {
    const searchInput = document.querySelector("input#search");
    const focusedElement: Element | null = document.activeElement;
    const isInEditableField = focusedElement?.closest("[contenteditable], textarea, input");

    if (event.code === "KeyH" && focusedElement !== searchInput && !isInEditableField) {
      isVisible = !isVisible;
      applyVisibility(isVisible);
      try {
        chromeStorage.set({ isVisible });
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
        chromeStorage.set({ isVisible });
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
      const hasUIElements =
        document.querySelector(".ytp-ce-element") ||
        document.querySelector(".ytp-chrome-bottom") ||
        document.querySelector(".ytp-pause-overlay-container");

      if (observerTimeout !== null) return;

      observerTimeout = window.setTimeout(() => {
        if (hasUIElements) {
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
