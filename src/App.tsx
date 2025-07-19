import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faExpand,
  faPlay,
  faThumbsUp,
  faVolumeLow,
} from "@fortawesome/free-solid-svg-icons";

export const App = () => {
  const [isVisibile, setIsVisibile] = useState(true);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: "GET_VISIBILITY" },
        (response) => {
          if (response) setIsVisibile(response.visible);
        }
      );
    });
  }, []);

  const toggleVisibility = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { type: "TOGGLE_UI" },
        (response) => {
          if (response) setIsVisibile(response.visible);
        }
      );
    });
  };

  return (
    <div className="popup">
      <ul className={`popup__controls lstn ${!isVisibile && "hidden"}`}>
        <li>
          <FontAwesomeIcon icon={faPlay} />
        </li>
        <li>
          <FontAwesomeIcon icon={faVolumeLow} />
        </li>
        <li className="popup__control--expand">
          <FontAwesomeIcon color="white" icon={faExpand} />
        </li>
      </ul>
      <nav className="popup__nav">
        <ul className="lstn">
          <li>
            <FontAwesomeIcon icon={faThumbsUp} />
          </li>
          <li>
            <FontAwesomeIcon icon={faComment} />
          </li>
        </ul>
      </nav>
      <div className="popup__main">
        <p className="popup__status">
          Status: <strong>{isVisibile ? "Vissible" : "Hidden"}</strong>
        </p>
        <label className="popup__toggle">
          <input
            className="popup__toggle-input"
            type="checkbox"
            onChange={toggleVisibility}
            checked={!isVisibile}
          />
          <span className="popup__slider popup__slider--round"></span>
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
          Hide distractions. Toggle YouTube’s UI for a cleaner viewing
          experience.
        </p>
      </footer>
      <div
        className={`popup__fake-progress-bar ${!isVisibile && "hidden"}`}
      ></div>
    </div>
  );
};
