"use client";

import { useEffect, useState } from "react";
import { footer } from "@/data/portfolio";

// Footer "was listening to" card. Wired to the existing /api/now-playing endpoint;
// the static design copy (footer.spotifyFallback) is the no-data / no-JS fallback.
const WAVE = [
  30, 55, 42, 70, 38, 85, 50, 62, 95, 45, 33, 60, 78, 40, 52, 88, 48, 35, 66,
  58, 100, 44, 30, 72, 54, 82, 46, 38, 64, 90, 42, 56, 34, 68, 76, 40, 50, 84,
  46, 32, 60, 52, 74, 38, 80, 44, 30, 58,
];

type Track = {
  title: string;
  artist: string;
  album: string | null;
  url: string | null;
};

export function SpotifyCard() {
  const [track, setTrack] = useState<Track | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/now-playing", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data?.track) return;
        setTrack(data.track as Track);
        setLive(Boolean(data.isPlaying));
      })
      .catch(() => {
        /* keep the static fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  const title = track
    ? `${track.title} · ${track.artist}`
    : footer.spotifyFallback.title;
  const album = track ? track.album ?? track.artist : footer.spotifyFallback.album;
  const url = track?.url ?? null;
  const label = live ? "Listening to" : "Was listening to";

  return (
    <div className="pk-spotify" aria-label={`${label} on Spotify`}>
      <div className="pk-spotify-meta">
        <span>Spotify</span>
        <span>{label}</span>
      </div>
      <div className="pk-wave" aria-hidden="true">
        {WAVE.map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="pk-spotify-title">{title}</p>
      <p className="pk-spotify-album">{album}</p>
      {url ? (
        <a
          href={url}
          className="pk-spotify-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="ico" aria-hidden="true" />
          <span>
            Listen on Spotify{" "}
            <span style={{ fontFamily: "var(--font-display)" }}>↗</span>
          </span>
        </a>
      ) : (
        <span className="pk-spotify-cta">
          <span className="ico" aria-hidden="true" />
          <span>
            Listen on Spotify{" "}
            <span style={{ fontFamily: "var(--font-display)" }}>↗</span>
          </span>
        </span>
      )}
    </div>
  );
}
