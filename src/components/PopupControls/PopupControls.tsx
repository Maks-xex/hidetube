import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faPause,
  faPlay,
  faVolumeLow,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

import "./PopupControls.css";

type ControlsState = {
  isPlaying: boolean;
  isMute: boolean;
};

type PopupControlsProps = {
  isVisible: boolean;
};

export const PopupControls = ({ isVisible }: PopupControlsProps) => {
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
  return (
    <>
      <ul className={`popup__controls ${!isVisible && "popup__controls--hidden"}`}>
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
      <div className={`popup__fake-progress-bar ${!isVisible && "popup__controls--hidden"}`}></div>
    </>
  );
};
