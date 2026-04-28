// Funzione richiesta da Nuvio per gli Addon/Plugin di streaming
async function getStream(args) {
    // tt0373926 è l'ID Cinemeta per The Interpreter
    if (args.type === "movie" && args.id === "tt0373926") {
        return {
            streams: [
                {
                    name: "MIXDROP",
                    title: "The Interpreter (HD)\nPersonal Lisa Store",
                    // Usiamo l'embedURL che abbiamo testato prima, è il più sicuro
                    url: "https://mxdrop.sx/e/dk3rro1mb774mp9"
                }
            ]
        };
    }
    // Se è un altro film, non restituiamo nulla (per ora)
    return { streams: [] };
}

// Esponiamo la funzione in modo che Nuvio possa chiamarla
export { getStream };
