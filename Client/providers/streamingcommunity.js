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

// src/fetch_helper.js
var require_fetch_helper = __commonJS({
  "src/fetch_helper.js"(exports2, module2) {
    var FETCH_TIMEOUT = 3e4;
    function createTimeoutSignal(timeoutMs) {
      const parsed = Number.parseInt(String(timeoutMs), 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return { signal: void 0, cleanup: null, timed: false };
      }
      if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
        return { signal: AbortSignal.timeout(parsed), cleanup: null, timed: true };
      }
      if (typeof AbortController !== "undefined" && typeof setTimeout === "function") {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, parsed);
        return {
          signal: controller.signal,
          cleanup: () => clearTimeout(timeoutId),
          timed: true
        };
      }
      return { signal: void 0, cleanup: null, timed: false };
    }
    function fetchWithTimeout(_0) {
      return __async(this, arguments, function* (url, options = {}) {
        if (typeof fetch === "undefined") {
          throw new Error("No fetch implementation found!");
        }
        const _a = options, { timeout } = _a, fetchOptions = __objRest(_a, ["timeout"]);
        const requestTimeout = timeout || FETCH_TIMEOUT;
        const timeoutConfig = createTimeoutSignal(requestTimeout);
        const requestOptions = __spreadValues({}, fetchOptions);
        if (timeoutConfig.signal) {
          if (requestOptions.signal && typeof AbortSignal !== "undefined" && typeof AbortSignal.any === "function") {
            requestOptions.signal = AbortSignal.any([requestOptions.signal, timeoutConfig.signal]);
          } else if (!requestOptions.signal) {
            requestOptions.signal = timeoutConfig.signal;
          }
        }
        try {
          const response = yield fetch(url, requestOptions);
          return response;
        } catch (error) {
          if (error && error.name === "AbortError" && timeoutConfig.timed) {
            throw new Error(`Request to ${url} timed out after ${requestTimeout}ms`);
          }
          throw error;
        } finally {
          if (typeof timeoutConfig.cleanup === "function") {
            timeoutConfig.cleanup();
          }
        }
      });
    }
    module2.exports = { fetchWithTimeout, createTimeoutSignal };
  }
});

// src/quality_helper.js
var require_quality_helper = __commonJS({
  "src/quality_helper.js"(exports2, module2) {
    var { createTimeoutSignal } = require_fetch_helper();
    var USER_AGENT2 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36";
    function checkQualityFromText2(text) {
      if (!text) return null;
      if (/RESOLUTION=\d+x2160/i.test(text) || /RESOLUTION=2160/i.test(text)) return "4K";
      if (/RESOLUTION=\d+x1440/i.test(text) || /RESOLUTION=1440/i.test(text)) return "1440p";
      if (/RESOLUTION=\d+x1080/i.test(text) || /RESOLUTION=1080/i.test(text)) return "1080p";
      if (/RESOLUTION=\d+x720/i.test(text) || /RESOLUTION=720/i.test(text)) return "720p";
      if (/RESOLUTION=\d+x480/i.test(text) || /RESOLUTION=480/i.test(text)) return "480p";
      return null;
    }
    function checkQualityFromPlaylist(_0) {
      return __async(this, arguments, function* (url, headers = {}, options = {}) {
        try {
          const finalHeaders = __spreadValues({}, headers);
          if (!finalHeaders["User-Agent"]) finalHeaders["User-Agent"] = USER_AGENT2;
          const timeoutConfig = createTimeoutSignal(3e3);
          try {
            const fetcher = typeof options.fetcher === "function" ? options.fetcher : fetch;
            const response = yield fetcher(url, {
              headers: finalHeaders,
              signal: timeoutConfig.signal
            });
            if (!response.ok) return null;
            const text = yield response.text();
            if (!text.startsWith("#EXTM3U")) return null;
            const quality = checkQualityFromText2(text);
            if (quality) console.log(`[QualityHelper] Detected ${quality} from playlist: ${url}`);
            return quality;
          } finally {
            if (typeof timeoutConfig.cleanup === "function") timeoutConfig.cleanup();
          }
        } catch (_) {
          return null;
        }
      });
    }
    function getQualityFromUrl(url) {
      if (!url) return null;
      const urlPath = url.split("?")[0].toLowerCase();
      if (urlPath.includes("4k") || urlPath.includes("2160")) return "4K";
      if (urlPath.includes("1440") || urlPath.includes("2k")) return "1440p";
      if (urlPath.includes("1080") || urlPath.includes("fhd")) return "1080p";
      if (urlPath.includes("720") || urlPath.includes("hd")) return "720p";
      if (urlPath.includes("480") || urlPath.includes("sd")) return "480p";
      if (urlPath.includes("360")) return "360p";
      return null;
    }
    module2.exports = {
      checkQualityFromPlaylist,
      getQualityFromUrl,
      checkQualityFromText: checkQualityFromText2
    };
  }
});

