import {GradientStops, Preferences} from '../typings';
import {anglesTransform} from './constants';

const isGradientCompatible = (node: SceneNode): boolean =>
    node.type == 'RECTANGLE' ||
    node.type == 'ELLIPSE' ||
    node.type == 'POLYGON' ||
    node.type == 'VECTOR' ||
    node.type == 'FRAME' ||
    node.type == 'STAR';

const getGradientsFromStyles = (paintStyles: PaintStyle[]) => {
    return paintStyles
        .map((style) => {
            let stylePaints: GradientPaint[] = [];
            style.paints.forEach((paint) => {
                if (paint.type == 'GRADIENT_LINEAR') {
                    stylePaints.push({
                        type: 'GRADIENT_LINEAR',
                        gradientStops: paint.gradientStops,
                        gradientTransform: paint.gradientTransform,
                    });
                }
            });
            if (stylePaints.length) return {id: style.id, name: style.name, paints: stylePaints};
        })
        .filter((value) => !!value);
};

const createGradientStyle = (
    colorName: string,
    gradient: {gradientStops: GradientStops; gradientTransform: Transform}
) => {
    const style = figma.createPaintStyle();
    style.name = colorName;
    style.paints = [
        {
            type: 'GRADIENT_LINEAR',
            ...gradient,
        },
    ];
    return style;
};

export {isGradientCompatible, getGradientsFromStyles, createGradientStyle};
