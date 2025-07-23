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
                console.warn(
                  "Error sending message:",
                  chrome.runtime.lastError.message
                );
              }
            }
          );
        }
      });
    };

    if (needsInjection) {
      chrome.scripting
        .executeScript({
          target: { tabId },
          files: ["static/js/content.js"],
        })
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
  if (details.url.includes("youtube.com/watch")) {
    injectAndApplyVisibility(details.tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab?.url?.includes("youtube.com/watch")) {
      injectAndApplyVisibility(tab.id!);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.includes("youtube.com/watch")
  ) {
    injectAndApplyVisibility(tabId);
  }
});

export {};
