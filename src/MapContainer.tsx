import React from "react";
import {Map, NavigationControl} from "mapbox-gl";
import {MapContext} from "./MapContext";

export const MapContainer: React.FC<{}> = ({children}) => {
    const mapRef = React.useRef<HTMLDivElement | null>(null);
    const [map, setMap] = React.useState<Map | null>(null);

    React.useEffect(() => {
        if(mapRef.current) {
            const map = new Map({
                container: mapRef.current!,
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [19.457216, 51.759445],
                zoom: 14,
                accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA',
            });
            map.addControl(new NavigationControl());

            map.on('load', () => {
                setMap(map);
            });
        }
    }, [mapRef]);

    return (
        <div className="map-container" ref={mapRef}>
            {map && (
                <MapContext.Provider value={{ map }}>
                    {children}
                </MapContext.Provider>
            )}
        </div>
    )
};