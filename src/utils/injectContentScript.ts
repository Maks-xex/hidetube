export const injectContentScript = (tabId: number, frameId?: number[]) => {
  return chrome.scripting.executeScript({
    target: frameId ? { tabId, frameIds: frameId } : { tabId },
    files: ["static/js/content.js"],
  });
};
