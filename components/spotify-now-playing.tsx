"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type Track = {
  title: string;
  artist: string;
  album?: string | null;
  albumArt?: string | null;
  url?: string | null;
  progressMs?: number | null;
  durationMs?: number | null;
};

type ApiResponse = { isPlaying?: boolean; track?: Track };

type Source = "live" | "recent" | "cache" | "placeholder" | "none";

type State = {
  isPlaying: boolean;
  track: Track | null;
  source: Source;
  loading: boolean;
};

type ForceState = "auto" | "live" | "last";

const CACHE_KEY = "pk.nowplaying.v1";
const POLL_MS = 30_000;

const PLACEHOLDER_TRACK: Track = {
  title: "Blade Runner Blues",
  artist: "Vangelis",
  album: "Blade Runner (Music From The Original Soundtrack)",
  albumArt: null,
  url: "https://open.spotify.com/track/575blCgesVtCu0HEYaIcas",
};

function readCache(): Track | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { track?: Track };
    return parsed.track ?? null;
  } catch {
    return null;
  }
}

function writeCache(track: Track) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ track, savedAt: Date.now() }),
    );
  } catch {
    /* ignore quota / disabled storage */
  }
}

function useNowPlaying(endpoint: string): State {
  // Start with an SSR-stable state; hydrate from localStorage after mount so
  // the server HTML and the first client render match.
  const [state, setState] = useState<State>({
    isPlaying: false,
    track: null,
    source: "none",
    loading: true,
  });

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const cached = readCache();
    if (cached) {
      setState({
        isPlaying: false,
        track: cached,
        source: "cache",
        loading: true,
      });
    }

    async function tick() {
      try {
        const r = await fetch(endpoint, { cache: "no-store" });
        if (!r.ok) throw new Error(`bad status ${r.status}`);
        const data = (await r.json()) as ApiResponse;
        if (!alive) return;
        if (data.track) {
          writeCache(data.track);
          setState({
            isPlaying: Boolean(data.isPlaying),
            track: data.track,
            source: data.isPlaying ? "live" : "recent",
            loading: false,
          });
        } else {
          setState((s) => ({
            isPlaying: false,
            track: s.track,
            source: s.track ? "cache" : "none",
            loading: false,
          }));
        }
      } catch {
        if (!alive) return;
        setState((s) => ({
          isPlaying: false,
          track: s.track ?? PLACEHOLDER_TRACK,
          source: s.track ? "cache" : "placeholder",
          loading: false,
        }));
      } finally {
        if (alive && !document.hidden) {
          timer = setTimeout(tick, POLL_MS);
        }
      }
    }

    function onVisibilityChange() {
      if (document.hidden) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      } else if (!timer && alive) {
        tick();
      }
    }

    tick();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [endpoint]);

  return state;
}

function SpotifyMark() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.52 17.293a.748.748 0 0 1-1.03.249c-2.818-1.724-6.365-2.114-10.541-1.158a.748.748 0 0 1-.332-1.459c4.568-1.045 8.487-.595 11.655 1.338a.749.749 0 0 1 .248 1.03zm1.473-3.277a.936.936 0 0 1-1.288.308c-3.225-1.981-8.14-2.555-11.956-1.398a.936.936 0 1 1-.543-1.79c4.358-1.323 9.776-.682 13.479 1.592a.937.937 0 0 1 .308 1.288zm.127-3.411c-3.868-2.297-10.248-2.508-13.942-1.388a1.123 1.123 0 1 1-.651-2.15c4.241-1.285 11.29-1.037 15.74 1.605a1.123 1.123 0 1 1-1.147 1.933z" />
    </svg>
  );
}

type BarStyle = CSSProperties & {
  "--tk-base": string;
  "--tk-peak": string;
  "--tk-dur": string;
  "--tk-delay": string;
};

export function SpotifyNowPlaying({
  endpoint,
  forceState,
}: {
  endpoint: string;
  forceState: ForceState;
}) {
  const { isPlaying: apiPlaying, track, source } = useNowPlaying(endpoint);

  const isPlaying =
    forceState === "live"
      ? true
      : forceState === "last"
        ? false
        : apiPlaying;

  const show = track ?? PLACEHOLDER_TRACK;
  const label = isPlaying
    ? "Listening To Right Now"
    : source === "placeholder" && forceState === "auto"
      ? "On Rotation"
      : "Was Listening to";

  const bars = useMemo(() => {
    const out: { style: BarStyle }[] = [];
    for (let i = 0; i < 48; i++) {
      const h = Math.min(
        1,
        0.3 +
          0.35 * Math.abs(Math.sin(i * 0.7)) +
          0.35 * Math.abs(Math.sin(i * 1.9 + 1)),
      );
      const dur = 0.6 + ((i * 7) % 9) / 10;
      const delay = -((i * 11) % 19) / 10;
      const base = Math.max(0.2, h * 0.5);
      // Round to 4 decimals so the string round-trips identically through
      // CSS parse — raw floats like 0.33714241840525316 can canonicalize
      // differently on server vs client and break React hydration.
      out.push({
        style: {
          height: `${Math.round(h * 100)}%`,
          "--tk-base": base.toFixed(4),
          "--tk-peak": h.toFixed(4),
          "--tk-dur": `${dur.toFixed(1)}s`,
          "--tk-delay": `${delay.toFixed(1)}s`,
        },
      });
    }
    return out;
  }, []);

  const marqueeUnit = `${show.title}  ·  ${show.artist}  ·  `;
  const marqueePieces = isPlaying
    ? marqueeUnit.repeat(4).split("  ·  ")
    : [show.title, show.artist];

  return (
    <div className="np-wrap" data-live={isPlaying ? "true" : "false"}>
      <div className="np-meta">
        <span>Spotify</span>
        <b>{label}</b>
      </div>
      <div className="tk-wave" aria-hidden="true">
        {bars.map((bar, i) => (
          <i key={i} style={bar.style} />
        ))}
      </div>
      <div className="tk-marq" aria-hidden="true">
        <span className="inner">
          {marqueePieces.map((piece, i) => (
            <Fragment key={i}>
              {i > 0 && <em>&nbsp;·&nbsp;</em>}
              {piece}
            </Fragment>
          ))}
        </span>
      </div>
      <div className="tk-meta">{show.album ?? ""}</div>
      <a
        className="np-cta"
        href={show.url ?? "https://open.spotify.com"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SpotifyMark /> Listen on Spotify ↗
      </a>
    </div>
  );
}
