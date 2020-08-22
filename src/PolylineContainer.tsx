import React, {useContext, useEffect, useState} from 'react';
import {AnyLayout, AnyPaint, GeoJSONSource} from "mapbox-gl";
import {MapContext} from "./MapContext";

type LayerType =
    | 'fill'
    | 'line'
    | 'symbol'
    | 'circle'
    | 'fill-extrusion'
    | 'raster'
    | 'background'
    | 'heatmap'
    | 'hillshade';

const PolylineContainer: React.FC<{
   coordinates: number[][],
   paint?: AnyPaint,
   layout?: AnyLayout,
   type?: LayerType;
}> = ({ coordinates, paint, layout, type }) => {
   const { map } = useContext(MapContext);
   const [id] = useState(Math.random().toString(36).substring(7));

   useEffect(() => {
      if(map.getSource(id)) {
         (map.getSource(id) as GeoJSONSource).setData({
            type: 'Feature',
            geometry: {
               type: 'LineString',
               coordinates,
            },
            properties: {},
         });
      }
   }, [map, id, coordinates]);

   // TODO: update paint
   // TODO: update layout
   // TODO: update type

   useEffect(() => {
      map.addSource(id, {
         type: 'geojson',
         data: {
            type: 'Feature',
            geometry: {
               type: 'Polygon',
               coordinates: [coordinates]
            },
            properties: {},
         }
      });

      map.addLayer({
         id: id,
         type: type || 'line',
         source: id,
         layout: layout || {},
         paint: paint || {},
      });

      return () => {
         if(map.getLayer(id)) {
            map.removeLayer(id);
            map.removeSource(id);
         }
      };
   }, [map, id]);

   return null;
};

export default PolylineContainer;