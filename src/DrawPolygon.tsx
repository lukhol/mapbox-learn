import React, {useCallback, useContext, useEffect, useState} from 'react';
import {MapContext} from "./MapContext";
import {GeoJSONSource, MapMouseEvent} from "mapbox-gl";
import {Feature, FeatureCollection} from "geojson";

const DrawPolygon: React.FC<{}> = ({}) => {
   const { map } = useContext(MapContext);

   const [points, setPoints] = useState<{ lng: number, lat: number }[]>([]);
   const [id] = useState(Math.random().toString(36).substring(7));
   const [nodeId] = useState(Math.random().toString(36).substring(7));

   const removeLayerIfInMap = useCallback(() => {
      if(map.getSource(id)) {
         map.removeLayer(id);
         map.removeSource(id);
      }
   }, [id, map]);

   const onClick = (event: MapMouseEvent) => {
      setPoints(prevState => {
         return [
            ...prevState,
            event.lngLat,
         ]
      });
   };

   useEffect(() => {
      map.on('click', onClick);
   }, [map]);

   useEffect(() => {
      removeLayerIfInMap();

      const polylineGeoJson: Feature = {
         type: 'Feature',
         geometry: {
            type: 'LineString',
            coordinates: [...points.map(point => [point.lng, point.lat])]
         },
         properties: {},
      };

      const polylineSource = map.getSource(id) as GeoJSONSource;
      if(polylineSource) {
         polylineSource.setData(polylineGeoJson);
      } else {
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
      }

      const features: Feature[] = points.map(point => ({
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
      }));

      const nodeGeoJson: FeatureCollection = {
         type: "FeatureCollection",
         features,
      };
      console.log(JSON.stringify(nodeGeoJson));

      const nodesSource = map.getSource(nodeId) as GeoJSONSource;
      if(nodesSource) {
         nodesSource.setData(nodeGeoJson);
      } else {
         map.addSource(nodeId, {
            type: 'geojson',
            data: nodesSource,
         });

         map.addLayer({
            id: nodeId,
            type: 'symbol',
            source: nodeId,
            layout: {
               "text-field": ["get", "title"],
               "text-anchor": "top",
               "text-offset": [0, 1.25],
            }
         });
      }

      return removeLayerIfInMap;
   }, [points, map, id, removeLayerIfInMap]);

   return null;
};


export default DrawPolygon;