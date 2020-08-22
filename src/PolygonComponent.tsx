import React, {useContext, useEffect, useState} from 'react';
import {MapContext} from "./MapContext";

const PolygonContainer: React.FC<{}> = ({}) => {
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
                   'coordinates': [
                       [
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
                       ]
                   ]
               }
           }
       } as any);

       map.addLayer({
           id: name,
           type: 'fill',
           source: name,
           layout: {},
           paint: {
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