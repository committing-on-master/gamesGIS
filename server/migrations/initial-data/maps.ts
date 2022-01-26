import {MapDao} from "../../src/data-layer/models/map.dao";

const maps: MapDao[] = [
    // Woods,
    {
        mapType: 1,
        name: "Woods",
        center: {
            X: -128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
        layers: 0,
        defaultLayer: 0,
        maxZoom: 4,
        minZoom: 0,
    },

    // Factory
    /* {
        mapType: 2,
        name: "Factory",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    }, */

    // Customs,
    /* {
        mapType: 3,
        name: "Customs",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    }, */

    // Interchange,
    /*
    {
        mapType: 4,
        name: "Interchange",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    },
    */

    // Labs,
    /* {
        mapType: 5,
        name: "Labs",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    }, */

    // Shoreline,
    /* {
        mapType: 6,
        name: "Shoreline",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    }, */

    // Reserve,
    /* {
        mapType: 7,
        name: "Reserve",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    }, */

    // Lighthouse
    /* {
        mapType: 8,
        name: "Lighthouse",
        center: {
            X: 128,
            Y: 128,
        },
        leftBottom: {
            X: -256,
            Y: 0,
        },
        rightTop: {
            X: 0,
            Y: 256,
        },
    }, */
];

export {maps};
