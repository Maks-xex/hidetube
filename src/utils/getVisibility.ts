export const getVisibility = (): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.storage.local.get("isVisible", (result) => {
      resolve(typeof result.isVisible === "boolean" ? result.isVisible : true);
    });
  });
};
