import {anglesTransform} from '../app/lib/angles';
import {gradientAngleFromTransform} from '../app/lib/colors';
import {getGradientsFromStyles, isGradientCompatible, createGradientStyle} from '../app/lib/utils';
import {GradientStops} from '../app/typings';

const defaultPreferences = {liveEditMode: true};

const updateSelection = () => {
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const gradientNodes = figma.currentPage.selection.map((node) => {
            if (node && isGradientCompatible(node)) {
                return {id: node.id, fills: node.fills};
            }
        });
        if (gradientNodes && gradientNodes.length >= 0) {
            figma.ui.postMessage({
                type: 'figma:selectionchange',
                message: {selection: figma.currentPage.selection, fills: gradientNodes[0].fills},
            });
        }
    }
};

figma.showUI(__html__);
figma.ui.resize(300, 400);

figma.ui.onmessage = (msg) => {
    // Apply gradient to current selection event
    // only gradient compatible nodes
    if (msg.type === 'apply-gradient') {
        const angle = msg.angle;
        const gradientStops: GradientStops = msg.gradientStops;
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
                    const hasChanged =
                        (style && JSON.stringify(msg.gradientStops) != JSON.stringify(style.paints[0].gradientStops)) ||
                        (style && angle != gradientAngleFromTransform(style.paints[0].gradientTransform));

                    if (style && !hasChanged) {
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
    }

    // Clears preferences event
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

    // Create new Figma styles event
    if (msg.type === 'create-style') {
        const newStyle = createGradientStyle('Gradient name', {
            gradientStops: msg.gradientStops,
            gradientTransform: msg.gradientTransform,
        });

        figma.currentPage.selection.map((node) => {
            if (node && isGradientCompatible(node)) {
                node.fillStyleId = newStyle.id;
            }
        });

        const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());
        //Gradient styles change event
        figma.ui.postMessage({
            type: 'figma:styles:gradientschange',
            message: {paintStyles: gradientPaintStyles},
        });

        figma.notify('New gradient style created', {timeout: msg.timeout || 1000});
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

figma.on('run', ({command, parameters}) => {
    //Load preferences
    const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());

    figma.clientStorage.getAsync('preferences').then((preferences) => {
        figma.ui.postMessage({
            type: 'figma:preferencesupdate',
            message: {preferences: JSON.parse(preferences) || defaultPreferences},
        });
    });

    //Update selection event
    updateSelection();

    //Gradient styles change event
    figma.ui.postMessage({
        type: 'figma:styles:gradientschange',
        message: {paintStyles: gradientPaintStyles},
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
