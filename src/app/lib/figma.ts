import {getGradientsFromStyles, isGradientCompatible} from './utils';

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
            console.log('FILLS', gradientNodes);
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
    //Gradient styles change event
    postMessage &&
        figma.ui.postMessage({
            type: 'figma:styles:gradientschange',
            message: {paintStyles: gradientPaintStyles},
        });

    return gradientPaintStyles;
};

export {updateSelection, updateGradientStyles};
