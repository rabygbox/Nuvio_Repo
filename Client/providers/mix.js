(function() {
    // Identificativi del tuo film
    const movieTitle = "The Interpreter";
    const mixdropLink = "https://mxdrop.sx/e/dk3rro1mb774mp9";

    // Questa funzione cerca di capire se sei nella pagina del film giusto
    function injectMixdrop() {
        // Cerchiamo il titolo nella pagina di Nuvio
        const pageTitle = document.body.innerText;

        if (pageTitle.includes(movieTitle)) {
            // Cerchiamo il contenitore dove Nuvio mette i provider
            // Nota: Nuvio usa spesso classi come 'stream-list' o 'providers'
            const providerList = document.querySelector('.stream-list') || document.querySelector('.providers-container') || document.body;

            // Se troviamo la lista e non abbiamo già aggiunto il tasto
            if (providerList && !document.getElementById('mixdrop-lisa')) {
                const btn = document.createElement('div');
                btn.id = 'mixdrop-lisa';
                btn.innerHTML = `
                    <div style="background: #ff4500; color: white; padding: 10px; margin: 5px; border-radius: 5px; cursor: pointer; font-weight: bold; text-align: center;">
                        🚀 PLAY SU MIXDROP (Personal)
                    </div>
                `;
                btn.onclick = function() {
                    window.open(mixdropLink, '_blank');
                };
                
                // Inseriamo il tasto all'inizio della lista
                providerList.prepend(btn);
            }
        }
    }

    // Eseguiamo il controllo ogni 2 secondi per essere sicuri che la pagina sia caricata
    setInterval(injectMixdrop, 2000);
})();
