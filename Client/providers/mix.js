const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://cb01uno.run';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Referer': BASE_URL
};

/**
 * Funzione di ricerca specifica per Cinemate
 * Cerca il titolo su CB01 e restituisce l'URL della pagina corretta
 */
async function searchOnCB01(title) {
    try {
        // Pulizia titolo per la ricerca
        const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(title)}`;
        const { data } = await axios.get(searchUrl, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        // Prendiamo il primo risultato della ricerca che corrisponde al titolo
        const firstResult = $('.post-video a').first().attr('href');
        return firstResult || null;
    } catch (e) {
        return null;
    }
}

/**
 * Resolver per MIXDROP
 */
async function resolveMixdrop(url) {
    try {
        const { data } = await axios.get(url, { headers: { ...HEADERS, 'Referer': 'https://mixdrop.co/' } });
        const packed = data.match(/eval\(function\(p,a,c,k,e,d\).+?\}\((.+?)\)\)/);
        if (packed) {
            const dict = packed[1].split(',').pop().split('|');
            const file = dict.find(v => v.includes('mp4') || v.length > 20);
            const srv = dict.find(v => v.startsWith('s-'));
            if (file && srv) return `https://${srv}.delivery.mixdrop.co/hls/${file}.mp4`;
        }
        return null;
    } catch (e) { return null; }
}

/**
 * Resolver per VOE
 */
async function resolveVoe(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const match = data.match(/'hls':\s*'([^']+)'/);
        return match ? match[1] : null;
    } catch (e) { return null; }
}

/**
 * ESPORTAZIONE PLUGIN PER NUVIO/CINEMATE
 */
const CinemateCB01Plugin = {
    // Questa funzione viene chiamata da Cinemate quando l'utente clicca su un film
    async getStreamsByMetadata(metadata) {
        const title = metadata.title; // Cinemate passa il titolo qui
        console.log(`Ricerca flussi per: ${title}`);

        // 1. Trova la pagina del film su CB01
        const moviePageUrl = await searchOnCB01(title);
        if (!moviePageUrl) return [];

        // 2. Estrai i link dalla pagina
        const { data } = await axios.get(moviePageUrl, { headers: HEADERS });
        const $ = cheerio.load(data);
        const streams = [];
        const rawLinks = [];

        $('.list-server a, .v_link').each((i, el) => {
            rawLinks.push({ name: $(el).text().trim(), url: $(el).attr('href') });
        });

        // 3. Risolvi i link (Mixdrop e Voe)
        for (const item of rawLinks) {
            let directUrl = null;
            if (item.url.includes('voe.sx')) directUrl = await resolveVoe(item.url);
            else if (item.url.includes('mixdrop')) directUrl = await resolveMixdrop(item.url);
            
            if (directUrl) {
                streams.push({
                    name: `CB01 - ${item.name || 'HD Server'}`,
                    url: directUrl,
                    type: 'direct'
                });
            }
        }
        return streams;
    }
};

module.exports = CinemateCB01Plugin;
