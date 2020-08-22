import React, {useContext, useEffect, useState} from 'react';
import {MapContext} from "./MapContext";
import {AnyLayout, AnyPaint} from "mapbox-gl";

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

const PolygonContainer: React.FC<{
    coordinates: number[][],
    paint?: AnyPaint,
    layout?: AnyLayout,
    type?: LayerType;
}> = ({ coordinates, layout, paint, type }) => {
   const { map } = useContext(MapContext);
   const [name] = useState(Math.random().toString(36).substring(7));

   useEffect(() => {
       if(!map) return;

       map.addSource(name, {
           'type': 'geojson',
           'data': {
               'type': 'Feature',
               'geometry': {
                   'type': 'Polygon',
                   'coordinates': [coordinates]
               }
           }
       } as any);

       map.addLayer({
           id: name,
           type: type || 'fill',
           source: name,
           layout: layout || {},
           paint: paint || {
               'fill-color': '#088',
               'fill-opacity': 0.4,
           }
       });

       return () => {
           if(map.getLayer(name)) {
               map.removeLayer(name);
               map.removeSource(name);
           }
       };
   }, [map]);

   return null;
};


export default PolygonContainer;