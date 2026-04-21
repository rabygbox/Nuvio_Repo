// NetMirror Scraper for Nuvio Local Scrapers
// React Native compatible version - Optimized for Sandbox
console.log('[NetMirror] Initializing NetMirror provider');

// Constants
const TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
const NETMIRROR_BASE = 'https://net51.cc';
const BASE_HEADERS = {
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5'
};

// Global storage
let globalCookie = '';
let cookieTimestamp = 0;
const COOKIE_EXPIRY = 54000000; 

function makeRequest(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            ...BASE_HEADERS,
            ...options.headers
        }
    }).then(function (response) {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response;
    });
}

function getUnixTime() {
    return Math.floor(Date.now() / 1000);
}

// Hilfsfunktion für Flags (Sprach-Tags)
function extractFlagsFromTracks(tracks) {
    if (!tracks) return [];
    return tracks
        .filter(track => track.kind === 'captions')
        .map(track => track.label);
}

function bypass() {
    const now = Date.now();
    if (globalCookie && (now - cookieTimestamp) < COOKIE_EXPIRY) {
        return Promise.resolve(globalCookie);
    }

    return makeRequest(`${NETMIRROR_BASE}/tv/p.php`, {
        method: 'POST'
    }).then(function (response) {
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            const match = setCookie.match(/t_hash_t=([^;]+)/);
            if (match) globalCookie = match[1];
        }
        return response.text();
    }).then(function (text) {
        cookieTimestamp = Date.now();
        // Falls kein Cookie im Header war, versuchen wir es trotzdem mit dem Default
        return globalCookie || 'valid_session_placeholder';
    });
}

function searchContent(query, platform) {
    const ottMap = { 'netflix': 'nf', 'primevideo': 'pv', 'disney': 'hs' };
    const ott = ottMap[platform.toLowerCase()] || 'nf';
    
    return bypass().then(function (cookie) {
        const searchEndpoints = {
            'netflix': `${NETMIRROR_BASE}/search.php`,
            'primevideo': `${NETMIRROR_BASE}/pv/search.php`,
            'disney': `${NETMIRROR_BASE}/mobile/hs/search.php`
        };
        const url = `${searchEndpoints[platform.toLowerCase()] || searchEndpoints['netflix']}?s=${encodeURIComponent(query)}&t=${getUnixTime()}`;
        
        return makeRequest(url, {
            headers: { 'Cookie': `t_hash_t=${cookie}; ott=${ott}; hd=on` }
        });
    }).then(res => res.json()).then(data => {
        return (data.searchResult || []).map(item => ({
            id: item.id,
            title: item.t
        }));
    });
}

function loadContent(contentId, platform) {
    const ottMap = { 'netflix': 'nf', 'primevideo': 'pv', 'disney': 'hs' };
    const ott = ottMap[platform.toLowerCase()] || 'nf';

    return bypass().then(function (cookie) {
        const postEndpoints = {
            'netflix': `${NETMIRROR_BASE}/post.php`,
            'primevideo': `${NETMIRROR_BASE}/pv/post.php`,
            'disney': `${NETMIRROR_BASE}/mobile/hs/post.php`
        };
        const url = `${postEndpoints[platform.toLowerCase()] || postEndpoints['netflix']}?id=${contentId}&t=${getUnixTime()}`;

        return makeRequest(url, {
            headers: { 'Cookie': `t_hash_t=${cookie}; ott=${ott}; hd=on` }
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
        const url = `${NETMIRROR_BASE}/tv/playlist.php?id=${contentId}&t=${encodeURIComponent(title)}&tm=${getUnixTime()}`;
        return makeRequest(url, {
            headers: { 'Cookie': `t_hash_t=${cookie}; ott=${ott}; hd=on`, 'Referer': `${NETMIRROR_BASE}/` }
        });
    }).then(res => res.json()).then(playlist => {
        const sources = [];
        const subtitles = [];
        let flags = [];

        if (!Array.isArray(playlist)) return { sources, subtitles, flags };

        playlist.forEach(item => {
            if (item.tracks) flags = extractFlagsFromTracks(item.tracks);
            
            if (item.sources) {
                item.sources.forEach(source => {
                    let file = source.file.replace('/tv/', '/');
                    if (!file.startsWith('/')) file = '/' + file;
                    sources.push({
                        url: NETMIRROR_BASE + file,
                        quality: source.label || '720p',
                        type: source.type || 'hls'
                    });
                });
            }
        });
        return { sources, subtitles, flags };
    });
}

function getStreams(tmdbId, mediaType = 'movie', seasonNum = null, episodeNum = null) {
    const tmdbUrl = `https://api.themoviedb.org/3/${mediaType === 'tv' ? 'tv' : 'movie'}/${tmdbId}?api_key=${TMDB_API_KEY}`;
    
    return makeRequest(tmdbUrl).then(res => res.json()).then(tmdbData => {
        const title = mediaType === 'tv' ? tmdbData.name : tmdbData.title;
        const year = (mediaType === 'tv' ? tmdbData.first_air_date : tmdbData.release_date || "").substring(0, 4);
        const platforms = ['netflix', 'primevideo', 'disney'];

        function tryPlatform(index) {
            if (index >= platforms.length) return [];
            const platform = platforms[index];

            return searchContent(title, platform).then(results => {
                const match = results.find(r => r.title.toLowerCase().includes(title.toLowerCase()));
                if (!match) return tryPlatform(index + 1);

                return loadContent(match.id, platform).then(content => {
                    let targetId = match.id;
                    if (mediaType === 'tv' && !content.isMovie) {
                        const ep = content.episodes.find(e => 
                            (e.s === `S${seasonNum}` && e.ep === `E${episodeNum}`) || 
                            (parseInt(e.season) === seasonNum && parseInt(e.episode) === episodeNum)
                        );
                        if (ep) targetId = ep.id;
                        else return tryPlatform(index + 1);
                    }

                    return getStreamingLinks(targetId, title, platform).then(data => {
                        return data.sources.map(s => ({
                            name: `NetMirror (${platform})`,
                            title: `${title} - ${s.quality}`,
                            url: s.url,
                            quality: s.quality,
                            type: 'hls',
                            headers: { 'Referer': 'https://net51.cc/', 'User-Agent': BASE_HEADERS['User-Agent'] }
                        }));
                    });
                });
            }).catch(() => tryPlatform(index + 1));
        }

        return tryPlatform(0);
    });
}

// Global Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getStreams };
} else {
    global.getStreams = getStreams;
}
