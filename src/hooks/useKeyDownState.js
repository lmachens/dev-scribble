import { useEffect, useState } from "react";

function useKeyDownState() {
  const [keyEvent, setKeyEvent] = useState(null);

  useEffect(() => {
    function handleKeyDown(event) {
      setKeyEvent({
        timestamp: Date.now(),
        key: event.key,
      });
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return [keyEvent, setKeyEvent];
}

export default useKeyDownState;
