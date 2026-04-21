// NetMirror Scraper for Nuvio Local Scrapers
// React Native compatible version
// Fetches streaming links from net51.cc with Audio Flag Support

console.log('[NetMirror] Initializing NetMirror provider');

// Constants
const TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
const NETMIRROR_BASE = 'https://net51.cc/';
const BASE_HEADERS = {
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive'
};

// Global cookie storage
let globalCookie = '';
let cookieTimestamp = 0;
const COOKIE_EXPIRY = 54000000; // 15 hours

// --- Hilfsfunktion für Flaggen ---
function getFlagsFromLabel(label) {
    if (!label) return '';
    const text = label.toLowerCase();
    const flagMap = {
        'german': '🇩🇪', 'deutsch': '🇩🇪',
        'italian': '🇮🇹', 'italiano': '🇮🇹',
        'french': '🇫🇷', 'français': '🇫🇷',
        'turkish': '🇹🇷', 'türkçe': '🇹🇷',
        'spanish': '🇪🇸', 'español': '🇪🇸',
        'english': '🇬🇧', 'englisch': '🇬🇧',
        'portuguese': '🇵🇹', 'portugiesisch': '🇵🇹',
        'russian': '🇷🇺', 'russisch': '🇷🇺'
    };

    let foundFlags = '';
    Object.keys(flagMap).forEach(lang => {
        if (text.includes(lang)) {
            foundFlags += flagMap[lang];
        }
    });
    
    // Falls keine spezifische Flagge gefunden wurde, aber "Multi" dasteht
    if (!foundFlags && text.includes('multi')) return '🌐';
    
    return foundFlags;
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            ...BASE_HEADERS,
            ...options.headers
        },
        timeout: 10000
    }).then(function (response) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
    });
}

function getUnixTime() {
    return Math.floor(Date.now() / 1000);
}

function bypass() {
    const now = Date.now();
    if (globalCookie && cookieTimestamp && (now - cookieTimestamp) < COOKIE_EXPIRY) {
        return Promise.resolve(globalCookie);
    }

    return makeRequest(`${NETMIRROR_BASE}/tv/p.php`, {
        method: 'POST',
        headers: BASE_HEADERS
    }).then(function (response) {
        const setCookieHeader = response.headers.get('set-cookie');
        let extractedCookie = null;
        
        if (setCookieHeader) {
            const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader;
            const cookieMatch = cookieString.match(/t_hash_t=([^;]+)/);
            if (cookieMatch) extractedCookie = cookieMatch[1];
        }
        
        return response.text().then(function (responseText) {
            if (extractedCookie) {
                globalCookie = extractedCookie;
                cookieTimestamp = Date.now();
                return globalCookie;
            }
            throw new Error('Failed to extract cookie');
        });
    });
}

function searchContent(query, platform) {
    const ottMap = { 'netflix': 'nf', 'primevideo': 'pv', 'disney': 'hs' };
    const ott = ottMap[platform.toLowerCase()] || 'nf';
    
    return bypass().then(function (cookie) {
        const cookies = { 't_hash_t': cookie, 'user_token': '233123f803cf02184bf6c67e149cdd50', 'hd': 'on', 'ott': ott };
        const cookieString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
        const searchEndpoints = {
            'netflix': `${NETMIRROR_BASE}/search.php`,
            'primevideo': `${NETMIRROR_BASE}/pv/search.php`,
            'disney': `${NETMIRROR_BASE}/mobile/hs/search.php`
        };
        const searchUrl = searchEndpoints[platform.toLowerCase()] || searchEndpoints['netflix'];
        
        return makeRequest(`${searchUrl}?s=${encodeURIComponent(query)}&t=${getUnixTime()}`, {
            headers: { ...BASE_HEADERS, 'Cookie': cookieString, 'Referer': `${NETMIRROR_BASE}/tv/home` }
        });
    }).then(res => res.json()).then(data => {
        if (data.searchResult) {
            return data.searchResult.map(item => ({ id: item.id, title: item.t }));
        }
        return [];
    });
}

function getEpisodesFromSeason(seriesId, seasonId, platform, page) {
    const ottMap = { 'netflix': 'nf', 'primevideo': 'pv', 'disney': 'hs' };
    const ott = ottMap[platform.toLowerCase()] || 'nf';
    
    return bypass().then(function (cookie) {
        const cookies = { 't_hash_t': cookie, 'user_token': '233123f803cf02184bf6c67e149cdd50', 'ott': ott, 'hd': 'on' };
        const cookieString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
        const episodesEndpoints = {
            'netflix': `${NETMIRROR_BASE}/episodes.php`,
            'primevideo': `${NETMIRROR_BASE}/pv/episodes.php`,
            'disney': `${NETMIRROR_BASE}/mobile/hs/episodes.php`
        };
        const episodesUrl = episodesEndpoints[platform.toLowerCase()] || episodesEndpoints['netflix'];
        
        return makeRequest(`${episodesUrl}?s=${seasonId}&series=${seriesId}&t=${getUnixTime()}&page=${page || 1}`, {
            headers: { ...BASE_HEADERS, 'Cookie': cookieString }
        }).then(res => res.json()).then(data => data.episodes || []);
    });
}

