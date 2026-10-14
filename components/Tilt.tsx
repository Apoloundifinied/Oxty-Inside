"use client";

import { useEffect, useRef } from "react";

// Tilt 3D sutil: define --rx/--ry a partir do ponteiro (referencia docs/re-design v2).
// Desligado com prefers-reduced-motion e em toque (sem hover continuo).
export function Tilt({
  children,
  className = "",
  max = 10,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", (-y * max).toFixed(1));
      el.style.setProperty("--ry", (x * max).toFixed(1));
    };
    const onLeave = () => {
      el.style.setProperty("--rx", "0");
      el.style.setProperty("--ry", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
