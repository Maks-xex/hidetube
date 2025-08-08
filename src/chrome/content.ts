import { getVisibility } from "../utils/getVisibility";

if (!(window as any)._myExtensionScriptInjected) {
  (window as any)._myExtensionScriptInjected = true;

  let isVisible = true;

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
      const pauseOverlay = document.querySelector(".ytp-pause-overlay-container");
      if (pauseOverlay instanceof HTMLElement) pauseOverlay.style.display = display;
    }

    elements.forEach((element) => {
      if (element instanceof HTMLElement) element.style.display = display;
    });
  };
  const bindKeyHandler = () => {
    document.addEventListener("keydown", (event) => {
      const searchInput = document.querySelector("input#search");
      const focusedElement: Element | null = document.activeElement;
      const isInEditableField = focusedElement?.closest("[contenteditable], textarea, input");

      if (event.code === "KeyH" && focusedElement !== searchInput && !isInEditableField) {
        isVisible = !isVisible;
        if (typeof chrome.runtime?.id === "undefined") return;
        chrome.storage.local.set({ isVisible }, () => {
          if (chrome.runtime.lastError) {
            if (chrome.runtime.lastError.message === "Extension context invalidated.") {
              return;
            }
            console.warn("Storage error:", chrome.runtime.lastError.message);
          }
        });
        getVisibility().then((visibile) => applyVisibility(visibile));
      }
    });
  };

  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    switch (msg.type) {
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
          getVisibility().then((visible) => applyVisibility(visible));
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
  bindKeyHandler();
}

export {};
