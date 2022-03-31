import {GradientStops, Preferences} from '../typings';
import {anglesTransform} from './angles';

const defaultAngle = 180;
const defaultGradientStops = [
    {position: 0.0, color: {r: 238 / 255, g: 241 / 255, b: 11 / 255, a: 1}},
    {position: 0.5, color: {r: 215 / 255, g: 128 / 255, b: 37 / 255, a: 1}},
    {position: 1.0, color: {r: 126 / 255, g: 32 / 255, b: 207 / 255, a: 1}},
];
const defaultGradientTransform = anglesTransform[defaultAngle] as Transform;

const defaultPreferences: Preferences = {liveUpdates: true, updateStyles: true};

const checkredGradient = {
    backgroundColor: 'gray.200',
    bgGradient:
        'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0px 0px, 10px 10px',
};

const isGradientCompatible = (node: SceneNode): boolean =>
    node.type == 'RECTANGLE' ||
    node.type == 'ELLIPSE' ||
    node.type == 'POLYGON' ||
    node.type == 'VECTOR' ||
    node.type == 'FRAME' ||
    node.type == 'STAR';

const getGradientsFromStyles = (paintStyles: PaintStyle[]): PaintStyle[] => {
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

export {
    defaultAngle,
    defaultGradientStops,
    defaultGradientTransform,
    defaultPreferences,
    checkredGradient,
    isGradientCompatible,
    getGradientsFromStyles,
    createGradientStyle,
};
