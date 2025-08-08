export const sendVisibility = (tabId: number, visible: boolean, frameId?: number): void => {
  chrome.tabs.sendMessage(
    tabId,
    {
      type: "APPLY_VISIBILITY",
      visible,
    },
    frameId !== undefined ? { frameId } : undefined,
    () => {
      if (chrome.runtime.lastError) {
        console.warn("Error sending message:", chrome.runtime.lastError.message);
      }
    },
  );
};
