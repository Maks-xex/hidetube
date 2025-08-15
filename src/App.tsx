import { useEffect, useState } from "react";

import { PopupControls } from "./components/PopupControls/PopupControls";
import { PopupNav } from "./components/PopupNav/PopupNav";
import { PopupMain } from "./components/PopupMain/PopupMain";
import { PopupFooter } from "./components/PopupFooter/PopupFooter";

export const App = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    chrome.storage.local.get("isVisible", (result) => {
      if (typeof result.isVisible === "boolean") {
        setIsVisible(result.isVisible);
      }
    });
  }, []);

  return (
    <div className="popup">
      <PopupControls isVisible={isVisible} />
      <PopupNav />
      <PopupMain isVisible={isVisible} setIsVisible={setIsVisible} />
      <PopupFooter />
    </div>
  );
};
