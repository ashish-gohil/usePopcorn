import { useEffect } from "react";

export function useKeyPress(keycode, onCloseMovie) {
  useEffect(() => {
    const keyPressHandler = (e) => {
      if (e.key === keycode) {
        onCloseMovie();
      }
    };
    document.addEventListener("keydown", keyPressHandler);
    return () => document.removeEventListener("keydown", keyPressHandler);
  }, []);
}
