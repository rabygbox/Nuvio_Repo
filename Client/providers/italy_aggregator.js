import guardoserie from './guardoserie.js';
import guardahd from './guardahd.js';
import netmirror from './netmirror.js';
import guardaserie from './guardaserie.js';
import animeunity from './animeunity.js';
import animeworld from './animeworld.js';
import animesaturn from './animesaturn.js';
import streamingcommunity from './streamingcommunity.js';
import cinemacity from './cinemacity.js';

const providers = [
    guardoserie, guardahd, netmirror, guardaserie,
    animeunity, animeworld, animesaturn, streamingcommunity, cinemacity
];

export default {
    async scrape(input) {
        // Erstellt für jeden Provider eine Anfrage
        const scraperPromises = providers.map(async (provider) => {
            // Falls der Scraper den Typ nicht unterstützt (z.B. Anime-Scraper bei Filmen)
            if (provider.supportedTypes && !provider.supportedTypes.includes(input.type)) {
                return [];
            }

            try {
                // Führe die spezifische Scrape-Funktion aus
                const results = await provider.scrape(input);
                return Array.isArray(results) ? results : [];
            } catch (err) {
                console.error(`Fehler bei ${provider.name}:`, err);
                return [];
            }
        });

        // Alle Scraper gleichzeitig abwarten
        const allResults = await Promise.all(scraperPromises);

        // Ergebnisse zusammenführen und leere Einträge löschen
        return allResults.flat().filter(item => item && item.url);
    }
};
