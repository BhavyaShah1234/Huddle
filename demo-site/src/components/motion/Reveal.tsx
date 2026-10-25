"use client";

import { useEffect, useRef } from "react";

export default function Reveal({
  children,
  className = "",
  variant = "clip",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "clip" | "group";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "");
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${variant === "clip" ? "reveal" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
