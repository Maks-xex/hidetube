import { applyToIframe } from "../utils/applyToIframe";

const isYouTubeVideoUrl = (url?: string) => url?.includes("youtube.com/watch");

const injectContentScript = (tabId: number) => {
  return chrome.scripting.executeScript({
    target: { tabId },
    files: ["static/js/content.js"],
  });
};

const injectAndApplyVisibility = (tabId: number) => {
  chrome.tabs.sendMessage(tabId, { type: "PING" }, (response) => {
    const needsInjection = chrome.runtime.lastError || response !== "PONG";

    const afterInjection = () => {
      chrome.storage.local.get("isVisible", (result) => {
        if (typeof result.isVisible === "boolean") {
          chrome.tabs.sendMessage(
            tabId,
            {
              type: "APPLY_VISIBILITY",
              visible: result.isVisible,
            },
            () => {
              if (chrome.runtime.lastError) {
                console.warn("Error sending message:", chrome.runtime.lastError.message);
              }
            },
          );
        }
      });
    };

    if (needsInjection) {
      injectContentScript(tabId)
        .then(afterInjection)
        .catch((err) => {
          console.warn("Injection failed:", err.message);
        });
    } else {
      afterInjection();
    }
  });
};

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (isYouTubeVideoUrl(details.url)) {
    injectAndApplyVisibility(details.tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (isYouTubeVideoUrl(tab.url)) {
      injectAndApplyVisibility(tab.id!);
    }
    applyToIframe(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (isYouTubeVideoUrl(tab.url)) {
      injectAndApplyVisibility(tabId);
      return;
    }
    applyToIframe(tab);
  }
});

export {};
