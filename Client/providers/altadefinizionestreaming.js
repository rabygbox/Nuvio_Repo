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
    function shouldForceNotWebReadyForPlugin(stream, providerName, headers, behaviorHints) {
      const text = [
        stream == null ? void 0 : stream.url,
        stream == null ? void 0 : stream.name,
        stream == null ? void 0 : stream.title,
        stream == null ? void 0 : stream.server,
        providerName
      ].filter(Boolean).join(" ").toLowerCase();
      if (text.includes("loadm") || text.includes("loadm.cam") || text.includes("mixdrop") || text.includes("mxcontent")) {
        return true;
      }
      return false;
    }
    function normalizeProviderId(providerName) {
      const normalized = String(providerName || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
      return normalized || void 0;
    }
    function normalizeEpisodeTemplate(value) {
      return String(value || "").replace(
        /\b(\d{1,3})[xX](\d{1,3})\b/g,
        (_, season, episode) => `S${season.padStart(2, "0")}E${episode.padStart(2, "0")}`
      ).replace(
        /\bS(\d{1,3})\s*E(\d{1,3})\b/gi,
        (_, season, episode) => `S${season.padStart(2, "0")}E${episode.padStart(2, "0")}`
      );
    }
    var EASYJACK_LANGUAGE_FLAGS = {
      unknown: "\u{1F30E}",
      ita: "\u{1F1EE}\u{1F1F9}",
      italian: "\u{1F1EE}\u{1F1F9}",
      eng: "\u{1F1EC}\u{1F1E7}",
      english: "\u{1F1EC}\u{1F1E7}",
      jpn: "\u{1F1EF}\u{1F1F5}",
      japanese: "\u{1F1EF}\u{1F1F5}",
      ko: "\u{1F1F0}\u{1F1F7}",
      kor: "\u{1F1F0}\u{1F1F7}",
      korean: "\u{1F1F0}\u{1F1F7}",
      rus: "\u{1F1F7}\u{1F1FA}",
      russian: "\u{1F1F7}\u{1F1FA}",
      por: "\u{1F1F5}\u{1F1F9}",
      portuguese: "\u{1F1F5}\u{1F1F9}",
      fra: "\u{1F1EB}\u{1F1F7}",
      fre: "\u{1F1EB}\u{1F1F7}",
      french: "\u{1F1EB}\u{1F1F7}",
      spa: "\u{1F1EA}\u{1F1F8}",
      spanish: "\u{1F1EA}\u{1F1F8}",
      ger: "\u{1F1E9}\u{1F1EA}",
      deu: "\u{1F1E9}\u{1F1EA}",
      german: "\u{1F1E9}\u{1F1EA}",
      dut: "\u{1F1F3}\u{1F1F1}",
      nld: "\u{1F1F3}\u{1F1F1}",
      pol: "\u{1F1F5}\u{1F1F1}",
      cze: "\u{1F1E8}\u{1F1FF}",
      hun: "\u{1F1ED}\u{1F1FA}",
      hrv: "\u{1F1ED}\u{1F1F7}",
      ukr: "\u{1F1FA}\u{1F1E6}",
      dan: "\u{1F1E9}\u{1F1F0}",
      swe: "\u{1F1F8}\u{1F1EA}",
      nor: "\u{1F1F3}\u{1F1F4}",
      tur: "\u{1F1F9}\u{1F1F7}",
      ara: "\u{1F1F8}\u{1F1E6}",
      heb: "\u{1F1EE}\u{1F1F1}",
      ind: "\u{1F1EE}\u{1F1E9}",
      may: "\u{1F1F2}\u{1F1FE}",
      tha: "\u{1F1F9}\u{1F1ED}"
    };
    function formatEasyJackLanguage(value) {
      return String(value || "").trim().split(/\s*\/\s*/).map((part) => EASYJACK_LANGUAGE_FLAGS[part.trim().toLowerCase()] || part.trim()).filter(Boolean).join(" / ");
    }
    function formatEasyJackList(value) {
      if (Array.isArray(value)) return value.flatMap(formatEasyJackList);
      const text = String(value || "").trim();
      return text ? text.split(/\s*(?:\||\/)\s*/).map((item) => item.trim()).filter(Boolean) : [];
    }
    function formatEasyJackFilename(stream, fallbackTitle = "Stream") {
      var _a;
      const raw = String(
        ((_a = stream == null ? void 0 : stream.behaviorHints) == null ? void 0 : _a.filename) || (stream == null ? void 0 : stream.filename) || (stream == null ? void 0 : stream.fileName) || (stream == null ? void 0 : stream.debridFilename) || fallbackTitle || "Stream"
      ).trim();
      return raw.replace(/\\/g, "/").split("/").pop() || fallbackTitle || "Stream";
    }
    function formatEasyJackDescription(stream = {}, titleOverride = "") {
      const filename = formatEasyJackFilename(stream, titleOverride || stream.originalTitle || stream.title);
      const sourceQuality = String(
        stream.releaseQuality || stream.sourceQuality || (stream.quality && !/^(?:4k|2160p|1440p|2k|1080p|fhd|720p|hd|576p|480p|360p|240p|sd|unknown)$/i.test(String(stream.quality).trim()) ? stream.quality : "")
      ).trim();
      const visualTags = formatEasyJackList(stream.visualTags || stream.visual_tags);
      const encode = String(stream.encode || stream.videoCodec || stream.video_codec || "").trim();
      const videoLine = [
        sourceQuality ? `\u{1F3A5} ${sourceQuality}` : "",
        visualTags.length > 0 ? `\u{1F4FA} ${visualTags.join(" | ")}` : "",
        encode ? `\u{1F39E}\uFE0F ${encode}` : ""
      ].filter(Boolean).join(" ");
      const audioTags = formatEasyJackList(stream.audioTags || stream.audio_tags || stream.audioTag || stream.audioCodec || stream.audio_codec);
      const audioChannels = formatEasyJackList(stream.audioChannels || stream.audio_channels || stream.audioChannel || stream.audio_channel);
      const audioLine = [
        audioTags.length > 0 ? `\u{1F3A7} ${audioTags.join(" | ")}` : "",
        audioChannels.length > 0 ? `\u{1F50A} ${audioChannels.join(" | ")}` : ""
      ].filter(Boolean).join(" ");
      const languageValue = stream.languageDefaulted ? "UNKNOWN" : Array.isArray(stream.languageEmojis) && stream.languageEmojis.length > 0 ? stream.languageEmojis.join(" / ") : stream.language || "";
      const language = formatEasyJackLanguage(languageValue);
      const languageSizeLine = [
        language ? `\u{1F5E3}\uFE0F ${language}` : "",
        stream.size ? `\u{1F4BE} ${String(stream.size).trim()}` : ""
      ].filter(Boolean).join(" ");
      return [
        `\u{1F4C1} ${filename}`,
        videoLine,
        audioLine,
        languageSizeLine,
        "\u{1F50D} EasyJack \u{1F4E1} EasyStreams"
      ].filter(Boolean).join("\n");
    }
    function formatStream2(stream, providerName) {
      let quality = stream.resolution || stream.quality || "";
      if (["4k", "2160p"].includes(String(quality).toLowerCase())) quality = "\u{1F525}4K UHD";
      else if (quality === "1440p") quality = "\u2728 QHD";
      else if (quality === "1080p") quality = "\u{1F680} FHD";
      else if (quality === "720p") quality = "\u{1F4BF} HD";
      else if (quality === "576p" || quality === "480p" || quality === "360p" || quality === "240p") quality = "\u{1F4A9} Low Quality";
      else if (!quality || ["auto", "unknown", "unknow"].includes(String(quality).toLowerCase())) quality = "\u{1F4BF} HD";
      const normalizedTitle = normalizeEpisodeTemplate(stream.title || "Stream");
      let title = `\u{1F4C1} ${normalizedTitle}`;
      let language = stream.language;
      const isEasyJackProvider = String(providerName || "").trim().toLowerCase() === "easyjack";
      if (isEasyJackProvider) {
        language = formatEasyJackLanguage(language);
      } else if (language === "Italian") {
        language = "\u{1F1EE}\u{1F1F9}";
      } else if (language === void 0 || language === null) {
        language = "";
      }
      let details = [];
      if (stream.size) details.push(`\u{1F4E6} ${stream.size}`);
      const desc = details.join(" | ");
      let pName = stream.name || stream.server || providerName;
      if (pName) {
        pName = pName.replace(/\s*\[?\(?\s*SUB\s*ITA\s*\)?\]?/i, "").replace(/\s*\[?\(?\s*ITA\s*\)?\]?/i, "").replace(/\s*\[?\(?\s*SUB\s*\)?\]?/i, "").replace(/\(\s*\)/g, "").replace(/\[\s*\]/g, "").trim();
      }
      if (pName === providerName) {
        pName = pName.charAt(0).toUpperCase() + pName.slice(1);
      }
      if (pName) {
        pName = `\u{1F4E1} ${pName}`;
      }
      const formattedDescription = isEasyJackProvider ? formatEasyJackDescription(stream, normalizedTitle) : desc;
      const behaviorHints = stream.behaviorHints && typeof stream.behaviorHints === "object" ? __spreadValues({}, stream.behaviorHints) : {};
      let finalHeaders = stream.headers;
      if (behaviorHints.proxyHeaders && behaviorHints.proxyHeaders.request) {
        finalHeaders = behaviorHints.proxyHeaders.request;
      } else if (behaviorHints.headers) {
        finalHeaders = behaviorHints.headers;
      }
      finalHeaders = normalizePlaybackHeaders(finalHeaders);
      const isStreamingCommunityProvider = String(providerName || "").toLowerCase() === "streamingcommunity" || String((stream == null ? void 0 : stream.name) || "").toLowerCase().includes("streamingcommunity");
      if (isStreamingCommunityProvider && !finalHeaders) {
        delete behaviorHints.proxyHeaders;
        delete behaviorHints.headers;
        delete behaviorHints.notWebReady;
      }
      if (finalHeaders) {
        behaviorHints.proxyHeaders = behaviorHints.proxyHeaders || {};
        behaviorHints.proxyHeaders.request = finalHeaders;
        behaviorHints.headers = finalHeaders;
      }
      const providerExplicitNotWebReady = stream.behaviorHints && "notWebReady" in stream.behaviorHints;
      const shouldForceNotWebReady = shouldForceNotWebReadyForPlugin(stream, providerName, finalHeaders, behaviorHints);
      if (!isStreamingCommunityProvider && shouldForceNotWebReady) {
        behaviorHints.notWebReady = true;
      } else if (!providerExplicitNotWebReady) {
        delete behaviorHints.notWebReady;
      }
      const finalName = pName;
      let finalTitle = isEasyJackProvider ? formattedDescription : `\u{1F4C1} ${normalizedTitle}`;
      if (!isEasyJackProvider) {
        if (desc) finalTitle += ` | ${desc}`;
        if (language) finalTitle += ` | ${language}`;
      }
      const playbackReferer = stream.referer || (finalHeaders == null ? void 0 : finalHeaders.Referer) || (finalHeaders == null ? void 0 : finalHeaders.referer);
      const playbackUserAgent = stream.userAgent || (finalHeaders == null ? void 0 : finalHeaders["User-Agent"]) || (finalHeaders == null ? void 0 : finalHeaders["user-agent"]);
      return __spreadProps(__spreadValues({}, stream), {
        // Keep original properties
        name: finalName,
        title: finalTitle,
        // Metadata for Stremio UI reconstruction (safer names for RN)
        providerName: pName,
        qualityTag: quality,
        description: formattedDescription,
        originalTitle: normalizedTitle,
        // Ensure language is set for Stremio/Nuvio sorting
        language,
        // Mark as formatted
        _nuvio_formatted: true,
        behaviorHints,
        provider: stream.provider || normalizeProviderId(providerName),
        referer: playbackReferer,
        userAgent: playbackUserAgent,
        // Explicitly ensure root headers are preserved for Nuvio
        headers: finalHeaders
      });
    }
    module2.exports = { formatEasyJackDescription, formatStream: formatStream2 };
  }
});

