"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { fullAddress, mapsPlaceUrl, siteConfig } from "@/lib/site.config";
import { cn } from "@/lib/utils";

/**
 * Carte Google Maps chargée uniquement à la demande du visiteur :
 * aucun contenu tiers (ni cookie Google) avant son clic.
 */
export function MapEmbed({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const [active, setActive] = useState(false);
  const { embedApiKey, query } = siteConfig.maps;
  const src = embedApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedApiKey)}&q=${encodeURIComponent(query)}&zoom=16&language=fr`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=fr&output=embed`;

  return (
    <div className={cn("relative overflow-hidden", tone === "light" ? "bg-paper" : "bg-blue-night", className)}>
      {active ? (
        <iframe
          title={`Carte : ${siteConfig.name}, ${fullAddress}`}
          src={src}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center",
            tone === "light" ? "text-blue-deep" : "on-dark text-ivory",
          )}
        >
          {/* Plan stylisé : rues suggérées en filets, sans données tierces */}
          <svg className="absolute inset-0 size-full opacity-[0.16]" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M-10 210 C 80 190, 150 200, 230 150 S 360 90, 420 100" strokeWidth="10" />
              <path d="M60 -10 C 90 80, 110 170, 100 320" />
              <path d="M180 -10 C 190 90, 215 140, 240 320" />
              <path d="M300 -10 C 290 70, 320 160, 360 320" />
              <path d="M-10 70 C 100 90, 250 60, 420 40" />
              <path d="M-10 260 C 120 250, 260 270, 420 240" />
            </g>
          </svg>
          <span className="relative grid size-16 place-items-center">
            <span aria-hidden="true" className="animate-ping-soft absolute inset-0 rounded-full bg-framboise/40" />
            <span className="relative grid size-16 place-items-center rounded-full bg-framboise text-ivory shadow-[0_10px_30px_-10px_rgb(18_61_88/0.6)] ring-4 ring-ivory">
              <MapPin className="size-6" aria-hidden="true" />
            </span>
          </span>
          <p className="relative max-w-xs t-small">
            {fullAddress}
            <br />
            <span className="opacity-75">La carte est fournie par Google, qui peut déposer des cookies.</span>
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setActive(true)}
              className={cn(
                "min-h-11 rounded-full px-5 text-sm font-semibold transition",
                tone === "light" ? "bg-blue-deep text-ivory hover:bg-blue" : "bg-ivory text-blue-deep hover:bg-citron",
              )}
            >
              Afficher la carte
            </button>
            <a
              href={mapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 content-center rounded-full bg-ivory/70 px-5 text-sm font-semibold ring-1 ring-line transition hover:bg-ivory"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
