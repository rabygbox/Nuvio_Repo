const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = 'https://cb01uno.run';

// 1. IL MANIFEST: Fondamentale perché il plugin appaia nella lista
const manifest = {
    id: "org.cb01nuvio.com",
    version: "1.0.0",
    name: "CB01 Uno",
    description: "Provider per CB01 con supporto Mixdrop e Voe",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"], // Indica che accetta ID da Cinemate/IMDb
    catalogs: []
};

const builder = new addonBuilder(manifest);

// 2. LOGICA DI RICERCA E ESTRAZIONE
builder.defineStreamHandler(async (args) => {
    try {
        // Otteniamo il titolo o l'ID da Cinemate
        // Nota: per semplicità cerchiamo su CB01 usando l'ID o il titolo se disponibile
        const searchUrl = `${BASE_URL}/?s=${args.id}`; 
        const response = await axios.get(searchUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        
        const $ = cheerio.load(response.data);
        const moviePage = $('.post-video a').first().attr('href');

        if (!moviePage) return { streams: [] };

        const movieData = await axios.get(moviePage);
        const $$ = cheerio.load(movieData.data);
        const streams = [];

        // Estrazione e pulizia link
        $$('.list-server a, .v_link').each((i, el) => {
            const url = $$(el).attr('href');
            const name = $$(el).text().trim() || "Server";

            if (url.includes('mixdrop') || url.includes('voe.sx')) {
                streams.push({
                    title: `🍿 CB01 - ${name} - 1080p`,
                    url: url, // Il player di Nuvio proverà a risolverlo
                    behaviorHints: { notWebReady: true }
                });
            }
        });

        return { streams };
    } catch (e) {
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
