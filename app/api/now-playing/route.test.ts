import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { GET } from "./route";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type FetchHandler = (
  url: string,
  init?: RequestInit,
) => Response | Promise<Response>;

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function emptyStatus(status: number) {
  return new Response(null, { status });
}

let fetchMock: ReturnType<typeof vi.fn>;

function installFetch(handler: FetchHandler) {
  fetchMock.mockImplementation(
    (input: string | URL | Request, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      return Promise.resolve(handler(url, init));
    },
  );
}

function tokenOk(body: unknown) {
  return jsonResponse(body);
}

const ITEM_BASIC = {
  name: "Blade Runner Blues",
  artists: [{ name: "Vangelis" }],
  album: {
    name: "Blade Runner",
    images: [{ url: "https://img.example/cover.jpg" }],
  },
  external_urls: { spotify: "https://open.spotify.com/track/blade" },
  duration_ms: 540_000,
};

describe("GET /api/now-playing", () => {
  beforeEach(() => {
    process.env.SPOTIFY_CLIENT_ID = "client-id";
    process.env.SPOTIFY_CLIENT_SECRET = "client-secret";
    process.env.SPOTIFY_REFRESH_TOKEN = "refresh-token";
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
    delete process.env.SPOTIFY_REFRESH_TOKEN;
  });

  it("returns isPlaying:false when env vars are missing", async () => {
    delete process.env.SPOTIFY_REFRESH_TOKEN;
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ isPlaying: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns isPlaying:false when the token request fails", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return emptyStatus(401);
      throw new Error(`unexpected url ${url}`);
    });

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ isPlaying: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns isPlaying:false when token response lacks access_token", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({});
      throw new Error(`unexpected url ${url}`);
    });

    const res = await GET();
    expect(await res.json()).toEqual({ isPlaying: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("authenticates the token request with Basic auth and refresh grant", async () => {
    installFetch((url, init) => {
      if (url === TOKEN_URL) {
        const auth = (init?.headers as Record<string, string>).Authorization;
        const body = (init?.body as URLSearchParams).toString();
        expect(auth).toBe(
          `Basic ${Buffer.from("client-id:client-secret").toString("base64")}`,
        );
        expect(body).toBe(
          "grant_type=refresh_token&refresh_token=refresh-token",
        );
        return tokenOk({ access_token: "access" });
      }
      if (url === NOW_URL) return emptyStatus(204);
      if (url === RECENT_URL) return jsonResponse({ items: [] });
      throw new Error(`unexpected url ${url}`);
    });

    await GET();
    expect(fetchMock).toHaveBeenCalledWith(
      TOKEN_URL,
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns the currently-playing track when Spotify reports is_playing:true", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL)
        return jsonResponse({
          item: ITEM_BASIC,
          is_playing: true,
          progress_ms: 12_345,
        });
      throw new Error(`unexpected url ${url}`);
    });

    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, s-maxage=30, stale-while-revalidate=60",
    );
    expect(await res.json()).toEqual({
      isPlaying: true,
      track: {
        title: "Blade Runner Blues",
        artist: "Vangelis",
        album: "Blade Runner",
        albumArt: "https://img.example/cover.jpg",
        url: "https://open.spotify.com/track/blade",
        progressMs: 12_345,
        durationMs: 540_000,
      },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("joins multiple artists with a comma", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL)
        return jsonResponse({
          item: {
            ...ITEM_BASIC,
            artists: [{ name: "Daft Punk" }, { name: "Pharrell" }],
          },
          is_playing: true,
          progress_ms: 0,
        });
      throw new Error(`unexpected url ${url}`);
    });

    const body = (await (await GET()).json()) as {
      track: { artist: string };
    };
    expect(body.track.artist).toBe("Daft Punk, Pharrell");
  });

  it("sends the access token on Spotify data requests", async () => {
    installFetch((url, init) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access-abc" });
      if (url === NOW_URL) {
        expect((init?.headers as Record<string, string>).Authorization).toBe(
          "Bearer access-abc",
        );
        return jsonResponse({
          item: ITEM_BASIC,
          is_playing: true,
          progress_ms: 0,
        });
      }
      throw new Error(`unexpected url ${url}`);
    });

    await GET();
  });

  it("falls back to recently-played when no track is currently playing", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL) return emptyStatus(204);
      if (url === RECENT_URL)
        return jsonResponse({ items: [{ track: ITEM_BASIC }] });
      throw new Error(`unexpected url ${url}`);
    });

    const body = (await (await GET()).json()) as {
      isPlaying: boolean;
      track: { title: string; progressMs: number | null };
    };
    expect(body.isPlaying).toBe(false);
    expect(body.track.title).toBe("Blade Runner Blues");
    expect(body.track.progressMs).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("falls back to recently-played when currently-playing returns is_playing:false", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL)
        return jsonResponse({
          item: ITEM_BASIC,
          is_playing: false,
          progress_ms: 99,
        });
      if (url === RECENT_URL)
        return jsonResponse({
          items: [{ track: { ...ITEM_BASIC, name: "Last Song" } }],
        });
      throw new Error(`unexpected url ${url}`);
    });

    const body = (await (await GET()).json()) as {
      isPlaying: boolean;
      track: { title: string };
    };
    expect(body.isPlaying).toBe(false);
    expect(body.track.title).toBe("Last Song");
  });

  it("shapes tracks with null album art and url when Spotify omits them", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL) return emptyStatus(204);
      if (url === RECENT_URL)
        return jsonResponse({
          items: [
            {
              track: {
                name: "Sparse",
                artists: [{ name: "Someone" }],
              },
            },
          ],
        });
      throw new Error(`unexpected url ${url}`);
    });

    const body = (await (await GET()).json()) as {
      track: {
        album: string | null;
        albumArt: string | null;
        url: string | null;
        durationMs: number | null;
      };
    };
    expect(body.track.album).toBeNull();
    expect(body.track.albumArt).toBeNull();
    expect(body.track.url).toBeNull();
    expect(body.track.durationMs).toBeNull();
  });

  it("returns isPlaying:false when both endpoints have no track", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL) return emptyStatus(204);
      if (url === RECENT_URL) return jsonResponse({ items: [] });
      throw new Error(`unexpected url ${url}`);
    });

    const res = await GET();
    expect(await res.json()).toEqual({ isPlaying: false });
  });

  it("returns isPlaying:false when recently-played request itself fails", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL) return emptyStatus(204);
      if (url === RECENT_URL) return emptyStatus(500);
      throw new Error(`unexpected url ${url}`);
    });

    const res = await GET();
    expect(await res.json()).toEqual({ isPlaying: false });
  });

  it("returns a 500 error when an upstream call throws", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      throw new Error("network down");
    });

    const res = await GET();
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "upstream" });
  });

  it("sets the shared cache-control header on success responses", async () => {
    installFetch((url) => {
      if (url === TOKEN_URL) return tokenOk({ access_token: "access" });
      if (url === NOW_URL)
        return jsonResponse({
          item: ITEM_BASIC,
          is_playing: true,
          progress_ms: 0,
        });
      throw new Error(`unexpected url ${url}`);
    });

    const res = await GET();
    expect(res.headers.get("Cache-Control")).toBe(
      "public, s-maxage=30, stale-while-revalidate=60",
    );
  });
});
