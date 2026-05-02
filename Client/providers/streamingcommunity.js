// --- StreamingCommunity Plugin Full Update ---

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
      try { step(generator.next(value)); } catch (e) { reject(e); }
    };
    var rejected = (value) => {
      try { step(generator.throw(value)); } catch (e) { reject(e); }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/formatter.js
var require_formatter = __commonJS({
  "src/formatter.js"(exports2, module2) {
    function formatStream2(stream, providerName) {
      const behaviorHints = stream.behaviorHints || {};
      const headers = stream.headers || {};
      
      return __spreadProps(__spreadValues({}, stream), {
        name: `🍿 SC • Play`,
        title: `\u{1F4C1} ${stream.title || "StreamingCommunity"} | 1080p | 🇮🇹`,
        behaviorHints: __spreadValues(behaviorHints, {
          proxyHeaders: { request: headers },
          notWebReady: false
        })
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
  const baseUrl = getStreamingCommunityBaseUrl();
  return {
    "User-Agent": USER_AGENT,
    "Referer": `${baseUrl}/`,
    "Accept": "application/json, text/plain, */*",
    "X-Requested-With": "XMLHttpRequest"
  };
}

function extractPlaylistData(html) {
  if (!html) return null;
  // Verbesserte Regex für verschiedene Anführungszeichen und Escaping
  const token = html.match(/['"]token['"]\s*[:=]\s*['"]([^'"]+)['"]/i);
  const expires = html.match(/['"]expires['"]\s*[:=]\s*['"]([^'"]+)['"]/i);
  const url = html.match(/['"]url['"]\s*[:=]\s*['"]([^'"]+)['"]/i);
  
  if (!token || !expires || !url) return null;
  
  return {
    token: token[1],
    expires: expires[1],
    url: url[1].replace(/\\/g, "")
  };
}

async function getTmdbId(imdbId, type) {
  const endpoint = type === "movie" ? "movie" : "tv";
  const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = type === "movie" ? data.movie_results : data.tv_results;
    return results && results.length > 0 ? results[0].id.toString() : null;
  } catch (e) { return null; }
}

async function getStreams(id, type, season, episode) {
  const baseUrl = getStreamingCommunityBaseUrl();
  const normalizedType = (type === "series" || type === "tv") ? "tv" : "movie";
  
  // ID Auflösung
  let tmdbId = id.toString().replace("tmdb:", "");
  if (tmdbId.startsWith("tt")) {
    tmdbId = await getTmdbId(tmdbId, normalizedType);
  }
  
  if (!tmdbId) return [];

  const apiUrl = normalizedType === "movie" 
    ? `${baseUrl}/api/movie/${tmdbId}` 
    : `${baseUrl}/api/tv/${tmdbId}/${season}/${episode}`;

  try {
    const response = await fetch(apiUrl, { headers: getCommonHeaders() });
    if (!response.ok) return [];
    
    const apiPayload = await response.json();
    // Flexiblerer Zugriff auf die Embed-URL
    let embedUrl = apiPayload.src || apiPayload.url || (apiPayload.data ? apiPayload.data.link : null);
    
    if (!embedUrl) return [];
    if (embedUrl.startsWith("/")) embedUrl = baseUrl + embedUrl;

    const embedRes = await fetch(embedUrl, { 
      headers: { "User-Agent": USER_AGENT, "Referer": baseUrl } 
    });
    const embedHtml = await embedRes.text();
    const playlist = extractPlaylistData(embedHtml);

    if (playlist) {
      const finalUrl = playlist.url.startsWith("http") 
        ? `${playlist.url}?token=${playlist.token}&expires=${playlist.expires}&h=1`
        : `${baseUrl}${playlist.url}?token=${playlist.token}&expires=${playlist.expires}&h=1`;

      const streamHeaders = {
        "User-Agent": USER_AGENT,
        "Referer": embedUrl,
        "Origin": new URL(embedUrl).origin
      };

      const result = {
        url: finalUrl,
        title: "Stream",
        headers: streamHeaders
      };

      return [formatStream(result, "StreamingCommunity")];
    }
  } catch (error) {
    console.error("[SC Plugin] Critical Error:", error);
  }
  return [];
}

module.exports = { getStreams };
