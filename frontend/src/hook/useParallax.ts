"use client";
import { useEffect } from "react";

export default function useParallax(speed = 0.25) {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-parallax]");

      sections.forEach((sec: any) => {
        const rect = sec.getBoundingClientRect();
        const offset = rect.top * speed;
        sec.style.setProperty("--parallax-offset", `${offset}px`);
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
}
