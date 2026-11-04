"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Grain = { x: number; y: number; r: number; alpha: number; vx: number; vy: number; phase: number };

/**
 * Poussière de farine en suspension, à poser sur une photo sombre.
 * Dessin sur canvas, en pause hors de l'écran, absent si le mouvement est réduit.
 */
export function FlourDust({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let grains: Grain[] = [];
    let frame = 0;
    let last = 0;

    const spawn = (anywhere: boolean): Grain => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 8,
      r: 0.5 + Math.random() * Math.random() * 2.4,
      alpha: 0.12 + Math.random() * 0.5,
      vx: -6 + Math.random() * 12,
      vy: -(5 + Math.random() * 16),
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (width * height) / 14000));
      grains = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff8ec";
      for (const g of grains) {
        g.x += (g.vx + Math.sin(time / 1400 + g.phase) * 9) * dt;
        g.y += g.vy * dt;
        if (g.y < -8 || g.x < -8 || g.x > width + 8) Object.assign(g, spawn(false));
        ctx.globalAlpha = g.alpha * (0.6 + 0.4 * Math.sin(time / 900 + g.phase));
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