// easyjack/local_settings.js
var require_local_settings = __commonJS({
  "easyjack/local_settings.js"(exports2, module2) {
    "use strict";
    var crypto = require("crypto");
    var fs = require("fs");
    var path = require("path");
    var SETTINGS_VERSION = 1;
    function getSettingsFilePath() {
      const configuredPath = String(process.env.EASYJACK_SETTINGS_FILE || "").trim();
      return path.resolve(configuredPath || path.join(process.cwd(), "data", "easyjack-settings.json"));
    }
    function loadLocalSettings() {
      const settingsPath = getSettingsFilePath();
      try {
        const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
        return parsed;
      } catch (error) {
        if (error.code === "ENOENT") return null;
        return null;
      }
    }
    function saveLocalSettings(settings) {
      const settingsPath = getSettingsFilePath();
      const directory = path.dirname(settingsPath);
      const temporaryPath = path.join(
        directory,
        `.${path.basename(settingsPath)}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`
      );
      const payload = __spreadProps(__spreadValues({
        version: SETTINGS_VERSION
      }, settings), {
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      fs.mkdirSync(directory, { recursive: true, mode: 448 });
      try {
        fs.writeFileSync(temporaryPath, `${JSON.stringify(payload, null, 2)}
`, {
          encoding: "utf8",
          mode: 384
        });
        fs.chmodSync(temporaryPath, 384);
        fs.renameSync(temporaryPath, settingsPath);
        fs.chmodSync(settingsPath, 384);
      } finally {
        try {
          if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
        } catch (e) {
        }
      }
      return payload;
    }
    module2.exports = {
      getSettingsFilePath,
      loadLocalSettings,
      saveLocalSettings
    };
  }
});

// easyjack/provider_proxy_settings.js
var require_provider_proxy_settings = __commonJS({
  "easyjack/provider_proxy_settings.js"(exports2, module2) {
    "use strict";
    var crypto = require("crypto");
    var fs = require("fs");
    var path = require("path");
    var { getSettingsFilePath } = require_local_settings();
    var SETTINGS_VERSION = 1;
    var PROXY_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:", "socks5:", "socks5h:"]);
    var QUICK_PROXY_MODES = /* @__PURE__ */ new Set(["proxy-pool", "torproxy", "nordvpn", "warp-proxy"]);
    var DEFAULT_SETTINGS = Object.freeze({
      version: SETTINGS_VERSION,
      providerRules: Object.freeze({}),
      urlRules: Object.freeze([])
    });
    var cachedPath = "";
    var cachedSignature = "";
    var cachedSettings = null;
    function getProviderProxySettingsPath() {
      const configuredPath = String(process.env.EASYJACK_PROVIDER_PROXY_SETTINGS_FILE || "").trim();
      return path.resolve(configuredPath || path.join(path.dirname(getSettingsFilePath()), "provider-proxy-settings.json"));
    }
    function cloneDefaultSettings() {
      return {
        version: SETTINGS_VERSION,
        providerRules: {},
        urlRules: []
      };
    }
    function normalizeBoolean(value, fallback = false) {
      if (typeof value === "boolean") return value;
      const normalized = String(value != null ? value : "").trim().toLowerCase();
      if (["1", "true", "yes", "on"].includes(normalized)) return true;
      if (["0", "false", "no", "off"].includes(normalized)) return false;
      return fallback;
    }
    function normalizeMode(value) {
      const mode = String(value || "default").trim().toLowerCase();
      if (mode === "direct" || mode === "proxy" || mode === "default" || QUICK_PROXY_MODES.has(mode)) return mode;
      throw new Error(`Modalit\xE0 proxy non valida: ${value}`);
    }
    function quickProxyUrl(mode) {
      if (mode === "proxy-pool") return String(process.env.EASYJACK_PROXY_POOL_URL || "socks5h://proxy-pool:1080").trim();
      if (mode === "torproxy") return String(process.env.EASYJACK_TORQUE_PROXY_URL || "http://torque:3128").trim();
      if (mode === "nordvpn") return String(process.env.EASYJACK_NORDVPN_PROXY_URL || "socks5h://nordvpn:1080").trim();
      if (mode === "warp-proxy") return String(process.env.EASYJACK_WARP_PROXY_URL || "socks5h://warp-proxy:1080").trim();
      return "";
    }
    function normalizeProxyUrl(value, { required = false } = {}) {
      const raw = String(value != null ? value : "").trim();
      if (!raw) {
        if (required) throw new Error("URL proxy obbligatorio per la modalit\xE0 proxy.");
        return "";
      }
      let parsed;
      try {
        parsed = new URL(raw);
      } catch (e) {
        throw new Error(`URL proxy non valido: ${raw}`);
      }
      if (!PROXY_PROTOCOLS.has(parsed.protocol.toLowerCase()) || !parsed.hostname) {
        throw new Error(`Protocollo proxy non supportato per una regola personalizzata: ${parsed.protocol || raw}`);
      }
      if (parsed.username || parsed.password) {
        parsed.username = encodeURIComponent(decodeURIComponent(parsed.username));
        parsed.password = encodeURIComponent(decodeURIComponent(parsed.password));
      }
      return parsed.toString().replace(/\/$/, "");
    }
    function normalizeProviderRule(rule = {}) {
      const mode = normalizeMode(rule.mode);
      const configuredUrl = mode === "proxy" ? rule.proxyUrl || rule.url : quickProxyUrl(mode);
      return {
        mode,
        proxyUrl: mode === "proxy" || QUICK_PROXY_MODES.has(mode) ? normalizeProxyUrl(configuredUrl, { required: true }) : "",
        sticky: normalizeBoolean(rule.sticky, false)
      };
    }
    function normalizeUrlRule(rule = {}) {
      const pattern = String(rule.pattern || rule.url || "").trim();
      if (!pattern || pattern.length > 512 || /[\u0000\r\n]/.test(pattern)) {
        throw new Error("Ogni regola URL deve avere un pattern valido (massimo 512 caratteri).");
      }
      const mode = normalizeMode(rule.mode || "proxy");
      const configuredUrl = mode === "proxy" ? rule.proxyUrl || rule.proxy : quickProxyUrl(mode);
      return {
        pattern,
        mode,
        proxyUrl: mode === "proxy" || QUICK_PROXY_MODES.has(mode) ? normalizeProxyUrl(configuredUrl, { required: true }) : "",
        sticky: normalizeBoolean(rule.sticky, false),
        enabled: rule.enabled !== false
      };
    }
    function normalizeSettings(input = {}) {
      if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new Error("Configurazione proxy provider non valida.");
      }
      const providerRules = {};
      const rawProviders = Array.isArray(input.providerRules) ? input.providerRules.map((rule) => [(rule == null ? void 0 : rule.provider) || (rule == null ? void 0 : rule.id), rule]) : Object.entries(input.providerRules || {});
      for (const [provider, rawRule] of rawProviders) {
        const id = String(provider || "").trim().toLowerCase();
        if (!id || !/^[a-z0-9][a-z0-9_-]{0,95}$/.test(id)) {
          throw new Error(`ID provider non valido: ${provider}`);
        }
        providerRules[id] = normalizeProviderRule(rawRule || {});
      }
      const rawUrlRules = Array.isArray(input.urlRules) ? input.urlRules : [];
      if (rawUrlRules.length > 200) throw new Error("Massimo 200 regole proxy URL.");
      const urlRules = rawUrlRules.map(normalizeUrlRule);
      return {
        version: SETTINGS_VERSION,
        providerRules,
        urlRules
      };
    }
    function writeSettings(settings) {
      const settingsPath = getProviderProxySettingsPath();
      const directory = path.dirname(settingsPath);
      const temporaryPath = path.join(
        directory,
        `.${path.basename(settingsPath)}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`
      );
      fs.mkdirSync(directory, { recursive: true, mode: 448 });
      try {
        fs.writeFileSync(temporaryPath, `${JSON.stringify(__spreadProps(__spreadValues({}, settings), { updatedAt: (/* @__PURE__ */ new Date()).toISOString() }), null, 2)}
`, {
          encoding: "utf8",
          mode: 384
        });
        fs.chmodSync(temporaryPath, 384);
        fs.renameSync(temporaryPath, settingsPath);
        fs.chmodSync(settingsPath, 384);
      } finally {
        try {
          if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
        } catch (e) {
        }
      }
      cachedPath = "";
      cachedSignature = "";
      cachedSettings = null;
      return readStoredSettings();
    }
    function readStoredSettings() {
      const settingsPath = getProviderProxySettingsPath();
      try {
        const stat = fs.statSync(settingsPath);
        const signature = `${stat.mtimeMs}:${stat.size}`;
        if (settingsPath === cachedPath && signature === cachedSignature && cachedSettings) return cachedSettings;
        const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        const normalized = normalizeSettings(parsed);
        cachedPath = settingsPath;
        cachedSignature = signature;
        cachedSettings = normalized;
        return normalized;
      } catch (error) {
        if (error.code !== "ENOENT") {
          cachedPath = settingsPath;
          cachedSignature = "";
          cachedSettings = null;
          throw new Error(`Impossibile leggere configurazione proxy provider: ${error.message}`);
        }
        return cloneDefaultSettings();
      }
    }
    function getProviderProxySettings() {
      return readStoredSettings();
    }
    function saveProviderProxySettings(input = {}) {
      return writeSettings(normalizeSettings(input));
    }
    function getProviderProxyRule(providerName) {
      const provider = String(providerName || "").trim().toLowerCase();
      if (!provider) return null;
      return getProviderProxySettings().providerRules[provider] || null;
    }
    function matchesUrlPattern(urlString, pattern) {
      let parsed;
      try {
        parsed = new URL(String(urlString || ""));
      } catch (e) {
        return false;
      }
      const rawPattern = String(pattern || "").trim().toLowerCase();
      if (!rawPattern) return false;
      if (/^https?:\/\//i.test(rawPattern)) {
        return parsed.href.toLowerCase().startsWith(rawPattern.replace(/\/$/, ""));
      }
      const hostPattern = rawPattern.replace(/^\*\./, "").replace(/\/+$/, "");
      const hostname = parsed.hostname.toLowerCase();
      return hostname === hostPattern || hostname.endsWith(`.${hostPattern}`);
    }
    function findProviderProxyUrlRule(urlString) {
      var _a;
      const matches = getProviderProxySettings().urlRules.map((rule, index) => ({ rule, index })).filter(({ rule }) => rule.enabled && matchesUrlPattern(urlString, rule.pattern)).sort((a, b) => b.rule.pattern.length - a.rule.pattern.length || a.index - b.index);
      return ((_a = matches[0]) == null ? void 0 : _a.rule) || null;
    }
    function getProviderProxySettingsView(providerNames = [], getEffectiveRule = () => null) {
      const stored = getProviderProxySettings();
      const providers = [...new Set(providerNames.map((name) => String(name || "").trim().toLowerCase()).filter(Boolean))].sort().map((id) => {
        const configured = stored.providerRules[id] || null;
        const effective = getEffectiveRule(id) || {};
        return {
          id,
          mode: (configured == null ? void 0 : configured.mode) || "default",
          proxyUrl: (configured == null ? void 0 : configured.proxyUrl) || "",
          sticky: (configured == null ? void 0 : configured.sticky) === true,
          effectiveProxyUrl: effective.proxyUrl || "",
          effectiveMode: effective.mode || "default",
          effectiveSticky: effective.sticky === true
        };
      });
      return {
        file: getProviderProxySettingsPath(),
        providers,
        urlRules: stored.urlRules
      };
    }
    module2.exports = {
      findProviderProxyUrlRule,
      getProviderProxyRule,
      getProviderProxySettings,
      getProviderProxySettingsPath,
      getProviderProxySettingsView,
      matchesUrlPattern,
      normalizeSettings,
      saveProviderProxySettings
    };
  }
});

// easyjack/runtime_env.js
var require_runtime_env = __commonJS({
  "easyjack/runtime_env.js"(exports2, module2) {
    "use strict";
    var crypto = require("crypto");
    var fs = require("fs");
    var path = require("path");
    var { getSettingsFilePath } = require_local_settings();
    var RUNTIME_ENV_VERSION = 1;
    var RUNTIME_ENV_DEFINITIONS = Object.freeze({
      PROVIDER_PROXY: {
        label: "Proxy provider",
        help: "Proxy usato dai provider HTTP. Accetta solo socks5:// o socks5h://.",
        defaultValue: "socks5h://proxy-pool:1080"
      },
      PROVIDER_PROXY_ALL: {
        label: "Proxy globale provider",
        help: "Attivo = instrada tutti i provider HTTP tramite proxy; Disattivo = usa il proxy solo per i provider che lo richiedono.",
        defaultValue: "1",
        type: "boolean"
      },
      EASYJACK_TORRENTIO_PROXY_URL: {
        label: "Proxy Torrentio",
        help: "Proxy usato da Torrentio, Meteor e TorrentsDB. Accetta http://, https://, socks5:// o socks5h://.",
        defaultValue: "socks5h://proxy-pool:1080"
      },
      EASYJACK_TORRENTIO_PROXY_REQUIRED: {
        label: "Proxy Torrentio obbligatorio",
        help: "Attivo = se il proxy \xE8 offline la richiesta viene rifiutata (fail-closed per privacy); Disattivo = tenta connessione diretta se il proxy fallisce.",
        defaultValue: "true",
        type: "boolean"
      },
      EASYJACK_ANIME_MAPPING_URL: {
        label: "URL AnimeMapping",
        help: "Dominio unico usato per mapping anime, ID e ricerca rapida. Default: animemapping.realbestia.com.",
        defaultValue: "https://animemapping.realbestia.com"
      },
      EASYJACK_TMDB_API_KEY: {
        label: "API key TMDB per le identit\xE0",
        help: "Chiave TMDB server-side usata per completare e verificare IMDb/TMDB dei torrent.",
        defaultValue: "68e094699525b18a70bab2f86b1fa706",
        secret: true
      }
    });
    var SOCKS_RUNTIME_PROXY_KEYS = /* @__PURE__ */ new Set(["PROVIDER_PROXY"]);
    var TORRENTIO_RUNTIME_PROXY_KEYS = /* @__PURE__ */ new Set(["EASYJACK_TORRENTIO_PROXY_URL"]);
    function isValidSocksRuntimeProxyValue(key, value) {
      if (!SOCKS_RUNTIME_PROXY_KEYS.has(key) && !TORRENTIO_RUNTIME_PROXY_KEYS.has(key)) return true;
      const raw = String(value != null ? value : "").trim();
      if (!raw || raw.toLowerCase() === "null") return true;
      const allowedProtocols = TORRENTIO_RUNTIME_PROXY_KEYS.has(key) ? ["http:", "https:", "socks5:", "socks5h:"] : ["socks5:", "socks5h:"];
      return raw.split(/[\s,;|]+/).map((item) => item.trim()).filter(Boolean).every((item) => {
        try {
          const parsed = new URL(item);
          return allowedProtocols.includes(parsed.protocol.toLowerCase()) && Boolean(parsed.hostname);
        } catch (e) {
          return false;
        }
      });
    }
    var cachedSettingsPath = "";
    var cachedSignature = "";
    var cachedSettings = null;
    function getRuntimeEnvFilePath() {
      const configuredPath = String(process.env.EASYJACK_RUNTIME_ENV_FILE || "").trim();
      return path.resolve(configuredPath || path.join(path.dirname(getSettingsFilePath()), "env.db"));
    }
    function getLegacyRuntimeEnvFilePath() {
      return path.resolve(path.join(path.dirname(getSettingsFilePath()), "env.db"));
    }
    function getRuntimeEnvSourcePath() {
      const targetPath = getRuntimeEnvFilePath();
      const legacyPath = getLegacyRuntimeEnvFilePath();
      if (targetPath !== legacyPath && !fs.existsSync(targetPath) && fs.existsSync(legacyPath)) return legacyPath;
      return targetPath;
    }
    function getDefaultRuntimeValues() {
      return Object.fromEntries(
        Object.entries(RUNTIME_ENV_DEFINITIONS).map(([key, definition]) => {
          var _a;
          return [key, String((_a = definition.defaultValue) != null ? _a : "")];
        })
      );
    }
    function readStoredSettings() {
      var _a;
      const settingsPath = getRuntimeEnvSourcePath();
      try {
        const stat = fs.statSync(settingsPath);
        const signature = `${stat.mtimeMs}:${stat.size}`;
        if (settingsPath === cachedSettingsPath && signature === cachedSignature) return cachedSettings;
        const parsed = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        const parsedValues = parsed && typeof parsed === "object" && !Array.isArray(parsed) && parsed.values && typeof parsed.values === "object" && !Array.isArray(parsed.values) ? parsed.values : {};
        const values = Object.fromEntries(
          Object.entries(parsedValues).filter(([key]) => Object.prototype.hasOwnProperty.call(RUNTIME_ENV_DEFINITIONS, key))
        );
        const defaultValues = getDefaultRuntimeValues();
        const completeValues = __spreadValues(__spreadValues({}, defaultValues), values);
        let needsRepair = Object.keys(parsedValues).some((key) => !Object.prototype.hasOwnProperty.call(RUNTIME_ENV_DEFINITIONS, key)) || Object.keys(defaultValues).some((key) => !Object.prototype.hasOwnProperty.call(parsedValues, key));
        for (const [key, definition] of Object.entries(RUNTIME_ENV_DEFINITIONS)) {
          if (!isValidSocksRuntimeProxyValue(key, completeValues[key])) {
            console.warn(`[EasyJack][RuntimeEnv] ${key} non valido: ripristino il valore predefinito`);
            completeValues[key] = String((_a = definition.defaultValue) != null ? _a : "");
            needsRepair = true;
          }
        }
        cachedSettingsPath = settingsPath;
        cachedSignature = signature;
        cachedSettings = {
          version: parsed.version || RUNTIME_ENV_VERSION,
          values: completeValues,
          updatedAt: parsed.updatedAt || null
        };
        if (needsRepair) {
          try {
            return writeStoredSettings(completeValues);
          } catch (e) {
          }
        }
        return cachedSettings;
      } catch (error) {
        if (error.code === "ENOENT") {
          try {
            return writeStoredSettings(getDefaultRuntimeValues());
          } catch (e) {
          }
        }
        if (error.code !== "ENOENT") {
          cachedSettingsPath = settingsPath;
          cachedSignature = "";
          cachedSettings = null;
        }
        return null;
      }
    }
    function getRuntimeEnvValue(name) {
      var _a, _b;
      const key = String(name || "").trim();
      const definition = RUNTIME_ENV_DEFINITIONS[key];
      const stored = readStoredSettings();
      if (stored && Object.prototype.hasOwnProperty.call(stored.values, key)) {
        const val = String((_a = stored.values[key]) != null ? _a : "").trim();
        if (val.toLowerCase() === "null") return "";
        return val;
      }
      if (typeof process.env[key] === "string") {
        const val = process.env[key].trim();
        if (val.toLowerCase() === "null") return "";
        return val;
      }
      return definition ? String((_b = definition.defaultValue) != null ? _b : "") : void 0;
    }
    function normalizeRuntimeValue(key, value) {
      const definition = RUNTIME_ENV_DEFINITIONS[key];
      if (!definition) throw new Error(`Variabile runtime non consentita: ${key}`);
      const normalized = String(value == null ? "" : value).trim();
      if (normalized.toLowerCase() === "null") {
        return "null";
      }
      if (normalized.length > 4096 || /[\u0000\r\n]/.test(normalized)) {
        throw new Error(`Valore non valido per ${key}`);
      }
      if ((SOCKS_RUNTIME_PROXY_KEYS.has(key) || TORRENTIO_RUNTIME_PROXY_KEYS.has(key)) && normalized) {
        const candidates = normalized.split(/[\s,;|]+/).filter(Boolean);
        if (!candidates.length || !isValidSocksRuntimeProxyValue(key, normalized)) {
          const help = TORRENTIO_RUNTIME_PROXY_KEYS.has(key) ? "URL http://, https://, socks5:// o socks5h://" : "URL socks5:// o socks5h://";
          throw new Error(`${key}: accetta solo ${help}`);
        }
      }
      if (definition.type === "port") {
        const port = Number.parseInt(normalized, 10);
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Porta non valida per ${key}`);
      }
      if (definition.type === "boolean" && !["0", "1", "true", "false", "yes", "no", "on", "off"].includes(normalized.toLowerCase())) {
        throw new Error(`Valore booleano non valido per ${key}`);
      }
      return normalized;
    }
    function writeStoredSettings(values) {
      const settingsPath = getRuntimeEnvFilePath();
      const directory = path.dirname(settingsPath);
      const temporaryPath = path.join(
        directory,
        `.${path.basename(settingsPath)}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`
      );
      const payload = {
        version: RUNTIME_ENV_VERSION,
        values,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      fs.mkdirSync(directory, { recursive: true, mode: 448 });
      try {
        fs.writeFileSync(temporaryPath, `${JSON.stringify(payload, null, 2)}
`, { encoding: "utf8", mode: 384 });
        fs.chmodSync(temporaryPath, 384);
        fs.renameSync(temporaryPath, settingsPath);
        fs.chmodSync(settingsPath, 384);
      } finally {
        try {
          if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
        } catch (e) {
        }
      }
      cachedSettingsPath = "";
      cachedSignature = "";
      cachedSettings = null;
      return payload;
    }
    function saveRuntimeEnvSettings(input = {}) {
      var _a;
      if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Variabili runtime non valide");
      const previous = ((_a = readStoredSettings()) == null ? void 0 : _a.values) || {};
      const values = __spreadValues({}, previous);
      for (const [key, value] of Object.entries(input)) {
        if (!Object.prototype.hasOwnProperty.call(RUNTIME_ENV_DEFINITIONS, key)) {
          throw new Error(`Variabile runtime non consentita: ${key}`);
        }
        const normalized = normalizeRuntimeValue(key, value);
        if (normalized === "") delete values[key];
        else values[key] = normalized;
      }
      return writeStoredSettings(values);
    }
    function getRuntimeEnvView(stored = readStoredSettings()) {
      const values = (stored == null ? void 0 : stored.values) || {};
      return {
        file: getRuntimeEnvFilePath(),
        updatedAt: (stored == null ? void 0 : stored.updatedAt) || null,
        variables: Object.entries(RUNTIME_ENV_DEFINITIONS).map(([key, definition]) => {
          var _a, _b, _c;
          const rawStored = values[key];
          const isExplicitNull = typeof rawStored === "string" && rawStored.trim().toLowerCase() === "null";
          const configured = Object.prototype.hasOwnProperty.call(values, key) && String((_a = values[key]) != null ? _a : "").trim() !== "" || typeof process.env[key] === "string" && String(process.env[key]).trim() !== "";
          let displayValue = "";
          if (definition.secret !== true) {
            displayValue = isExplicitNull ? "null" : String((_b = getRuntimeEnvValue(key)) != null ? _b : "");
          }
          return {
            key,
            label: definition.label,
            help: definition.help,
            type: definition.type || "text",
            secret: definition.secret === true,
            configured,
            value: displayValue,
            defaultValue: definition.secret === true ? "" : String((_c = definition.defaultValue) != null ? _c : "")
          };
        })
      };
    }
    module2.exports = {
      RUNTIME_ENV_DEFINITIONS,
      getRuntimeEnvFilePath,
      getRuntimeEnvValue,
      getRuntimeEnvView,
      readStoredSettings,
      saveRuntimeEnvSettings
    };
  }
});

// cf_bypass.js
var require_cf_bypass = __commonJS({
  "cf_bypass.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var activeBypasses = /* @__PURE__ */ new Map();
    var configuredFlareSolverrUrls = String(process.env.FLARESOLVERR_URL || "http://flaresolverr:8191").split(",").map((value) => value.trim().replace(/\/+$/, "")).filter(Boolean);
    var maxFlareSolverrEndpoints = Math.max(1, Number.parseInt(process.env.FLARESOLVERR_MAX_ENDPOINTS || "2", 10) || 2);
    var FLARESOLVERR_URLS = configuredFlareSolverrUrls.slice(0, maxFlareSolverrEndpoints);
    var DEFAULT_TIMEOUT = Number.parseInt(process.env.FLARESOLVERR_MAX_TIMEOUT || "55000", 10);
    var ONE_SHOT_MIN_TIMEOUT = 15e3;
    var nextUrl = 0;
    function sessionDir() {
      var _a;
      try {
        if (typeof process !== "undefined" && ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.EASYJACK_SETTINGS_FILE)) {
          return path.dirname(process.env.EASYJACK_SETTINGS_FILE);
        }
      } catch (_) {
      }
      try {
        if (typeof process !== "undefined" && (process == null ? void 0 : process.cwd)) return process.cwd();
      } catch (_) {
      }
      return ".";
    }
    function cfSessionFilePath(provider) {
      return path.join(sessionDir(), `cf-session-${String(provider || "default")}.json`);
    }
    var DEFAULT_FLARE_PROXY = String(
      process.env.FETCHER_PROXY || process.env.EASYJACK_WARP_PROXY_URL || "socks5h://warp-proxy:1080"
    ).trim();
    function destroySession(endpoint, sessionId) {
      return __async(this, null, function* () {
        if (!sessionId) return;
        try {
          yield fetch(`${endpoint}/v1`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ cmd: "sessions.destroy", session: sessionId }),
            signal: AbortSignal.timeout(5e3)
          });
        } catch (_) {
        }
      });
    }
    function buildProxyPayload(proxyUrl) {
      const raw = String(proxyUrl || "").trim();
      if (raw === "direct") return void 0;
      const value = raw || DEFAULT_FLARE_PROXY;
      if (!value || value === "direct") return void 0;
      try {
        const proxy = new URL(value);
        const scheme = proxy.protocol.toLowerCase() === "socks5h:" ? "socks5:" : proxy.protocol;
        const payload = { url: `${scheme}//${proxy.host}` };
        if (proxy.username) payload.username = decodeURIComponent(proxy.username);
        if (proxy.password) payload.password = decodeURIComponent(proxy.password);
        return payload;
      } catch (_) {
        return void 0;
      }
    }
    function createSession(endpoint, sessionId, proxyUrl) {
      return __async(this, null, function* () {
        const payload = { cmd: "sessions.create", session: sessionId };
        const proxy = buildProxyPayload(proxyUrl);
        if (proxy) payload.proxy = proxy;
        const response = yield fetch(`${endpoint}/v1`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(1e4)
        });
        const result = yield response.json();
        if (!response.ok || result.status !== "ok") {
          throw new Error(result.message || `FlareSolverr sessions.create HTTP ${response.status}`);
        }
      });
    }
    function getClearance(url, provider = "default", options = {}) {
      if (activeBypasses.has(provider)) return activeBypasses.get(provider);
      const promise = resolveWithFlareSolverr(url, provider, options).finally(() => activeBypasses.delete(provider));
      activeBypasses.set(provider, promise);
      return promise;
    }
    function resolveWithFlareSolverr(_0, _1) {
      return __async(this, arguments, function* (url, provider, options = {}) {
        var _a, _b, _c, _d, _e;
        const sessionFile = path.join(sessionDir(), `cf-session-${provider}.json`);
        let cookies = "";
        try {
          cookies = String(JSON.parse(fs.readFileSync(sessionFile, "utf8")).cookies || "");
        } catch (_) {
        }
        const timeout = Number.parseInt(options.maxTimeout || options.requestTimeout || DEFAULT_TIMEOUT, 10);
        const sessionId = `easystreams-${provider}`;
        const payload = { cmd: "request.get", url, maxTimeout: Number.isFinite(timeout) ? timeout : DEFAULT_TIMEOUT, session: sessionId };
        const proxyUrl = String(options.proxyUrl || "").trim();
        if (cookies) payload.cookies = cookies.split(";").map((item) => {
          const index = item.indexOf("=");
          return index > 0 ? { name: item.slice(0, index).trim(), value: item.slice(index + 1).trim() } : null;
        }).filter(Boolean);
        let lastError;
        for (let attempt = 0; attempt < FLARESOLVERR_URLS.length; attempt++) {
          const endpoint = FLARESOLVERR_URLS[nextUrl++ % FLARESOLVERR_URLS.length];
          try {
            yield destroySession(endpoint, sessionId);
            yield createSession(endpoint, sessionId, proxyUrl);
            const response = yield fetch(`${endpoint}/v1`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
              signal: AbortSignal.timeout(Math.max(timeout + 5e3, 1e4))
            });
            const result = yield response.json();
            if (!response.ok || result.status !== "ok") throw new Error(result.message || `FlareSolverr HTTP ${response.status}`);
            const solvedCookies = Array.isArray((_a = result.solution) == null ? void 0 : _a.cookies) ? result.solution.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ") : cookies;
            const data = {
              userAgent: ((_b = result.solution) == null ? void 0 : _b.userAgent) || "",
              cookies: solvedCookies,
              url: ((_c = result.solution) == null ? void 0 : _c.url) || url,
              response: ((_d = result.solution) == null ? void 0 : _d.response) || "",
              responseText: ((_e = result.solution) == null ? void 0 : _e.response) || "",
              cookieDomains: [],
              timestamp: Date.now()
            };
            try {
              fs.writeFileSync(sessionFile, JSON.stringify(data, null, 2));
            } catch (_) {
            }
            yield destroySession(endpoint, sessionId);
            console.log(`[CF][${provider}] FlareSolverr bypass completato`);
            return data;
          } catch (error) {
            lastError = error;
            yield destroySession(endpoint, sessionId);
          }
        }
        throw lastError || new Error("FlareSolverr non disponibile");
      });
    }
    function hasActiveBypass(provider) {
      return activeBypasses.has(provider);
    }
    function execPythonBypass() {
      return Promise.reject(new Error("Camoufox/Scrapling rimosso: usare FlareSolverr"));
    }
    function getStats() {
      return { active: activeBypasses.size, queued: 0, capacity: Infinity };
    }
    var flareSessions = /* @__PURE__ */ new Map();
    function usesOneShotFlare(provider) {
      const key = String(provider || "").trim().toLowerCase();
      return key === "vixsrc" || key === "guardoserie";
    }
    function defaultWarmUrl(provider) {
      const key = String(provider || "").trim().toLowerCase();
      if (key === "vixsrc") return "https://vixsrc.to";
      if (key === "guardoserie") return "https://guardoserie.college";
      return "";
    }
    function flareSessionState(provider) {
      const key = String(provider || "default").trim().toLowerCase() || "default";
      let state = flareSessions.get(key);
      if (!state) {
        state = { ready: false, sessionId: `easystreams-${key}`, warmPromise: null, proactivePromise: null, warmUrl: defaultWarmUrl(key), proxyUrl: "" };
        flareSessions.set(key, state);
      }
      if (!state.warmUrl) state.warmUrl = defaultWarmUrl(key);
      return state;
    }
    function isFlareSessionReady2(provider) {
      return flareSessionState(provider).ready === true;
    }
    function isFlareSessionBusy2(provider) {
      const state = flareSessionState(provider);
      return Boolean(state.warmPromise || state.refreshPromise);
    }
    var FLARE_BLOCK_COOLDOWN_MS = 10 * 60 * 1e3;
    function markFlareSessionBlocked(state) {
      state.blockedUntil = Date.now() + FLARE_BLOCK_COOLDOWN_MS;
      state.ready = false;
      state.cookies = "";
      state.userAgent = "";
    }
    function resetFlareClearance(state) {
      state.ready = false;
      state.cookies = "";
      state.userAgent = "";
    }
    function setFlareProxy(state, proxyUrl) {
      const nextProxy = String(proxyUrl || "").trim();
      if (state.proxyUrl && nextProxy !== state.proxyUrl) {
        resetFlareClearance(state);
        state.blockedUntil = 0;
      }
      state.proxyUrl = nextProxy;
      return nextProxy;
    }
    function isFlareBlockError(error) {
      const message = String((error == null ? void 0 : error.message) || "");
      return /Cloudflare has blocked/i.test(message) || /^HTTP (403|503)$/i.test(message);
    }
    function isFlareSessionBlocked2(provider) {
      const state = flareSessionState(provider);
      return Number(state.blockedUntil || 0) > Date.now();
    }
    function nextFlareSolverrEndpoint() {
      return FLARESOLVERR_URLS[nextUrl++ % FLARESOLVERR_URLS.length];
    }
    function flareV1(endpoint, payload, timeoutMs) {
      return __async(this, null, function* () {
        const response = yield fetch(`${endpoint}/v1`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(Math.max(Number(timeoutMs) || DEFAULT_TIMEOUT, 1e4))
        });
        const result = yield response.json();
        if (!response.ok || result.status !== "ok") {
          throw new Error((result == null ? void 0 : result.message) || `FlareSolverr HTTP ${response.status}`);
        }
        return result;
      });
    }
    function captureClearance(state, solution) {
      var _a;
      const cookieValues = /* @__PURE__ */ new Map();
      if (Array.isArray(solution == null ? void 0 : solution.cookies)) {
        for (const cookie of solution.cookies) {
          if (cookie == null ? void 0 : cookie.name) cookieValues.set(String(cookie.name), String((_a = cookie.value) != null ? _a : ""));
        }
      }
      const cookies = [...cookieValues.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
      if (cookies) state.cookies = cookies;
      if (solution == null ? void 0 : solution.userAgent) state.userAgent = solution.userAgent;
    }
    function flareRequestOnce(_0) {
      return __async(this, arguments, function* (provider, {
        url,
        method = "GET",
        postData = null,
        proxyUrl = "",
        maxTimeout = DEFAULT_TIMEOUT
      } = {}) {
        if (!url) throw new Error("URL mancante");
        const state = flareSessionState(provider);
        const effectiveProxy = setFlareProxy(state, proxyUrl || state.proxyUrl || DEFAULT_FLARE_PROXY);
        const endpoint = nextFlareSolverrEndpoint();
        const requestedTimeout = Number(maxTimeout);
        const solverTimeout = Number.isFinite(requestedTimeout) && requestedTimeout > 0 ? Math.max(requestedTimeout, ONE_SHOT_MIN_TIMEOUT) : DEFAULT_TIMEOUT;
        const payload = {
          cmd: method === "POST" ? "request.post" : "request.get",
          url,
          maxTimeout: solverTimeout
        };
        const proxy = buildProxyPayload(effectiveProxy);
        if (proxy) payload.proxy = proxy;
        if (state.cookies) {
          payload.cookies = state.cookies.split(";").map((item) => {
            const index = item.indexOf("=");
            return index > 0 ? { name: item.slice(0, index).trim(), value: item.slice(index + 1).trim() } : null;
          }).filter(Boolean);
        }
        if (postData != null) payload.postData = postData;
        const result = yield flareV1(endpoint, payload, solverTimeout + 5e3);
        const solution = result.solution || {};
        const status = Number(solution.status || 0);
        if (status >= 400) throw new Error(`HTTP ${status}`);
        captureClearance(state, solution);
        return {
          status,
          text: String(solution.response || ""),
          url: solution.url || url,
          cookies: state.cookies || ""
        };
      });
    }
    function warmFlareOnce(provider, warmUrl, { proxyUrl = "" } = {}) {
      const state = flareSessionState(provider);
      if (warmUrl) state.warmUrl = warmUrl;
      const nextProxy = setFlareProxy(state, proxyUrl || state.proxyUrl || DEFAULT_FLARE_PROXY);
      if (state.ready) return Promise.resolve(true);
      if (isFlareSessionBlocked2(provider)) return Promise.resolve(false);
      if (state.warmPromise) return state.warmPromise;
      state.warmPromise = (() => __async(null, null, function* () {
        if (!warmUrl) throw new Error("URL di warm-up mancante");
        yield flareRequestOnce(provider, {
          url: warmUrl,
          proxyUrl: nextProxy,
          maxTimeout: DEFAULT_TIMEOUT
        });
        state.ready = true;
        return true;
      }))().catch((error) => {
        resetFlareClearance(state);
        if (isFlareBlockError(error)) {
          markFlareSessionBlocked(state);
        }
        throw error;
      }).finally(() => {
        state.warmPromise = null;
      });
      return state.warmPromise;
    }
    function warmFlareSession2(provider, warmUrl, { proxyUrl = "" } = {}) {
      if (usesOneShotFlare(provider)) {
        return warmFlareOnce(provider, warmUrl, { proxyUrl });
      }
      const state = flareSessionState(provider);
      if (warmUrl) state.warmUrl = warmUrl;
      const rawProxy = String(proxyUrl || "").trim();
      const nextProxy = rawProxy || state.proxyUrl || DEFAULT_FLARE_PROXY;
      if (state.ready && nextProxy !== state.proxyUrl) {
        state.ready = false;
        destroySession(nextFlareSolverrEndpoint(), state.sessionId).catch(() => {
        });
      }
      setFlareProxy(state, nextProxy);
      if (state.ready) return Promise.resolve(true);
      if (isFlareSessionBlocked2(provider)) return Promise.resolve(false);
      if (state.warmPromise) return state.warmPromise;
      state.warmPromise = (() => __async(null, null, function* () {
        if (!warmUrl) throw new Error("URL di warm-up mancante");
        const endpoint = nextFlareSolverrEndpoint();
        yield destroySession(endpoint, state.sessionId);
        yield createSession(endpoint, state.sessionId, nextProxy);
        const result = yield flareV1(endpoint, {
          cmd: "request.get",
          url: warmUrl,
          maxTimeout: DEFAULT_TIMEOUT,
          session: state.sessionId
        }, DEFAULT_TIMEOUT + 5e3);
        captureClearance(state, result.solution);
        state.ready = true;
        return true;
      }))().catch((error) => {
        resetFlareClearance(state);
        if (isFlareBlockError(error)) {
          markFlareSessionBlocked(state);
        }
        throw error;
      }).finally(() => {
        state.warmPromise = null;
      });
      return state.warmPromise;
    }
    function refreshFlareSession(provider, { proactive = false } = {}) {
      const state = flareSessionState(provider);
      if (usesOneShotFlare(provider)) {
        if (proactive) {
          if (state.refreshPromise) return state.refreshPromise;
          if (state.proactivePromise) return state.proactivePromise;
          const warmUrl3 = state.warmUrl || defaultWarmUrl(provider);
          if (!warmUrl3 || isFlareSessionBlocked2(provider)) return Promise.resolve(false);
          state.proactivePromise = (() => __async(null, null, function* () {
            try {
              const probe = yield tlsFetch(provider, {
                url: warmUrl3,
                proxyUrl: state.proxyUrl,
                oneShot: true,
                maxTimeout: 15e3
              });
              if (Number(probe.status || 0) >= 400) {
                const error = new Error(`HTTP ${probe.status}`);
                error.challenge = true;
                throw error;
              }
              state.ready = true;
              console.log(`[CF][${provider}] Cookie correnti validati via tls-client`);
              return true;
            } catch (error) {
              if (!(error == null ? void 0 : error.challenge)) {
                console.warn(`[CF][${provider}] Verifica cookie refresh fallita: ${error.message}`);
                return false;
              }
              return refreshFlareSession(provider);
            }
          }))().finally(() => {
            state.proactivePromise = null;
          });
          return state.proactivePromise;
        }
        if (state.refreshPromise) return state.refreshPromise;
        const warmUrl2 = state.warmUrl || defaultWarmUrl(provider);
        if (!warmUrl2) return Promise.resolve(false);
        state.refreshPromise = (() => __async(null, null, function* () {
          try {
            yield flareRequestOnce(provider, {
              url: warmUrl2,
              proxyUrl: state.proxyUrl,
              maxTimeout: DEFAULT_TIMEOUT
            });
            state.ready = true;
            state.failStreak = 0;
            state.failWindowStart = 0;
            console.log(`[CF][${provider}] Clearance aggiornata via one-shot`);
            return true;
          } catch (error) {
            resetFlareClearance(state);
            if (isFlareBlockError(error)) markFlareSessionBlocked(state);
            console.warn(`[CF][${provider}] Refresh one-shot fallito: ${error.message}`);
            return false;
          } finally {
            state.refreshPromise = null;
          }
        }))();
        return state.refreshPromise;
      }
      if (state.refreshPromise) return state.refreshPromise;
      const warmUrl = state.warmUrl || defaultWarmUrl(provider);
      if (!warmUrl) return Promise.resolve(false);
      state.warmUrl = warmUrl;
      state.refreshPromise = (() => __async(null, null, function* () {
        try {
          const result = yield flareV1(nextFlareSolverrEndpoint(), {
            cmd: "request.get",
            url: state.warmUrl,
            maxTimeout: DEFAULT_TIMEOUT,
            session: state.sessionId
          }, DEFAULT_TIMEOUT + 5e3);
          captureClearance(state, result.solution);
          state.ready = true;
          state.failStreak = 0;
          state.failWindowStart = 0;
          console.log(`[CF][${provider}] Sessione aggiornata`);
          return true;
        } catch (error) {
          console.warn(`[CF][${provider}] Refresh sessione fallito: ${error.message}`);
          resetFlareClearance(state);
          if (isFlareBlockError(error)) {
            markFlareSessionBlocked(state);
            return false;
          }
          yield warmFlareSession2(provider, state.warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
          });
          return false;
        } finally {
          state.refreshPromise = null;
        }
      }))();
      return state.refreshPromise;
    }
    function flareRequest(_0) {
      return __async(this, arguments, function* (provider, { url, method = "GET", postData = null, headers = null, maxTimeout = DEFAULT_TIMEOUT } = {}) {
        if (usesOneShotFlare(provider)) {
          return flareRequestOnce(provider, { url, method, postData, maxTimeout });
        }
        if (!url) throw new Error("URL mancante");
        const state = flareSessionState(provider);
        if (!state.ready) {
          const warmUrl = state.warmUrl || defaultWarmUrl(provider);
          if (warmUrl) {
            yield warmFlareSession2(provider, warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
            });
          }
          if (!state.ready) {
            throw new Error("Sessione FlareSolverr non pronta");
          }
        }
        if (state.inFlight || state.refreshPromise || state.warmPromise) {
          throw new Error("Sessione FlareSolverr occupata");
        }
        const endpoint = nextFlareSolverrEndpoint();
        const payload = {
          cmd: method === "POST" ? "request.post" : "request.get",
          url,
          maxTimeout,
          session: state.sessionId
        };
        if (postData != null) payload.postData = postData;
        state.inFlight = true;
        try {
          const result = yield flareV1(endpoint, payload, Number(maxTimeout) + 5e3);
          const solution = result.solution || {};
          const status = Number(solution.status || 0);
          if (status >= 400) throw new Error(`HTTP ${status}`);
          state.failStreak = 0;
          captureClearance(state, solution);
          const cookies = Array.isArray(solution == null ? void 0 : solution.cookies) ? solution.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ") : state.cookies || "";
          return { status, text: String(solution.response || ""), url: solution.url || url, cookies };
        } catch (error) {
          const message = String((error == null ? void 0 : error.message) || "");
          if (/does not exist|no session/i.test(message)) {
            state.ready = false;
            const warmUrl = state.warmUrl || defaultWarmUrl(provider);
            if (warmUrl) {
              yield warmFlareSession2(provider, warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
              });
              if (state.ready) {
                const retryResult = yield flareV1(endpoint, payload, Number(maxTimeout) + 5e3);
                const retrySolution = retryResult.solution || {};
                const retryStatus = Number(retrySolution.status || 0);
                if (retryStatus < 400) {
                  state.failStreak = 0;
                  captureClearance(state, retrySolution);
                  const cookies = Array.isArray(retrySolution == null ? void 0 : retrySolution.cookies) ? retrySolution.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ") : state.cookies || "";
                  return { status: retryStatus, text: String(retrySolution.response || ""), url: retrySolution.url || url, cookies };
                }
              }
            }
          }
          const generous = Number(maxTimeout) >= 5e3;
          const transient = (error == null ? void 0 : error.name) === "TimeoutError" || (error == null ? void 0 : error.name) === "AbortError" || /^HTTP \d{3}$/.test(message) || !generous && /Timeout after/i.test(message);
          if (isFlareBlockError(error)) {
            resetFlareClearance(state);
            markFlareSessionBlocked(state);
            throw error;
          }
          const now = Date.now();
          if (!state.failWindowStart || now - state.failWindowStart > 6e4) {
            state.failWindowStart = now;
            state.failStreak = 0;
          }
          state.failStreak = (state.failStreak || 0) + 1;
          if (!transient || state.failStreak >= 5) {
            state.failStreak = 0;
            state.failWindowStart = 0;
            if (transient) {
              refreshFlareSession(provider).catch(() => {
              });
            } else {
              state.ready = false;
              if (state.warmUrl) {
                warmFlareSession2(provider, state.warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
                });
              }
            }
          }
          throw error;
        } finally {
          state.inFlight = false;
        }
      });
    }
    var FETCHER_URL = (process.env.FLARE_FETCHER_URL || "http://flaresolverr:8192").replace(/\/+$/, "");
    function tlsFetch(_0) {
      return __async(this, arguments, function* (provider, { url, method = "GET", postData = null, headers = null, proxyUrl = "", oneShot = false, maxTimeout = 15e3 } = {}) {
        if (!url) throw new Error("URL mancante");
        if (isFlareSessionBusy2(provider) && !oneShot) throw new Error("Sessione FlareSolverr occupata");
        const state = flareSessionState(provider);
        if (proxyUrl) setFlareProxy(state, proxyUrl);
        if (!state.cookies) {
          if (!oneShot) {
            const warmUrl = state.warmUrl || defaultWarmUrl(provider);
            if (warmUrl) {
              warmFlareSession2(provider, warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
              });
            }
            throw new Error("Clearance non disponibile: sessione non ancora risolta");
          }
        }
        const cleanHeaders = {};
        if (headers && typeof headers === "object") {
          for (const [key, value] of Object.entries(headers)) {
            const lower = String(key || "").toLowerCase();
            if (lower !== "user-agent" && lower !== "cookie") {
              cleanHeaders[key] = value;
            }
          }
        }
        const resolvedProxy = String(proxyUrl || state.proxyUrl || DEFAULT_FLARE_PROXY || "").trim();
        const isDirect = resolvedProxy === "direct";
        const payload = {
          url,
          method,
          postData: postData == null ? null : String(postData),
          cookies: state.cookies,
          userAgent: state.userAgent || "",
          proxy: isDirect ? "" : resolvedProxy,
          proxyDirect: isDirect,
          timeoutMs: Math.min(Math.max(Number(maxTimeout) || 15e3, 2e3), 6e4),
          headers: cleanHeaders
        };
        const response = yield fetch(`${FETCHER_URL}/fetch`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(Number(maxTimeout) + 2e3)
        });
        const data = yield response.json().catch(() => ({}));
        if (data.challenge) {
          const error = new Error("Challenge durante il fetch");
          error.challenge = true;
          throw error;
        }
        if (data.error) throw new Error(`Fetcher: ${data.error}`);
        const responseCookies = Array.isArray(data.responseCookies) ? data.responseCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ") : "";
        if (responseCookies) state.cookies = responseCookies;
        const cookies = responseCookies || state.cookies || "";
        return { status: Number(data.status || 0), text: String(data.text || ""), url, cookies };
      });
    }
    function fetchFlarePage(provider, request) {
      return __async(this, null, function* () {
        const req = typeof request === "string" ? { url: request } : request;
        try {
          return yield tlsFetch(provider, req);
        } catch (error) {
          if ((error == null ? void 0 : error.name) === "AbortError") throw error;
          return req.oneShot ? flareRequestOnce(provider, req) : flareRequest(provider, req);
        }
      });
    }
    module2.exports = { getClearance, hasActiveBypass, execPythonBypass, getStats, getSessionDir: sessionDir, cfSessionFilePath, flareRequest, flareRequestOnce, tlsFetch, refreshFlareSession, isFlareSessionReady: isFlareSessionReady2, isFlareSessionBusy: isFlareSessionBusy2, isFlareSessionBlocked: isFlareSessionBlocked2, warmFlareSession: warmFlareSession2, warmFlareOnce, fetchFlarePage };
  }
});

