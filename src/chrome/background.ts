import { applyToIframe } from "../utils/applyToIframe";
import { injectContentScript } from "../utils/injectContentScript";
import { sendVisibility } from "../utils/sendVisability";
import { getVisibility } from "../utils/getVisibility";

const isYouTubeVideoUrl = (url?: string) => url?.includes("youtube.com/watch");

const injectAndApplyVisibility = (tabId: number) => {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab) {
      console.warn(`Cannot inject/apply: Tab ${tabId} not found`);
      return;
    }

    chrome.tabs.sendMessage(tabId, { type: "PING" }, (response) => {
      const needsInjection = chrome.runtime.lastError || response !== "PONG";

      const afterInjection = async () => {
        const visible = await getVisibility();
        sendVisibility(tabId, visible);
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