// src/altadefinizionestreaming/index.js
var TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
var BASE_URL = "https://altadefinizionestreaming.net";
var USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36";
var CDN_PROBE_TIMEOUT_MS = 500;
var SESSION_COOKIE = "sid=32234dfabd14e587764e84405e75e99856c6bef31c6b1752e19897b8ae3d4a21";
var DOMAINS_CONFIG_URL = "https://raw.githubusercontent.com/realbestia1/domains/refs/heads/main/domains.json";
var REMOTE_CONFIG_CACHE_MS = 5 * 60 * 1e3;
var remoteConfigCache = { baseUrl: "", cookie: "", expiresAt: 0 };
var { formatStream } = require_formatter();
function fetchRemoteConfig() {
  return __async(this, null, function* () {
    if (remoteConfigCache.expiresAt > Date.now() && (remoteConfigCache.baseUrl || remoteConfigCache.cookie)) {
      return remoteConfigCache;
    }
    try {
      const response = yield fetch(DOMAINS_CONFIG_URL, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
      });
      if (response.ok) {
        const payload = yield response.json();
        const baseUrl = String((payload == null ? void 0 : payload.ADS) || "").trim().replace(/\/+$/, "");
        const cookie = String((payload == null ? void 0 : payload.ADS_COOKIE) || "").trim();
        if (baseUrl || cookie) {
          remoteConfigCache = { baseUrl, cookie, expiresAt: Date.now() + REMOTE_CONFIG_CACHE_MS };
        }
      }
    } catch (e) {
    }
    return remoteConfigCache;
  });
}
function getCookie(remoteCookie = "") {
  return __async(this, null, function* () {
    var _a, _b;
    if (remoteCookie) return remoteCookie;
    if (remoteConfigCache.cookie) return remoteConfigCache.cookie;
    try {
      return (((_a = globalThis == null ? void 0 : globalThis.SCRAPER_SETTINGS) == null ? void 0 : _a.altadefinizioneCookie) || ((_b = process == null ? void 0 : process.env) == null ? void 0 : _b.ALTADEFINIZIONE_COOKIE) || SESSION_COOKIE || "").trim();
    } catch (e) {
      return SESSION_COOKIE || "";
    }
  });
}
function fetchJson(url, cookie) {
  return __async(this, null, function* () {
    try {
      const headers = {
        "User-Agent": USER_AGENT,
        "Referer": `${BASE_URL}/`,
        "Accept": "application/json,text/plain,*/*"
      };
      if (cookie && url.startsWith(BASE_URL)) headers.Cookie = cookie;
      const response = yield fetch(url, { headers });
      if (!response.ok) return null;
      return yield response.json();
    } catch (e) {
      return null;
    }
  });
}
function resolveTmdbId(id, type, providerContext = null) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d;
    const contextTmdbId = providerContext && /^\d+$/.test(String(providerContext.tmdbId || "")) ? String(providerContext.tmdbId) : null;
    if (contextTmdbId) return contextTmdbId;
    const idStr = String(id || "").trim();
    if (/^tmdb:\d+$/i.test(idStr)) return idStr.split(":")[1];
    if (/^\d+$/.test(idStr)) return idStr;
    const contextImdbId = providerContext && /^tt\d+$/i.test(String(providerContext.imdbId || "")) ? String(providerContext.imdbId) : null;
    const imdbId = /^tt\d+$/i.test(idStr) ? idStr : contextImdbId;
    if (!imdbId) return null;
    const normalizedType = String(type || "").toLowerCase();
    const payload = yield fetchJson(`https://api.themoviedb.org/3/find/${encodeURIComponent(imdbId)}?api_key=${TMDB_API_KEY}&external_source=imdb_id`);
    if (!payload) return null;
    if (normalizedType === "movie") {
      if (Array.isArray(payload.movie_results) && ((_a = payload.movie_results[0]) == null ? void 0 : _a.id)) return String(payload.movie_results[0].id);
      if (Array.isArray(payload.tv_results) && ((_b = payload.tv_results[0]) == null ? void 0 : _b.id)) return String(payload.tv_results[0].id);
    }
    if (Array.isArray(payload.tv_results) && ((_c = payload.tv_results[0]) == null ? void 0 : _c.id)) return String(payload.tv_results[0].id);
    if (Array.isArray(payload.movie_results) && ((_d = payload.movie_results[0]) == null ? void 0 : _d.id)) return String(payload.movie_results[0].id);
    return null;
  });
}
function getShowTitle(tmdbId, type) {
  return __async(this, null, function* () {
    const endpoint = String(type || "").toLowerCase() === "movie" ? "movie" : "tv";
    const payload = yield fetchJson(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=it-IT`);
    if (!payload) return null;
    return payload.title || payload.name || payload.original_title || payload.original_name || null;
  });
}
function isCdnAllowedQuickly(url, headers) {
  return __async(this, null, function* () {
    if (typeof AbortController === "undefined" || typeof setTimeout !== "function" || typeof clearTimeout !== "function") return true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CDN_PROBE_TIMEOUT_MS);
    try {
      const response = yield fetch(url, {
        headers: __spreadProps(__spreadValues({}, headers), { Range: "bytes=0-0" }),
        signal: controller.signal
      });
      if (response.body && typeof response.body.cancel === "function") {
        response.body.cancel().catch(() => {
        });
      }
      return response.status !== 403;
    } catch (e) {
      return true;
    } finally {
      clearTimeout(timeoutId);
    }
  });
}
function addCdnStream(streams, tmdbId, type, season, episode, displayName, cookie) {
  return __async(this, null, function* () {
    var _a, _b;
    const normalizedType = String(type || "").toLowerCase();
    const endpoint = normalizedType === "movie" ? `${BASE_URL}/api/player-sources/movie/${tmdbId}` : `${BASE_URL}/api/player-sources/tv/${tmdbId}/${season}/${episode}`;
    const payload = yield fetchJson(endpoint, cookie);
    const isAllowed = (s) => (s == null ? void 0 : s.url) && !/vixsrc\.to/i.test(String(s.url));
    const source = ((_a = payload == null ? void 0 : payload.sources) == null ? void 0 : _a.find((s) => String((s == null ? void 0 : s.provider) || "").toLowerCase() === "cdn" && isAllowed(s))) || ((_b = payload == null ? void 0 : payload.sources) == null ? void 0 : _b.find((s) => isAllowed(s)));
    if (!(source == null ? void 0 : source.url)) return;
    const headers = { "User-Agent": USER_AGENT, "Referer": `${BASE_URL}/` };
    if (!(yield isCdnAllowedQuickly(source.url, headers))) return;
    streams.push({
      name: "AltadefinizioneStreaming - CDN",
      title: displayName,
      url: source.url,
      easyProxySourceUrl: endpoint,
      headers,
      quality: "720p",
      type: "direct",
      language: ""
    });
  });
}
function getStreams(id, type, season, episode, providerContext = null) {
  return __async(this, null, function* () {
    const normalizedType = String(type || "").toLowerCase();
    if (normalizedType !== "movie" && normalizedType !== "tv" && normalizedType !== "series") return [];
    const remote = yield fetchRemoteConfig();
    if (remote.baseUrl) BASE_URL = remote.baseUrl;
    const cookie = yield getCookie(remote.cookie);
    const adsStartedAt = Date.now();
    const adsPhases = { tmdbMs: 0, titleMs: 0, cdnMs: 0 };
    let tTmdb = Date.now();
    const tmdbId = yield resolveTmdbId(id, normalizedType === "movie" ? "movie" : "tv", providerContext);
    adsPhases.tmdbMs += Date.now() - tTmdb;
    if (!tmdbId) return [];
    const effectiveSeason = parseInt(String(season || ""), 10) || 1;
    const effectiveEpisode = parseInt(String(episode || ""), 10) || 1;
    const providerType = normalizedType === "movie" ? "movie" : "tv";
    const tTitle = Date.now();
    const showTitle = (yield getShowTitle(tmdbId, providerType)) || (normalizedType === "movie" ? "Film" : "Serie");
    adsPhases.titleMs += Date.now() - tTitle;
    const displayName = normalizedType === "movie" ? showTitle : `${showTitle} ${effectiveSeason}x${effectiveEpisode}`;
    const streams = [];
    const tCdn = Date.now();
    yield addCdnStream(streams, tmdbId, providerType, effectiveSeason, effectiveEpisode, displayName, cookie);
    adsPhases.cdnMs += Date.now() - tCdn;
    console.warn("[altadefinizionestreaming][PhaseTiming]", JSON.stringify(__spreadProps(__spreadValues({}, adsPhases), { totalMs: Date.now() - adsStartedAt, streams: streams.length })));
    return streams.map((s) => formatStream(s, "AltadefinizioneStreaming")).filter(Boolean);
  });
}
module.exports = { getStreams };
