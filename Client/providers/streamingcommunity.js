var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/formatter.js
var require_formatter = __commonJS({
  "src/formatter.js"(exports2, module2) {
    function normalizePlaybackHeaders(headers) {
      if (!headers || typeof headers !== "object") return headers;
      const normalized = {};
      for (const [key, value] of Object.entries(headers)) {
        if (value == null) continue;
        const lowerKey = String(key).toLowerCase();
        if (lowerKey === "user-agent") normalized["User-Agent"] = value;
        else if (lowerKey === "referer" || lowerKey === "referrer") normalized["Referer"] = value;
        else if (lowerKey === "origin") normalized["Origin"] = value;
        else if (lowerKey === "accept") normalized["Accept"] = value;
        else if (lowerKey === "accept-language") normalized["Accept-Language"] = value;
        else normalized[key] = value;
      }
      return normalized;
    }
    function formatStream2(stream, providerName) {
      let quality = stream.quality || "1080p";
      let title = `\u{1F4C1} ${stream.title || "Stream"}`;
      let language = stream.language || "🇮🇹";
      const behaviorHints = stream.behaviorHints && typeof stream.behaviorHints === "object" ? __spreadValues({}, stream.behaviorHints) : {};
      let finalHeaders = normalizePlaybackHeaders(stream.headers);
      if (finalHeaders) {
        behaviorHints.proxyHeaders = { request: finalHeaders };
        behaviorHints.headers = finalHeaders;
      }
      return __spreadProps(__spreadValues({}, stream), {
        name: `🍿 •Play`,
        title: `${title} | ${quality} | ${language}`,
        behaviorHints
      });
    }
    module2.exports = { formatStream: formatStream2 };
  }
});

// src/streamingcommunity/index.js
function getStreamingCommunityBaseUrl() {
  return "https://streamingcommunity.dog";
}

var { formatStream } = require_formatter();
var TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function getCommonHeaders() {
  return {
    "User-Agent": USER_AGENT,
    "Referer": `${getStreamingCommunityBaseUrl()}/`,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "it-IT,it;q=0.9"
  };
}

function extractMasterPlaylistFromEmbedHtml(html) {
  if (!html) return null;
  const tokenMatch = html.match(/['"]token['"]\s*:\s*['"]([^'"]+)['"]/i);
  const expiresMatch = html.match(/['"]expires['"]\s*:\s*['"]([^'"]+)['"]/i);
  const urlMatch = html.match(/['"]url['"]\s*:\s*['"]([^'"]+)['"]/i);
  
  if (!tokenMatch || !expiresMatch || !urlMatch) return null;
  return {
    token: tokenMatch[1],
    expires: expiresMatch[1],
    url: urlMatch[1].replace(/\\/g, "")
  };
}

async function getTmdbId(imdbId, type) {
  const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = type === "movie" ? data.movie_results : data.tv_results;
    return results?.[0]?.id?.toString() || null;
  } catch (e) { return null; }
}

async function getStreams(id, type, season, episode) {
  const baseUrl = getStreamingCommunityBaseUrl();
  let tmdbId = id.includes("tt") ? await getTmdbId(id, type === "series" ? "tv" : type) : id.replace("tmdb:", "");
  
  if (!tmdbId) return [];

  const apiUrl = type === "movie" 
    ? `${baseUrl}/api/movie/${tmdbId}` 
    : `${baseUrl}/api/tv/${tmdbId}/${season}/${episode}`;

  try {
    const response = await fetch(apiUrl, { headers: getCommonHeaders() });
    const apiPayload = await response.json();
    let embedUrl = apiPayload.src || apiPayload.url;
    if (!embedUrl) return [];
    if (embedUrl.startsWith("/")) embedUrl = baseUrl + embedUrl;

    const embedRes = await fetch(embedUrl, { headers: { "User-Agent": USER_AGENT, "Referer": baseUrl } });
    const embedHtml = await embedRes.text();
    const playlistData = extractMasterPlaylistFromEmbedHtml(embedHtml);

    if (playlistData) {
      const finalUrl = playlistData.url.startsWith("http") 
        ? `${playlistData.url}?token=${playlistData.token}&expires=${playlistData.expires}&h=1`
        : `${baseUrl}${playlistData.url}?token=${playlistData.token}&expires=${playlistData.expires}&h=1`;

      const streamHeaders = {
        "User-Agent": USER_AGENT,
        "Referer": embedUrl,
        "Origin": new URL(embedUrl).origin
      };

      const result = {
        url: finalUrl,
        headers: streamHeaders,
        behaviorHints: { notWebReady: false }
      };

      return [formatStream(result, "StreamingCommunity")];
    }
  } catch (e) {
    console.error("StreamingCommunity Error:", e);
  }
  return [];
}

module.exports = { getStreams };
