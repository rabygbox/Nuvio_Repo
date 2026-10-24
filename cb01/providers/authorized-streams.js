
/*
 * Nuvio: Authorized Streams
 *
 * Liest direkte, autorisierte HTTPS-Medienlinks.
 * Ruft keine CB01- oder Hosting-Playerseiten ab und
 * extrahiert keine Streams aus eingebetteten Playern.
 */

const STREAMS_URL = "";

const LOCAL_STREAMS = [
  /*
  {
    tmdbId: "603",
    mediaType: "movie",
    title: "Beispiel-Film",
    url: "https://media.deine-domain.de/film.mp4",
    provider: "MixDrop HD",
    quality: "1080p",
    type: "mp4",
    language: "it"
  },
  {
    tmdbId: "1399",
    mediaType: "series",
    season: 1,
    episode: 1,
    title: "Beispiel-Serie – Folge 1",
    url: "https://media.deine-domain.de/folge.m3u8",
    provider: "MaxStream",
    quality: "720p",
    type: "hls",
    language: "it"
  }
  */
];

function isDirectHttpsUrl(url) {
  if (typeof url !== "string") return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" &&
      parsed.hostname.length > 0;
  } catch (_) {
    return false;
  }
}

async function loadStreams() {
  if (!STREAMS_URL) {
    return LOCAL_STREAMS;
  }

  try {
    const response = await fetch(STREAMS_URL);

    if (!response || !response.ok) {
      return LOCAL_STREAMS;
    }

    const data = await response.json();

    return Array.isArray(data) ? data : LOCAL_STREAMS;
  } catch (_) {
    return LOCAL_STREAMS;
  }
}

async function getStreams(
  tmdbId,
  mediaType,
  season,
  episode
) {
  const entries = await loadStreams();

  return entries
    .filter(item => {
      if (!item || !isDirectHttpsUrl(item.url)) {
        return false;
      }

      if (String(item.tmdbId) !== String(tmdbId)) {
        return false;
      }

      const itemType = String(
        item.mediaType || "movie"
      ).toLowerCase();

      if (itemType !== String(mediaType).toLowerCase()) {
        return false;
      }

      if (itemType === "series") {
        return Number(item.season) === Number(season) &&
          Number(item.episode) === Number(episode);
      }

      return true;
    })
    .map(item => ({
      title: item.title || "Authorized stream",
      name: item.provider || "Direct stream",
      url: item.url,
      quality: item.quality || "Unknown",
      language: item.language || "it",
      provider: item.provider || "Authorized streams",
      type:
        item.type === "hls" ||
        /\.m3u8(?:$|\?)/i.test(item.url)
          ? "hls"
          : undefined
    }));
}

module.exports = { getStreams };
