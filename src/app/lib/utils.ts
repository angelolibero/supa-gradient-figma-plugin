import {GradientPaintType, GradientStops, Preferences} from '../typings';
import {LINEAR_TRANFORMS} from './constants';

const isGradientCompatible = (node: SceneNode): boolean =>
    node.type == 'RECTANGLE' ||
    node.type == 'ELLIPSE' ||
    node.type == 'POLYGON' ||
    node.type == 'VECTOR' ||
    node.type == 'FRAME' ||
    node.type == 'STAR';

const getGradientsFromStyles = (paintStyles: PaintStyle[]): any => {
    return paintStyles
        .map((style) => {
            let stylePaints: GradientPaint[] = [];
            style.paints.forEach((paint) => {
                if (
                    paint.type == 'GRADIENT_LINEAR' ||
                    paint.type == 'GRADIENT_RADIAL' ||
                    paint.type == 'GRADIENT_ANGULAR' ||
                    paint.type == 'GRADIENT_DIAMOND'
                ) {
                    stylePaints.push({
                        ...paint,
                        gradientStops: paint.gradientStops,
                        gradientTransform: paint.gradientTransform,
                    });
                }
            });
            if (stylePaints.length) return {id: style.id, name: style.name, paints: stylePaints};
        })
        .filter((value) => !!value);
};

const createGradientStyle = (colorName: string, gradient: GradientPaint) => {
    const style = figma.createPaintStyle();
    style.name = colorName;
    style.paints = [
        {
            ...gradient,
        },
    ];
    return style;
};

export {isGradientCompatible, getGradientsFromStyles, createGradientStyle};
