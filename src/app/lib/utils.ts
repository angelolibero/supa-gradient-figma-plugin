import {GRADIENT_TYPES} from './constants';

const isNodeGradientCompatible = (node: SceneNode): boolean =>
    node.type == 'RECTANGLE' ||
    node.type == 'ELLIPSE' ||
    node.type == 'POLYGON' ||
    node.type == 'VECTOR' ||
    node.type == 'FRAME' ||
    node.type == 'STAR' ||
    node.type == 'TEXT' ||
    node.type == 'COMPONENT' ||
    node.type == 'INSTANCE';

const isGradientPaint = (paint: GradientPaint): boolean => (GRADIENT_TYPES.indexOf(paint.type) >= 0 ? true : false);
const isSolidPaint = (paint: Paint): boolean => paint.type == 'SOLID';

const mapPaintStyles = (paintStyles: PaintStyle[]): {gradients: any[]; solid: any[]} => {
    let styles: {gradients: any[]; solid: any[]} = {
        gradients: [],
        solid: [],
    };

    paintStyles.forEach((style: PaintStyle) => {
        const gradientPaints: GradientPaint[] = [];
        const solidPaints: Paint[] = [];
        style.paints.forEach((paint: Paint) => {
            const gradientPaint = paint as GradientPaint;
            if (isGradientPaint(gradientPaint)) {
                gradientPaints.push({
                    ...gradientPaint,
                    gradientStops: gradientPaint.gradientStops,
                    gradientTransform: gradientPaint.gradientTransform,
                });
            } else if (isSolidPaint(paint)) {
                solidPaints.push(paint);
            }
        });
        gradientPaints.length &&
            styles.gradients.push({id: style.id, name: style.name, type: style.type, paints: gradientPaints});
        solidPaints.length &&
            solidPaints.length == style.paints.length &&
            styles.solid.push({
                id: style.id,
                name: style.name,
                type: style.type,
                paints: [...solidPaints],
            });
    });

    return styles;
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

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);

export {isNodeGradientCompatible, mapPaintStyles, createGradientStyle, groupBy};
