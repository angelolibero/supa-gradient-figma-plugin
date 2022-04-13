import {mapPaintStyles, isNodeGradientCompatible} from './utils';
import {DEFAULT_WINDOW_SIZE} from './constants';

const isExternalStyleId = (styleId: string | PluginAPI['mixed']) => {
    return styleId && (styleId as string).split(',')[1] ? true : false;
};

const filterGradientCompatibleNodes = (selection: any[]) => {
    const gradientCompatibleNodes =
        selection &&
        selection.map((node) => {
            if (node && isNodeGradientCompatible(node) && node.fills[0]) {
                //&& node.fills[0].gradientStops
                const gradientNode = node;
                return {
                    id: node.id,
                    fillStyleId: gradientNode.fillStyleId,
                    fills: gradientNode.fills,
                    type: node.type,
                };
            }
        });

    return gradientCompatibleNodes && gradientCompatibleNodes.filter((value) => !!value);
};

const updateSelection = () => {
    if (figma.currentPage.selection && figma.currentPage.selection.length) {
        const selection = [...figma.currentPage.selection];
        console.log('updateSelection', selection);
        const gradientCompatibleNodes = filterGradientCompatibleNodes(selection);
        if (gradientCompatibleNodes && gradientCompatibleNodes.length > 0 && gradientCompatibleNodes[0]) {
            figma.ui.postMessage({
                type: 'figma:selectionchange',
                message: JSON.stringify({
                    selection: gradientCompatibleNodes.length ? gradientCompatibleNodes : [{id: selection[0].id}],
                    selectionFills: gradientCompatibleNodes[0] && gradientCompatibleNodes[0].fills,
                }),
            });
        } else {
            figma.ui.postMessage({
                type: 'figma:selectionchange',
                message: JSON.stringify({
                    selection: [{id: selection[0].id}],
                }),
            });
        }
    } else {
        figma.ui.postMessage({
            type: 'figma:selectionchange',
            message: JSON.stringify({
                selection: [],
            }),
        });
    }
};

const updatePaintStyles = (postMessage = true): {gradients: any[]; solid: any[]} => {
    const styles = mapPaintStyles(figma.getLocalPaintStyles());
    // if (styles.gradients && styles.gradients.length > 5) {
    figma.ui.resize(DEFAULT_WINDOW_SIZE.width, DEFAULT_WINDOW_SIZE.height);
    // } else {
    //     figma.ui.resize(DEFAULT_WINDOW_SIZE.width, DEFAULT_WINDOW_SIZE.height);
    // }

    //Gradient styles change event
    postMessage &&
        figma.ui.postMessage({
            type: 'figma:styles:gradientschange',
            message: {styles},
        });

    return styles;
};

const selectPaintStyleWithId = (id: string) => {
    const styles = mapPaintStyles(figma.getLocalPaintStyles());
    const selectedPaintStyle = styles.gradients.filter((value) => value.id && value.id == id)[0];

    figma.ui.postMessage({
        type: 'figma:selectstyle',
        message: {paintStyle: selectedPaintStyle},
    });
};

export {isExternalStyleId, filterGradientCompatibleNodes, updateSelection, updatePaintStyles, selectPaintStyleWithId};
