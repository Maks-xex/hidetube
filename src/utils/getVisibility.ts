export const getVisibility = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof chrome?.runtime?.id === "undefined") {
      console.warn("Extension context invalidated – fallback to default visibility");
      resolve(true);
      return;
    }
    chrome.storage.local.get("isVisible", (result) => {
      resolve(typeof result.isVisible === "boolean" ? result.isVisible : true);
    });
  });
};
