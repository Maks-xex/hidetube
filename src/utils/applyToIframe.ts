import { injectContentScript } from "./injectContentScript";
import { sendVisibility } from "./sendVisability";
import { getVisibility } from "./getVisibility";

export const applyToIframe = (tab: chrome.tabs.Tab) => {
  if (!tab.id) return;
  chrome.webNavigation.getAllFrames({ tabId: tab.id }, async (frames) => {
    const embed = ["youtube-nocookie.com/embed", "youtube.com/embed"];
    const ytFrame = frames?.find((frame) => embed.some((sub) => frame.url.includes(sub)));

    if (!ytFrame) {
      return;
    }
    try {
      if (!tab.id) return;
      await injectContentScript(tab.id!, [ytFrame.frameId]);
      const visible = await getVisibility();
      sendVisibility(tab.id, visible, ytFrame.frameId);
    } catch (err) {
      console.warn("Injection failed:", err);
    }
  });
};
