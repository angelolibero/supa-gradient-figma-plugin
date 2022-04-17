import {updateSelection, updatePaintStyles, selectPaintStyleWithId, isExternalStyleId} from '../app/lib/figma';
import {isNodeGradientCompatible, createGradientStyle} from '../app/lib/utils';
import {GradientPaintType, GradientStops} from '../app/typings';
import {
    DEFAULT_PREFERENCES,
    DEFAULT_POOLING_TIMEOUT,
    DEFAULT_FIGMA_NOTIFICATION_TIMEOUT,
    DEFAULT_AFFINE_TRANSFORMS,
    DEFAULT_GRADIENT_STOPS,
    DEFAULT_WINDOW_SIZE,
} from '../app/lib/constants';

var poolingInterval;

figma.showUI(__html__);
figma.ui.resize(240, DEFAULT_WINDOW_SIZE.height); //initial window size

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        // Apply gradient to current selection event
        // only gradient compatible nodes
        case 'apply-gradient':
            // const angle = msg.angle;
            //  const updateStyles = msg.updateStyles;
            const gradientStops: GradientStops = msg.gradientStops;
            const gradientType: GradientPaintType = msg.gradientType;
            const gradientTransform: Transform = msg.gradientTransform;
            const paintStyleId: string = msg.paintStyleId;
            const style = paintStyleId && (figma.getStyleById(paintStyleId) as PaintStyle);
            const updatedGradientPaint = {
                type: gradientType,
                gradientTransform,
                gradientStops,
            };

            if (style && isExternalStyleId(style.id)) {
                // Selected style is external, cannot edit it
                figma.notify('Cannot update external styles', {timeout: DEFAULT_FIGMA_NOTIFICATION_TIMEOUT});
            } else if (paintStyleId && style) {
                // Selected style exist, updated it
                style.paints = [updatedGradientPaint];
            }
            // console.log('apply-gradient', updatedGradientPaint);

            // Fill node with updated paint
            figma.currentPage.selection &&
                figma.currentPage.selection.forEach((node: RectangleNode) => {
                    if (node && gradientStops && isNodeGradientCompatible(node)) {
                        if (style && node.fillStyleId != style.id) node.fillStyleId = style.id;
                        if (!style || (style && style.id != node.fillStyleId)) node.fills = [updatedGradientPaint];
                    }
                });

            break;
        /*-------------------*/
        // Close plugin event
        case 'preferences-update':
            figma.clientStorage.setAsync('preferences', JSON.stringify(msg.preferences));
            figma.ui.postMessage({
                type: 'figma:preferencesupdate',
                message: {preferences: msg.preferences},
            });
            figma.notify('Plugin preferences updated', {timeout: DEFAULT_FIGMA_NOTIFICATION_TIMEOUT});
            break;
        /*-------------------*/
        // Reset preferences
        case 'preferences-reset':
            const newPreferencesValue = JSON.stringify(DEFAULT_PREFERENCES);
            figma.clientStorage.setAsync('preferences', newPreferencesValue);
            figma.ui.postMessage({
                type: 'figma:preferencesupdate',
                message: {preferences: newPreferencesValue},
            });
            figma.notify('Cleared preferences', {timeout: DEFAULT_FIGMA_NOTIFICATION_TIMEOUT});
            break;
        /*-------------------*/
        // Create new paint style and updates styles
        case 'create-style':
            const gradientPaint = msg.gradientPaint;
            const gradientName = msg.name;
            const newStyle = createGradientStyle(gradientName, {
                gradientStops: gradientPaint.gradientStops || DEFAULT_GRADIENT_STOPS,
                gradientTransform: gradientPaint.gradientTransform || DEFAULT_AFFINE_TRANSFORMS[0],
                type: gradientPaint.type,
            });
            figma.notify('New gradient style created! ⚡️', {
                timeout: gradientPaint.timeout || DEFAULT_FIGMA_NOTIFICATION_TIMEOUT,
            });
            figma.currentPage.selection.map((node) => {
                if (node && isNodeGradientCompatible(node)) {
                    (node as RectangleNode).fillStyleId = newStyle.id;
                }
            });
            updatePaintStyles();
            selectPaintStyleWithId(newStyle.id);
            break;
        /*-------------------*/
        // Basic figma notification event
        case 'notify':
            figma.notify(msg.title, {timeout: msg.timeout || DEFAULT_FIGMA_NOTIFICATION_TIMEOUT});
            break;
        /*-------------------*/
        // Resize event
        case 'resize':
            figma.ui.resize(msg.size.w, msg.size.h);
            break;
        default:
            break;
    }
};

figma.on('selectionchange', () => {
    // Current selection has changed
    // console.log('selectionchange', figma.currentPage.selection[0]);
    updateSelection();
});

figma.on('currentpagechange', () => {
    // Current page has changed, do something
    // console.log('currentpagechange');
});

figma.on('run' as any, () => {
    //Initialization
    updateSelection();
    updatePaintStyles();

    //Starting polling interval
    poolingInterval = setInterval(() => {
        updatePaintStyles();
    }, DEFAULT_POOLING_TIMEOUT);

    //Load preferences and send to UI
    figma.clientStorage.getAsync('preferences').then((preferences) => {
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: JSON.parse(preferences) || DEFAULT_PREFERENCES},
        });
    });
});

figma.on('close', () => {
    //Plugin has been closed
    clearInterval(poolingInterval);
});
