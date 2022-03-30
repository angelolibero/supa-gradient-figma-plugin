import {anglesTransform} from '../app/lib/angles';
import {paletteToGradientStops} from '../app/lib/colors';
import {isGradientCompatible} from '../app/lib/utils';

figma.showUI(__html__);
figma.ui.resize(300, 350);

figma.ui.onmessage = (msg) => {
    if (msg.type === 'apply-gradient') {
        const angle = msg.angle;
        const gradientStops = paletteToGradientStops(msg.palette);
        figma.currentPage.selection.forEach((node) => {
            if (isGradientCompatible(node) && node) {
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
    if (msg.type === 'close-plugin') {
        figma.closePlugin();
    }

    // if (msg.type === 'log-gradient') {
    //     if (figma.currentPage.selection && figma.currentPage.selection[0]) {
    //         console.log(figma.currentPage.selection[0]);
    //     }
    // }
};

figma.on('selectionchange', () => {
    console.log('Change');
    figma.ui.postMessage({
        type: 'figma:selectionchange',
        message: {selection: figma.currentPage.selection},
    });
});

figma.on('run', ({command, parameters}) => {
    //RunEvent
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const gradientNodes = figma.currentPage.selection.map((node) => {
            if (isGradientCompatible(node) && node) {
                return {id: node.id, fills: node.fills};
            }
        });

        figma.ui.postMessage({
            type: 'figma:selectionchange',
            message: {selection: figma.currentPage.selection, fills: gradientNodes[0].fills},
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
