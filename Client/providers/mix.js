// NUVIO ADDON-BRIDGE PER CINEMETA
(function() {
    const CONFIG = {
        targetId: "tt0373926", // ID Cinemeta di The Interpreter
        streamUrl: "https://mxdrop.sx/e/dk3rro1mb774mp9",
        buttonName: "LISA MIXDROP (Direct)"
    };

    function injectStream() {
        // 1. Controlla se siamo in una pagina di un film
        if (!window.location.href.includes('movie')) return;

        // 2. Controlla se l'ID Cinemeta è quello giusto
        if (window.location.href.includes(CONFIG.targetId) || document.body.innerText.includes(CONFIG.targetId)) {
            
            // Cerchiamo il punto dove Nuvio mette i tasti (solitamente un contenitore di stream)
            const container = document.querySelector('.streams-list') || document.querySelector('.buttons-container') || document.querySelector('[class*="Stream"]');

            if (container && !document.getElementById('mixdrop-lisa-link')) {
                const link = document.createElement('a');
                link.id = 'mixdrop-lisa-link';
                link.href = CONFIG.streamUrl;
                link.target = "_self"; // Apre direttamente nel player di Nuvio
                link.style = "display: block; background: #007bff; color: white; padding: 12px; margin: 10px 0; border-radius: 8px; text-align: center; font-weight: bold; text-decoration: none; border: 2px solid #fff;";
                link.innerHTML = `<span>▶️ ${CONFIG.buttonName}</span>`;
                
                container.prepend(link);
                console.log("Mixdrop agganciato a Cinemeta con successo!");
            }
        }
    }

    // Esegue il controllo ogni secondo per gestire il caricamento lento di Cinemeta
    setInterval(injectStream, 1500);
})();
