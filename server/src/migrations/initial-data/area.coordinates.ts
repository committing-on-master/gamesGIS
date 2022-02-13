
import {CoordinatesDao} from "../../data-layer/models/coordinates.dao";

// Мини скрипт по форматированию кучи координат из бд
// const data =
//     `-125.98275439222 133.333555163687
//     -127.232426804098 137.083056045391
//     ... etc`;
//
// const separated = data.split(/\r?\n/);
// separated.forEach((value, index) => {
//     const xy = value.split(' ');
//     console.log(
//         `{
//           xCoordinate: ${xy[0]},
//           yCoordinate: ${xy[1]},
//         },`);
// });

const coordinates: Omit<CoordinatesDao, "id" | "marker">[][] = [
    [ // first small area
        {
            xCoordinate: -145.254768314025,
            yCoordinate: 100.824354059516,
        },
        {
            xCoordinate: -143.005357972645,
            yCoordinate: 100.886845740878,
        },
        {
            xCoordinate: -141.255816596016,
            yCoordinate: 102.324154412198,
        },
        {
            xCoordinate: -141.505751078392,
            yCoordinate: 105.761196887093,
        },
        {
            xCoordinate: -142.75542349027,
            yCoordinate: 107.448472283861,
        },
        {
            xCoordinate: -144.567448487493,
            yCoordinate: 104.073921490326,
        },
    ],
    [// second large area
        {
            xCoordinate: -125.98275439222,
            yCoordinate: 133.333555163687,
        },
        {
            xCoordinate: -127.232426804098,
            yCoordinate: 137.083056045391,
        },
        {
            xCoordinate: -126.420139736377,
            yCoordinate: 138.520364716712,
        },
        {
            xCoordinate: -126.232688874596,
            yCoordinate: 141.020031971181,
        },
        {
            xCoordinate: -124.733081980342,
            yCoordinate: 141.832423828884,
        },
        {
            xCoordinate: -121.48393370946,
            yCoordinate: 143.082257456119,
        },
        {
            xCoordinate: -120.0468104358,
            yCoordinate: 144.832024534248,
        },
        {
            xCoordinate: -120.734130262333,
            yCoordinate: 146.331824886929,
        },
        {
            xCoordinate: -118.484719920953,
            yCoordinate: 150.018834087272,
        },
        {
            xCoordinate: -117.672432853232,
            yCoordinate: 153.018434792636,
        },
        {
            xCoordinate: -119.484457850455,
            yCoordinate: 154.95567691485,
        },
        {
            xCoordinate: -121.608900950647,
            yCoordinate: 155.580593728467,
        },
        {
            xCoordinate: -122.108769915399,
            yCoordinate: 158.017769301575,
        },
        {
            xCoordinate: -126.732557839347,
            yCoordinate: 159.455077972896,
        },
        {
            xCoordinate: -128.482099215976,
            yCoordinate: 160.017503105151,
        },
        {
            xCoordinate: -130.169156972011,
            yCoordinate: 156.767935674341,
        },
        {
            xCoordinate: -127.982230251225,
            yCoordinate: 154.58072682668,
        },
        {
            xCoordinate: -129.231902663103,
            yCoordinate: 153.330893199445,
        },
        {
            xCoordinate: -131.856214728046,
            yCoordinate: 150.268800812719,
        },
        {
            xCoordinate: -133.980657828239,
            yCoordinate: 150.143817449996,
        },
        {
            xCoordinate: -135.792682825461,
            yCoordinate: 147.956608602335,
        },
        {
            xCoordinate: -135.230330240116,
            yCoordinate: 144.082124357907,
        },
        {
            xCoordinate: -133.105887139924,
            yCoordinate: 139.332756574414,
        },
        {
            xCoordinate: -130.48157507498,
            yCoordinate: 139.332756574414,
        },
        {
            xCoordinate: -129.919222489635,
            yCoordinate: 136.145680824965,
        },
        {
            xCoordinate: -127.669812148255,
            yCoordinate: 132.396179943261,
        },
    ],
];

export const areas = coordinates as CoordinatesDao[][];
