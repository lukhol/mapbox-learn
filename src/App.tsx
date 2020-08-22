import React from 'react';
import { Checkbox, Card } from '@blueprintjs/core';
import {OpenStreetMapTerrain} from "./Map/OpenStreetMapTerrain";
import {OpenStreetMapLayer} from "./Map/OpenStreetMap";
import PolygonContainer from "./MapBox/PolygonComponent";
import Ruler from "./MapBox/Ruler/Ruler";
import MapBoxControl from "./MapBox/MapBoxControl";
import {MapContainer} from "./MapBox/MapContainer";
import {SingleMarker} from "./Map/SingleMarker";
import {useVisibleLayers} from "./Map/useVisibleLayers";

const Application = () => {
  const RAND_MARKER = 'Rand marker';
  const OPEN_STREET_MAP = "Open Street Map";
  const OPEN_STREET_MAP_TERRAIN = 'Open Street Map Terrain';
  const POLYGON = 'Sample polygon';
  const RULER = 'Ruler';

  const LAYERS = [
    RAND_MARKER,
    OPEN_STREET_MAP_TERRAIN,
    POLYGON,
    RULER
  ];

  const [visibleLayers, onChange] = useVisibleLayers([RULER]);

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
                        checked={visibleLayers.has(layerName)}
                        key={layerName}
                        label={layerName}
                        value={layerName}
                        onChange={onChange}
                    />
                ))}
              </Card>
            </MapBoxControl>
            <OpenStreetMapLayer />
            {visibleLayers.has(RAND_MARKER) && <SingleMarker />}
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