// src/extractors/common.js
var require_common = __commonJS({
  "src/extractors/common.js"(exports2, module2) {
    var USER_AGENT2 = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
    function getProxiedUrl(url) {
      let proxyUrl = null;
      try {
        if (typeof global !== "undefined" && global.CF_PROXY_URL) {
          proxyUrl = global.CF_PROXY_URL;
        }
      } catch (e) {
      }
      if (proxyUrl && url) {
        const separator = proxyUrl.includes("?") ? "&" : "?";
        return `${proxyUrl}${separator}url=${encodeURIComponent(url)}`;
      }
      return url;
    }
    function unPack(p, a, c, k, e, d) {
      e = function(c2) {
        return (c2 < a ? "" : e(parseInt(c2 / a))) + ((c2 = c2 % a) > 35 ? String.fromCharCode(c2 + 29) : c2.toString(36));
      };
      if (!"".replace(/^/, String)) {
        while (c--) {
          d[e(c)] = k[c] || e(c);
        }
        k = [function(e2) {
          return d[e2] || e2;
        }];
        e = function() {
          return "\\w+";
        };
        c = 1;
      }
      while (c--) {
        if (k[c]) {
          p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
        }
      }
      return p;
    }
    function isFlareSolverrBlockedError(error) {
      const message = String(error && error.message || error || "");
      return /FlareSolverr in cooldown|Request failed with status code 500|Cloudflare has blocked/i.test(message);
    }
    module2.exports = {
      USER_AGENT: USER_AGENT2,
      unPack,
      getProxiedUrl,
      isFlareSolverrBlockedError
    };
  }
});

