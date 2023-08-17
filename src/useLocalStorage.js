import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [watched, setWatched] = useState(() => {
    return JSON.parse(localStorage.getItem(key)) || initialValue;
  });
  useEffect(() => {
    localStorage.setItem("watchedList", JSON.stringify(watched));
  }, [watched]);
  return [watched, setWatched];
}
