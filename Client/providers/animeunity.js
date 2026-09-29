"use strict";
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

// src/extractors/common.js
var require_common = __commonJS({
  "src/extractors/common.js"(exports2, module2) {
    var USER_AGENT2 = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
    function getProxiedUrl2(url) {
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
      getProxiedUrl: getProxiedUrl2,
      isFlareSolverrBlockedError
    };
  }
});

// src/fetch_helper.js
var require_fetch_helper = __commonJS({
  "src/fetch_helper.js"(exports2, module2) {
    var FETCH_TIMEOUT2 = 3e4;
    function createTimeoutSignal2(timeoutMs) {
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
    function fetchWithTimeout2(_0) {
      return __async(this, arguments, function* (url, options = {}) {
        if (typeof fetch === "undefined") {
          throw new Error("No fetch implementation found!");
        }
        const _a = options, { timeout } = _a, fetchOptions = __objRest(_a, ["timeout"]);
        const requestTimeout = timeout || FETCH_TIMEOUT2;
        const timeoutConfig = createTimeoutSignal2(requestTimeout);
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
    module2.exports = { fetchWithTimeout: fetchWithTimeout2, createTimeoutSignal: createTimeoutSignal2 };
  }
});

// src/quality_helper.js
var require_quality_helper = __commonJS({
  "src/quality_helper.js"(exports2, module2) {
    var { createTimeoutSignal: createTimeoutSignal2 } = require_fetch_helper();
    var USER_AGENT2 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36";
    function checkQualityFromText(text) {
      if (!text) return null;
      if (/RESOLUTION=\d+x2160/i.test(text) || /RESOLUTION=2160/i.test(text)) return "4K";
      if (/RESOLUTION=\d+x1440/i.test(text) || /RESOLUTION=1440/i.test(text)) return "1440p";
      if (/RESOLUTION=\d+x1080/i.test(text) || /RESOLUTION=1080/i.test(text)) return "1080p";
      if (/RESOLUTION=\d+x720/i.test(text) || /RESOLUTION=720/i.test(text)) return "720p";
      if (/RESOLUTION=\d+x480/i.test(text) || /RESOLUTION=480/i.test(text)) return "480p";
      return null;
    }
    function checkQualityFromPlaylist2(_0) {
      return __async(this, arguments, function* (url, headers = {}, options = {}) {
        try {
          const finalHeaders = __spreadValues({}, headers);
          if (!finalHeaders["User-Agent"]) finalHeaders["User-Agent"] = USER_AGENT2;
          const timeoutConfig = createTimeoutSignal2(3e3);
          try {
            const fetcher = typeof options.fetcher === "function" ? options.fetcher : fetch;
            const response = yield fetcher(url, {
              headers: finalHeaders,
              signal: timeoutConfig.signal
            });
            if (!response.ok) return null;
            const text = yield response.text();
            if (!text.startsWith("#EXTM3U")) return null;
            const quality = checkQualityFromText(text);
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
      checkQualityFromPlaylist: checkQualityFromPlaylist2,
      getQualityFromUrl,
      checkQualityFromText
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
    function isFlareSessionReady(provider) {
      return flareSessionState(provider).ready === true;
    }
    function isFlareSessionBusy(provider) {
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
    function isFlareSessionBlocked(provider) {
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
      if (isFlareSessionBlocked(provider)) return Promise.resolve(false);
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
    function warmFlareSession(provider, warmUrl, { proxyUrl = "" } = {}) {
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
      if (isFlareSessionBlocked(provider)) return Promise.resolve(false);
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
          if (!warmUrl3 || isFlareSessionBlocked(provider)) return Promise.resolve(false);
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
          yield warmFlareSession(provider, state.warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
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
            yield warmFlareSession(provider, warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
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
              yield warmFlareSession(provider, warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
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
                warmFlareSession(provider, state.warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
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
        if (isFlareSessionBusy(provider) && !oneShot) throw new Error("Sessione FlareSolverr occupata");
        const state = flareSessionState(provider);
        if (proxyUrl) setFlareProxy(state, proxyUrl);
        if (!state.cookies) {
          if (!oneShot) {
            const warmUrl = state.warmUrl || defaultWarmUrl(provider);
            if (warmUrl) {
              warmFlareSession(provider, warmUrl, { proxyUrl: state.proxyUrl }).catch(() => {
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
    module2.exports = { getClearance, hasActiveBypass, execPythonBypass, getStats, getSessionDir: sessionDir, cfSessionFilePath, flareRequest, flareRequestOnce, tlsFetch, refreshFlareSession, isFlareSessionReady, isFlareSessionBusy, isFlareSessionBlocked, warmFlareSession, warmFlareOnce, fetchFlarePage };
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
    function getProviderProxyUrl(url, providerName) {
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
        const { tlsFetch, warmFlareOnce, refreshFlareSession, isFlareSessionReady, isFlareSessionBusy } = require_cf_bypass();
        const { rewriteVixsrcHost: rewriteVixsrcHost2 } = require_vixcloud();
        const targetUrl = rewriteVixsrcHost2(request.url);
        const updatedRequest = __spreadProps(__spreadValues({}, request), { url: targetUrl });
        const proxyUrl = getProviderProxyUrl(targetUrl, providerName) || getProviderProxyUrl(targetUrl, "vixsrc") || getProviderProxyUrl(targetUrl, "streamingcommunity") || getProviderProxyUrl(targetUrl, "cinejoy") || getProviderProxyUrl(targetUrl, "vidfast") || getProviderProxyUrl(targetUrl, "animeunity");
        const skipForBypass = (cause) => {
          const error = new Error("Flare bypass in corso");
          error.code = "FLARE_BYPASS_IN_PROGRESS";
          error.cause = cause;
          return error;
        };
        if (isFlareSessionBusy("vixsrc")) {
          throw skipForBypass();
        }
        if (!isFlareSessionReady("vixsrc")) {
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
      getProviderProxyUrl,
      fetchVixsrcPage,
      isVixsrcTarget
    };
  }
});

// src/extractors/vixcloud.js
var require_vixcloud = __commonJS({
  "src/extractors/vixcloud.js"(exports2, module2) {
    var { USER_AGENT: USER_AGENT2 } = require_common();
    var { checkQualityFromPlaylist: checkQualityFromPlaylist2 } = require_quality_helper();
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
    function rewriteVixsrcHost2(value) {
      return String(value || "").replace(/vixcloud\.co/gi, vixsrcMediaHost).replace(/vixsrc\.to/gi, vixsrcMediaHost);
    }
    function extractVixCloud2(url) {
      return __async(this, null, function* () {
        try {
          yield loadVixsrcConfig();
          const fixedUrl = rewriteVixsrcHost2(url);
          const vixsrcReferer = rewriteVixsrcHost2("https://vixcloud.co/");
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
            const streamUrl = rewriteVixsrcHost2(finalUrl);
            const detectedQuality = yield checkQualityFromPlaylist2(streamUrl, {
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
    module2.exports = { extractVixCloud: extractVixCloud2, rewriteVixsrcHost: rewriteVixsrcHost2, getVixsrcBaseUrl };
  }
});

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

// easyjack/anime_mapping.js
var require_anime_mapping = __commonJS({
  "easyjack/anime_mapping.js"(exports2, module2) {
    "use strict";
    var DEFAULT_ANIME_MAPPING_URL = "https://animemapping.realbestia.com";
    var configuredAnimeMappingUrl = "";
    function normalizeAnimeMappingUrl(value) {
      const normalized = String(value || "").trim().replace(/\/+$/, "");
      if (!normalized) return "";
      try {
        const parsed = new URL(normalized);
        if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
          return "";
        }
        if (parsed.search || parsed.hash) return "";
        return parsed.toString().replace(/\/+$/, "");
      } catch (e) {
        return "";
      }
    }
    function getAnimeMappingBaseUrl2() {
      var _a;
      const scraperSettings = typeof globalThis !== "undefined" && globalThis.SCRAPER_SETTINGS && typeof globalThis.SCRAPER_SETTINGS === "object" ? globalThis.SCRAPER_SETTINGS : null;
      const configured = configuredAnimeMappingUrl || (scraperSettings == null ? void 0 : scraperSettings.animeMappingUrl) || (scraperSettings == null ? void 0 : scraperSettings.animeMappingURL) || (typeof globalThis !== "undefined" ? globalThis.EASYJACK_ANIME_MAPPING_URL : "") || (typeof process !== "undefined" ? (_a = process.env) == null ? void 0 : _a.EASYJACK_ANIME_MAPPING_URL : "");
      return normalizeAnimeMappingUrl(configured) || DEFAULT_ANIME_MAPPING_URL;
    }
    function setAnimeMappingBaseUrl(value) {
      configuredAnimeMappingUrl = normalizeAnimeMappingUrl(value);
      return getAnimeMappingBaseUrl2();
    }
    module2.exports = {
      DEFAULT_ANIME_MAPPING_URL,
      getAnimeMappingBaseUrl: getAnimeMappingBaseUrl2,
      normalizeAnimeMappingUrl,
      setAnimeMappingBaseUrl
    };
  }
});

// src/animeunity/index.js
var { extractVixCloud, rewriteVixsrcHost } = require_vixcloud();
var { getProxiedUrl } = require_common();
var { formatStream } = require_formatter();
var { checkQualityFromPlaylist } = require_quality_helper();
var { createTimeoutSignal } = require_fetch_helper();
var { fetchWithCloudflareCookies } = require_cloudflare_provider_fetch();
var { getAnimeMappingBaseUrl } = require_anime_mapping();
function getUnityBaseUrl() {
  return "https://www.animeunity.so";
}
function getMappingApiBase() {
  return getAnimeMappingBaseUrl();
}
function getAnimeUnityProxyDisplay(url) {
  var _a;
  try {
    const display = (_a = global.getEasyStreamsProviderProxyDisplay) == null ? void 0 : _a.call(global, url);
    return display || "none";
  } catch (e) {
    return "unknown";
  }
}
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";
var FETCH_TIMEOUT = 1e4;
var TTL = {
  http: 5 * 60 * 1e3,
  animePage: 15 * 60 * 1e3,
  streamPage: 5 * 60 * 1e3,
  mapping: 2 * 60 * 1e3
};
var caches = {
  http: /* @__PURE__ */ new Map(),
  mapping: /* @__PURE__ */ new Map(),
  inflight: /* @__PURE__ */ new Map()
};
var animeUnityCookies = /* @__PURE__ */ new Map();
var animeUnityCsrfToken = "";
var animeUnitySessionWarmupPromise = null;
function getCached(map, key) {
  const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative" || typeof global !== "undefined" && global.HermesInternal;
  if (isReactNative) return void 0;
  const entry = map.get(key);
  if (!entry) return void 0;
  if (entry.expiresAt <= Date.now()) {
    map.delete(key);
    return void 0;
  }
  return entry.value;
}
function setCached(map, key, value, ttlMs) {
  const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative" || typeof global !== "undefined" && global.HermesInternal;
  if (isReactNative) return value;
  for (const [k, entry] of map.entries()) {
    if (entry.expiresAt <= Date.now()) {
      map.delete(k);
    }
  }
  const MAX_CACHE_ENTRIES = 500;
  if (map.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = map.keys().next().value;
    if (oldestKey !== void 0) {
      map.delete(oldestKey);
    }
  }
  map.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}
function uniqueStrings(values) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const value of values) {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}
function parsePositiveInt(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}
function normalizeRequestedEpisode(value) {
  const parsed = parsePositiveInt(value);
  return parsed || 1;
}
function resolveAnimeEpisode(provider, providerContext, fallbackEpisode) {
  const requestedEpisode = parsePositiveInt(providerContext == null ? void 0 : providerContext.requestedEpisode);
  const mappedEpisode = parsePositiveInt(fallbackEpisode);
  return ["kitsu", "mal", "anilist", "anidb", "imdb", "tmdb", "tvdb"].includes(String(provider || "").toLowerCase()) ? normalizeRequestedEpisode(mappedEpisode || requestedEpisode) : normalizeRequestedEpisode(fallbackEpisode);
}
function normalizeRequestedSeason(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}
function getMappingLanguage(providerContext = null) {
  return "it";
}
function toAbsoluteUrl(href) {
  if (!href) return null;
  const trimmed = String(href).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  try {
    return new URL(trimmed, getUnityBaseUrl()).toString();
  } catch (e) {
    return null;
  }
}
function normalizeAnimePath(pathOrUrl) {
  if (!pathOrUrl) return null;
  let value = String(pathOrUrl).trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      value = new URL(value).pathname;
    } catch (e) {
      return null;
    }
  }
  if (!value.startsWith("/")) value = `/${value}`;
  value = value.replace(/\/+$/, "");
  const match = value.match(/^\/(?:anime\/\d+(?:-[^/?#]+)?|play\/[^/?#]+)/i);
  return match ? match[0] : null;
}
function buildUnityUrl(pathOrUrl) {
  const text = String(pathOrUrl || "").trim();
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) return text;
  if (text.startsWith("/")) return `${getUnityBaseUrl()}${text}`;
  return `${getUnityBaseUrl()}/${text}`;
}
function isAnimeUnityUrl(url) {
  const text = String(url || "").trim();
  return text.startsWith(getUnityBaseUrl());
}
function getAnimeUnityCookieHeader() {
  if (animeUnityCookies.size === 0) return "";
  return Array.from(animeUnityCookies.entries()).map(([name, value]) => `${name}=${value}`).join("; ");
}
function getSetCookieHeaders(response) {
  var _a, _b;
  if (!(response == null ? void 0 : response.headers)) return [];
  if (typeof response.headers.getSetCookie === "function") {
    const values = response.headers.getSetCookie();
    if (Array.isArray(values) && values.length > 0) return values;
  }
  if (typeof response.headers.raw === "function") {
    const raw = response.headers.raw();
    const values = raw == null ? void 0 : raw["set-cookie"];
    if (Array.isArray(values) && values.length > 0) return values;
  }
  const single = (_b = (_a = response.headers).get) == null ? void 0 : _b.call(_a, "set-cookie");
  return single ? [single] : [];
}
function storeAnimeUnityCookies(response) {
  const setCookies = getSetCookieHeaders(response);
  for (const value of setCookies) {
    const cookie = String(value || "").split(";")[0];
    const separatorIndex = cookie.indexOf("=");
    if (separatorIndex <= 0) continue;
    const name = cookie.slice(0, separatorIndex).trim();
    const cookieValue = cookie.slice(separatorIndex + 1).trim();
    if (!name) continue;
    animeUnityCookies.set(name, cookieValue);
  }
}
function storeAnimeUnityCsrfToken(html) {
  const match = String(html || "").match(
    /<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i
  );
  const token = String((match == null ? void 0 : match[1]) || "").trim();
  if (token) {
    animeUnityCsrfToken = token;
  }
}
function hasHeader(headers, key) {
  const target = String(key || "").trim().toLowerCase();
  if (!target) return false;
  return Object.keys(headers || {}).some((name) => String(name || "").toLowerCase() === target);
}
function getHeaderValue(headers, key) {
  const target = String(key || "").trim().toLowerCase();
  if (!target) return void 0;
  const match = Object.keys(headers || {}).find(
    (name) => String(name || "").toLowerCase() === target
  );
  return match ? headers[match] : void 0;
}
function buildAnimeUnityHeaders(url, headers = {}, as = "text") {
  const finalHeaders = __spreadValues({
    "user-agent": USER_AGENT,
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    accept: as === "json" ? "application/json, text/plain, */*" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "cache-control": "no-cache",
    pragma: "no-cache"
  }, headers);
  if (!isAnimeUnityUrl(url)) return finalHeaders;
  if (!hasHeader(finalHeaders, "referer")) {
    finalHeaders.referer = `${getUnityBaseUrl()}/`;
  }
  const requestedWith = String(getHeaderValue(finalHeaders, "x-requested-with") || "").trim().toLowerCase();
  if (requestedWith === "xmlhttprequest") {
    if (animeUnityCsrfToken && !hasHeader(finalHeaders, "x-csrf-token")) {
      finalHeaders["x-csrf-token"] = animeUnityCsrfToken;
    }
    if (!hasHeader(finalHeaders, "origin")) {
      finalHeaders.origin = getUnityBaseUrl();
    }
    if (!hasHeader(finalHeaders, "sec-fetch-dest")) {
      finalHeaders["sec-fetch-dest"] = "empty";
    }
    if (!hasHeader(finalHeaders, "sec-fetch-mode")) {
      finalHeaders["sec-fetch-mode"] = "cors";
    }
    if (!hasHeader(finalHeaders, "sec-fetch-site")) {
      finalHeaders["sec-fetch-site"] = "same-origin";
    }
  } else {
    if (!hasHeader(finalHeaders, "upgrade-insecure-requests")) {
      finalHeaders["upgrade-insecure-requests"] = "1";
    }
    if (!hasHeader(finalHeaders, "sec-fetch-dest")) {
      finalHeaders["sec-fetch-dest"] = "document";
    }
    if (!hasHeader(finalHeaders, "sec-fetch-mode")) {
      finalHeaders["sec-fetch-mode"] = "navigate";
    }
    if (!hasHeader(finalHeaders, "sec-fetch-site")) {
      finalHeaders["sec-fetch-site"] = "same-origin";
    }
  }
  const cookieHeader = getAnimeUnityCookieHeader();
  if (cookieHeader && !hasHeader(finalHeaders, "cookie")) {
    finalHeaders.cookie = cookieHeader;
  }
  return finalHeaders;
}
function inferSourceTag(title, animePath) {
  const titleText = String(title || "").toLowerCase();
  const pathText = String(animePath || "").toLowerCase();
  if (/(?:^|[^\w])ita(?:[^\w]|$)/i.test(titleText)) return "ITA";
  if (/(?:^|[-_/])ita(?:[-_/]|$)/i.test(pathText)) return "ITA";
  return "SUB";
}
function sanitizeAnimeTitle(rawTitle) {
  let text = decodeHtmlEntities(rawTitle).trim();
  if (!text) return null;
  text = text.replace(/\s*-\s*AnimeUnity.*$/i, "").replace(/\s+Streaming.*$/i, "").trim();
  text = text.replace(/\s*[\[(]\s*(?:SUB\s*ITA|ITA|SUB|DUB(?:BED)?|DOPPIATO)\s*[\])]\s*/gi, " ").replace(/\s*[-\u2013_|:]\s*(?:SUB\s*ITA|ITA|SUB|DUB(?:BED)?|DOPPIATO)\s*$/gi, "").replace(/\s{2,}/g, " ").replace(/\s*[-\u2013_|:]\s*$/g, "").trim();
  return text || null;
}
function decodeHtmlEntities(value) {
  const decodedNumeric = String(value || "").replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
    const codePoint = Number.parseInt(hex, 16);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 1114111) return _;
    try {
      return String.fromCodePoint(codePoint);
    } catch (e) {
      return _;
    }
  }).replace(/&#(\d+);/g, (_, dec) => {
    const codePoint = Number.parseInt(dec, 10);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 1114111) return _;
    try {
      return String.fromCodePoint(codePoint);
    } catch (e) {
      return _;
    }
  });
  return decodedNumeric.replace(/&quot;/gi, '"').replace(/&apos;/gi, "'").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ");
}
function stripHtmlTags(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}
function getTagAttribute(tag, attrName) {
  const escaped = String(attrName || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escaped}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i");
  const match = String(tag || "").match(regex);
  return match ? decodeHtmlEntities(match[2]) : null;
}
function findFirstTag(html, tagName, attrPattern = "") {
  const regex = new RegExp(`<${tagName}\\b${attrPattern}[\\s\\S]*?>`, "i");
  const match = String(html || "").match(regex);
  return match ? match[0] : "";
}
function getMetaContent(html, propertyValue) {
  const escaped = String(propertyValue || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = findFirstTag(html, "meta", `(?=[^>]*(?:property|name)\\s*=\\s*["']${escaped}["'])`);
  return getTagAttribute(tag, "content");
}
function getFirstTagText(html, tagName) {
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = String(html || "").match(regex);
  return match ? stripHtmlTags(match[1]) : "";
}
function parseVideoPlayerJson(rawValue, fallback) {
  const text = String(rawValue || "").trim();
  if (!text) return fallback;
  const attempts = [
    text,
    text.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  ];
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (e) {
    }
  }
  return fallback;
}
function parseEpisodeNumber(value, fallbackNum) {
  const text = String(value || "").trim();
  const match = text.match(/(\d{1,4})/);
  if (match) {
    const parsed = Number.parseInt(match[1], 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return fallbackNum;
}
function parseTotalEpisodesFromHtml(html, fallbackCount = 0) {
  const match = /episodes_count="(\d+)"/i.exec(String(html || ""));
  const parsed = parsePositiveInt(match == null ? void 0 : match[1]);
  if (parsed) return parsed;
  return Math.max(0, parsePositiveInt(fallbackCount) || 0);
}
function extractEpisodesChunksFromHtml(html) {
  const chunks = [];
  const regex = /<video-player[^>]*episodes="([^"]*)"/gi;
  let match;
  while ((match = regex.exec(String(html || ""))) !== null) {
    const parsed = parseVideoPlayerJson(match[1], []);
    if (Array.isArray(parsed) && parsed.length > 0) {
      chunks.push(...parsed);
    }
  }
  return chunks;
}
function extractAnimeIdFromPath(animePath) {
  const match = String(animePath || "").match(/^\/anime\/(\d+)/i);
  return parsePositiveInt(match == null ? void 0 : match[1]);
}
function resolveLanguageEmoji(sourceTag) {
  return String(sourceTag || "").toUpperCase() === "ITA" ? "\u{1F1EE}\u{1F1F9}" : "\u{1F1EF}\u{1F1F5} \u{1F1EE}\u{1F1F9}";
}
function extractQualityHint(value) {
  const text = String(value || "");
  const match = text.match(/(\d{3,4}p)/i);
  return match ? match[1] : "Unknown";
}
function normalizeAnimeUnityQuality(value) {
  const quality = String(value || "").trim();
  if (!quality || ["unknown", "unknow"].includes(quality.toLowerCase())) return "1080p";
  return quality;
}
function normalizeEpisodesList(sourceEpisodes = []) {
  var _a, _b, _c;
  if (!Array.isArray(sourceEpisodes) || sourceEpisodes.length === 0) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (let index = 0; index < sourceEpisodes.length; index += 1) {
    const entry = sourceEpisodes[index] || {};
    const numRaw = Number.parseInt(String((_a = entry.num) != null ? _a : index + 1), 10);
    const num = Number.isFinite(numRaw) && numRaw > 0 ? numRaw : index + 1;
    const episodeId = parsePositiveInt((_b = entry.episodeId) != null ? _b : entry.id);
    const scwsId = parsePositiveInt((_c = entry.scwsId) != null ? _c : entry.scws_id);
    const token = String(
      entry.token || (episodeId ? `ep:${episodeId}` : scwsId ? `scws:${scwsId}` : `ep-${num}`)
    ).trim() || `ep-${num}`;
    const link = toAbsoluteUrl(entry.link || entry.file_name || null);
    const fileName = String(entry.fileName || entry.file_name || entry.link || "").trim() || null;
    const embedUrl = toAbsoluteUrl(entry.embedUrl || entry.embed_url || null);
    const key = `${num}|${episodeId || ""}|${scwsId || ""}|${token}|${link || ""}|${fileName || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      num,
      token,
      episodeId: episodeId || null,
      scwsId: scwsId || null,
      link,
      fileName,
      embedUrl
    });
  }
  out.sort((a, b) => a.num - b.num);
  return out;
}
function fetchWithTimeout(_0) {
  return __async(this, arguments, function* (url, options = {}, timeoutMs = FETCH_TIMEOUT) {
    const timeoutConfig = createTimeoutSignal(timeoutMs);
    const requestOptions = __spreadProps(__spreadValues({}, options), {
      provider: "animeunity",
      forceProviderProxy: true
    });
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
    } finally {
      if (typeof timeoutConfig.cleanup === "function") {
        timeoutConfig.cleanup();
      }
    }
  });
}
function warmAnimeUnitySession() {
  return __async(this, arguments, function* (timeoutMs = FETCH_TIMEOUT, requestUrl = getUnityBaseUrl(), sourceUrl = getUnityBaseUrl()) {
    if (animeUnitySessionWarmupPromise) return animeUnitySessionWarmupPromise;
    animeUnitySessionWarmupPromise = (() => __async(null, null, function* () {
      const response = yield fetchWithTimeout(
        requestUrl,
        {
          method: "GET",
          headers: buildAnimeUnityHeaders(sourceUrl, {}, "text"),
          redirect: "follow"
        },
        timeoutMs
      );
      storeAnimeUnityCookies(response);
      const html = yield response.text();
      storeAnimeUnityCsrfToken(html);
      return response.ok;
    }))();
    try {
      return yield animeUnitySessionWarmupPromise;
    } finally {
      animeUnitySessionWarmupPromise = null;
    }
  });
}
function requestAnimeUnityResponse(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const {
      as = "text",
      method = "GET",
      headers = {},
      body = void 0,
      timeoutMs = FETCH_TIMEOUT
    } = options;
    const requestConfig = {
      method,
      body,
      redirect: "follow"
    };
    const attemptStatuses = [];
    let providerProxyWarmupError = null;
    let proxyWarmupError = null;
    const doRequest = (_02, _1, ..._2) => __async(null, [_02, _1, ..._2], function* (targetUrl, requestHeaders, { storeCookies = false } = {}) {
      const response2 = yield fetchWithTimeout(
        targetUrl,
        __spreadProps(__spreadValues({}, requestConfig), {
          headers: requestHeaders
        }),
        timeoutMs
      );
      if (storeCookies && isAnimeUnityUrl(url)) {
        storeAnimeUnityCookies(response2);
      }
      return response2;
    });
    const directHeaders = buildAnimeUnityHeaders(url, headers, as);
    let response = yield doRequest(url, directHeaders, { storeCookies: true });
    attemptStatuses.push(`providerProxy(${getAnimeUnityProxyDisplay(url)})=${response.status}`);
    if (response.ok) return response;
    if (!isAnimeUnityUrl(url) || response.status !== 403) {
      throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
    }
    try {
      yield warmAnimeUnitySession(timeoutMs);
    } catch (error) {
      providerProxyWarmupError = error.message;
    }
    const retryHeaders = buildAnimeUnityHeaders(url, headers, as);
    response = yield doRequest(url, retryHeaders, { storeCookies: true });
    attemptStatuses.push(`providerProxySession(${getAnimeUnityProxyDisplay(url)})=${response.status}`);
    if (response.ok) return response;
    const proxiedUrl = getProxiedUrl(url);
    if (response.status === 403 && proxiedUrl && proxiedUrl !== url) {
      const proxiedBaseUrl = getProxiedUrl(getUnityBaseUrl());
      if (proxiedBaseUrl && proxiedBaseUrl !== getUnityBaseUrl()) {
        try {
          yield warmAnimeUnitySession(timeoutMs, proxiedBaseUrl, getUnityBaseUrl());
        } catch (error) {
          proxyWarmupError = error.message;
        }
      }
      const proxiedHeaders = buildAnimeUnityHeaders(url, headers, as);
      const proxiedResponse = yield doRequest(proxiedUrl, proxiedHeaders, { storeCookies: true });
      attemptStatuses.push(`proxy=${proxiedResponse.status}`);
      if (proxiedResponse.ok) return proxiedResponse;
      const debugSuffix2 = [
        attemptStatuses.join(", "),
        providerProxyWarmupError ? `providerProxyWarmup=${providerProxyWarmupError}` : "",
        proxyWarmupError ? `proxyWarmup=${proxyWarmupError}` : ""
      ].filter(Boolean).join(" | ");
      throw new Error(
        `HTTP ${proxiedResponse.status} ${proxiedResponse.statusText} for ${url}${debugSuffix2 ? ` (${debugSuffix2})` : ""}`
      );
    }
    const debugSuffix = [
      attemptStatuses.join(", "),
      providerProxyWarmupError ? `providerProxyWarmup=${providerProxyWarmupError}` : ""
    ].filter(Boolean).join(" | ");
    throw new Error(
      `HTTP ${response.status} ${response.statusText} for ${url}${debugSuffix ? ` (${debugSuffix})` : ""}`
    );
  });
}
function fetchResource(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const {
      ttlMs = 0,
      cacheKey = url,
      as = "text",
      method = "GET",
      headers = {},
      body = void 0,
      timeoutMs = FETCH_TIMEOUT
    } = options;
    const key = `${as}:${method}:${cacheKey}:${typeof body === "string" ? body : ""}`;
    if (ttlMs > 0) {
      const cached = getCached(caches.http, key);
      if (cached !== void 0) return cached;
    }
    const inflightKey = `http:${key}`;
    const running = caches.inflight.get(inflightKey);
    if (running) return running;
    const task = (() => __async(null, null, function* () {
      const response = yield requestAnimeUnityResponse(url, {
        as,
        method,
        headers,
        body,
        timeoutMs
      });
      const payload = as === "json" ? yield response.json() : yield response.text();
      if (as !== "json" && isAnimeUnityUrl(url)) {
        storeAnimeUnityCsrfToken(payload);
      }
      if (ttlMs > 0) setCached(caches.http, key, payload, ttlMs);
      return payload;
    }))();
    caches.inflight.set(inflightKey, task);
    try {
      return yield task;
    } finally {
      caches.inflight.delete(inflightKey);
    }
  });
}
function parseAnimePage(html, fallback = {}) {
  const vp = findFirstTag(html, "video-player");
  const animeData = parseVideoPlayerJson(getTagAttribute(vp, "anime"), {});
  const episodeData = parseVideoPlayerJson(getTagAttribute(vp, "episode"), null);
  const episodesData = parseVideoPlayerJson(getTagAttribute(vp, "episodes"), []);
  const pageTitle = getMetaContent(html, "og:title") || getFirstTagText(html, "title") || null;
  const titleCandidates = [
    fallback.title,
    animeData == null ? void 0 : animeData.title_it,
    animeData == null ? void 0 : animeData.title_eng,
    animeData == null ? void 0 : animeData.title,
    pageTitle
  ];
  let title = null;
  for (const candidate of titleCandidates) {
    const cleaned = sanitizeAnimeTitle(candidate);
    if (cleaned) {
      title = cleaned;
      break;
    }
  }
  const chunkEpisodes = extractEpisodesChunksFromHtml(html);
  const episodesInput = Array.isArray(chunkEpisodes) && chunkEpisodes.length > 0 ? chunkEpisodes : Array.isArray(episodesData) && episodesData.length > 0 ? episodesData : episodeData ? [episodeData] : [];
  const episodes = normalizeEpisodesList(
    episodesInput.map((entry, index) => ({
      num: parseEpisodeNumber((entry == null ? void 0 : entry.number) || (entry == null ? void 0 : entry.link), index + 1),
      token: (entry == null ? void 0 : entry.id) ? `ep:${entry.id}` : void 0,
      episodeId: entry == null ? void 0 : entry.id,
      scwsId: entry == null ? void 0 : entry.scws_id,
      fileName: (entry == null ? void 0 : entry.file_name) || (entry == null ? void 0 : entry.link),
      link: (entry == null ? void 0 : entry.link) || (entry == null ? void 0 : entry.file_name),
      embedUrl: (entry == null ? void 0 : entry.embed_url) || null
    }))
  );
  const currentEmbedUrl = toAbsoluteUrl(getTagAttribute(vp, "embed_url"));
  if (currentEmbedUrl && episodes.length > 0) {
    if (episodeData == null ? void 0 : episodeData.id) {
      const currentId = parsePositiveInt(episodeData.id);
      const current = episodes.find((entry) => entry.episodeId === currentId);
      if (current) current.embedUrl = currentEmbedUrl;
      else episodes[0].embedUrl = currentEmbedUrl;
    } else {
      episodes[0].embedUrl = currentEmbedUrl;
    }
  }
  return {
    title,
    animePath: normalizeAnimePath(fallback.animePath || null),
    animeId: extractAnimeIdFromPath(fallback.animePath || null),
    sourceTag: inferSourceTag(title, fallback.animePath),
    totalEpisodes: parseTotalEpisodesFromHtml(html, episodes.length),
    episodes
  };
}
function isDirectMediaPath(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (!/^https?:\/\//i.test(text)) {
    return /\.(?:mp4|m3u8)(?:[?#].*)?$/i.test(text);
  }
  try {
    const parsed = new URL(text);
    const path = String(parsed.pathname || "").toLowerCase();
    return path.endsWith(".mp4") || path.endsWith(".m3u8");
  } catch (e) {
    return /\.(?:mp4|m3u8)(?:[?#].*)?$/i.test(text);
  }
}
function normalizePlayableMediaUrl(rawUrl, depth = 0) {
  const absolute = toAbsoluteUrl(rawUrl);
  if (!absolute) return null;
  if (isDirectMediaPath(absolute)) return absolute;
  if (depth >= 1) return null;
  let parsed;
  try {
    parsed = new URL(absolute);
  } catch (e) {
    return null;
  }
  const path = String(parsed.pathname || "").toLowerCase();
  if (path.endsWith(".mp4") || path.endsWith(".m3u8")) return parsed.toString();
  const nestedKeys = ["url", "src", "file", "link", "stream", "id"];
  for (const key of nestedKeys) {
    const nested = parsed.searchParams.get(key);
    if (!nested) continue;
    let decoded = nested;
    try {
      decoded = decodeURIComponent(nested);
    } catch (e) {
      decoded = nested;
    }
    const nestedUrl = normalizePlayableMediaUrl(decoded, depth + 1);
    if (nestedUrl) return nestedUrl;
  }
  return null;
}
function collectMediaLinksFromEmbedHtml(html) {
  const links = [];
  const seen = /* @__PURE__ */ new Set();
  function addLink(href, label) {
    const playable = normalizePlayableMediaUrl(href);
    if (!playable || seen.has(playable)) return;
    seen.add(playable);
    links.push({ href: playable, label });
  }
  const raw = String(html || "");
  const variants = [raw, raw.replace(/\\\//g, "/")];
  for (const text of variants) {
    const downloadRegex = /window\.downloadUrl\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = downloadRegex.exec(text)) !== null) {
      addLink(match[1], "Download diretto");
    }
    const directRegex = /https?:\/\/[^\s"'<>\\]+(?:\.mp4|\.m3u8)(?:[^\s"'<>\\]*)?/gi;
    while ((match = directRegex.exec(text)) !== null) {
      addLink(match[0], "Player");
    }
    const encodedUrlRegex = /https%3A%2F%2F[^\s"'<>\\]+/gi;
    while ((match = encodedUrlRegex.exec(text)) !== null) {
      try {
        addLink(decodeURIComponent(match[0]), "Player");
      } catch (e) {
      }
    }
    const fileRegex = /(?:file|src|url|link)\s*[:=]\s*["']([^"']+)["']/gi;
    while ((match = fileRegex.exec(text)) !== null) {
      addLink(match[1], "Player");
    }
  }
  return links;
}
function pickEpisodeEntry(episodes, requestedEpisode) {
  const list = normalizeEpisodesList(episodes);
  if (list.length === 0) return null;
  const episode = normalizeRequestedEpisode(requestedEpisode);
  const byNum = list.find((entry) => entry.num === episode);
  if (byNum) return byNum;
  const byIndex = list[episode - 1];
  if (byIndex) return byIndex;
  if (list.length === 1) return list[0];
  const first = list.find((entry) => entry.num === 1);
  if (episode === 1 && first) return first;
  return null;
}
function resolveEmbedUrlForEpisodeEntry(source, episodeEntry) {
  return __async(this, null, function* () {
    var _a, _b;
    if (episodeEntry == null ? void 0 : episodeEntry.embedUrl) {
      const direct = toAbsoluteUrl(episodeEntry.embedUrl);
      if (direct) return direct;
    }
    if (episodeEntry == null ? void 0 : episodeEntry.episodeId) {
      try {
        const payload = yield fetchResource(`${getUnityBaseUrl()}/embed-url/${episodeEntry.episodeId}`, {
          ttlMs: TTL.streamPage,
          cacheKey: `embed-url:${episodeEntry.episodeId}`,
          timeoutMs: FETCH_TIMEOUT
        });
        const embedUrl = toAbsoluteUrl(String(payload || "").trim());
        if (embedUrl) return embedUrl;
      } catch (error) {
        console.error("[AnimeUnity] embed endpoint failed:", error.message);
      }
    }
    if (source == null ? void 0 : source.animePath) {
      try {
        const animeHtml = yield fetchResource(buildUnityUrl(source.animePath), {
          ttlMs: TTL.animePage,
          cacheKey: `anime-fallback:${source.animePath}`,
          timeoutMs: FETCH_TIMEOUT
        });
        const parsed = parseAnimePage(animeHtml, source);
        const candidate = normalizeEpisodesList(parsed.episodes).find((entry) => {
          if ((episodeEntry == null ? void 0 : episodeEntry.episodeId) && entry.episodeId) return entry.episodeId === episodeEntry.episodeId;
          if ((episodeEntry == null ? void 0 : episodeEntry.num) && entry.num) return entry.num === episodeEntry.num;
          return false;
        });
        const fallbackEmbed = toAbsoluteUrl((candidate == null ? void 0 : candidate.embedUrl) || ((_b = (_a = parsed.episodes) == null ? void 0 : _a[0]) == null ? void 0 : _b.embedUrl) || null);
        if (fallbackEmbed) return fallbackEmbed;
      } catch (error) {
        console.error("[AnimeUnity] anime fallback failed:", error.message);
      }
    }
    return null;
  });
}
function fetchEpisodesRangeFromApi(animeId, requestedEpisode, animeUrl) {
  return __async(this, null, function* () {
    const numericAnimeId = parsePositiveInt(animeId);
    const episodeNumber = normalizeRequestedEpisode(requestedEpisode);
    if (!numericAnimeId || !episodeNumber) return [];
    const startRange = Math.floor((episodeNumber - 1) / 120) * 120 + 1;
    const endRange = startRange + 119;
    const apiUrl = `${getUnityBaseUrl()}/info_api/${numericAnimeId}/1?start_range=${startRange}&end_range=${endRange}`;
    try {
      const payload = yield fetchResource(apiUrl, {
        as: "json",
        ttlMs: TTL.animePage,
        cacheKey: `info-api:${numericAnimeId}:${startRange}:${endRange}`,
        timeoutMs: FETCH_TIMEOUT,
        headers: {
          "x-requested-with": "XMLHttpRequest",
          referer: animeUrl
        }
      });
      if (!payload || !Array.isArray(payload.episodes)) return [];
      return normalizeEpisodesList(
        payload.episodes.map((entry, index) => ({
          num: parseEpisodeNumber((entry == null ? void 0 : entry.number) || (entry == null ? void 0 : entry.link), index + 1),
          token: (entry == null ? void 0 : entry.id) ? `ep:${entry.id}` : void 0,
          episodeId: entry == null ? void 0 : entry.id,
          scwsId: entry == null ? void 0 : entry.scws_id,
          fileName: (entry == null ? void 0 : entry.file_name) || (entry == null ? void 0 : entry.link),
          link: (entry == null ? void 0 : entry.link) || (entry == null ? void 0 : entry.file_name),
          embedUrl: (entry == null ? void 0 : entry.embed_url) || null
        }))
      );
    } catch (error) {
      console.error("[AnimeUnity] info_api request failed:", error.message);
      return [];
    }
  });
}
function parseExplicitRequestId(rawId) {
  const value = String(rawId || "").trim();
  if (!value) return null;
  let match = value.match(/^(kitsu|mal|anilist|anidb):(\d+)(?::(\d+))?(?::(\d+))?$/i);
  if (match) {
    return {
      provider: match[1].toLowerCase(),
      externalId: match[2],
      seasonFromId: match[4] ? normalizeRequestedSeason(match[3]) : null,
      episodeFromId: match[4] ? normalizeRequestedEpisode(match[4]) : match[3] ? normalizeRequestedEpisode(match[3]) : null
    };
  }
  match = value.match(/^imdb:(tt\d+)(?::(\d+))?(?::(\d+))?$/i);
  if (match) {
    return {
      provider: "imdb",
      externalId: match[1],
      seasonFromId: match[3] ? normalizeRequestedSeason(match[2]) : null,
      episodeFromId: match[3] ? normalizeRequestedEpisode(match[3]) : match[2] ? normalizeRequestedEpisode(match[2]) : null
    };
  }
  match = value.match(/^tmdb:(\d+)(?::(\d+))?(?::(\d+))?$/i);
  if (match) {
    return {
      provider: "tmdb",
      externalId: match[1],
      seasonFromId: match[3] ? normalizeRequestedSeason(match[2]) : null,
      episodeFromId: match[3] ? normalizeRequestedEpisode(match[3]) : match[2] ? normalizeRequestedEpisode(match[2]) : null
    };
  }
  match = value.match(/^(tt\d+)$/i);
  if (match) {
    return {
      provider: "imdb",
      externalId: match[1],
      seasonFromId: null,
      episodeFromId: null
    };
  }
  match = value.match(/^(\d+)$/);
  if (match) {
    return {
      provider: "tmdb",
      externalId: match[1],
      seasonFromId: null,
      episodeFromId: null
    };
  }
  return null;
}
function resolveLookupRequest(id, season, episode, providerContext = null) {
  let rawId = String(id || "").trim();
  try {
    rawId = decodeURIComponent(rawId);
  } catch (e) {
  }
  let requestedSeason = normalizeRequestedSeason(season);
  let requestedEpisode = normalizeRequestedEpisode(episode);
  const explicit = parseExplicitRequestId(rawId);
  if (explicit) {
    const explicitSeason = Number.isInteger(explicit.seasonFromId) && explicit.seasonFromId >= 0 ? explicit.seasonFromId : null;
    if (["kitsu", "mal", "anilist", "anidb"].includes(explicit.provider)) {
      requestedSeason = explicitSeason;
    } else if (explicitSeason !== null) {
      requestedSeason = explicitSeason;
    }
    if (Number.isInteger(explicit.episodeFromId) && explicit.episodeFromId > 0) {
      requestedEpisode = explicit.episodeFromId;
    } else if (["kitsu", "mal", "anilist", "anidb", "imdb", "tmdb", "tvdb"].includes(String(explicit.provider || "").toLowerCase())) {
      requestedEpisode = resolveAnimeEpisode(explicit.provider, providerContext, requestedEpisode);
    }
    return {
      provider: explicit.provider,
      externalId: explicit.externalId,
      season: requestedSeason,
      episode: requestedEpisode
    };
  }
  const contextKitsu = parsePositiveInt(providerContext == null ? void 0 : providerContext.kitsuId);
  if (contextKitsu) {
    return {
      provider: "kitsu",
      externalId: String(contextKitsu),
      season: null,
      episode: resolveAnimeEpisode("kitsu", providerContext, requestedEpisode)
    };
  }
  const contextMal = parsePositiveInt(providerContext == null ? void 0 : providerContext.malId);
  if (contextMal) {
    return {
      provider: "mal",
      externalId: String(contextMal),
      season: null,
      episode: resolveAnimeEpisode("mal", providerContext, requestedEpisode)
    };
  }
  const contextAnilist = parsePositiveInt(providerContext == null ? void 0 : providerContext.anilistId);
  if (contextAnilist) {
    return {
      provider: "anilist",
      externalId: String(contextAnilist),
      season: null,
      episode: resolveAnimeEpisode("anilist", providerContext, requestedEpisode)
    };
  }
  const contextAnidb = parsePositiveInt(providerContext == null ? void 0 : providerContext.anidbId);
  if (contextAnidb) {
    return {
      provider: "anidb",
      externalId: String(contextAnidb),
      season: null,
      episode: resolveAnimeEpisode("anidb", providerContext, requestedEpisode)
    };
  }
  const contextImdb = /^tt\d+$/i.test(String((providerContext == null ? void 0 : providerContext.imdbId) || "").trim()) ? String(providerContext.imdbId).trim() : null;
  if (contextImdb) {
    return {
      provider: "imdb",
      externalId: contextImdb,
      season: requestedSeason,
      episode: resolveAnimeEpisode("imdb", providerContext, requestedEpisode)
    };
  }
  const contextTmdb = /^\d+$/.test(String((providerContext == null ? void 0 : providerContext.tmdbId) || "").trim()) ? String(providerContext.tmdbId).trim() : null;
  if (contextTmdb) {
    return {
      provider: "tmdb",
      externalId: contextTmdb,
      season: requestedSeason,
      episode: resolveAnimeEpisode("tmdb", providerContext, requestedEpisode)
    };
  }
  return null;
}
function fetchMappingPayload(lookup, providerContext = null) {
  return __async(this, null, function* () {
    if (!(lookup == null ? void 0 : lookup.provider) || !(lookup == null ? void 0 : lookup.externalId)) return null;
    const provider = String(lookup.provider || "").trim().toLowerCase();
    const externalId = String(lookup.externalId || "").trim();
    const requestedEpisode = normalizeRequestedEpisode(lookup.episode);
    const requestedSeason = normalizeRequestedSeason(lookup.season);
    if (!["kitsu", "mal", "anilist", "anidb", "imdb", "tmdb"].includes(provider)) return null;
    if (!externalId) return null;
    const mappingLanguage = ["kitsu", "mal", "anilist", "anidb"].includes(provider) ? "it" : getMappingLanguage(providerContext);
    const mappingLanguageToken = mappingLanguage || "default";
    const cacheKey = `${provider}:${externalId}:s=${requestedSeason != null ? requestedSeason : "na"}:ep=${requestedEpisode}:lang=${mappingLanguageToken}`;
    const cached = getCached(caches.mapping, cacheKey);
    if (cached !== void 0) return cached;
    const params = new URLSearchParams();
    params.set("ep", String(requestedEpisode));
    if (Number.isInteger(requestedSeason) && requestedSeason >= 0) {
      params.set("s", String(requestedSeason));
    }
    if (mappingLanguage === "it") {
      params.set("lang", "it");
    }
    const url = `${getMappingApiBase()}/${provider}/${encodeURIComponent(externalId)}?${params.toString()}`;
    try {
      const payload = yield fetchResource(url, {
        as: "json",
        ttlMs: TTL.mapping,
        cacheKey,
        timeoutMs: FETCH_TIMEOUT
      });
      setCached(caches.mapping, cacheKey, payload, TTL.mapping);
      return payload;
    } catch (error) {
      console.error("[AnimeUnity] mapping request failed:", error.message);
      return null;
    }
  });
}
function extractAnimeUnityPaths(mappingPayload) {
  var _a;
  if (!mappingPayload || typeof mappingPayload !== "object") return [];
  const raw = (_a = mappingPayload == null ? void 0 : mappingPayload.mappings) == null ? void 0 : _a.animeunity;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const paths = [];
  for (const item of list) {
    const candidate = typeof item === "string" ? item : item && typeof item === "object" ? item.path || item.url || item.href || item.playPath : null;
    const normalized = normalizeAnimePath(candidate);
    if (normalized) paths.push(normalized);
  }
  return uniqueStrings(paths);
}
function extractTmdbIdFromMappingPayload(mappingPayload) {
  var _a, _b, _c;
  const candidate = ((_b = (_a = mappingPayload == null ? void 0 : mappingPayload.mappings) == null ? void 0 : _a.ids) == null ? void 0 : _b.tmdb) || ((_c = mappingPayload == null ? void 0 : mappingPayload.ids) == null ? void 0 : _c.tmdb) || (mappingPayload == null ? void 0 : mappingPayload.tmdbId) || null;
  const text = String(candidate || "").trim();
  return /^\d+$/.test(text) ? text : null;
}
function resolveEpisodeFromMappingPayload(mappingPayload, fallbackEpisode) {
  var _a;
  return normalizeRequestedEpisode(
    parsePositiveInt((_a = mappingPayload == null ? void 0 : mappingPayload.kitsu) == null ? void 0 : _a.episode) || fallbackEpisode
  );
}
function mapLimit(values, limit, mapper) {
  return __async(this, null, function* () {
    if (!Array.isArray(values) || values.length === 0) return [];
    const concurrency = Math.max(1, Math.min(limit, values.length));
    const output = new Array(values.length);
    let cursor = 0;
    function worker() {
      return __async(this, null, function* () {
        while (cursor < values.length) {
          const current = cursor;
          cursor += 1;
          try {
            output[current] = yield mapper(values[current], current);
          } catch (error) {
            output[current] = [];
            console.error("[AnimeUnity] task failed:", error.message);
          }
        }
      });
    }
    yield Promise.all(Array.from({ length: concurrency }, () => worker()));
    return output;
  });
}
function extractStreamsFromAnimePath(animePath, requestedEpisode) {
  return __async(this, null, function* () {
    const normalizedPath = normalizeAnimePath(animePath);
    if (!normalizedPath) return [];
    const animeUrl = buildUnityUrl(normalizedPath);
    if (!animeUrl) return [];
    let parsedAnime = null;
    try {
      const html = yield fetchResource(animeUrl, {
        ttlMs: TTL.animePage,
        cacheKey: `anime:${normalizedPath}`,
        timeoutMs: FETCH_TIMEOUT
      });
      parsedAnime = parseAnimePage(html, { animePath: normalizedPath });
    } catch (error) {
      console.error("[AnimeUnity] anime page failed:", error.message);
      return [];
    }
    const normalizedEpisode = normalizeRequestedEpisode(requestedEpisode);
    let episodes = normalizeEpisodesList(parsedAnime.episodes);
    let selected = pickEpisodeEntry(episodes, normalizedEpisode);
    if (!selected && parsedAnime.animeId && parsedAnime.totalEpisodes > episodes.length) {
      const extraEpisodes = yield fetchEpisodesRangeFromApi(
        parsedAnime.animeId,
        normalizedEpisode,
        animeUrl
      );
      if (extraEpisodes.length > 0) {
        episodes = normalizeEpisodesList([...episodes, ...extraEpisodes]);
        selected = pickEpisodeEntry(episodes, normalizedEpisode);
      }
    }
    if (!selected) return [];
    const labelSuffix = "";
    const resolvedEpisodeNumber = parsePositiveInt(selected.num) || normalizedEpisode || 1;
    const baseTitle = sanitizeAnimeTitle(parsedAnime.title) || "Unknown Title";
    const displayTitle = `${baseTitle} - Ep ${resolvedEpisodeNumber}${labelSuffix}`;
    const streamLanguage = resolveLanguageEmoji(parsedAnime.sourceTag);
    const subtitleOnly = String(parsedAnime.sourceTag || "").toUpperCase() !== "ITA";
    const streams = [];
    if (selected.scwsId && (selected.embedUrl || selected.episodeId)) {
      try {
        let embedUrl2 = toAbsoluteUrl(selected.embedUrl || null);
        if (!embedUrl2 && selected.episodeId) {
          const embedPayload = yield fetchResource(`${getUnityBaseUrl()}/embed-url/${selected.episodeId}`, {
            ttlMs: TTL.streamPage,
            cacheKey: `embed-url:${selected.episodeId}`,
            timeoutMs: FETCH_TIMEOUT,
            headers: {
              referer: animeUrl,
              "x-requested-with": "XMLHttpRequest"
            }
          });
          embedUrl2 = toAbsoluteUrl(String(embedPayload || "").trim());
        }
        if (embedUrl2 && /^https?:\/\//i.test(embedUrl2)) {
          const vixStreams = yield extractVixCloud(embedUrl2);
          if (Array.isArray(vixStreams) && vixStreams.length > 0) {
            streams.push(
              ...vixStreams.map((stream) => __spreadProps(__spreadValues({}, stream), {
                easyProxySourceUrl: rewriteVixsrcHost(embedUrl2),
                name: `AnimeUnity - VixCloud${labelSuffix}`,
                title: displayTitle,
                language: subtitleOnly ? streamLanguage : stream.language || streamLanguage,
                subtitleOnly
              }))
            );
          }
        }
      } catch (error) {
        console.error("[AnimeUnity] VixCloud extraction failed:", error.message);
      }
    }
    if (streams.length > 0) return streams;
    const embedUrl = yield resolveEmbedUrlForEpisodeEntry(
      {
        animePath: normalizedPath,
        title: parsedAnime.title,
        sourceTag: parsedAnime.sourceTag,
        episodes
      },
      selected
    );
    if (!embedUrl) return [];
    const resolvedEmbedUrl = rewriteVixsrcHost(embedUrl);
    let embedHtml = "";
    try {
      const embedResponse = yield fetchWithCloudflareCookies(resolvedEmbedUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Referer: getUnityBaseUrl()
        },
        timeout: FETCH_TIMEOUT
      }, "animeunity");
      if (!embedResponse.ok) throw new Error(`HTTP ${embedResponse.status} ${embedResponse.statusText}`);
      embedHtml = yield embedResponse.text();
    } catch (error) {
      console.error("[AnimeUnity] embed page failed:", error.message);
      return [];
    }
    const mediaLinks = collectMediaLinksFromEmbedHtml(embedHtml);
    if (!Array.isArray(mediaLinks) || mediaLinks.length === 0) return [];
    const fallbackStreams = [];
    for (const link of mediaLinks) {
      const mediaUrl = normalizePlayableMediaUrl(link.href);
      if (!mediaUrl) continue;
      let quality = extractQualityHint(mediaUrl);
      if (mediaUrl.toLowerCase().includes(".m3u8")) {
        const detectedQuality = yield checkQualityFromPlaylist(mediaUrl, {
          "User-Agent": USER_AGENT,
          Referer: getUnityBaseUrl()
        });
        if (detectedQuality) quality = detectedQuality;
      }
      quality = normalizeAnimeUnityQuality(quality);
      fallbackStreams.push({
        name: `AnimeUnity${labelSuffix}`,
        title: displayTitle,
        url: mediaUrl,
        easyProxySourceUrl: resolvedEmbedUrl,
        language: streamLanguage,
        subtitleOnly,
        quality,
        type: "direct",
        headers: {
          "User-Agent": USER_AGENT,
          Referer: getUnityBaseUrl()
        }
      });
    }
    return fallbackStreams;
  });
}
function getStreams(id, type, season, episode, providerContext = null) {
  return __async(this, null, function* () {
    try {
      const lookup = resolveLookupRequest(id, season, episode, providerContext);
      if (!lookup) return [];
      let mappingPayload = yield fetchMappingPayload(lookup, providerContext);
      let animePaths = extractAnimeUnityPaths(mappingPayload);
      if (animePaths.length === 0 && String(lookup.provider || "").toLowerCase() === "imdb") {
        const tmdbFromContext = /^\d+$/.test(String((providerContext == null ? void 0 : providerContext.tmdbId) || "").trim()) ? String(providerContext.tmdbId).trim() : null;
        const tmdbFromPayload = extractTmdbIdFromMappingPayload(mappingPayload);
        const fallbackTmdbId = tmdbFromContext || tmdbFromPayload;
        if (fallbackTmdbId) {
          const tmdbLookup = {
            provider: "tmdb",
            externalId: fallbackTmdbId,
            season: lookup.season,
            episode: lookup.episode
          };
          const tmdbPayload = yield fetchMappingPayload(tmdbLookup, providerContext);
          const tmdbPaths = extractAnimeUnityPaths(tmdbPayload);
          if (tmdbPaths.length > 0) {
            mappingPayload = tmdbPayload;
            animePaths = tmdbPaths;
          }
        }
      }
      if (animePaths.length === 0) return [];
      const mappedEpisode = resolveEpisodeFromMappingPayload(mappingPayload, lookup.episode);
      const requestedEpisode = resolveAnimeEpisode(lookup.provider, providerContext, mappedEpisode);
      const perPathStreams = yield mapLimit(
        animePaths,
        3,
        (path) => extractStreamsFromAnimePath(path, requestedEpisode)
      );
      const streams = perPathStreams.flat().filter((stream) => stream && stream.url);
      const deduped = [];
      const seen = /* @__PURE__ */ new Set();
      for (const stream of streams) {
        const normalizedUrl = normalizePlayableMediaUrl(stream.url);
        if (!normalizedUrl) continue;
        if (seen.has(normalizedUrl)) continue;
        seen.add(normalizedUrl);
        deduped.push(__spreadProps(__spreadValues({}, stream), { url: normalizedUrl }));
      }
      return deduped.map((stream) => formatStream(stream, "AnimeUnity")).filter(Boolean);
    } catch (error) {
      console.error("[AnimeUnity] getStreams failed:", error.message);
      return [];
    }
  });
}
module.exports = { getStreams, sanitizeAnimeTitle };