// src/extractors/vixcloud.js
var require_vixcloud = __commonJS({
  "src/extractors/vixcloud.js"(exports2, module2) {
    var { USER_AGENT: USER_AGENT2 } = require_common();
    var { checkQualityFromPlaylist } = require_quality_helper();
    var { fetchWithCloudflareCookies: fetchWithCloudflareCookies2 } = require_cloudflare_provider_fetch();
    var VIXSRC_CONFIG_URL = "https://raw.githubusercontent.com/realbestia1/domains/refs/heads/main/domains.json";
    var VIXSRC_CONFIG_TTL_MS = 10 * 60 * 1e3;
    var VIXSRC_DEFAULT_BASE_URL = "https://vixsrc.to";
    var VIXSRC_BASE_URL_OVERRIDE = String(
      typeof process !== "undefined" && process.env && process.env.VIXSRC_BASE_URL || ""
    ).trim();
    function normalizeVixsrcBaseUrl(value) {
      try {
        const parsed = new URL(String(value || "").trim());
        if (!/^https?:$/i.test(parsed.protocol) || !parsed.hostname) return null;
        return parsed.toString().replace(/\/+$/, "");
      } catch (_) {
        return null;
      }
    }
    var vixsrcBaseUrl = normalizeVixsrcBaseUrl(VIXSRC_BASE_URL_OVERRIDE) || VIXSRC_DEFAULT_BASE_URL;
    var vixsrcMediaHost = new URL(vixsrcBaseUrl).hostname;
    var vixsrcConfigLoaded = Boolean(VIXSRC_BASE_URL_OVERRIDE);
    var vixsrcConfigLoadedAt = VIXSRC_BASE_URL_OVERRIDE ? Date.now() : 0;
    var vixsrcConfigPromise = null;
    function loadVixsrcConfig() {
      return __async(this, null, function* () {
        if (vixsrcConfigLoaded && Date.now() - vixsrcConfigLoadedAt < VIXSRC_CONFIG_TTL_MS) {
          return vixsrcBaseUrl;
        }
        if (vixsrcConfigPromise) return yield vixsrcConfigPromise;
        vixsrcConfigPromise = (() => __async(null, null, function* () {
          let timeoutId = null;
          const controller = typeof AbortController === "function" ? new AbortController() : null;
          const hasTimer = typeof setTimeout === "function" && typeof clearTimeout === "function";
          try {
            if (controller && hasTimer) timeoutId = setTimeout(() => controller.abort(), 5e3);
            const configUrl = `${VIXSRC_CONFIG_URL}?_=${Date.now()}`;
            const response = yield fetch(configUrl, __spreadValues({
              headers: {
                Accept: "application/json",
                "Cache-Control": "no-cache",
                Pragma: "no-cache"
              }
            }, controller ? { signal: controller.signal } : {}));
            if (!response.ok) throw new Error(`Config HTTP ${response.status}`);
            const config = yield response.json();
            const nextBaseUrl = normalizeVixsrcBaseUrl(config == null ? void 0 : config.vixsrc);
            if (nextBaseUrl) {
              vixsrcBaseUrl = nextBaseUrl;
              vixsrcMediaHost = new URL(nextBaseUrl).hostname;
            }
          } catch (error) {
            console.warn(`[VixCloud] Vixsrc config unavailable, using fallback: ${error.message}`);
          } finally {
            if (timeoutId && typeof clearTimeout === "function") clearTimeout(timeoutId);
            vixsrcConfigLoaded = true;
            vixsrcConfigLoadedAt = Date.now();
            vixsrcConfigPromise = null;
          }
          return vixsrcBaseUrl;
        }))();
        return yield vixsrcConfigPromise;
      });
    }
    function getVixsrcBaseUrl() {
      return __async(this, null, function* () {
        return yield loadVixsrcConfig();
      });
    }
    function rewriteVixsrcHost(value) {
      return String(value || "").replace(/vixcloud\.co/gi, vixsrcMediaHost).replace(/vixsrc\.to/gi, vixsrcMediaHost);
    }
    function extractVixCloud(url) {
      return __async(this, null, function* () {
        try {
          yield loadVixsrcConfig();
          const fixedUrl = rewriteVixsrcHost(url);
          const vixsrcReferer = rewriteVixsrcHost("https://vixcloud.co/");
          const response = yield fetchWithCloudflareCookies2(fixedUrl, {
            forceProviderProxy: true,
            headers: {
              "User-Agent": USER_AGENT2,
              "Referer": vixsrcReferer
            }
          });
          if (!response.ok) return null;
          const html = yield response.text();
          const streams = [];
          const tokenRegex = /'token':\s*'(\w+)'/;
          const expiresRegex = /'expires':\s*'(\d+)'/;
          const urlRegex = /url:\s*'([^']+)'/;
          const fhdRegex = /window\.canPlayFHD\s*=\s*true/;
          const tokenMatch = tokenRegex.exec(html);
          const expiresMatch = expiresRegex.exec(html);
          const urlMatch = urlRegex.exec(html);
          const fhdMatch = fhdRegex.test(html);
          if (tokenMatch && expiresMatch && urlMatch) {
            const token = tokenMatch[1];
            const expires = expiresMatch[1];
            let serverUrl = urlMatch[1];
            let finalUrl = "";
            if (serverUrl.includes("?b=1")) {
              finalUrl = `${serverUrl}&token=${token}&expires=${expires}`;
            } else {
              finalUrl = `${serverUrl}?token=${token}&expires=${expires}`;
            }
            if (fhdMatch) {
              finalUrl += "&h=1";
            }
            const parts = finalUrl.split("?");
            finalUrl = parts[0] + ".m3u8";
            if (parts.length > 1) {
              finalUrl += "?" + parts.slice(1).join("?");
            }
            let quality = "1080p";
            const streamUrl = rewriteVixsrcHost(finalUrl);
            const detectedQuality = yield checkQualityFromPlaylist(streamUrl, {
              "User-Agent": USER_AGENT2,
              "Referer": vixsrcReferer
            }, {
              fetcher: (targetUrl, options) => fetchWithCloudflareCookies2(targetUrl, options, "animeunity")
            });
            if (detectedQuality) quality = detectedQuality;
            streams.push({
              url: streamUrl,
              quality,
              type: "m3u8",
              headers: {
                "User-Agent": USER_AGENT2,
                "Referer": vixsrcReferer
              }
            });
          }
          return streams;
        } catch (e) {
          console.error("[VixCloud] Extraction error:", e);
          return [];
        }
      });
    }
    module2.exports = { extractVixCloud, rewriteVixsrcHost, getVixsrcBaseUrl };
  }
});

