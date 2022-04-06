import {Preferences} from '../typings';

//Styles pooling timeout
export const DEFAULT_POOLING_TIMEOUT = 1000 * 3; //10 second

//Window
export const DEFAULT_WINDOW_SIZE = {
    width: 240,
    height: 429,
};

//Preferences
export const DEFAULT_PREFERENCES: Preferences = {liveUpdates: true, updateStyles: true};

//Gradient
export const LINEAR_TRANFORMS = {
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
export const DEFAULT_ANGLE = 180;
export const DEFAULT_GRADIENT_STOPS = [
    {position: 0.0, color: {r: 238 / 255, g: 241 / 255, b: 11 / 255, a: 1}},
    {position: 0.5, color: {r: 215 / 255, g: 128 / 255, b: 37 / 255, a: 1}},
    {position: 1.0, color: {r: 126 / 255, g: 32 / 255, b: 207 / 255, a: 1}},
];
export const DEFAULT_GRADIENT_TRANSFORM = LINEAR_TRANFORMS[DEFAULT_ANGLE] as Transform;
export const CHECKERED_GRADIENT_PROPS = {
    backgroundColor: 'gray.200',
    bgGradient:
        'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0px 0px, 10px 10px',
};

//GradientStops
const STOP_WIDTH = 18;
export const HALF_STOP_WIDTH = STOP_WIDTH / 2;
export const DEFAULT_STOP_REMOVAL_DROP = 50;
export const DEFAULT_WIDTH = 221;
export const DEFAULT_HEIGHT = 6; //Chakra size
export const DEFAULT_MAX_STOPS = 5;
export const DEFAULT_MIN_STOPS = 2;

//Colors
export const COLORS = [
    {value: '#000000', name: 'black'},
    {value: '#808080', name: 'gray'},
    {value: '#C0C0C0', name: 'silver'},
    {value: '#FFFFFF', name: 'white'},
    {value: '#FF0000', name: 'red'},
    {value: '#800000', name: 'maroon'},
    {value: '#FFFF00', name: 'yellow'},
    {value: '#808000', name: 'olive'},
    {value: '#00FF00', name: 'lime'},
    {value: '#008000', name: 'green'},
    {value: '#00FFFF', name: 'aqua'},
    {value: '#008080', name: 'teal'},
    {value: '#0000FF', name: 'blue'},
    {value: '#000080', name: 'navy'},
    {value: '#FF00FF', name: 'fuchsia'},
    {value: '#800080', name: 'purple'},
];

/**
 * The drag supported events
 * Object<String>
 */
export const EVENTS = {
    MOUSEDOWN: 'mousedown',
    MOUSEMOVE: 'mousemove',
    MOUSEUP: 'mouseup',
    TOUCHSTART: 'touchstart',
    TOUCHMOVE: 'touchmove',
    TOUCHEND: 'touchend',
};
