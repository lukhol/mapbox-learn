import {Map} from "mapbox-gl";
import React from "react";

interface IMapContext { map: Map };
export const MapContext = React.createContext<IMapContext>({} as IMapContext);