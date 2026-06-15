"use client";
import { useEffect, useRef } from "react";

export default function ScrollObserver() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScrollOrTouch = () => {
      // Add the class immediately when scrolling or touching starts
      if (!document.body.classList.contains("is-scrolling")) {
        document.body.classList.add("is-scrolling");
      }

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a timeout to remove the class after inactivity
      timeoutRef.current = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 500); // 500ms of inactivity means scroll stopped
    };

    window.addEventListener("scroll", handleScrollOrTouch, { passive: true });
    window.addEventListener("touchstart", handleScrollOrTouch, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollOrTouch);
      window.removeEventListener("touchstart", handleScrollOrTouch);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null; // This component doesn't render anything
}
