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
        else normalized[key] = value;
      }
      return normalized;
    }

    function formatStream2(stream, providerName) {
      let quality = stream.quality || "1080p";
      
      // --- SPRACH-LOGIK (Flaggen) ---
      let language = "";
      const streamData = (stream.name + " " + (stream.title || "")).toUpperCase();
      
      if (streamData.includes("ENG")) {
        language = "\u{1F1EC}\u{1F1E7}"; // 🇬🇧 Englisch
      } else if (streamData.includes("ITA") || streamData.includes("SUB ITA")) {
        language = "\u{1F1EE}\u{1F1F9}"; // 🇮🇹 Italienisch
      } else {
        language = "\u{1F1EE}\u{1F1F9}"; // Standard 🇮🇹
      }

      // --- ANZEIGE KONFIGURATION ---
      // Obere Zeile: Name + Qualität
      const finalName = `\u{1F4E1} sc - ${quality}`;
      
      // Untere Zeile: Ordner + Titel + Flagge + ggf. Größe
      let finalTitle = `\u{1F4C1} ${stream.originalTitle || stream.title || "Stream"}`;
      if (language) finalTitle += ` | ${language}`;
      if (stream.size) finalTitle += ` | \u{1F4E6} ${stream.size}`;
      if (quality) finalTitle += ` | ${quality}`;

      const behaviorHints = stream.behaviorHints && typeof stream.behaviorHints === "object" ? __spreadValues({}, stream.behaviorHints) : {};
      let finalHeaders = normalizePlaybackHeaders(stream.headers);

      return __spreadProps(__spreadValues({}, stream), {
        name: finalName,
        title: finalTitle,
        language,
        behaviorHints,
        headers: finalHeaders,
        _nuvio_formatted: true
      });
    }
    module2.exports = { formatStream: formatStream2 };
  }
});

// src/fetch_helper.js
var require_fetch_helper = __commonJS({
  "src/fetch_helper.js"(exports2, module2) {
    var FETCH_TIMEOUT = 3e4;
    function createTimeoutSignal(timeoutMs) {
      const parsed = Number.parseInt(String(timeoutMs), 10);
      if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
        return { signal: AbortSignal.timeout(parsed), cleanup: null, timed: true };
      }
      return { signal: void 0, cleanup: null, timed: false };
    }
    function fetchWithTimeout(url, options = {}) {
      return __async(this, null, function* () {
        const timeoutConfig = createTimeoutSignal(options.timeout || FETCH_TIMEOUT);
        try {
          return yield fetch(url, __spreadValues({ signal: timeoutConfig.signal }, options));
        } finally {
          if (timeoutConfig.cleanup) timeoutConfig.cleanup();
        }
      });
    }
    module2.exports = { fetchWithTimeout, createTimeoutSignal };
  }
});

// src/quality_helper.js
var require_quality_helper = __commonJS({
  "src/quality_helper.js"(exports2, module2) {
    function checkQualityFromText2(text) {
      if (!text) return null;
      if (/RESOLUTION=\d+x2160/i.test(text)) return "4K";
      if (/RESOLUTION=\d+x1080/i.test(text)) return "1080p";
      if (/RESOLUTION=\d+x720/i.test(text)) return "720p";
      return null;
    }
    module2.exports = { checkQualityFromText: checkQualityFromText2 };
  }
});

// src/streamingcommunity/index.js
var { formatStream } = require_formatter();
var { checkQualityFromText } = require_quality_helper();
var TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
var USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function getStreamingCommunityBaseUrl() { return "https://vixsrc.to"; }

async function getStreams(id, type, season, episode, providerContext = null) {
  const baseUrl = getStreamingCommunityBaseUrl();
  let tmdbId = id.toString().replace("tmdb:", "");
  const apiUrl = type === "movie" ? `${baseUrl}/api/movie/${tmdbId}` : `${baseUrl}/api/tv/${tmdbId}/${season}/${episode}`;

  try {
    const response = await fetch(apiUrl, { headers: { "User-Agent": USER_AGENT, "Referer": baseUrl } });
    const apiPayload = await response.json();
    const embedUrl = apiPayload.src;
    if (!embedUrl) return [];

    const embedResp = await fetch(embedUrl, { headers: { "User-Agent": USER_AGENT, "Referer": baseUrl } });
    const embedHtml = await embedResp.text();
    
    const tokenMatch = embedHtml.match(/'token'\s*:\s*'([^']+)'/i);
    const expiresMatch = embedHtml.match(/'expires'\s*:\s*'([^']+)'/i);
    const urlMatch = embedHtml.match(/url\s*:\s*'([^']+\/playlist\/\d+[^']*)'/i);

    if (tokenMatch && urlMatch) {
      const streamUrl = `${urlMatch[1]}?token=${tokenMatch[1]}&expires=${expiresMatch ? expiresMatch[1] : ''}&h=1`;
      const result = {
        name: "sc",
        title: "Stream",
        url: streamUrl,
        quality: "1080p",
        headers: { "User-Agent": USER_AGENT, "Referer": embedUrl }
      };
      return [formatStream(result, "sc")];
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

module.exports = { getStreams };
