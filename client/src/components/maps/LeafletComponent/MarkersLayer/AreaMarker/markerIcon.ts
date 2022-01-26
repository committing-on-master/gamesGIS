import L from 'leaflet';
import pepeimg from "./../../../../../img/altyn-pepe.png"

const markerIcon = new L.Icon({
    iconUrl: pepeimg,
    iconRetinaUrl: pepeimg,
    iconAnchor: undefined,
    popupAnchor: new L.Point(0, -15),
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

export { markerIcon };