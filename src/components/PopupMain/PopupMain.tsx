import { applyToIframe } from "../../utils/applyToIframe";
import { sendVisibility } from "../../utils/sendVisability";

import "./PopupMain.css";

type PopupMainProps = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

export const PopupMain = ({ isVisible, setIsVisible }: PopupMainProps) => {
  const toggleVisibility = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    chrome.storage.local.set({ isVisible: newState });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;
      if (tab.url?.includes("youtube.com/watch")) {
        sendVisibility(tab.id, newState);
        return;
      }
      applyToIframe(tab);
    });
  };
  return (
    <div className="popup__main">
      <p className="popup__status">
        Overlay: <strong>{isVisible ? "Shown" : "Hidden"}</strong>
      </p>
      <label className="popup__toggle">
        <input
          className="popup__toggle-input"
          type="checkbox"
          onChange={toggleVisibility}
          checked={!isVisible}
        />
        <span className="popup__slider popup__slider--round">Toggle Overlay</span>
      </label>
    </div>
  );
};
