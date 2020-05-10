import { useEffect, useState } from "react";

function useKeyDownState(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Backspace") {
        setValue((value) => value.substring(0, value.length - 1));
      } else if (event.key.trim().length === 1) {
        setValue((value) => value + event.key);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return [value, setValue];
}

export default useKeyDownState;
