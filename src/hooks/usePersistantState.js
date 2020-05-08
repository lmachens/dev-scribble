import { useState } from "react";

function getSessionStorageItem(key, defaultValue) {
  try {
    const item = sessionStorage.getItem(key);
    if (item === undefined) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    return defaultValue;
  }
}

function usePersistantState(key, defaultValue) {
  const [value, setValue] = useState(getSessionStorageItem(key, defaultValue));

  function setPersistentValue(value) {
    const valueJSON = JSON.stringify(value);
    sessionStorage.setItem(key, valueJSON);
    setValue(value);
  }

  return [value, setPersistentValue];
}

export default usePersistantState;
