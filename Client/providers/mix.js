/**
 * PLUGIN MIXDROP PER NUVIO 
 * Configurato per: lisa.fremd@web.de
 */

const CONFIG = {
    MOVIE_ID: "tt0373926", // ID Cinemeta per 'The Interpreter'
    STREAM_URL: "https://mxdrop.sx/e/dk3rro1mb774mp9" // Il tuo link file
};

// --- FUNZIONE PER IL PLAYER DI NUVIO ---
export async function getStream(type, id) {
    if (type === "movie" && id === CONFIG.MOVIE_ID) {
        return {
            streams: [
                {
                    name: "MIXDROP\nLISA",
                    title: "The Interpreter (2005)\nHD - Personal Stream",
                    url: CONFIG.STREAM_URL
                }
            ]
        };
    }
    return { streams: [] };
}

// --- FUNZIONE PER L'INTERFACCIA (INIEZIONE TASTO) ---
(function() {
    function injectButton() {
        // Controlla se siamo nella scheda di The Interpreter
        if (window.location.href.includes(CONFIG.MOVIE_ID) || document.body.innerText.includes("The Interpreter")) {
            
            // Cerchiamo dove Nuvio mette i provider (StreamingCommunity, etc)
            const container = document.querySelector('.streams-list') || 
                              document.querySelector('.providers-container') || 
                              document.querySelector('[class*="Stream"]');

            if (container && !document.getElementById('lisa-btn')) {
                const btn = document.createElement('div');
                btn.id = 'lisa-btn';
                btn.style = "background:#ff4500; color:white; padding:12px; margin:10px; border-radius:8px; text-align:center; font-weight:bold; cursor:pointer; border:1px solid white;";
                btn.innerHTML = "▶️ GUARDA SU MIXDROP (LISA)";
                
                btn.onclick = function() {
                    window.location.href = CONFIG.STREAM_URL;
                };

                container.prepend(btn);
            }
        }
    }
    // Controlla la pagina ogni 2 secondi
    setInterval(injectButton, 2000);
})();
