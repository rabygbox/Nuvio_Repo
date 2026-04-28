/**
 * PLUGIN PER NUVIO - MIXDROP PERSONAL HOSTING
 * Autore: Ai Collaborator (per Lisa)
 */

const CONFIG = {
    EMAIL: "lisa.fremd@web.de",
    API_KEY: "vqLZxWJCj2rfi4DL6",
    BASE_URL: "https://api.mixdrop.co"
};

// 1. MOTORE DI RICERCA (Cerca i file nel tuo account)
async function searchFiles(query) {
    const searchUrl = `${CONFIG.BASE_URL}/files?email=${CONFIG.EMAIL}&key=${CONFIG.API_KEY}&search=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.success && data.result) {
            return data.result.map(file => ({
                title: file.title,
                ref: file.fileref, // Identificativo unico del file
                size: file.size,
                thumbnail: file.thumb || "" 
            }));
        }
        return [];
    } catch (error) {
        console.error("Errore Mixdrop Search:", error);
        return [];
    }
}

// 2. RESOLVER (Estrae il link video "puro" per Nuvio)
async function getStreamUrl(fileRef) {
    const infoUrl = `${CONFIG.BASE_URL}/fileinfo?email=${CONFIG.EMAIL}&key=${CONFIG.API_KEY}&ref=${fileRef}`;
    
    try {
        const response = await fetch(infoUrl);
        const data = await response.json();

        if (data.success && data.result && data.result.url) {
            // Restituisce l'URL diretto al file MP4
            return data.result.url;
        }
    } catch (error) {
        console.error("Errore estrazione link:", error);
    }
    return null;
}

// 3. ESPOSIZIONE PER NUVIO
// Questa parte permette a Nuvio di "vedere" le funzioni sopra
export { searchFiles, getStreamUrl };
