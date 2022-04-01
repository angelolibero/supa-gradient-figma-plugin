import {getGradientsFromStyles, isGradientCompatible} from './utils';
import {defaultWindowSize} from './constants';

const getGradientNode = (node: SceneNode): RectangleNode | undefined => {
    if (node && isGradientCompatible(node)) {
        const gradientNode = node as RectangleNode;
        return {id: node.id, fills: gradientNode.fills, fillStyleId: gradientNode.fillStyleId} as RectangleNode;
    }
};

const updateSelection = () => {
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const gradientNodes = figma.currentPage.selection.map(getGradientNode);
        if (gradientNodes && gradientNodes.length > 0 && gradientNodes[0]) {
            figma.ui.postMessage({
                type: 'figma:selectionchange',
                message: {selection: figma.currentPage.selection, fills: JSON.stringify(gradientNodes[0].fills)},
            });
        }
    } else {
        figma.ui.postMessage({
            type: 'figma:selectionchange',
            message: {selection: figma.currentPage.selection},
        });
    }
};

const updateGradientStyles = (postMessage = true): PaintStyle[] => {
    const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());

    console.log('gradientPaintStyles', gradientPaintStyles);

    if (gradientPaintStyles && gradientPaintStyles.length > 11) {
        figma.ui.resize(defaultWindowSize.width, 415);
    } else if (gradientPaintStyles && gradientPaintStyles.length > 5) {
        figma.ui.resize(defaultWindowSize.width, 407);
    } else {
        figma.ui.resize(defaultWindowSize.width, defaultWindowSize.height);
    }

    //Gradient styles change event
    postMessage &&
        figma.ui.postMessage({
            type: 'figma:styles:gradientschange',
            message: {paintStyles: gradientPaintStyles},
        });

    return gradientPaintStyles;
};

const selectPaintStyle = (paintStyle: PaintStyle) => {
    figma.ui.postMessage({
        type: 'figma:selectstyle',
        message: {paintStyle: JSON.stringify(paintStyle)},
    });
};

export {updateSelection, updateGradientStyles, selectPaintStyle};
