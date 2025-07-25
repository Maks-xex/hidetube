import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faExpand,
  faPause,
  faPlay,
  faThumbsUp,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

type ControlsState = {
  isPlaying: boolean;
  isMute: boolean;
};

export const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [controls, setControls] = useState<ControlsState>({
    isPlaying: true,
    isMute: false,
  });

  const toggleControl = (controlName: keyof ControlsState) => {
    setControls((prev) => ({
      ...prev,
      [controlName]: !prev[controlName],
    }));
  };

  const toggleVisibility = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    chrome.storage.local.set({ isVisible: newState });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].url?.includes("youtube.com/watch")) {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "APPLY_VISIBILITY",
            visible: newState,
          });
        }
      }
    });
  };

  useEffect(() => {
    chrome.storage.local.get("isVisible", (result) => {
      if (typeof result.isVisible === "boolean") {
        setIsVisible(result.isVisible);
      }
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url?.includes("youtube.com/watch") && tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "APPLY_VISIBILITY",
          visible: isVisible,
        });
      }
    });
  }, [isVisible]);

  return (
    <div className="popup">
      <ul className={`popup__controls lstn ${!isVisible && "popup__controls--hidden"}`}>
        <li>
          <button className="popup__control" onClick={() => toggleControl("isPlaying")}>
            <FontAwesomeIcon icon={controls.isPlaying ? faPlay : faPause} width="15px" />
          </button>
        </li>
        <li>
          <button className="popup__control" onClick={() => toggleControl("isMute")}>
            <FontAwesomeIcon icon={controls.isMute ? faVolumeMute : faVolumeLow} width="15px" />
          </button>
        </li>
        <li className="popup__control popup__control--expand">
          <FontAwesomeIcon color="white" icon={faExpand} width="15px" />
        </li>
      </ul>
      <nav className="popup__nav">
        <ul className="lstn">
          <li className="popup__control-donate">
            <a
              href="https://ko-fi.com/zonkx"
              title="Support me before I start talking to my computer"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Maks-xex/hidetube-ui/issues"
              title="BUG REPORT"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faComment} />
            </a>
          </li>
        </ul>
      </nav>
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
          <span className="popup__slider popup__slider--round">toggleControl</span>
        </label>
      </div>
      <footer className="popup__footer">
        <a
          href="https://github.com/Maks-xex/hide-ytplayer-hud"
          target="_blank"
          rel="noreferrer"
          className="popup__link"
          title="GitHub"
        >
          <img
            src="https://avatars.githubusercontent.com/u/61715859?v=4"
            alt="avatar"
            width="24px"
            height="24px"
          />
          <h1 className="popup__title">@HideTube</h1>
        </a>
        <p className="popup__description">
          Hide distractions. Toggle YouTube’s UI for a cleaner viewing experience.
        </p>
      </footer>
      <div className={`popup__fake-progress-bar ${!isVisible && "popup__controls--hidden"}`}></div>
    </div>
  );
};
