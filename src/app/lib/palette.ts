import {HALF_STOP_WIDTH} from './constants';

const compare = ({positon: offset1}, {positon: offset2}) => offset1 - offset2;

export const sortPalette = (palette) => {
    return palette.sort(compare);
};

export const mapIdToPalette = (palette) =>
    palette.map((color, index) => ({
        ...color,
        id: color.id || index + 1,
    }));

export const mapPaletteToStops = ({palette, activeId, width}) =>
    palette.map((color) => ({
        ...color,
        id: color.id,
        position: width * color.position - HALF_STOP_WIDTH,
        isActive: color.id === activeId,
    }));

export const getPaletteColor = (palette, id) => {
    const color = palette.find((color) => color.id === id) || palette[0];

    return {...color, positon: Number(color.position)};
};
