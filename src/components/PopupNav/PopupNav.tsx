import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import "./PopupNav.css";

export const PopupNav = () => (
  <nav className="popup__nav">
    <ul className="popup__nav-list">
      <li className="popup__nav-item popup__nav-donate">
        <a
          href="https://ko-fi.com/zonkx"
          title="Buy me a Coffee"
          target="_blank"
          rel="noreferrer"
          aria-label="Support me on Ko-fi"
        >
          <FontAwesomeIcon icon={faThumbsUp} />
        </a>
      </li>
      <li className="popup__nav-item popup__nav-bugreport">
        <a
          href="https://github.com/Maks-xex/hidetube/issues/new?template=bug_report.md"
          title="BUG REPORT"
          aria-label="Report a bug"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faBug} />
        </a>
      </li>
      <li className="popup__nav-item popup__nav-feedback">
        <a
          href="https://tally.so/r/nPq410"
          title="Feedback"
          aria-label="Give feedback"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faComment} />
        </a>
      </li>
    </ul>
  </nav>
);
