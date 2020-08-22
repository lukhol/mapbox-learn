import React from "react";
import {MapContext} from "../MapBox/MapContext";

export const OpenStreetMapTerrain = () => {
    const { map } = React.useContext(MapContext);
    const NAME = "open-street-map-terrain";

    React.useEffect(() => {
        let layer;
        const createLayer = () => {
            map.addSource(NAME, {
                type: 'raster',
                tiles: ['http://a.tile.stamen.com/toner/{z}/{x}/{y}.png'],
                tileSize: 256,
            });
            layer = map.addLayer({
                id: NAME,
                type: 'raster',
                source: NAME,
                minzoom: 0,
                maxzoom: 22,
            })
        };
        createLayer();

        return () => {
            if(map.getLayer(NAME)) {
                map.removeLayer(NAME);
                map.removeSource(NAME);
            }
        }
    }, [map]);
    return null;
};