function loadContent(contentId, platform) {
    const ottMap = { 'netflix': 'nf', 'primevideo': 'pv', 'disney': 'hs' };
    const ott = ottMap[platform.toLowerCase()] || 'nf';
    
    return bypass().then(function (cookie) {
        const cookies = { 't_hash_t': cookie, 'user_token': '233123f803cf02184bf6c67e149cdd50', 'ott': ott, 'hd': 'on' };
        const cookieString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
        const postEndpoints = {
            'netflix': `${NETMIRROR_BASE}/post.php`,
            'primevideo': `${NETMIRROR_BASE}/pv/post.php`,
            'disney': `${NETMIRROR_BASE}/mobile/hs/post.php`
        };
        const postUrl = postEndpoints[platform.toLowerCase()] || postEndpoints['netflix'];
        
        return makeRequest(`${postUrl}?id=${contentId}&t=${getUnixTime()}`, {
            headers: { ...BASE_HEADERS, 'Cookie': cookieString }
        });
    }).then(res => res.json()).then(postData => {
        return {
            id: contentId,
            title: postData.title,
            year: postData.year,
            episodes: postData.episodes || [],
            isMovie: !postData.episodes || postData.episodes.length === 0 || postData.episodes[0] === null
        };
    });
}

function getStreamingLinks(contentId, title, platform) {
    const ottMap = { 'netflix': 'nf', 'primevideo': 'pv', 'disney': 'hs' };
    const ott = ottMap[platform.toLowerCase()] || 'nf';
    
    return bypass().then(function (cookie) {
        const cookies = { 't_hash_t': cookie, 'user_token': '233123f803cf02184bf6c67e149cdd50', 'ott': ott, 'hd': 'on' };
        const cookieString = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
        const playlistUrl = `${NETMIRROR_BASE}/tv/playlist.php`;

        return makeRequest(`${playlistUrl}?id=${contentId}&t=${encodeURIComponent(title)}&tm=${getUnixTime()}`, {
            headers: { ...BASE_HEADERS, 'Cookie': cookieString, 'Referer': `${NETMIRROR_BASE}/tv/home` }
        });
    }).then(res => res.json()).then(playlist => {
        const sources = [];
        const subtitles = [];
        
        if (Array.isArray(playlist)) {
            playlist.forEach(item => {
                if (item.sources) {
                    item.sources.forEach(source => {
                        let fullUrl = source.file.replace('/tv/', '/');
                        if (!fullUrl.startsWith('/')) fullUrl = '/' + fullUrl;
                        fullUrl = NETMIRROR_BASE + fullUrl;

                        sources.push({
                            url: fullUrl,
                            quality: source.label,
                            type: source.type || 'application/x-mpegURL',
                            flags: getFlagsFromLabel(source.label) // Flaggen hier extrahieren
                        });
                    });
                }
                if (item.tracks) {
                    item.tracks.filter(t => t.kind === 'captions').forEach(t => {
                        subtitles.push({ url: t.file.startsWith('/') ? NETMIRROR_BASE + t.file : t.file, language: t.label });
                    });
                }
            });
        }
        return { sources, subtitles };
    });
}

function getStreams(tmdbId, mediaType = 'movie', seasonNum = null, episodeNum = null) {
    const tmdbUrl = `https://api.themoviedb.org/3/${mediaType === 'tv' ? 'tv' : 'movie'}/${tmdbId}?api_key=${TMDB_API_KEY}`;
    
    return makeRequest(tmdbUrl).then(res => res.json()).then(tmdbData => {
        const title = mediaType === 'tv' ? tmdbData.name : tmdbData.title;
        const year = mediaType === 'tv' ? tmdbData.first_air_date?.substring(0, 4) : tmdbData.release_date?.substring(0, 4);
        const platforms = ['netflix', 'primevideo', 'disney'];
        
        function tryPlatform(index) {
            if (index >= platforms.length) return [];
            const platform = platforms[index];
            
            return searchContent(title, platform).then(results => {
                if (results.length === 0) return tryPlatform(index + 1);
                
                const selected = results[0];
                return loadContent(selected.id, platform).then(contentData => {
                    let targetId = selected.id;
                    let epInfo = '';
                    
                    if (mediaType === 'tv' && !contentData.isMovie) {
                        const ep = contentData.episodes.find(e => e && parseInt(e.s?.replace('S','')) === seasonNum && parseInt(e.ep?.replace('E','')) === episodeNum);
                        if (!ep) return tryPlatform(index + 1);
                        targetId = ep.id;
                        epInfo = ` S${seasonNum}E${episodeNum}`;
                    }

                    return getStreamingLinks(targetId, title, platform).then(sd => {
                        return sd.sources.map(s => ({
                            name: `NetMirror (${platform})`,
                            title: `${title} ${s.flags}${epInfo} (${s.quality})`.replace(/\s+/g, ' '),
                            url: s.url,
                            quality: s.quality,
                            type: s.type.includes('mpegURL') ? 'hls' : 'direct',
                            headers: { "Referer": "https://net51.cc/", "User-Agent": "Mozilla/5.0..." }
                        }));
                    });
                });
            }).catch(() => tryPlatform(index + 1));
        }
        return tryPlatform(0);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getStreams };
} else {
    global.getStreams = getStreams;
}
