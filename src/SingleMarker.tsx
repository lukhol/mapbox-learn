import React from "react";
import {MapContext} from "./MapContext";
import {Marker} from "mapbox-gl";

export const SingleMarker = () => {
    const { map } = React.useContext(MapContext);
    const [marker, setMarker] = React.useState<Marker | null>(null);

    React.useEffect(() => {
        const marker = new Marker()
            .setLngLat([19.457216, 51.759445])
            .addTo(map);
        setMarker(marker);
    }, [map]);

    return null;
};