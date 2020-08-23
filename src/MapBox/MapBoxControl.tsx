import React from 'react';
import {Button, PopoverInteractionKind, Popover, IconName} from "@blueprintjs/core";

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
    icon?: IconName,
    interactionKind?: PopoverInteractionKind,
    defaultIsOpen?: boolean,
}> = ({ children, position = 'topright', icon= 'eye-on', interactionKind = PopoverInteractionKind.HOVER, defaultIsOpen = false}) => {

    const controlClassName = findClassName(position);

    return (
        <div className={`${controlClassName} mapboxgl-control-container-relative`} style={{marginTop: 8, marginLeft: 8}}>
            <Popover
                defaultIsOpen={defaultIsOpen}
                interactionKind={interactionKind}
                position="right"
                popoverClassName="bp3-popover-content-sizing"
                content={<>{children}</>}
            >
                <Button icon={icon}>
                </Button>
            </Popover>
        </div>
    )
};

export default MapBoxControl;