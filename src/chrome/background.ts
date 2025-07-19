chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url?.includes("youtube.com/watch")) {
      chrome.storage.local.get("isVisible", (result) => {
        if (typeof result.isVisible === "boolean") {
          chrome.tabs.sendMessage(tab.id!, {
            type: "APPLY_VISIBILITY",
            visible: result.isVisible,
          });
        }
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
        chrome.tabs.sendMessage(tabId, {
          type: "APPLY_VISIBILITY",
          visible: result.isVisible,
        });
      }
    });
  }
});
export {};
