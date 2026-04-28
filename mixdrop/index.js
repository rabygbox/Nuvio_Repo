/**
 * PLUGIN MIXDROP PER NUVIO 
 * Configurato per: lisa.fremd@web.de
 */

const CONFIG = {
    EMAIL: "lisa.fremd@web.de",
    API_KEY: "vqLZxWJCj2rfi4DL6",
    BASE_URL: "https://api.mixdrop.ag" // Usiamo questo per le chiamate API
};

// FUNZIONE DI RICERCA
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

// FUNZIONE DI RIPRODUZIONE (ESTRAZIONE LINK PURO)
async function getStream(id) {
    // Usiamo l'endpoint che hai appena testato con successo!
    const url = `${CONFIG.BASE_URL}/fileinfo?email=${CONFIG.EMAIL}&key=${CONFIG.API_KEY}&ref=${id}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success && data.result.url) {
            // Restituisce il link che Nuvio userà per il player
            return data.result.url;
        }
    } catch (e) { return null; }
}

export { searchFiles, getStream };
