import {linearTransforms, defaultWindowSize} from '../app/lib/constants';
import {gradientAngleFromTransform} from '../app/lib/colors';
import {updateSelection, updateGradientStyles, selectPaintStyleWithId} from '../app/lib/figma';
import {isGradientCompatible, createGradientStyle} from '../app/lib/utils';
import {GradientPaintType, GradientStops} from '../app/typings';
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
            const gradientType: GradientPaintType = msg.gradientType;
            const paintStyleId: string = msg.paintStyleId;
            console.log('FILL SELECTION ', gradientStops, gradientType, paintStyleId);
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
                        const style = figma.getStyleById(paintStyleId) as PaintStyle;
                        const paint = style && ((style as PaintStyle).paints[0] as GradientPaint);
                        const updatedPaint = {
                            type: gradientType,
                            gradientTransform: linearTransforms[angle],
                            gradientStops,
                        };

                        const isChanged =
                            (style && JSON.stringify(gradientStops) != JSON.stringify(gradientStops)) ||
                            (style && angle != gradientAngleFromTransform(paint.gradientTransform)) ||
                            (style && gradientType != paint.type);

                        if (style && !isChanged) {
                            node.fillStyleId = style.id;
                        } else if (paintStyleId && style) {
                            style.paints = [updatedPaint];
                        } else {
                            node.fills = [updatedPaint];
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
    updateSelection();
    updateGradientStyles();

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
