import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {MapContext} from "../MapContext";
import {GeoJSONSource, MapMouseEvent, Marker} from "mapbox-gl";
import {FeatureCollection} from "geojson";
import polylineLength from '@turf/length';
import { lineString } from '@turf/helpers';
import MapBoxControl from "../MapBoxControl";
import {Tag} from "@blueprintjs/core";
import PolylineContainer from "../PolylineContainer";

interface MyPoint {
   lng: number,
   lat: number,
   marker?: Marker;
}

const findLength = (points: MyPoint[], underMousePoint: MyPoint | null, numFromBeginning = points.length): number => {
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
   ]), { units: 'meters' });
};

const markers: Marker[] = [];

const Ruler: React.FC = () => {
   const { map } = useContext(MapContext);

   const [points, setPoints] = useState<MyPoint[]>([]);
   const [underMousePoint, setUnderMousePoint] = useState<MyPoint | null>(null);
   const [nodeId] = useState(Math.random().toString(36).substring(7));

   const length = useMemo(() => {
      return findLength(points, underMousePoint);
   }, [points, underMousePoint]);

   const nodesGeoJson: FeatureCollection = useMemo(() => ({
      type: "FeatureCollection",
      features: points.map((point: MyPoint, index: number) => {
         const length = findLength(points, null, index);
         if(point.marker) {
            point.marker.getElement().innerHTML = `${length.toFixed(3)} meters`;
         }

         return {
            type: "Feature",
            geometry: {
               type: "Point",
               coordinates: [point.lng, point.lat],
            },
            properties: {
               'marker-color': '#3bb2d0',
               'marker-size': 'large',
               'marker-symbol': 'rocket',
               description: `${length.toFixed(3)} meters`,
            },
         };
      }),
   }), [points]);

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
         type: 'symbol',
         layout: {
            'text-field': ['get', 'description'],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
         }
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
          <MapBoxControl>
             <Tag>
                {length.toFixed(3)} m
             </Tag>
          </MapBoxControl>
       </>
   );
};


export default Ruler;