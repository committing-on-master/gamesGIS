import fetchMock from "fetch-mock";
import { MapAreas, ProfileMapDTO } from "../api/dto/response/ProfileMapDTO";
import { MapType } from "./dto/types/MapType";

const marker1: MapAreas = {
    id: 35,
    name: "First aria",
    center: {x: -50, y: 60},
    color: "blue",
    aria: [
        {x: -55, y: 62},
        {x: -50, y: 66},
        {x: -47, y: 62},
        {x: -48, y: 57},
        {x: -53, y: 57}
    ]
}

const marker2: MapAreas = {
    id: 41,
    name: "Second aria",
    center: {x: -128, y: 128},
    color: "green",
    aria: [
        {x: -120, y: 100},
        {x: -120, y: 130},
        {x: -130, y: 130},
        {x: -135, y: 128},
        {x: -129, y: 95}
    ]
}

const marker3: MapAreas = {
    id: 39,
    name: "Third aria",
    center:{x: -150, y: 60},
    color: "red",
    aria: [
        {x: -155, y: 62},
        {x: -150, y: 66},
        {x: -147, y: 62},
        {x: -148, y: 57},
        {x: -153, y: 57}
    ]
}

const responseBody: ProfileMapDTO = {
    msg: "successfully respose",
    payload: {
        mapType: MapType.Woods,
        id: 42,
        name: "profile name",
        center: {x: -128, y: 128},
        bound: [
            { x: -256, y: 0 },
            { x: 0, y: 256 }
        ],
        points: [marker1, marker2, marker3]
    }
}
fetchMock
    .restore()
    .get(
        "http://localhost:3000/api/maps/woods",
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responseBody)
        },
        {
            delay: 1000
        }
    )