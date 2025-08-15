import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./PopupFooter.css";

export const PopupFooter = () => (
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
    <p className="popup__tip">
      <FontAwesomeIcon icon={faLightbulb} width={9} color="#ffd679" />
      Press H to toggle UI anytime
    </p>
  </footer>
);
