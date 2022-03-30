const isGradientCompatible = (node: SceneNode): boolean => {
    return (
        node.type == 'RECTANGLE' ||
        node.type == 'ELLIPSE' ||
        node.type == 'POLYGON' ||
        node.type == 'VECTOR' ||
        node.type == 'FRAME'
    );
};

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

export {isGradientCompatible, getGradientsFromStyles};
