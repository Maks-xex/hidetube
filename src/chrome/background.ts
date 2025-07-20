chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes("youtube.com/watch")) {
    chrome.scripting
      .executeScript({
        target: { tabId: details.tabId },
        files: ["static/js/content.js"],
      })
      .catch((err) => {
        console.warn("Injection failed:", err.message);
      });
  }
});

function sendApplyVisibilityMessage(tabId: number, isVisible: boolean) {
  chrome.tabs.sendMessage(
    tabId,
    { type: "APPLY_VISIBILITY", visible: isVisible },
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

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url?.includes("youtube.com/watch")) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id! },
          files: ["static/js/content.js"],
        })
        .then(() => {
          chrome.storage.local.get("isVisible", (result) => {
            if (typeof result.isVisible === "boolean") {
              sendApplyVisibilityMessage(tab.id!, result.isVisible);
            }
          });
        })
        .catch((err) => {
          console.warn("Injection failed:", err.message);
        });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.includes("youtube.com/watch")
  ) {
    chrome.storage.local.get("isVisible", (result) => {
      if (typeof result.isVisible === "boolean") {
        sendApplyVisibilityMessage(tabId, result.isVisible);
      }
    });
  }
});
export {};
