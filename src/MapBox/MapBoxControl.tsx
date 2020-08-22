import React from 'react';

const findClassName = (controlPosition: ControlPosition) => {
    switch (controlPosition) {
        case "bottomleft": return 'mapbox-ctrl-bottom-left';
        case "bottomright": return 'mapbox-ctrl-bottom-right';
        case "topleft": return 'mapbox-ctrl-top-left';
        case "topright": return 'mapbox-ctrl-top-right';
        default: return '';
    }
};

type ControlPosition = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

const MapBoxControl: React.FC<{
    position?: ControlPosition,
}> = ({ children, position = 'topright'}) => {

    const controlClassName = findClassName(position);

    return (
        <div className={`${controlClassName} mapboxgl-control-container-absolute`} style={{margin: 8}}>
            {children}
        </div>
    )
};

export default MapBoxControl;