// src/utils/cloudflare_provider_fetch.js
var require_cloudflare_provider_fetch = __commonJS({
  "src/utils/cloudflare_provider_fetch.js"(exports2, module2) {
    "use strict";
    var IS_SERVER = typeof process !== "undefined" && !!(process.versions && process.versions.node);
    function getEnv(key) {
      try {
        if (typeof process !== "undefined" && process && process.env) return process.env[key];
      } catch (e) {
      }
      return void 0;
    }
    var CONFIGURED_PROXY_MODES = /* @__PURE__ */ new Set([
      "proxy",
      "proxy-pool",
      "torproxy",
      "nordvpn",
      "warp-proxy"
    ]);
    function getProviderProxyUrl2(url, providerName) {
      if (!IS_SERVER) return "";
      try {
        const { findProviderProxyUrlRule, getProviderProxyRule } = require_provider_proxy_settings();
        const { getRuntimeEnvValue } = require_runtime_env();
        const urlRule = findProviderProxyUrlRule(url);
        if ((urlRule == null ? void 0 : urlRule.mode) === "direct") return "direct";
        if (CONFIGURED_PROXY_MODES.has(urlRule == null ? void 0 : urlRule.mode) && urlRule.proxyUrl) return urlRule.proxyUrl;
        const rule = getProviderProxyRule(providerName);
        if ((rule == null ? void 0 : rule.mode) === "direct") return "direct";
        if (CONFIGURED_PROXY_MODES.has(rule == null ? void 0 : rule.mode) && rule.proxyUrl) return rule.proxyUrl;
        const envProxy = String(getEnv(`${String(providerName || "").toUpperCase()}_PROXY`) || "").trim();
        return envProxy || String(getEnv("SOCKS5_PROXY") || "").trim() || String(getRuntimeEnvValue("PROVIDER_PROXY") || "").trim();
      } catch (e) {
        return "";
      }
    }
    function isVixsrcTarget(url, providerName) {
      if (providerName === "vixsrc") return true;
      try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        if (host.includes("vixsrc") || host.includes("vixcloud")) return true;
      } catch (e) {
        const str = String(url || "").toLowerCase();
        if (str.includes("vixsrc") || str.includes("vixcloud")) return true;
      }
      return false;
    }
    function safeParseJson(text) {
      const raw = String(text || "").trim();
      if (!raw) return null;
      if (raw.startsWith("{") || raw.startsWith("[")) {
        return JSON.parse(raw);
      }
      const preMatch = raw.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
      if (preMatch) {
        return JSON.parse(preMatch[1].trim());
      }
      const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        return JSON.parse(bodyMatch[1].trim());
      }
      return JSON.parse(raw);
    }
    function fetchVixsrcPage(request, providerName = "vixsrc") {
      return __async(this, null, function* () {
        const { tlsFetch, warmFlareOnce, refreshFlareSession, isFlareSessionReady: isFlareSessionReady2, isFlareSessionBusy: isFlareSessionBusy2 } = require_cf_bypass();
        const { rewriteVixsrcHost } = require_vixcloud();
        const targetUrl = rewriteVixsrcHost(request.url);
        const updatedRequest = __spreadProps(__spreadValues({}, request), { url: targetUrl });
        const proxyUrl = getProviderProxyUrl2(targetUrl, providerName) || getProviderProxyUrl2(targetUrl, "vixsrc") || getProviderProxyUrl2(targetUrl, "streamingcommunity") || getProviderProxyUrl2(targetUrl, "cinejoy") || getProviderProxyUrl2(targetUrl, "vidfast") || getProviderProxyUrl2(targetUrl, "animeunity");
        const skipForBypass = (cause) => {
          const error = new Error("Flare bypass in corso");
          error.code = "FLARE_BYPASS_IN_PROGRESS";
          error.cause = cause;
          return error;
        };
        if (isFlareSessionBusy2("vixsrc")) {
          throw skipForBypass();
        }
        if (!isFlareSessionReady2("vixsrc")) {
          warmFlareOnce("vixsrc", "https://vixsrc.to", { proxyUrl }).catch(() => {
          });
          throw skipForBypass();
        }
        try {
          return yield tlsFetch("vixsrc", __spreadProps(__spreadValues({}, updatedRequest), { proxyUrl, oneShot: true }));
        } catch (error) {
          if (error == null ? void 0 : error.challenge) {
            refreshFlareSession("vixsrc").catch(() => {
            });
            throw skipForBypass(error);
          }
          throw error;
        }
      });
    }
    function fetchWithCloudflareCookies2(_0) {
      return __async(this, arguments, function* (url, options = {}, providerName = "provider") {
        if (!IS_SERVER) {
          const _a = options || {}, { forceProviderProxy: _fpp, dispatcher: _d, provider: _p } = _a, clientOptions = __objRest(_a, ["forceProviderProxy", "dispatcher", "provider"]);
          return fetch(url, clientOptions);
        }
        if (isVixsrcTarget(url, providerName)) {
          try {
            const page = yield fetchVixsrcPage({
              url,
              method: options.method || "GET",
              headers: options.headers || {},
              postData: options.body || null,
              maxTimeout: options.timeout || 15e3
            }, providerName);
            const text = String(page.text || "");
            const status = Number(page.status || 200);
            return {
              ok: status >= 200 && status < 300,
              status,
              statusText: status === 200 ? "OK" : `HTTP ${status}`,
              url: page.url || url,
              text: () => __async(null, null, function* () {
                return text;
              }),
              json: () => __async(null, null, function* () {
                return safeParseJson(text);
              }),
              headers: {
                get: (headerName) => {
                  const lower = String(headerName || "").toLowerCase();
                  if (lower === "content-type") return "text/html; charset=utf-8";
                  if (lower === "set-cookie") return page.cookies || null;
                  return null;
                },
                getSetCookie: () => page.cookies ? page.cookies.split("; ").filter(Boolean) : []
              }
            };
          } catch (error) {
            if ((error == null ? void 0 : error.code) === "FLARE_BYPASS_IN_PROGRESS") throw error;
            if (/Clearance non disponibile|FlareSolverr non disponibile|Sessione FlareSolverr non pronta|Sessione FlareSolverr occupata|Challenge durante il fetch/i.test(String((error == null ? void 0 : error.message) || ""))) {
              const requestOptions2 = __spreadProps(__spreadValues({}, options), {
                forceProviderProxy: true
              });
              return fetch(url, requestOptions2);
            }
            throw error;
          }
        }
        const requestOptions = __spreadProps(__spreadValues({}, options), {
          forceProviderProxy: true
        });
        return fetch(url, requestOptions);
      });
    }
    module2.exports = {
      fetchWithCloudflareCookies: fetchWithCloudflareCookies2,
      getProviderProxyUrl: getProviderProxyUrl2,
      fetchVixsrcPage,
      isVixsrcTarget
    };
  }
});

