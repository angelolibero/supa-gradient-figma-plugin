import {anglesTransform, defaultWindowSize} from '../app/lib/constants';
import {gradientAngleFromTransform} from '../app/lib/colors';
import {updateSelection, updateGradientStyles, selectPaintStyle} from '../app/lib/figma';
import {isGradientCompatible, createGradientStyle} from '../app/lib/utils';
import {GradientStops} from '../app/typings';
import {defaultPreferences, poolingTimeout} from '../app/lib/constants';

var poolingInterval;

figma.showUI(__html__);
figma.ui.resize(240, defaultWindowSize.width);

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        // Apply gradient to current selection event
        // only gradient compatible nodes
        case 'apply-gradient':
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
                            (style &&
                                JSON.stringify(msg.gradientStops) != JSON.stringify(style.paints[0].gradientStops)) ||
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
            break;
        // Close plugin event
        case 'preferences-update':
            figma.clientStorage.setAsync('preferences', JSON.stringify(msg.preferences));
            figma.ui.postMessage({
                type: 'figma:preferencesupdate',
                message: {preferences: msg.preferences},
            });
            figma.notify('Plugin preferences updated', {timeout: 1000});
            break;
        case 'preferences-clear':
            const newPreferencesValue = JSON.stringify(defaultPreferences);
            figma.clientStorage.setAsync('preferences', newPreferencesValue);
            figma.ui.postMessage({
                type: 'figma:preferencesupdate',
                message: {preferences: newPreferencesValue},
            });
            figma.notify('Cleared preferences', {timeout: 1000});
            break;
        // Create new paint style and updates styles
        case 'create-style':
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
            selectPaintStyle(newStyle);
            break;
        // Basic figma notification event
        case 'notify':
            figma.notify(msg.title, {timeout: msg.timeout || 1000});
            break;
        // Resize event
        case 'resize':
            console.log('RESIZE');
            figma.ui.resize(msg.size.w, msg.size.h);
            break;
        default:
            break;
    }
};

figma.on('selectionchange', () => {
    updateSelection();
});

figma.on('currentpagechange', () => {
    console.log('currentpagechange');
});

figma.on('run' as any, () => {
    //Send initial events
    updateGradientStyles();
    updateSelection();

    //Starting polling interval
    poolingInterval = setInterval(() => {
        updateGradientStyles();
    }, poolingTimeout);

    //Load preferences
    figma.clientStorage.getAsync('preferences').then((preferences) => {
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: JSON.parse(preferences) || defaultPreferences},
        });
    });
});

figma.on('close', () => {
    clearInterval(poolingInterval);
});
