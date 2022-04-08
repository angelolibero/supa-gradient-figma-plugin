import {DEFAULT_WINDOW_SIZE} from '../app/lib/constants';
import {updateSelection, updateGradientStyles, selectPaintStyleWithId} from '../app/lib/figma';
import {isGradientCompatible, createGradientStyle} from '../app/lib/utils';
import {GradientPaintType, GradientStops} from '../app/typings';
import {DEFAULT_PREFERENCES, DEFAULT_POOLING_TIMEOUT} from '../app/lib/constants';
import {gradientAngleToTransform} from '../app/lib/colors';
import {decomposeTSR} from 'transformation-matrix';
import {transformToMatrix} from '../app/lib/matrix';

var poolingInterval;

figma.showUI(__html__);
figma.ui.resize(240, 429);

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        // Apply gradient to current selection event
        // only gradient compatible nodes
        case 'apply-gradient':
            const angle = msg.angle;
            const gradientStops: GradientStops = msg.gradientStops;
            const gradientType: GradientPaintType = msg.gradientType;
            const gradientTransform: Transform = msg.gradientTransform;
            const paintStyleId: string = msg.paintStyleId;
            const style = paintStyleId && (figma.getStyleById(paintStyleId) as PaintStyle);

            const updatedGradientPaint = {
                //  id: paintStyleId,
                type: gradientType,
                gradientTransform, //gradientTransform //FIX angoli custom
                gradientStops,
            };
            console.log(decomposeTSR(transformToMatrix(gradientTransform)));

            if (paintStyleId && style) {
                console.log('apply-gradient', gradientStops, gradientType, paintStyleId);
                style.paints = [updatedGradientPaint];
            }

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
                        //is external, can't fill it
                        if ((node.fillStyleId as string).split(',')[1]) return;
                        //is local
                        if (style) node.fillStyleId = style.id;
                        if (!style || (style && style.id != node.fillStyleId)) node.fills = [updatedGradientPaint];
                    }
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
        // Reset preferences
        case 'preferences-reset':
            const newPreferencesValue = JSON.stringify(DEFAULT_PREFERENCES);
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
                type: msg.gradientType,
            });
            figma.notify('New gradient style created', {timeout: msg.timeout || 1000});
            figma.currentPage.selection.map((node) => {
                if (node && isGradientCompatible(node)) {
                    (node as RectangleNode).fillStyleId = newStyle.id;
                }
            });
            updateGradientStyles();
            selectPaintStyleWithId(newStyle.id);
            break;
        // Basic figma notification event
        case 'notify':
            figma.notify(msg.title, {timeout: msg.timeout || 1000});
            break;
        // Resize event
        case 'resize':
            figma.ui.resize(msg.size.w, msg.size.h);
            break;
        default:
            break;
    }
};

figma.on('selectionchange', () => {
    console.log('selectionchange', figma.currentPage.selection[0]);
    updateSelection();
});

// figma.on('currentpagechange', () => {
//     console.log('currentpagechange');
// });

figma.on('run' as any, () => {
    //Send initial events
    updateSelection();
    updateGradientStyles();

    //Starting polling interval
    poolingInterval = setInterval(() => {
        updateGradientStyles();
    }, DEFAULT_POOLING_TIMEOUT);

    //Load preferences
    figma.clientStorage.getAsync('preferences').then((preferences) => {
        console.log('PREF', JSON.parse(preferences));
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: JSON.parse(preferences) || DEFAULT_PREFERENCES},
        });
    });
});

figma.on('close', () => {
    clearInterval(poolingInterval);
});
