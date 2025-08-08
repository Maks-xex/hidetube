export const applyToIframe = (tab: chrome.tabs.Tab) => {
  if (!tab.id) return;
  chrome.webNavigation.getAllFrames({ tabId: tab.id }, (frames) => {
    const embed = ["youtube-nocookie.com/embed", "youtube.com/embed"];
    const ytFrame = frames?.find((frame) => embed.some((sub) => frame.url.includes(sub)));

    if (!ytFrame) {
      return;
    }

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id!, frameIds: [ytFrame.frameId] },
        files: ["static/js/content.js"],
      })
      .then(() => {
        chrome.storage.local.get("isVisible", (result) => {
          if (typeof result.isVisible === "boolean") {
            chrome.tabs.sendMessage(
              tab.id!,
              {
                type: "APPLY_VISIBILITY",
                visible: result.isVisible,
              },
              { frameId: ytFrame.frameId },
              (res) => {
                if (chrome.runtime.lastError) {
                  console.warn("Message failed:", chrome.runtime.lastError.message);
                }
              },
            );
          }
        });
      });
  });
};
