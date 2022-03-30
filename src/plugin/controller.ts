import {anglesTransform} from '../app/lib/angles';
import {getGradientsFromStyles, isGradientCompatible} from '../app/lib/utils';
import {GradientStops} from '../app/typings';

const defaultPreferences = {liveEditMode: true};

figma.showUI(__html__);
figma.ui.resize(300, 300);

figma.ui.onmessage = (msg) => {
    // Apply gradient to current selection
    // only gradient compatible nodes
    if (msg.type === 'apply-gradient') {
        const angle = msg.angle;
        const gradientStops: GradientStops = msg.gradientStops;
        figma.currentPage.selection &&
            figma.currentPage.selection.forEach((node) => {
                if (isGradientCompatible(node) && node && gradientStops) {
                    node.fills = [
                        {
                            type: 'GRADIENT_LINEAR',
                            gradientTransform: anglesTransform[angle],
                            gradientStops,
                        },
                    ];
                } else {
                    figma.notify(`Cant't apply gradient to node ${node.name}`, {timeout: 3000});
                }
            });
        //figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    }

    // Close plugin
    if (msg.type === 'close-plugin') {
        figma.closePlugin();
    }

    // Updates client storage with a new preferences
    if (msg.type === 'preferences-update') {
        let valueToStore = JSON.stringify(msg.preferences);
        figma.clientStorage.setAsync('preferences', valueToStore);
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: msg.preferences},
        });
        console.log('PREFERENCES UPDATED:', msg.preferences);
    }

    // Clears preferences
    // invoked from options menu
    if (msg.type === 'preferences-clear') {
        let valueToStore = JSON.stringify(defaultPreferences);
        figma.clientStorage.setAsync('preferences', valueToStore);
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            storage: valueToStore,
        });
        figma.notify('Cleared preferences', {timeout: 1000});
    }

    // if (msg.type === 'log-gradient') {
    //     if (figma.currentPage.selection && figma.currentPage.selection[0]) {
    //         console.log(figma.currentPage.selection[0]);
    //     }
    // }
};

figma.on('selectionchange', () => {
    figma.ui.postMessage({
        type: 'figma:selectionchange',
        message: {selection: figma.currentPage.selection},
    });
});

figma.on('run', ({command, parameters}) => {
    //Load preferences

    figma.clientStorage.getAsync('preferences').then((preferences) => {
        console.log('PREFERENCES LOADED:', JSON.parse(preferences));
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: JSON.parse(preferences) || defaultPreferences},
        });
    });

    //Run event
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const gradientNodes = figma.currentPage.selection.map((node) => {
            if (isGradientCompatible(node) && node) {
                return {id: node.id, fills: node.fills};
            }
        });
        const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());

        figma.ui.postMessage({
            type: 'figma:selectionchange',
            message: {selection: figma.currentPage.selection, fills: gradientNodes[0].fills},
        });

        figma.ui.postMessage({
            type: 'figma:styles:gradientschange',
            message: {paintStyles: gradientPaintStyles},
        });
    }

    //   switch (command) {
    //     case "resize":
    //       handleResize(parameters.width, parameters.height)
    //       break
    //     case "move":
    //       handleMove(parameters.dx, parameters.dy)
    //       break
    //     ...
    //   }
});
