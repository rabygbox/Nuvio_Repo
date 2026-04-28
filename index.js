export async function getStream(args) {
    if (args.type === "movie" && args.id === "tt0373926") {
        return {
            streams: [
                {
                    name: "MIXDROP LISA",
                    title: "The Interpreter (2005)\nHD - Caricato da Lisa",
                    url: "https://mxdrop.sx/e/dk3rro1mb774mp9"
                }
            ]
        };
    }
    return { streams: [] };
}
