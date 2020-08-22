import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {MapContext} from "./MapContext";
import {GeoJSONSource, MapMouseEvent} from "mapbox-gl";
import {Feature, FeatureCollection, LineString, Point} from "geojson";

interface MyPoint {
   lng: number,
   lat: number,
}

const DrawPolygon: React.FC<{}> = ({}) => {
   const { map } = useContext(MapContext);

   const [points, setPoints] = useState<MyPoint[]>([]);
   const [underMousePoint, setUnderMousePoint] = useState<MyPoint | null>(null);

   const [id] = useState(Math.random().toString(36).substring(7));
   const [nodeId] = useState(Math.random().toString(36).substring(7));
   const [lastPolylineId] = useState(Math.random().toString(36).substring(7));

   // Object from useMemo is mutated because without it geojson is redrawn by removing
   // it from map and adding again.
   const polylineGeoJson: Feature<LineString> = useMemo(() => ({
      type: 'Feature',
      geometry: {
         type: 'LineString',
         coordinates: [...points.map(point => [point.lng, point.lat])]
      },
      properties: {},
   }) ,[points]);
   const lastPolylineGeoJson: Feature<LineString> = useMemo(() => ({
      type: 'Feature',
      geometry: {
         type: 'LineString',
         coordinates: [
             [points[points.length - 1]?.lng || 0, points[points.length - 1]?.lat || 0],
             [underMousePoint?.lng || 0, underMousePoint?.lat || 0]
         ],
      },
      properties: {},
   }), [underMousePoint]);
   const nodesGeoJson: FeatureCollection = useMemo(() => ({
      type: "FeatureCollection",
      features: points.map(point => ({
         type: "Feature",
         geometry: {
            type: "Point",
            coordinates: [point.lng, point.lat],
         },
         properties: {
            'marker-color': '#3bb2d0',
            'marker-size': 'large',
            'marker-symbol': 'rocket',
            title: 'Title from properties',
         },
      })),
   }), [points]);

   const removeLayerIfInMap = useCallback(() => {
      const ids = [id, nodeId, lastPolylineId];
      ids.forEach(layerId => {
         if(map.getSource(layerId)) {
            map.removeLayer(layerId);
            map.removeSource(layerId);
         }
      })
   }, [map, id, nodeId, lastPolylineId]);

   const onClick = (event: MapMouseEvent) => {
      setPoints(prevState => {
         return [
            ...prevState,
            event.lngLat,
         ]
      });
   };
   const onMouseMove = (event: MapMouseEvent) => {
      if(points.length === 0) {
         return;
      }

      setUnderMousePoint({
         lat: event.lngLat.lat,
         lng: event.lngLat.lng,
      });
   };

   useEffect(() => {
      map.on('click', onClick);
      map.on('mousemove', onMouseMove);

      return () => {
         map.off('click', onClick);
         map.off('mousemove', onMouseMove);
      }
   }, [map, onClick, onMouseMove]);

   // Points
   useEffect(() => {
      if(points.length === 0) {
         return;
      }

      const lastPoint = points[points.length - 1];
      polylineGeoJson.geometry.coordinates.push([lastPoint.lng, lastPoint.lat]);
      (map.getSource(id) as GeoJSONSource).setData(polylineGeoJson);
   }, [points]);

   // Last linestring
   useEffect(() => {
      if(!underMousePoint) {
         return;
      }

      const length = lastPolylineGeoJson.geometry.coordinates.length;
      lastPolylineGeoJson.geometry.coordinates[length] = [underMousePoint.lng, underMousePoint.lat];
      (map.getSource(lastPolylineId) as GeoJSONSource).setData(lastPolylineGeoJson);
   }, [underMousePoint]);

   // Nodes
   useEffect(() => {
      const lastPoint = points[points.length - 1];
      if(!lastPoint) {
         return;
      }
      nodesGeoJson.features.push({
         type: 'Feature',
         geometry: {
            type: 'Point',
            coordinates: [
               lastPoint.lng,
               lastPoint.lat,
            ]
         },
         properties: {},
      });
      (map.getSource(nodeId) as GeoJSONSource).setData(nodesGeoJson);
   }, [points]);

   useEffect(() => {
      map.addSource(id, {
         type: 'geojson',
         data: polylineGeoJson,
      });
      map.addLayer({
         id,
         type: 'line',
         source: id,
         paint: {
            'line-color': '#888',
            'line-width': 3,
         },
      });

      map.addSource(nodeId, {
         type: 'geojson',
         data: {
            type: "FeatureCollection",
            features: points.map(point => ({
               type: "Feature",
               geometry: {
                  type: "Point",
                  coordinates: [point.lng, point.lat],
               },
               properties: {
                  'marker-color': '#3bb2d0',
                  'marker-size': 'large',
                  'marker-symbol': 'rocket',
                  title: 'Title from properties',
               },
            })),
         },
      });
      map.addLayer({
         id: nodeId,
         type: 'circle',
         source: nodeId,
         paint: {
            'circle-radius': 5,
            'circle-color': '#000'
         },
      });

      map.addSource(lastPolylineId, {
         type: 'geojson',
         data: lastPolylineGeoJson,
      });
      map.addLayer({
         id: lastPolylineId,
         type: 'line',
         source: lastPolylineId,
      });

      return removeLayerIfInMap;
   }, []);

   return null;
};


export default DrawPolygon;