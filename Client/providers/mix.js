/**
 * PLUGIN MIXDROP PER NUVIO 
 * Configurato per: lisa.fremd@web.de
 */

const CONFIG = {
    EMAIL: "lisa.fremd@web.de",
    API_KEY: "vqLZxWJCj2rfi4DL6",
    BASE_URL: "https://api.mixdrop.ag"
};

// 1. FUNZIONE DI RICERCA (Generica)
async function searchFiles(query) {
    const url = `${CONFIG.BASE_URL}/files?email=${CONFIG.EMAIL}&key=${CONFIG.API_KEY}&search=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
            return data.result.map(file => ({
                name: file.title,
                id: file.fileref,
                img: file.thumb
            }));
        }
    } catch (e) { return []; }
}

// 2. FUNZIONE STREAM (Quella che fa apparire il link nella scheda del film)
// 'id' è il codice IMDb che Nuvio invia (per The Interpreter è tt0373926)
async function getStream(type, id) {
    
    // TEST SPECIFICO PER "THE INTERPRETER"
    // Se l'ID che Nuvio sta guardando è quello del tuo film
    if (id === "tt0373926") {
        return [{
            name: "Mixdrop Personal",
            title: "The Interpreter (2005) - I miei file",
            type: "url",
            url: "https://mxdrop.sx/f/dk3rro1mb774mp9" // Il tuo file diretto
        }];
    }

    // Se cerchi altri film, il plugin proverà a cercarli nel tuo account Mixdrop
    return null;
}

// Esportiamo le funzioni in modo che Nuvio possa leggerle
export { searchFiles, getStream };