// src/utils/vixsrc_audio_check.js
var require_vixsrc_audio_check = __commonJS({
  "src/utils/vixsrc_audio_check.js"(exports2, module2) {
    var DOMAINS_CONFIG_URL = "https://raw.githubusercontent.com/realbestia1/domains/refs/heads/main/domains.json";
    var DEFAULT_BASE_URL = "https://vixsrc.to";
    var USER_AGENT2 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36";
    var CONFIG_CACHE_MS = 5 * 60 * 1e3;
    var CHECK_TTL_MS = 5 * 60 * 1e3;
    var ITALIAN_AUDIO_PATTERN = /#EXT-X-MEDIA:TYPE=AUDIO.*(?:LANGUAGE="it"|LANGUAGE="ita"|NAME="Italian"|NAME="Ita")/i;
    var { fetchWithCloudflareCookies: fetchWithCloudflareCookies2 } = require_cloudflare_provider_fetch();
    var cachedBaseUrl = "";
    var cachedBaseUrlExpiresAt = 0;
    var checkResults = /* @__PURE__ */ new Map();
    var checkHandles = /* @__PURE__ */ new Map();
    function vixsrcKey(pageUrl) {
      return String(pageUrl || "").replace(/^https?:\/\/[^/]+/i, "").replace(/^\/+/, "").toLowerCase();
    }
    function cachedVixsrcCheck(key) {
      const cached = checkResults.get(key);
      return cached && cached.expiresAt > Date.now() ? cached.result : null;
    }
    function announceVixsrcCheck2(pageUrl) {
      const key = vixsrcKey(pageUrl);
      if (!key) return null;
      const existing = checkHandles.get(key);
      if (existing && existing.expiresAt > Date.now()) return existing;
      let resolve;
      const promise = new Promise((settle) => {
        resolve = settle;
      });
      const handle = { promise, resolve, expiresAt: Date.now() + CHECK_TTL_MS, done: false };
      checkHandles.set(key, handle);
      return handle;
    }
    function publishVixsrcCheck2(pageUrl, result) {
      const key = vixsrcKey(pageUrl);
      if (!key || !result) return;
      checkResults.set(key, { result, expiresAt: Date.now() + CHECK_TTL_MS });
      const handle = checkHandles.get(key);
      if (handle && !handle.done) {
        handle.done = true;
        handle.resolve(result);
        checkHandles.delete(key);
      }
    }
    function settleVixsrcCheck2(pageUrl) {
      const key = vixsrcKey(pageUrl);
      if (!key) return;
      const handle = checkHandles.get(key);
      if (handle && !handle.done) {
        handle.done = true;
        handle.resolve(null);
        checkHandles.delete(key);
      }
    }
    function vixsrcBaseUrl() {
      return __async(this, null, function* () {
        if (cachedBaseUrl && cachedBaseUrlExpiresAt > Date.now()) return cachedBaseUrl;
        try {
          const response = yield fetch(DOMAINS_CONFIG_URL, {
            headers: { "User-Agent": USER_AGENT2, Accept: "application/json" }
          });
          if (response.ok) {
            const payload = yield response.json();
            const value = String((payload == null ? void 0 : payload.vixsrc) || "").trim().replace(/\/+$/, "");
            if (value) {
              cachedBaseUrl = value;
              cachedBaseUrlExpiresAt = Date.now() + CONFIG_CACHE_MS;
              return value;
            }
          }
        } catch (e) {
        }
        return cachedBaseUrl || DEFAULT_BASE_URL;
      });
    }
    function jsonHeaders() {
      return {
        "User-Agent": USER_AGENT2,
        Accept: "application/json",
        "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"
      };
    }
    function embedHeaders(embedUrl) {
      let origin = DEFAULT_BASE_URL;
      try {
        origin = new URL(embedUrl).origin;
      } catch (e) {
      }
      return {
        "User-Agent": USER_AGENT2,
        Referer: embedUrl,
        Origin: origin,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"
      };
    }
    function playlistHeaders(embedUrl) {
      let origin = DEFAULT_BASE_URL;
      try {
        origin = new URL(embedUrl).origin;
      } catch (e) {
      }
      return {
        "User-Agent": USER_AGENT2,
        Referer: embedUrl,
        Origin: origin,
        Accept: "*/*",
        "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      };
    }
    function embedUrlFromPayload(payload, baseUrl) {
      const rawSrc = payload && typeof payload === "object" ? payload.src : null;
      if (!rawSrc) return null;
      try {
        return new URL(rawSrc, baseUrl).toString();
      } catch (e) {
        return null;
      }
    }
    function masterPlaylistFromEmbedHtml(html) {
      const tokenMatch = String(html || "").match(/'token'\s*:\s*'([^']+)'/i);
      const expiresMatch = String(html || "").match(/'expires'\s*:\s*'([^']+)'/i);
      const urlMatch = String(html || "").match(/url\s*:\s*'([^']+\/playlist\/\d+[^']*)'/i);
      if (!tokenMatch || !expiresMatch || !urlMatch) return null;
      return { token: tokenMatch[1], expires: expiresMatch[1], url: urlMatch[1] };
    }
    function runVixsrcCheck(pageUrl, providerName = "vixsrc") {
      return __async(this, null, function* () {
        const baseUrl = yield vixsrcBaseUrl();
        const path = String(pageUrl || "").replace(/^https?:\/\/[^/]+/i, "").replace(/^\/+/, "");
        if (!/^(movie|tv)\//i.test(path)) return { exists: false, italian: false };
        try {
          const apiResponse = yield fetchWithCloudflareCookies2(`${baseUrl}/api/${path}`, { headers: jsonHeaders() }, providerName);
          if (!apiResponse.ok) return { exists: false, italian: false };
          const payload = yield apiResponse.json().catch(() => null);
          const embedUrl = embedUrlFromPayload(payload, baseUrl);
          if (!embedUrl) {
            const result2 = { exists: false, italian: false };
            publishVixsrcCheck2(pageUrl, result2);
            return result2;
          }
          const embedResponse = yield fetchWithCloudflareCookies2(embedUrl, { headers: embedHeaders(embedUrl) }, providerName);
          if (!embedResponse.ok) return { exists: true, italian: false };
          const master = masterPlaylistFromEmbedHtml(yield embedResponse.text());
          if (!master) return { exists: true, italian: false };
          const embedParams = new URL(embedUrl).searchParams;
          const playlistParams = [
            ["token", master.token],
            ["expires", master.expires],
            ...embedParams.get("canPlayFHD") ? [["h", "1"]] : [],
            ...embedParams.get("scz") ? [["scz", "1"]] : [],
            ["lang", embedParams.get("lang") || "en"]
          ];
          const separator = master.url.includes("?") ? "&" : "?";
          const playlistUrl = `${master.url}${separator}${playlistParams.map(([param, value]) => `${encodeURIComponent(param)}=${encodeURIComponent(value)}`).join("&")}`;
          const playlistResponse = yield fetchWithCloudflareCookies2(playlistUrl, { headers: playlistHeaders(embedUrl) }, providerName);
          if (!playlistResponse.ok) return { exists: true, italian: false };
          const playlistText = yield playlistResponse.text();
          const result = { exists: true, italian: ITALIAN_AUDIO_PATTERN.test(playlistText) };
          publishVixsrcCheck2(pageUrl, result);
          return result;
        } catch (error) {
          console.warn(`[VixsrcCheck] verifica fallita per ${pageUrl}: ${error.message}`);
          return { exists: false, italian: false };
        }
      });
    }
    function checkVixsrcItalianAudio(pageUrl, providerName = "vixsrc") {
      return __async(this, null, function* () {
        const key = vixsrcKey(pageUrl);
        const cached = cachedVixsrcCheck(key);
        if (cached) return cached;
        const existing = checkHandles.get(key);
        if (existing && existing.expiresAt > Date.now()) {
          const shared = yield existing.promise;
          if (shared) return shared;
          const late = cachedVixsrcCheck(key);
          if (late) return late;
        }
        const handle = announceVixsrcCheck2(pageUrl);
        try {
          return yield runVixsrcCheck(pageUrl, providerName);
        } finally {
          if (handle && !handle.done) {
            settleVixsrcCheck2(pageUrl);
          }
        }
      });
    }
    module2.exports = { checkVixsrcItalianAudio, announceVixsrcCheck: announceVixsrcCheck2, publishVixsrcCheck: publishVixsrcCheck2, settleVixsrcCheck: settleVixsrcCheck2 };
  }
});

