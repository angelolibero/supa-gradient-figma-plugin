import {anglesTransform} from '../app/lib/constants';
import {gradientAngleFromTransform} from '../app/lib/colors';
import {updateSelection, updateGradientStyles} from '../app/lib/figma';
import {isGradientCompatible, createGradientStyle} from '../app/lib/utils';
import {GradientStops} from '../app/typings';

const defaultPreferences = {liveUpdates: true};
var poolingInterval = undefined;
var poolingTimeout = 1000 * 5; //10 second

figma.showUI(__html__);
figma.ui.resize(300, 440);

figma.ui.onmessage = (msg) => {
    // Apply gradient to current selection event
    // only gradient compatible nodes
    if (msg.type === 'apply-gradient') {
        const angle = msg.angle;
        const gradientStops: GradientStops = msg.gradientStops;

        console.log('FILL SELECTION ', gradientStops);

        figma.currentPage.selection &&
            figma.currentPage.selection.forEach((node) => {
                if (
                    node &&
                    gradientStops &&
                    (node.type == 'RECTANGLE' ||
                        node.type == 'ELLIPSE' ||
                        node.type == 'POLYGON' ||
                        node.type == 'VECTOR' ||
                        node.type == 'FRAME' ||
                        node.type == 'STAR')
                ) {
                    const style = figma.getStyleById(msg.id);
                    const isChanged =
                        (style && JSON.stringify(msg.gradientStops) != JSON.stringify(style.paints[0].gradientStops)) ||
                        (style && angle != gradientAngleFromTransform(style.paints[0].gradientTransform));

                    if (style && !isChanged) {
                        node.fillStyleId = style.id;
                    } else {
                        node.fills = [
                            {
                                type: 'GRADIENT_LINEAR',
                                gradientTransform: anglesTransform[angle],
                                gradientStops,
                            },
                        ];
                    }
                }
                //else {
                //     figma.notify(`Can't apply gradient to node ${node.name}`, {timeout: 3000});
                // }
            });
        //figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    }

    // Close plugin event
    if (msg.type === 'close-plugin') {
        figma.closePlugin();
    }

    // Updates client storage with a new preferences event
    if (msg.type === 'preferences-update') {
        let valueToStore = JSON.stringify(msg.preferences);
        figma.clientStorage.setAsync('preferences', valueToStore);
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: msg.preferences},
        });
        figma.notify('Plugin preferences updated', {timeout: 1000});
    }

    // Clears preferences event
    // invoked from options menu
    if (msg.type === 'preferences-clear') {
        let valueToStore = JSON.stringify(defaultPreferences);
        figma.clientStorage.setAsync('preferences', valueToStore);
        console.log('CLEAR PREFERE', msg.preferences);
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            storage: valueToStore,
        });
        figma.notify('Cleared preferences', {timeout: 1000});
    }

    // Create new Figma styles event
    if (msg.type === 'create-style') {
        const newStyle = createGradientStyle(msg.name, {
            gradientStops: msg.gradientStops,
            gradientTransform: msg.gradientTransform,
        });
        figma.notify('New gradient style created', {timeout: msg.timeout || 1000});

        figma.currentPage.selection.map((node) => {
            if (node && isGradientCompatible(node)) {
                (node as RectangleNode).fillStyleId = newStyle.id;
            }
        });
        updateGradientStyles();
    }

    // Clear selection
    if (msg.type === 'clear-selection') {
        figma.currentPage.selection = [];
    }

    // Notification event
    if (msg.type === 'notify') {
        figma.notify(msg.title, {timeout: msg.timeout || 1000});
    }

    // if (msg.type === 'log-gradient') {
    //     if (figma.currentPage.selection && figma.currentPage.selection[0]) {
    //         console.log(figma.currentPage.selection[0]);
    //     }
    // }
};

figma.on('selectionchange', () => {
    // figma.ui.postMessage({
    //     type: 'figma:selectionchange',
    //     message: {selection: figma.currentPage.selection, fills: gradientNodes[0].fills},
    // });
    updateSelection();
});

figma.on('currentpagechange', () => {
    // figma.ui.postMessage({
    //     type: 'figma:selectionchange',
    //     message: {selection: figma.currentPage.selection, fills: gradientNodes[0].fills},
    // });
    console.log('currentpagechange');
    // updateSelection();
});

figma.on('run', () => {
    //Send initial events
    updateGradientStyles();
    updateSelection();

    //Starting polling interval
    poolingInterval = setInterval(() => {
        updateGradientStyles();
    }, poolingTimeout);

    //Load preferences
    figma.clientStorage.getAsync('preferences').then((preferences) => {
        console.log('GET PREFERE', preferences);
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: JSON.parse(preferences) || defaultPreferences},
        });
    });

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

figma.on('close', () => {
    clearInterval(poolingInterval);
});
