import React from 'react';
import './App.css';
import {Map, Marker, NavigationControl} from 'mapbox-gl';
import { Checkbox, Card } from '@blueprintjs/core';
import {OpenStreetMapTerrain} from "./OpenStreetMapTerrain";
import {OpenStreetMapLayer} from "./OpenStreetMap";
import {MapContext} from "./MapContext";
import PolygonContainer from "./PolygonComponent";
import Ruler from "./Ruler/Ruler";
import MapBoxControl from "./MapBoxControl";

const SomeComponent = () => {
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

const MapContainer: React.FC<{}> = ({children}) => {
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
      setMap(map);
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

const Application = () => {
  const [visibleLayers, setVisibleLayers] = React.useState(new Set<string>());

  const OPEN_STREET_MAP = "Open Street Map";
  const OPEN_STREET_MAP_TERRAIN = 'Open Street Map Terrain';
  const POLYGON = 'Sample polygon';
  const RULER = 'Ruler';

  const LAYERS = [
      OPEN_STREET_MAP,
      OPEN_STREET_MAP_TERRAIN,
      POLYGON,
      RULER
  ];

  const layerCheckboxClicked = (event: any) => {
    const layerName = event.target.value;
    const currentLayers = new Set(visibleLayers);
    if(currentLayers.has(layerName)) {
      currentLayers.delete(layerName);
    } else {
      currentLayers.add(layerName);
    }

    setVisibleLayers(currentLayers);
  };

  const polygonCoords = [
    [
      19.4582891,
      51.7613659
    ],
    [
      19.4546843,
      51.7590549
    ],
    [
      19.4571626,
      51.7582514
    ],
    [
      19.4592011,
      51.7602436
    ],
    [
      19.4582891,
      51.7613659
    ],
  ];

  return (
      <div>
        <MapContainer>
          <div className="mapboxgl-control-container">
            <MapBoxControl>
              <Card>
                {LAYERS.map(layerName => (
                    <Checkbox
                        key={layerName}
                        label={layerName}
                        value={layerName}
                        onChange={layerCheckboxClicked}
                    />
                ))}
              </Card>
            </MapBoxControl>
            <SomeComponent />
            {visibleLayers.has(OPEN_STREET_MAP) && <OpenStreetMapLayer />}
            {visibleLayers.has(OPEN_STREET_MAP_TERRAIN) && <OpenStreetMapTerrain/>}
            {visibleLayers.has(POLYGON) && (
                <PolygonContainer
                  coordinates={polygonCoords}
                />
            )}
            {visibleLayers.has(RULER) && <Ruler />}
          </div>
        </MapContainer>
      </div>
  )
};

export default Application;