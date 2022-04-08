import {decomposeTSR, rotateDEG} from 'transformation-matrix';

export const figmaDegreesOffset = 90;

export const rotateTransform = (degrees: number): Transform => {
    //    const matrix = transformToMatrix(transform);
    const rotated = rotateDEG(figmaDegreesOffset - degrees, 0.5, 0.5);
    const transform = [
        [rotated.a, rotated.c, rotated.e],
        [rotated.b, rotated.d, rotated.f],
    ] as Transform;

    const decomposed = decomposeTSR(rotated);
    console.log('decomposed', decomposed, degreesFromTransform(transform));
    return transform;
};

export const decomposeTransform = (transform: Transform) => {
    const decomposed = decomposeTSR(transformToMatrix(transform));
    return decomposed;
};

export const degreesFromTransform = (transform: Transform): number => {
    const decomposed = decomposeTransform(transform);
    return Math.round(figmaDegreesOffset - decomposed.rotation.angle * (180 / Math.PI));
};

export const transformToMatrix = (transform: Transform) => {
    return {
        a: transform[0][0], //  * @prop {number} a - scale x
        b: transform[0][1], //  * @prop {number} b - skew y
        c: transform[1][0], //  * @prop {number} c - skew x
        d: transform[1][1], //  * @prop {number} d - scale y
        e: transform[0][2], //  * @prop {number} e - translate x
        f: transform[1][2], //  * @prop {number} f - translate y
    };
};
