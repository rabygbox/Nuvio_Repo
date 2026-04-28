const MIXDROP_FILE = "https://mxdrop.sx/e/dk3rro1mb774mp9";

export default {
    async stream(type, id) {
        if (type === "movie" && id === "tt0373926") {
            return {
                streams: [{
                    name: "MIXDROP",
                    title: "The Interpreter\nHD - Caricato da Lisa",
                    url: MIXDROP_FILE
                }]
            };
        }
        return { streams: [] };
    }
};
