export const anglesTransform = {
    //Affine tranformations for common angles
    // custom: [
    //     [Math.cos(angle), Math.sin(angle), 0],
    //     [-Math.sin(angle), Math.cos(angle), 0],
    // ],
    '0': [
        [0, -1, 1],
        [1, 0, 0.5],
    ],
    '45': [
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0],
    ],
    '90': [
        [1, 2.0816681711721685e-17, 0],
        [0, 1, 0.5],
    ],
    '135': [
        [0.5, 0.5, 0],
        [-0.5, 0.5, 0.5],
    ],
    '180': [
        [0, 1, 0],
        [-1, 0, 1.5],
    ],
    '225': [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 1],
    ],
    '270': [
        [-1, 0, 1],
        [0, -1, 1.5],
    ],
    '315': [
        [-0.5, -0.5, 1],
        [0.5, -0.5, 0.5],
    ],
    '360': [
        [0, -1, 1],
        [1, 0, 0.5],
    ],
};
