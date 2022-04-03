import {getGradientsFromStyles, isGradientCompatible} from './utils';
import {defaultWindowSize} from './constants';

const filterGradientCompatibleNodes = (selection: any[]) => {
    console.log('filterGradientCompatibleNodes', selection);

    const gradientCompatibleNodes =
        selection &&
        selection.map((node, index) => {
            if (node && isGradientCompatible(node) && node.fills[0] && node.fills[0].gradientStops) {
                const gradientNode = node;
                console.log('COMPATIBLE', gradientNode, node);
                return {
                    id: node.id,
                    fillStyleId: gradientNode.fillStyleId,
                    fills: gradientNode.fills,
                    type: 'RECTANGLE',
                };
            }
        });

    return gradientCompatibleNodes && gradientCompatibleNodes.filter((value) => !!value);
};

const updateSelection = () => {
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const selection = [...figma.currentPage.selection];
        console.log('SEL', selection);
        const gradientCompatibleNodes = filterGradientCompatibleNodes(selection);
        if (gradientCompatibleNodes && gradientCompatibleNodes.length > 0 && gradientCompatibleNodes[0]) {
            console.log('11111');

            figma.ui.postMessage({
                type: 'figma:selectionchange',
                message: JSON.stringify({
                    selection: gradientCompatibleNodes.length ? gradientCompatibleNodes : [{id: selection[0].id}],
                    selectionFills: gradientCompatibleNodes[0] && gradientCompatibleNodes[0].fills,
                }),
            });
            console.log('11111');
        } else {
            console.log('2222');

            figma.ui.postMessage({
                type: 'figma:selectionchange',
                message: JSON.stringify({
                    selection: [{id: selection[0].id}],
                }),
            });
        }
    } else {
        console.log('333');

        figma.ui.postMessage({
            type: 'figma:selectionchange',
            message: JSON.stringify({
                selection: [],
            }),
        });
    }
};

const updateGradientStyles = (postMessage = true): PaintStyle[] => {
    const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());

    // console.log('update gradientPaintStyles');

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

const selectPaintStyleWithId = (id: string) => {
    const gradientPaintStyles = getGradientsFromStyles(figma.getLocalPaintStyles());
    const selectedPaintStyle = gradientPaintStyles.filter((value) => value.id && value.id == id)[0];

    figma.ui.postMessage({
        type: 'figma:selectstyle',
        message: {paintStyle: selectedPaintStyle},
    });
};

export {filterGradientCompatibleNodes, updateSelection, updateGradientStyles, selectPaintStyleWithId};
