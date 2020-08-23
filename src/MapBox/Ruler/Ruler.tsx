import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {MapContext} from "../MapContext";
import {GeoJSONSource, MapMouseEvent, Marker} from "mapbox-gl";
import {FeatureCollection} from "geojson";
import polylineLength from '@turf/length';
import {lineString, Units} from '@turf/helpers';
import MapBoxControl from "../MapBoxControl";
import {HTMLSelect, Tag, Card} from "@blueprintjs/core";
import PolylineContainer from "../PolylineContainer";

interface MyPoint {
   lng: number,
   lat: number,
   marker?: Marker;
}

const calculateLength = (points: MyPoint[], underMousePoint: MyPoint | null, units: Units = 'meters', numFromBeginning = points.length): number => {
   const newPoints = points.map(point => [point.lng, point.lat]);
   if(underMousePoint) {
      newPoints.push([underMousePoint.lng, underMousePoint.lat]);
   }

   const filteredPoints = newPoints.slice(0, numFromBeginning + 1);

   if(filteredPoints.length < 2) {
      return 0;
   }

   return polylineLength(lineString([
       ...filteredPoints,
   ]), { units: units });
};

const markers: Marker[] = [];

const Ruler: React.FC = () => {
   const { map } = useContext(MapContext);

   const [points, setPoints] = useState<MyPoint[]>([]);
   const [underMousePoint, setUnderMousePoint] = useState<MyPoint | null>(null);
   const [nodeId] = useState(Math.random().toString(36).substring(7));
   const [units, setUnits] = useState<Units>('kilometers');

   const length = useMemo(() => {
      return calculateLength(points, underMousePoint);
   }, [points, underMousePoint]);

   const nodesGeoJson: FeatureCollection = useMemo(() => ({
      type: "FeatureCollection",
      features: points.map((point: MyPoint, index: number) => {
         const length = calculateLength(points, null, units, index);
         if(point.marker) {
            point.marker.getElement().innerHTML = `${length.toFixed(3)} ${units}`;
         }

         return {
            type: "Feature",
            geometry: {
               type: "Point",
               coordinates: [point.lng, point.lat],
            },
            properties: {
               description: `${length.toFixed(3)} ${units}`,
            },
         };
      }),
   }), [points, units]);

   const removeLayerIfInMap = useCallback(() => {
      const ids = [nodeId];
      ids.forEach(layerId => {
         if(map.getSource(layerId)) {
            map.removeLayer(layerId);
            map.removeSource(layerId);
         }
      });
   }, [map, nodeId]);

   const onClick = useCallback((event: MapMouseEvent) => {
      const element = document.createElement('div');
      element.className = 'ruler-marker-container';
      element.addEventListener('click', event => {
         event.stopPropagation();
         setPoints(prevPoints => (prevPoints.filter(point => point.marker !== marker)));
         marker.remove();
      });
      const marker = new Marker(element)
          .setLngLat(event.lngLat)
          .addTo(map);

      markers.push(marker);

      setPoints(prevState => {
         return [
            ...prevState,
            {
               ...event.lngLat,
               marker,
            },
         ]
      });
   }, [setPoints]);

   const onMouseMove = useCallback((event: MapMouseEvent) => {
      if(points.length === 0) {
         return;
      }

      setUnderMousePoint({
         lat: event.lngLat.lat,
         lng: event.lngLat.lng,
      });
   }, [points, setUnderMousePoint]);

   useEffect(() => {
      map.on('click', onClick);
      map.on('mousemove', onMouseMove);

      return () => {
         map.off('click', onClick);
         map.off('mousemove', onMouseMove);
      }
   }, [map, onClick, onMouseMove]);

   // Nodes
   useEffect(() => {
      (map.getSource(nodeId) as GeoJSONSource)?.setData(nodesGeoJson);
   }, [map, nodeId, nodesGeoJson]);

   useEffect(() => {
      map.addSource(nodeId, {
         type: 'geojson',
         data: nodesGeoJson,
      });
      map.addLayer({
         id: nodeId,
         source: nodeId,
         // Symbol example (with text)
         // type: 'symbol',
         // layout: {
         //    'text-field': ['get', 'description'],
         //    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
         //    'text-radial-offset': 0.5,
         // },

         type: 'circle',
         paint: {
            "circle-radius": [
               "interpolate", ["linear"], ["zoom"],
               // zoom is 10 (or less) -> circle radius will be 20px
               10, 2,
               // zoom is 14 (or greater) -> circle radius will be 10px
               14, 8,
               15, 25
            ],
            "circle-stroke-width": 4,
            "circle-color": '#ccc',
         },
      });

      return removeLayerIfInMap;
   }, [removeLayerIfInMap]);

   useEffect(() => {
      return () => {
         markers.forEach(marker => marker.remove());
      }
   }, []);

   return (
       <>
          <PolylineContainer
              coordinates={[
                  ...points.map(point => [point.lng, point.lat])
              ]}
              paint={{
                 'line-color': '#888',
                 'line-width': 3,
              }}
          />
          {points.length > 0 && underMousePoint && (
              <PolylineContainer
                  coordinates={[
                     [points[points.length - 1].lng, points[points.length - 1].lat],
                     [underMousePoint.lng, underMousePoint.lat]
                  ]}
              />
          )}
          <MapBoxControl icon="settings" defaultIsOpen={true}>
             <div style={{marginBottom: "8px"}}>
                <Tag>
                   {length.toFixed(3)} m
                </Tag>
             </div>

             <HTMLSelect
                 value={units}
                 onChange={(event) => setUnits(event.target.value as Units)}
             >
                <option value="miles">Miles</option>
                <option value="kilometers">Kilometers</option>
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
                <option value="centimeters">Centimeters</option>
                <option value="millimeters">Millimeters</option>
             </HTMLSelect>
          </MapBoxControl>
       </>
   );
};


export default Ruler;