import { useEffect } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";
import { useContext } from "react";

export function usePrompt(when: boolean, message: string) {
  const navigator = useContext(UNSAFE_NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    // const originalPushState = navigator.push;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    const handlePopState = () => {
      const confirmed = window.confirm(message);
      if (!confirmed) {
        navigator.push(window.location.pathname); // отмена навигации
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [when, message, navigator]);
}
