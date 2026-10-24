/*
 * Nuvio provider: Authorized Streams
 * Only returns direct media URLs that you own or are explicitly authorized to distribute.
 *
 * IMPORTANT: Replace DATA_URL with the raw URL of your own hosted data/streams.json.
 * This provider does not scrape third-party streaming sites or bypass access controls.
 */
const DATA_URL = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/data/streams.json";

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    if (!/^https:\/\//i.test(DATA_URL) || DATA_URL.includes("YOUR_GITHUB_USERNAME")) {
      return [];
    }

    const response = await fetch(DATA_URL);
    if (!response || !response.ok) return [];

    const database = await response.json();
    const normalizedType = mediaType === "tv" || mediaType === "series" ? "tv" : "movie";
    const entries = Array.isArray(database.items) ? database.items : [];

    const matches = entries.filter(item => {
      if (String(item.tmdbId) !== String(tmdbId)) return false;
      const itemType = item.mediaType === "tv" || item.mediaType === "series" ? "tv" : "movie";
      if (itemType !== normalizedType) return false;
      if (normalizedType === "tv") {
        return Number(item.season) === Number(season) &&
               Number(item.episode) === Number(episode);
      }
      return true;
    });

    return matches
      .filter(item => typeof item.url === "string" &&
        /^https:\/\//i.test(item.url) &&
        (item.url.includes(".m3u8") || item.url.includes(".mp4") ||
         item.url.includes(".mpd") || item.format === "hls" ||
         item.format === "mp4" || item.format === "dash"))
      .map(item => ({
        name: "Authorized Streams",
        title: item.title || "Authorized direct stream",
        url: item.url,
        quality: item.quality || "Unknown",
        ...(item.language ? { language: item.language } : {})
      }));
  } catch (_) {
    // Fail safely when the data URL is unavailable or malformed.
    return [];
  }
}

module.exports = { getStreams };
