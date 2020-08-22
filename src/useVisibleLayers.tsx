import React from "react";

export const useVisibleLayers = (layers: string[]): [Set<String>, (event: any) => void] => {
    const [visibleLayers, setVisibleLayers] = React.useState<Set<String>>(new Set(layers));

    const layerCheckboxClicked = (event: any): void => {
        const layerName = event.target.value;
        const currentLayers = new Set(visibleLayers);
        if(currentLayers.has(layerName)) {
            currentLayers.delete(layerName);
        } else {
            currentLayers.add(layerName);
        }

        setVisibleLayers(currentLayers);
    };

    return [
        visibleLayers,
        layerCheckboxClicked,
    ];
};