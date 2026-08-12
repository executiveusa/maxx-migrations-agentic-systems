"use client";

import { useReducedMotion } from "motion/react";

const VIDEO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b7/Snoqualmie_Falls_2019-03-01_1063.ogv/Snoqualmie_Falls_2019-03-01_1063.ogv.480p.vp9.webm";
const POSTER_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Snoqualmie_Falls_2019-03-01_1063.ogv/960px--Snoqualmie_Falls_2019-03-01_1063.ogv.jpg";

export function SnoqualmieHeroMedia() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion !== false) {
    return (
      <img
        src={POSTER_URL}
        alt="Snoqualmie Falls in Washington"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={POSTER_URL}
      aria-label="Snoqualmie Falls flowing in Washington"
    >
      <source src={VIDEO_URL} type="video/webm" />
    </video>
  );
}
