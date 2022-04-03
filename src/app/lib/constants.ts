import {Preferences} from '../typings';

export const poolingTimeout = 1000 * 3; //10 second

export const defaultWindowSize = {
    width: 240,
    height: 375,
};

export const defaultPreferences: Preferences = {liveUpdates: true, updateStyles: true};

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
        [1, 0, 0],
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
export const defaultAngle = 180;
export const defaultGradientStops = [
    {position: 0.0, color: {r: 238 / 255, g: 241 / 255, b: 11 / 255, a: 1}},
    {position: 0.5, color: {r: 215 / 255, g: 128 / 255, b: 37 / 255, a: 1}},
    {position: 1.0, color: {r: 126 / 255, g: 32 / 255, b: 207 / 255, a: 1}},
];
export const defaultGradientTransform = anglesTransform[defaultAngle] as Transform;

export const checkredGradientProps = {
    backgroundColor: 'gray.200',
    bgGradient:
        'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0px 0px, 10px 10px',
};
