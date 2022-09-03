import {GradientPaintType, Preferences} from '../typings';
import {rotateTransform} from './matrix';

//Styles pooling timeout
export const DEFAULT_POOLING_TIMEOUT = 1000 * 2; //N second

//Window
export const DEFAULT_WINDOW_SIZE = {
    width: 240,
    height: 464,
};

//Preferences
export const DEFAULT_PREFERENCES: Preferences = {liveUpdates: true};

//Gradient
export const DEFAULT_AFFINE_TRANSFORMS = {
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
export const GRADIENT_TYPES: GradientPaintType[] = ['GRADIENT_LINEAR', 'GRADIENT_RADIAL', 'GRADIENT_ANGULAR'];
export const DEFAULT_ANGLE = 180;
export const DEFAULT_GRADIENT_STOPS = [
    {position: 0.0, color: {r: +(33 / 255).toFixed(2), g: +(214 / 255).toFixed(2), b: +(204 / 255).toFixed(2), a: 1}},
    {position: 1.0, color: {r: +(126 / 255).toFixed(2), g: +(32 / 255).toFixed(2), b: +(207 / 255).toFixed(2), a: 1}},
];
export const DEFAULT_GRADIENT_TRANSFORM = rotateTransform(DEFAULT_ANGLE);
export const DEFAULT_GRADIENT_PAINT: GradientPaint = {
    gradientTransform: DEFAULT_GRADIENT_TRANSFORM,
    gradientStops: DEFAULT_GRADIENT_STOPS,
    type: GRADIENT_TYPES[0],
};

export const LIGHT_CHECKBOARD_GRADIENT_PROPS = {
    backgroundColor: 'gray.200',
    bgImage:
        'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHBhdGggZmlsbD0iI0YxRjFGMSIgZD0iTSAwIDggSCAxNiBWIDAgSCA4IFYgMTYgSCAwIi8+PC9zdmc+")',
};

export const CHECKBOARD_GRADIENT_PROPS = {
    ...LIGHT_CHECKBOARD_GRADIENT_PROPS,
    _dark: {
        backgroundColor: 'gray.800',
        bgImage:
            'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMkMyQzJDIi8+CjxwYXRoIGQ9Ik0xNiAwSDBWMTZIMTZWMFoiIGZpbGw9IiMyQzJDMkMiLz4KPHBhdGggZD0iTTAgOEgxNlYwSDhWMTZIMCIgZmlsbD0iIzQwM0YzRiIvPgo8L3N2Zz4K")',
    },
};

//GradientStops
const STOP_WIDTH = 18;
export const HALF_STOP_WIDTH = STOP_WIDTH / 2;
export const DEFAULT_STOP_REMOVAL_DROP = 32;
export const DEFAULT_PALETTE_WIDTH = 186;
export const DEFAULT_PALETTE_HEIGHT = 4; //Chakra size
export const DEFAULT_MAX_STOPS = 6;
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

//Figma
export const DEFAULT_FIGMA_NOTIFICATION_TIMEOUT = 2000;

//Debounce options
export const DEFAULT_FAST_DEBOUNCE_TIMEOUT = 50;
export const DEFAULT_DEBOUNCE_TIMEOUT = 100;
export const DEFAULT_SLOW_DEBOUNCE_TIMEOUT = 250;
