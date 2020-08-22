import React from "react";
import {MapContext} from "./MapContext";

export const OpenStreetMapLayer = () => {
    const { map } = React.useContext(MapContext);
    React.useEffect(() => {
        const createLayer = () => {
            map.addSource("open-street-map", {
                type: 'raster',
                tiles: ['https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
            });

            map.addLayer({
                id: "open-street-map",
                type: 'raster',
                source: "open-street-map",
                minzoom: 0,
                maxzoom: 22,
            })
        };
        createLayer();

        return () => {
            if(map.getLayer('open-street-map')) {
                map.removeLayer('open-street-map');
                map.removeSource('open-street-map');
            }
        }
    }, [map]);
    return null;
};