// NUVIO PLUGIN - VERSIONE ANDROID DIRETTA
(function() {
    // Il link al tuo film
    const MIO_VIDEO = "https://mxdrop.sx/e/dk3rro1mb774mp9";
    const TITOLO_FILM = "The Interpreter";

    function creaPulsante() {
        // Se il pulsante esiste già, non fare nulla
        if (document.getElementById('lisa-mixdrop-btn')) return;

        // Controlla se nella pagina c'è scritto "The Interpreter"
        if (document.body.innerText.includes(TITOLO_FILM)) {
            
            // Crea un contenitore per il tasto
            const div = document.createElement('div');
            div.id = 'lisa-mixdrop-btn';
            div.style.position = 'fixed';
            div.style.bottom = '20px';
            div.style.right = '20px';
            div.style.zIndex = '9999';
            div.style.backgroundColor = '#E50914'; // Rosso stile Netflix
            div.style.color = 'white';
            div.style.padding = '15px';
            div.style.borderRadius = '50px';
            div.style.fontWeight = 'bold';
            div.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.5)';
            div.style.cursor = 'pointer';
            div.innerText = '▶️ PLAY MIXDROP';

            div.onclick = function() {
                // Apre il video direttamente
                window.location.href = MIO_VIDEO;
            };

            document.body.appendChild(div);
        }
    }

    // Controlla ogni secondo se siamo sulla pagina giusta
    setInterval(creaPulsante, 1000);
})();
