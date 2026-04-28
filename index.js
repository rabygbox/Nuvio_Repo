const { addonBuilder } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "it.lisa.mixdrop",
    version: "1.0.0",
    name: "Mixdrop Personal Lisa",
    resources: ["stream"],
    types: ["movie"],
    idPrefixes: ["tt"]
});

builder.defineStreamHandler((args) => {
    if (args.type === "movie" && args.id === "tt0373926") {
        return Promise.resolve({
            streams: [
                {
                    name: "MIXDROP",
                    title: "The Interpreter (2005)\nHD - Lisa Store",
                    url: "https://mxdrop.sx/e/dk3rro1mb774mp9"
                }
            ]
        });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

module.exports = builder.getInterface();
