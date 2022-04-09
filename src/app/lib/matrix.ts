import {decomposeTSR, rotateDEG, scale} from 'transformation-matrix';

export const figmaDegreesOffset = 90;

export const rotateTransform = (degrees: number, degreeOffset: number = figmaDegreesOffset): Transform => {
    //    const matrix = transformToMatrix(transform);
    const rotated = rotateDEG(
        Math.round(degrees <= 360 - degreeOffset ? degreeOffset - degrees : 360 - degrees + degreeOffset),
        0.5,
        0.5
    );
    const transform = [
        [rotated.a, rotated.c, rotated.e],
        [rotated.b, rotated.d, rotated.f],
    ] as Transform;

    const decomposed = decomposeTSR(rotated);
    // console.log('decomposed', decomposed, degreesFromTransform(transform));
    return transform;
};

export const scaleTransform = (scaleX: number, scaleY: number): Transform => {
    const scaled = scale(scaleX, scaleY, 0.5, 0.5);
    const transform = matrixToTransform(scaled);

    const decomposed = decomposeTSR(scaled);
    console.log('Scaled', decomposed, scaleX);
    return transform;
};

export const decomposeTransform = (transform: Transform) => {
    const decomposed = decomposeTSR(transformToMatrix(transform));
    return decomposed;
};

export const degreesFromTransform = (transform: Transform, degreeOffset: number = figmaDegreesOffset): number => {
    const decomposed = decomposeTransform(transform);
    const degrees = decomposed.rotation.angle * (180 / Math.PI);
    console.log('degrees:', degrees, '| offset:', degreeOffset);
    console.log('SSSSSS', degrees + degreeOffset);
    if (degrees == degreeOffset) {
        console.log('SIUUUUU');
        return 360;
    } else if (degrees >= -degreeOffset) {
        return Math.round(degreeOffset + degrees);
    } else return Math.round(360 - (Math.abs(degrees) - degreeOffset));
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

export const matrixToTransform = (matrix: any): Transform => {
    return [
        [matrix.a, matrix.c, matrix.e],
        [matrix.b, matrix.d, matrix.f],
    ];
};