// src/streamingcommunity/index.js
var STREAMINGCOMMUNITY_CONFIG_URL = "https://raw.githubusercontent.com/realbestia1/domains/refs/heads/main/domains.json";
var STREAMINGCOMMUNITY_CONFIG_TTL_MS = 10 * 60 * 1e3;
var STREAMINGCOMMUNITY_DEFAULT_BASE_URL = "https://vixsrc.to";
var STREAMINGCOMMUNITY_BASE_URL_OVERRIDE = String(
  typeof process !== "undefined" && process.env && process.env.STREAMINGCOMMUNITY_BASE_URL || ""
).trim();
var STREAMINGCOMMUNITY_MEDIA_HOST_OVERRIDE = String(
  typeof process !== "undefined" && process.env && process.env.STREAMINGCOMMUNITY_MEDIA_HOST || ""
).trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
function normalizeStreamingCommunityBaseUrl(value) {
  try {
    const parsed = new URL(String(value || "").trim());
    if (!/^https?:$/i.test(parsed.protocol) || !parsed.hostname) return null;
    return parsed.toString().replace(/\/+$/, "");
  } catch (_) {
    return null;
  }
}
var streamingCommunityBaseUrl = normalizeStreamingCommunityBaseUrl(STREAMINGCOMMUNITY_BASE_URL_OVERRIDE) || STREAMINGCOMMUNITY_DEFAULT_BASE_URL;
var streamingCommunityMediaHost = STREAMINGCOMMUNITY_MEDIA_HOST_OVERRIDE || new URL(streamingCommunityBaseUrl).hostname;
var streamingCommunityConfigLoaded = Boolean(STREAMINGCOMMUNITY_BASE_URL_OVERRIDE);
var streamingCommunityConfigLoadedAt = STREAMINGCOMMUNITY_BASE_URL_OVERRIDE ? Date.now() : 0;
var streamingCommunityConfigPromise = null;
function loadStreamingCommunityConfig() {
  return __async(this, null, function* () {
    if (streamingCommunityConfigLoaded && Date.now() - streamingCommunityConfigLoadedAt < STREAMINGCOMMUNITY_CONFIG_TTL_MS) {
      return streamingCommunityBaseUrl;
    }
    if (streamingCommunityConfigPromise) return yield streamingCommunityConfigPromise;
    streamingCommunityConfigPromise = (() => __async(null, null, function* () {
      try {
        const configUrl = `${STREAMINGCOMMUNITY_CONFIG_URL}?_=${Date.now()}`;
        const response = yield fetchStreamingCommunity(configUrl, {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache"
          }
        });
        if (!response.ok) throw new Error(`Config HTTP ${response.status}`);
        const configText = yield response.text();
        const config = JSON.parse(configText.replace(/("[^"\r\n]+")\s*("[^"]+"\s*:)/g, "$1,$2"));
        const nextBaseUrl = normalizeStreamingCommunityBaseUrl(config == null ? void 0 : config.vixsrc);
        const nextScUrl = normalizeStreamingCommunityBaseUrl(config == null ? void 0 : config.sc);
        if (nextBaseUrl) {
          streamingCommunityBaseUrl = nextBaseUrl;
          if (!STREAMINGCOMMUNITY_MEDIA_HOST_OVERRIDE) {
            streamingCommunityMediaHost = new URL(nextBaseUrl).hostname;
          }
        }
        if (nextScUrl) SC_BASE = nextScUrl;
      } catch (error) {
        console.warn(`[StreamingCommunity] Domains config unavailable, using fallback: ${error.message}`);
      } finally {
        streamingCommunityConfigLoaded = true;
        streamingCommunityConfigLoadedAt = Date.now();
        streamingCommunityConfigPromise = null;
      }
      return streamingCommunityBaseUrl;
    }))();
    return yield streamingCommunityConfigPromise;
  });
}
function getStreamingCommunityBaseUrl() {
  return streamingCommunityBaseUrl;
}
var { formatStream } = require_formatter();
require_fetch_helper();
var { checkQualityFromText } = require_quality_helper();
var { fetchWithCloudflareCookies, getProviderProxyUrl } = require_cloudflare_provider_fetch();
var { announceVixsrcCheck, publishVixsrcCheck, settleVixsrcCheck } = require_vixsrc_audio_check();
var warmFlareSession = null;
var isFlareSessionBlocked = null;
var isFlareSessionReady = null;
var isFlareSessionBusy = null;
try {
  const cf = require_cf_bypass();
  warmFlareSession = cf.warmFlareSession;
  isFlareSessionBlocked = cf.isFlareSessionBlocked;
  isFlareSessionReady = cf.isFlareSessionReady;
  isFlareSessionBusy = cf.isFlareSessionBusy;
} catch (_) {
}
var blockedLogAt = 0;
var STREAMINGCOMMUNITY_PROXY = typeof process !== "undefined" && process.env && process.env.STREAMINGCOMMUNITY_PROXY || "";
var ProxyAgent = null;
try {
  ProxyAgent = require("undici").ProxyAgent;
} catch (_) {
  ProxyAgent = null;
}
function fetchStreamingCommunity(url, options = {}) {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch (_) {
  }
  if (host === "vixsrc.to" || host === "streamingcommunityz.taxi") {
    return fetchWithCloudflareCookies(url, __spreadProps(__spreadValues({}, options), { forceProviderProxy: true }), "streamingcommunity");
  }
  return fetch(url, __spreadProps(__spreadValues({}, options), { forceProviderProxy: true }));
}
var SC_BASE = "https://streamingcommunityz.taxi";
var _sitemapCache = null;
var _sitemapPromise = null;
function getSitemap() {
  return __async(this, null, function* () {
    if (_sitemapCache) return _sitemapCache;
    if (_sitemapPromise) return yield _sitemapPromise;
    _sitemapPromise = (() => __async(null, null, function* () {
      try {
        const r = yield fetchStreamingCommunity(`${SC_BASE}/titles_it_sitemap.xml`);
        if (!r.ok) return [];
        const xml = yield r.text();
        const entries = [];
        const re = /titles\/(\d+)-([^<]+)/g;
        let m;
        while (m = re.exec(xml)) entries.push({ id: Number(m[1]), slug: m[2] });
        _sitemapCache = entries;
        return entries;
      } catch (e) {
        console.warn("[StreamingCommunity] Sitemap fetch error:", e.message);
        return [];
      } finally {
        _sitemapPromise = null;
      }
    }))();
    return yield _sitemapPromise;
  });
}
function findInSitemap(entries, name) {
  if (!name) return [];
  const cname = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cname.length < 2) return [];
  const exact = [];
  const prefix = [];
  for (const e of entries) {
    const cslug = e.slug.replace(/[^a-z0-9]/g, "");
    if (cslug === cname) exact.push(e);
    else if (cslug.startsWith(cname) || cname.startsWith(cslug)) prefix.push(e);
  }
  return [...exact, ...prefix];
}
function scrapeTitle(id, slug, season = null) {
  return __async(this, null, function* () {
    var _a, _b;
    try {
      const baseSlug = slug ? String(slug).replace(/\/season-\d+.*$/i, "") : "";
      let url = `${SC_BASE}/it/titles/${id}${baseSlug ? "-" + baseSlug : ""}`;
      if (season) url += `/season-${season}`;
      const r = yield fetchStreamingCommunity(url);
      if (!r.ok) return null;
      const html = yield r.text();
      const m = html.match(/data-page="({.+?})"/);
      if (!m) return null;
      const page = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
      const t = (_a = page == null ? void 0 : page.props) == null ? void 0 : _a.title;
      if (!t) return null;
      const loadedSeason = (_b = page == null ? void 0 : page.props) == null ? void 0 : _b.loadedSeason;
      const ep = loadedSeason == null ? void 0 : loadedSeason.episodes;
      return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        type: t.type,
        tmdb_id: t.tmdb_id,
        imdb_id: t.imdb_id,
        coming_soon: Boolean(t.coming_soon),
        seasonNumber: (loadedSeason == null ? void 0 : loadedSeason.number) || null,
        episodes: (ep == null ? void 0 : ep.map((e) => ({ id: e.id, number: e.number, name: e.name }))) || null
      };
    } catch (e) {
      return null;
    }
  });
}
function getCamEmbed(titleId, episodeId) {
  return __async(this, null, function* () {
    try {
      let url = `${SC_BASE}/it/iframe/${titleId}`;
      if (episodeId) url += `?episode_id=${episodeId}`;
      const r = yield fetchStreamingCommunity(url);
      if (!r.ok) return null;
      const m = (yield r.text()).match(/src="(https:\/\/vixcloud\.co\/embed\/[^"]+)"/);
      return m ? m[1].replace(/&amp;/g, "&") : null;
    } catch (e) {
      return null;
    }
  });
}
function resolveSczEmbed(metadata, normalizedType, season, episode, rawId) {
  return __async(this, null, function* () {
    try {
      const entries = yield getSitemap();
      if (!entries.length) return null;
      const inputIsTmdb = /^\d+$/.test(String(rawId).replace(/^tmdb:/i, ""));
      const targetTmdb = (metadata == null ? void 0 : metadata.id) || (inputIsTmdb ? String(rawId).replace(/^tmdb:/i, "") : null);
      const targetImdb = (metadata == null ? void 0 : metadata.imdb_id) || (!inputIsTmdb ? String(rawId) : null);
      const titlesToTry = [targetImdb, metadata == null ? void 0 : metadata.title, metadata == null ? void 0 : metadata.name, metadata == null ? void 0 : metadata.original_title, metadata == null ? void 0 : metadata.original_name].filter(Boolean);
      const candidateMatches = [];
      for (const t of titlesToTry) {
        for (const m of findInSitemap(entries, t)) {
          if (!candidateMatches.some((c) => c.id === m.id)) candidateMatches.push(m);
        }
      }
      if (!candidateMatches.length) {
        const searchResults = yield Promise.all(titlesToTry.map((t) => __async(null, null, function* () {
          var _a;
          try {
            const r = yield fetchStreamingCommunity(`${SC_BASE}/it/search?q=${encodeURIComponent(t)}`);
            if (!r.ok) return null;
            const html = yield r.text();
            const m = html.match(/data-page="({.+?})"/);
            if (!m) return null;
            const page = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
            return ((_a = page.props) == null ? void 0 : _a.titles) || [];
          } catch (_) {
            return null;
          }
        })));
        for (const titles of searchResults) {
          for (const item of titles || []) {
            if (!candidateMatches.some((c) => c.id === item.id)) {
              candidateMatches.push({ id: item.id, slug: item.slug });
            }
          }
        }
      }
      let foundTitle = null;
      const maxScrapes = Math.min(candidateMatches.length, 8);
      for (let offset = 0; offset < maxScrapes && !foundTitle; offset += 3) {
        const batch = candidateMatches.slice(offset, offset + 3);
        const scrapedBatch = yield Promise.all(batch.map(
          (m) => scrapeTitle(m.id, m.slug, normalizedType === "tv" ? season : null).catch(() => null)
        ));
        for (const scraped of scrapedBatch) {
          if (!scraped) continue;
          const matchTmdb = targetTmdb && scraped.tmdb_id !== null && String(scraped.tmdb_id) === String(targetTmdb);
          const matchImdb = targetImdb && scraped.imdb_id && String(scraped.imdb_id).toLowerCase() === String(targetImdb).toLowerCase();
          if (matchTmdb || matchImdb) {
            foundTitle = scraped;
            break;
          }
        }
      }
      if (!foundTitle || foundTitle.coming_soon) return null;
      let episodeId = null;
      if (normalizedType === "tv") {
        const targetSeason = Number(season) || 1;
        if (foundTitle.seasonNumber !== targetSeason || !foundTitle.episodes) return null;
        const epNum = Number(episode) || 1;
        const epObj = foundTitle.episodes.find((e) => e.number === epNum);
        if (!epObj) return null;
        episodeId = epObj.id;
      }
      const iframeUrl = `${SC_BASE}/it/iframe/${foundTitle.id}${episodeId ? "?episode_id=" + episodeId : ""}`;
      const embedUrl = yield getCamEmbed(foundTitle.id, episodeId);
      if (!embedUrl) return null;
      return { embedUrl, iframeUrl };
    } catch (e) {
      console.error("[StreamingCommunity] SCZ embed resolve error:", e.message);
      return null;
    }
  });
}
var TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
var USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
function getCommonHeaders() {
  return {
    "User-Agent": USER_AGENT,
    "Referer": `${getStreamingCommunityBaseUrl()}/`,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
  };
}
function getEmbedHeaders(embedUrl) {
  return {
    "User-Agent": USER_AGENT,
    "Referer": `${getStreamingCommunityBaseUrl()}/`,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"
  };
}
function getPlaylistHeaders(embedUrl) {
  let origin = getStreamingCommunityBaseUrl();
  try {
    origin = new URL(embedUrl).origin;
  } catch (_) {
  }
  return {
    "User-Agent": USER_AGENT,
    "Referer": embedUrl,
    "Origin": origin,
    "Accept": "*/*",
    "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin"
  };
}
function getResponseCookies(response) {
  var _a, _b, _c;
  try {
    const cookies = typeof ((_a = response.headers) == null ? void 0 : _a.getSetCookie) === "function" ? response.headers.getSetCookie() : [(_c = (_b = response.headers) == null ? void 0 : _b.get) == null ? void 0 : _c.call(_b, "set-cookie")].filter(Boolean);
    return cookies.map((value) => String(value).split(";", 1)[0]).filter(Boolean).join("; ");
  } catch (_) {
    return "";
  }
}
function rewriteStreamingCommunityHost(value) {
  return String(value || "").replace(/vixcloud\.co/gi, streamingCommunityMediaHost).replace(/vixsrc\.to/gi, streamingCommunityMediaHost);
}
function extractEmbedSrcFromApiPayload(payload) {
  const rawSrc = payload && typeof payload === "object" ? payload.src : null;
  if (!rawSrc) return null;
  try {
    return new URL(rawSrc, getStreamingCommunityBaseUrl()).toString();
  } catch (e) {
    return null;
  }
}
function extractMasterPlaylistFromEmbedHtml(html, preferActiveStream = false) {
  if (!html) return null;
  const tokenMatch = html.match(/'token'\s*:\s*'([^']+)'/i);
  const expiresMatch = html.match(/'expires'\s*:\s*'([^']+)'/i);
  const urlMatch = html.match(/url\s*:\s*'([^']+\/playlist\/\d+[^']*)'/i);
  if (!tokenMatch || !expiresMatch || !urlMatch) {
    return null;
  }
  let playlistUrl = urlMatch[1];
  if (preferActiveStream) {
    const streamsMatch = html.match(/window\.streams\s*=\s*(\[[\s\S]*?\])\s*;\s*window\.masterPlaylist/i);
    if (streamsMatch) {
      try {
        const streams = JSON.parse(streamsMatch[1]);
        const selected = streams.find((stream) => (stream == null ? void 0 : stream.active) && (stream == null ? void 0 : stream.url)) || streams.find((stream) => stream == null ? void 0 : stream.url);
        if (selected == null ? void 0 : selected.url) playlistUrl = selected.url;
      } catch (_) {
      }
    }
  }
  return {
    token: tokenMatch[1],
    expires: expiresMatch[1],
    url: playlistUrl
  };
}
function getQualityFromName(qualityStr) {
  if (!qualityStr) return "Unknown";
  const quality = qualityStr.toUpperCase();
  if (quality === "ORG" || quality === "ORIGINAL") return "Original";
  if (quality === "4K" || quality === "2160P") return "4K";
  if (quality === "1440P" || quality === "2K") return "1440p";
  if (quality === "1080P" || quality === "FHD") return "1080p";
  if (quality === "720P" || quality === "HD") return "720p";
  if (quality === "480P" || quality === "SD") return "480p";
  if (quality === "360P") return "360p";
  if (quality === "240P") return "240p";
  const match = qualityStr.match(/(\d{3,4})[pP]?/);
  if (match) {
    const resolution = parseInt(match[1]);
    if (resolution >= 2160) return "4K";
    if (resolution >= 1440) return "1440p";
    if (resolution >= 1080) return "1080p";
    if (resolution >= 720) return "720p";
    if (resolution >= 480) return "480p";
    if (resolution >= 360) return "360p";
    return "240p";
  }
  return "Unknown";
}
function getTmdbId(imdbId, type) {
  return __async(this, null, function* () {
    const normalizedType = String(type).toLowerCase();
    const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
    try {
      const response = yield fetchStreamingCommunity(findUrl);
      if (!response.ok) return null;
      const data = yield response.json();
      if (!data) return null;
      if (normalizedType === "movie" && data.movie_results && data.movie_results.length > 0) {
        return data.movie_results[0].id.toString();
      } else if (normalizedType === "tv" && data.tv_results && data.tv_results.length > 0) {
        return data.tv_results[0].id.toString();
      }
      return null;
    } catch (e) {
      console.error("[StreamingCommunity] Conversion error:", e);
      return null;
    }
  });
}
function getMetadata(id, type) {
  return __async(this, null, function* () {
    try {
      const normalizedType = String(type).toLowerCase();
      let url;
      if (String(id).startsWith("tt")) {
        url = `https://api.themoviedb.org/3/find/${id}?api_key=${TMDB_API_KEY}&external_source=imdb_id&language=it-IT`;
      } else {
        const endpoint = normalizedType === "movie" ? "movie" : "tv";
        url = `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}&language=it-IT`;
      }
      const response = yield fetchStreamingCommunity(url);
      if (!response.ok) return null;
      const data = yield response.json();
      if (String(id).startsWith("tt")) {
        const results = normalizedType === "movie" ? data.movie_results : data.tv_results;
        if (results && results.length > 0) return results[0];
      } else {
        return data;
      }
      return null;
    } catch (e) {
      console.error("[StreamingCommunity] Metadata error:", e);
      return null;
    }
  });
}
function getStreams(id, type, season, episode, providerContext = null) {
  return __async(this, null, function* () {
    const scStartedAt = Date.now();
    const scPhases = { setupMs: 0, metadataMs: 0, apiMs: 0, embedMs: 0 };
    let tSetup = Date.now();
    yield loadStreamingCommunityConfig();
    const requestedType = String(type).toLowerCase();
    const normalizedType = requestedType === "series" ? "tv" : requestedType;
    const baseUrl = getStreamingCommunityBaseUrl();
    const commonHeaders = getCommonHeaders();
    let tmdbId = id.toString();
    let resolvedSeason = season;
    const contextTmdbId = providerContext && /^\d+$/.test(String(providerContext.tmdbId || "")) ? String(providerContext.tmdbId) : null;
    if (contextTmdbId) {
      tmdbId = contextTmdbId;
    } else if (tmdbId.startsWith("tmdb:")) {
      tmdbId = tmdbId.replace("tmdb:", "");
    } else if (tmdbId.startsWith("tt")) {
      const convertedId = yield getTmdbId(tmdbId, normalizedType);
      if (convertedId) {
        console.log(`[StreamingCommunity] Converted ${id} to TMDB ID: ${convertedId}`);
        tmdbId = convertedId;
      } else {
        console.warn(`[StreamingCommunity] Could not convert IMDb ID ${id} to TMDB ID.`);
      }
    }
    let metadata = null;
    try {
      const tMeta = Date.now();
      metadata = yield getMetadata(tmdbId, type);
      scPhases.metadataMs += Date.now() - tMeta;
    } catch (e) {
      console.error("[StreamingCommunity] Error fetching metadata:", e);
    }
    scPhases.setupMs += Date.now() - tSetup - scPhases.metadataMs;
    const title = metadata && (metadata.title || metadata.name || metadata.original_title || metadata.original_name) ? metadata.title || metadata.name || metadata.original_title || metadata.original_name : normalizedType === "movie" ? "Film Sconosciuto" : "Serie TV";
    const displayName = normalizedType === "movie" ? title : `${title} ${resolvedSeason}x${episode}`;
    const finalDisplayName = displayName;
    let url;
    let apiUrl;
    if (normalizedType === "movie") {
      url = `${baseUrl}/movie/${tmdbId}`;
      apiUrl = `${baseUrl}/api/movie/${tmdbId}`;
    } else if (normalizedType === "tv") {
      url = `${baseUrl}/tv/${tmdbId}/${resolvedSeason}/${episode}`;
      apiUrl = `${baseUrl}/api/tv/${tmdbId}/${resolvedSeason}/${episode}`;
    } else {
      return [];
    }
    let scProxy = "";
    try {
      scProxy = new URL(getProviderProxyUrl(apiUrl, "streamingcommunity")).hostname;
    } catch (e) {
    }
    announceVixsrcCheck(url);
    if (typeof isFlareSessionBlocked === "function" && isFlareSessionBlocked("vixsrc")) {
      if (Date.now() - blockedLogAt > 5 * 60 * 1e3) {
        blockedLogAt = Date.now();
        console.warn("[StreamingCommunity] IP bloccato da Cloudflare per Vixsrc: provider in pausa (controlla il proxy nel pannello)");
      }
      return [];
    }
    const warming = typeof warmFlareSession === "function" ? warmFlareSession("vixsrc", baseUrl, {
      proxyUrl: getProviderProxyUrl(baseUrl, "vixsrc") || getProviderProxyUrl(baseUrl, "streamingcommunity")
    }) : null;
    if (typeof isFlareSessionReady === "function" && !isFlareSessionReady("vixsrc")) {
      console.log("[StreamingCommunity] Sessione FlareSolverr non pronta, salto provider e riscaldo in background");
      if (warming) {
        warming.then(() => console.log("[StreamingCommunity] Sessione FlareSolverr pronta!")).catch((e) => console.error("[StreamingCommunity] Warm-up sessione fallito:", e.message));
      }
      return [];
    }
    if (typeof isFlareSessionBusy === "function" && isFlareSessionBusy("vixsrc")) {
      console.log("[StreamingCommunity] Challenge in corso per Vixsrc, salto provider");
      return [];
    }
    try {
      const proxySocks = STREAMINGCOMMUNITY_PROXY || typeof process !== "undefined" && process.env.SOCKS5_PROXY || "";
      const useProxyFetch = proxySocks && typeof ProxyAgent === "function";
      let proxyAgent = null;
      if (useProxyFetch) {
        try {
          proxyAgent = new ProxyAgent(proxySocks);
          console.log(`[StreamingCommunity] Using SOCKS5 proxy for fetches`);
        } catch (e) {
          console.warn(`[StreamingCommunity] Failed to create proxy agent: ${e.message}`);
        }
      }
      console.log(`[StreamingCommunity] Fetching API: ${apiUrl}`);
      const tApi = Date.now();
      const vixPromise = fetchWithCloudflareCookies(apiUrl, { headers: commonHeaders, dispatcher: proxyAgent || void 0 }, "streamingcommunity").then((r) => r.ok ? r.json() : null).then((payload) => {
        const embedUrl = extractEmbedSrcFromApiPayload(payload);
        return embedUrl ? { embedUrl, iframeUrl: url } : null;
      }).catch(() => null);
      const sczPromise = resolveSczEmbed(metadata, normalizedType, resolvedSeason, episode, id).catch(() => null);
      const processEmbedSource = (item) => __async(null, null, function* () {
        const embedUrl = rewriteStreamingCommunityHost(item.embedUrl);
        const isSczSource = item.source === "scz";
        let embedHtml;
        let embedCookies = "";
        try {
          console.log(`[StreamingCommunity] Fetching embed (${item.source}): ${embedUrl}`);
          const embedResponse = yield fetchWithCloudflareCookies(embedUrl, {
            headers: getEmbedHeaders(embedUrl),
            dispatcher: proxyAgent || void 0
          });
          if (!embedResponse.ok) {
            console.error(`[StreamingCommunity] Failed to fetch embed (${item.source}): ${embedResponse.status}`);
            return null;
          }
          embedCookies = getResponseCookies(embedResponse);
          embedHtml = yield embedResponse.text();
        } catch (e) {
          console.error(`[StreamingCommunity] Failed to fetch embed (${item.source}): ${e.message}`);
          return null;
        }
        if (!embedHtml) return null;
        const masterPlaylist = extractMasterPlaylistFromEmbedHtml(embedHtml);
        if (!masterPlaylist) {
          console.log("[StreamingCommunity] Could not find playlist info in HTML");
          return null;
        }
        const embedParams = new URL(embedUrl).searchParams;
        const playlistParams = [
          ["token", masterPlaylist.token],
          ["expires", masterPlaylist.expires],
          ...embedParams.get("canPlayFHD") ? [["h", "1"]] : [],
          ...embedParams.get("scz") ? [["scz", "1"]] : [],
          ["lang", embedParams.get("lang") || "en"]
        ];
        const playlistSeparator = masterPlaylist.url.includes("?") ? "&" : "?";
        const streamUrl = rewriteStreamingCommunityHost(
          `${masterPlaylist.url}${playlistSeparator}${playlistParams.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&")}`
        );
        const cleanEmbedUrl = embedUrl;
        const cleanIframeUrl = rewriteStreamingCommunityHost(item.iframeUrl || cleanEmbedUrl);
        const streamHeaders = getPlaylistHeaders(embedUrl);
        if (embedCookies) streamHeaders.Cookie = embedCookies;
        console.log(`[StreamingCommunity] Final stream URL (${item.source}): ${streamUrl}`);
        let quality = "1080p";
        let hasItalianAudio = false;
        let playlistFetched = false;
        try {
          const playlistResponse = yield fetchWithCloudflareCookies(streamUrl, {
            headers: streamHeaders,
            dispatcher: proxyAgent || void 0
          });
          if (!playlistResponse.ok) {
            console.warn(`[StreamingCommunity] Playlist pre-check failed (${item.source}): ${playlistResponse.status}, stream not playable`);
            return null;
          }
          playlistFetched = true;
          const playlistText = yield playlistResponse.text();
          if (playlistText) {
            hasItalianAudio = /#EXT-X-MEDIA:TYPE=AUDIO.*(?:LANGUAGE="it"|LANGUAGE="ita"|NAME="Italian"|NAME="Ita")/i.test(playlistText);
            const detected = checkQualityFromText(playlistText);
            if (detected) quality = detected;
          }
          if (item.source === "vixsrc") {
            publishVixsrcCheck(url, { exists: true, italian: hasItalianAudio });
          }
        } catch (e) {
          console.warn(`[StreamingCommunity] Playlist pre-check failed (${item.source}), continuing:`, e);
          return null;
        }
        const normalizedQuality = getQualityFromName(quality);
        const isItalianAudio = isSczSource || playlistFetched && hasItalianAudio;
        const resultLanguage = isItalianAudio ? "Italian" : "";
        const isStremioAddon = Boolean(providerContext == null ? void 0 : providerContext.proxyUrl);
        const targetProxySource = isStremioAddon ? cleanIframeUrl : cleanEmbedUrl;
        const result = {
          name: `StreamingCommunity`,
          title: finalDisplayName,
          url: streamUrl,
          easyProxySourceUrl: targetProxySource,
          quality: normalizedQuality,
          type: "direct",
          headers: streamHeaders,
          behaviorHints: {
            notWebReady: false
          },
          language: resultLanguage
        };
        const formatted = formatStream(result, "StreamingCommunity");
        return formatted ? { stream: formatted, isItalianAudio } : null;
      });
      const streams = [];
      let sourcesResolved = 0;
      const vixRes = yield vixPromise;
      scPhases.apiMs += Date.now() - tApi;
      const vixEmbedUrl = (vixRes == null ? void 0 : vixRes.embedUrl) ? rewriteStreamingCommunityHost(vixRes.embedUrl) : "";
      const tEmbed = Date.now();
      let vixItalian = false;
      if (vixEmbedUrl) {
        sourcesResolved += 1;
        try {
          const processed = yield processEmbedSource(__spreadProps(__spreadValues({}, vixRes), { embedUrl: vixEmbedUrl, source: "vixsrc" }));
          if (processed) {
            streams.push(processed.stream);
            vixItalian = processed.isItalianAudio;
          }
        } finally {
          settleVixsrcCheck(url);
        }
      }
      if (!vixItalian) {
        const sczWaitStartedAt = Date.now();
        const sczRes = yield sczPromise;
        scPhases.apiMs += Date.now() - sczWaitStartedAt;
        const sczEmbedUrl = (sczRes == null ? void 0 : sczRes.embedUrl) ? rewriteStreamingCommunityHost(sczRes.embedUrl) : "";
        if (sczEmbedUrl && sczEmbedUrl !== vixEmbedUrl) {
          sourcesResolved += 1;
          const processed = yield processEmbedSource(__spreadProps(__spreadValues({}, sczRes), { embedUrl: sczEmbedUrl, source: "scz" }));
          if (processed) streams.push(processed.stream);
        }
      }
      if (streams.length === 0) {
        console.log("[StreamingCommunity] Could not find embed src from any source");
        scPhases.embedMs += Date.now() - tEmbed;
        console.warn("[streamingcommunity][PhaseTiming]", JSON.stringify(__spreadProps(__spreadValues({}, scPhases), { proxy: scProxy, totalMs: Date.now() - scStartedAt, sources: 0 })));
        return [];
      }
      const uniqueStreams = [];
      const seenStreamUrls = /* @__PURE__ */ new Set();
      for (const stream of streams) {
        const streamUrl = String((stream == null ? void 0 : stream.url) || "").trim();
        if (!streamUrl || seenStreamUrls.has(streamUrl)) continue;
        seenStreamUrls.add(streamUrl);
        uniqueStreams.push(stream);
      }
      const itaStreams = uniqueStreams.filter((s) => {
        var _a;
        return Boolean(s.language) || ((_a = s.title) == null ? void 0 : _a.includes("\u{1F1EE}\u{1F1F9}"));
      });
      scPhases.embedMs += Date.now() - tEmbed;
      console.warn("[streamingcommunity][PhaseTiming]", JSON.stringify(__spreadProps(__spreadValues({}, scPhases), { proxy: scProxy, totalMs: Date.now() - scStartedAt, sources: sourcesResolved })));
      if (itaStreams.length > 0) {
        return [itaStreams[0]];
      }
      return uniqueStreams.length > 0 ? [uniqueStreams[0]] : [];
    } catch (error) {
      console.error("[StreamingCommunity] Error:", error);
      return [];
    }
  });
}
module.exports = { getStreams };
