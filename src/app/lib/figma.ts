import {getGradientsFromStyles, isGradientCompatible} from './utils';

const updateSelection = () => {
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const gradientNodes = figma.currentPage.selection.map((node: RectangleNode) => {
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
    } else {
        figma.ui.postMessage({
            type: 'figma:selectionchange',
            message: {selection: figma.currentPage.selection},
        });
    }
};

const updatedGradientStyles = (postMessage = true): PaintStyle[] => {
    const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());
    //Gradient styles change event
    postMessage &&
        figma.ui.postMessage({
            type: 'figma:styles:gradientschange',
            message: {paintStyles: gradientPaintStyles},
        });

    return gradientPaintStyles;
};

export {updateSelection, updatedGradientStyles};
