import {MarkerDao} from "./../../src/data-layer/models/marker.dao";


const markersDummy: Omit<MarkerDao, "id" | "gallery" | "area" | "creationDate" | "profile">[] =
[
    {
        name: "Virgin marksman's stone",
        description: "A place where unsecured marksman's trying to control a sawmill",
        areaColor: "#0409ff",
        xCoordinate: -143.005357972645,
        yCoordinate: 103.573988039432,
    },
    {
        name: "Chad sniper's rock!",
        description: "A place, where confident snipers control entirely map safely!",
        areaColor: "#fc0303",
        xCoordinate: -121.983802674211,
        yCoordinate: 150.956217626337,
    },
];

export const markers = markersDummy as MarkerDao[];
