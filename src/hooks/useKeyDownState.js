import { useEffect, useState } from "react";

function useKeyDownState() {
  const [key, setKey] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      setKey(event.key);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return [key, setKey];
}

export default useKeyDownState;
