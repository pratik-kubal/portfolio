import { NextResponse } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyArtist = { name: string };
type SpotifyImage = { url: string };
type SpotifyAlbum = { name?: string; images?: SpotifyImage[] };
type SpotifyItem = {
  name: string;
  artists: SpotifyArtist[];
  album?: SpotifyAlbum;
  external_urls?: { spotify?: string };
  duration_ms?: number;
};

type Track = {
  title: string;
  artist: string;
  album: string | null;
  albumArt: string | null;
  url: string | null;
  progressMs: number | null;
  durationMs: number | null;
};

const CACHE_HEADER = "public, s-maxage=30, stale-while-revalidate=60";

function shape(
  item: SpotifyItem | null | undefined,
  progressMs: number | null,
): Track | null {
  if (!item) return null;
  return {
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album?.name ?? null,
    albumArt: item.album?.images?.[0]?.url ?? null,
    url: item.external_urls?.spotify ?? null,
    progressMs,
    durationMs: item.duration_ms ?? null,
  };
}

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string | null> {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });
  if (!r.ok) return null;
  const j = (await r.json()) as { access_token?: string };
  return j.access_token ?? null;
}

function emptyResponse() {
  return NextResponse.json(
    { isPlaying: false },
    { headers: { "Cache-Control": CACHE_HEADER } },
  );
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return emptyResponse();
  }

  try {
    const token = await getAccessToken(clientId, clientSecret, refreshToken);
    if (!token) return emptyResponse();

    const authHeader = { Authorization: `Bearer ${token}` };

    const np = await fetch(NOW_URL, { headers: authHeader, cache: "no-store" });
    if (np.status === 200) {
      const data = (await np.json()) as {
        item?: SpotifyItem;
        is_playing?: boolean;
        progress_ms?: number;
      };
      if (data?.item && data.is_playing) {
        const track = shape(data.item, data.progress_ms ?? null);
        return NextResponse.json(
          { isPlaying: true, track },
          { headers: { "Cache-Control": CACHE_HEADER } },
        );
      }
    }

    const rp = await fetch(RECENT_URL, {
      headers: authHeader,
      cache: "no-store",
    });
    if (rp.ok) {
      const data = (await rp.json()) as {
        items?: { track?: SpotifyItem }[];
      };
      const last = data.items?.[0]?.track;
      if (last) {
        return NextResponse.json(
          { isPlaying: false, track: shape(last, null) },
          { headers: { "Cache-Control": CACHE_HEADER } },
        );
      }
    }

    return emptyResponse();
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 500 });
  }
}
