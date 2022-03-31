import {rgba} from 'style-value-types';
import {GradientStops, Palette} from '../typings';
import {anglesTransform} from './angles';

const hexRegex = /^#([0-9a-f]{3}){1,2}$/i;
const rgbRegex =
    /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/i;
const rgbaRegex =
    /^rgba[(](?: \s * 0 * (?: \d\d ? (?: \.\d +) ? (?: \s*%)?|\.\d +\s *%| 100(?: \.0 *) ?\s *%| (?: 1\d\d | 2[0 - 4]\d | 25[0 - 5]) (?: \.\d +)?) \s *,) { 3 } \s * 0 * (?: \.\d +| 1(?: \.0 *) ?) \s * [)]$/i;

const isHex = (color: string) => {
    return hexRegex.test(color);
};

const hexToRgb = (hex: string, alpha?: boolean) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return !alpha
            ? 'rgb(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ')'
            : 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
};

const hexToRGBAObject = (hex: string, alpha?: boolean) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return !alpha && {r: (c >> 16) & 255, g: (c >> 8) & 255, b: c & 255, a: 1};
    }
    throw new Error('Bad Hex');
};

const paletteToRgbArray = (palette: Palette, alpha?: boolean) => {
    return (
        palette &&
        palette.map((value) =>
            isHex(value.color) ? hexToRgb(value.color, alpha).match(/\d+/g) : value.color.match(/\d+/g)
        )
    );
};

const paletteToGradientStops = (palette: Palette, alpha: boolean = false) => {
    let rgbArray = paletteToRgbArray(palette, alpha);
    let rgbaObjects =
        rgbArray &&
        rgbArray.map((value, index) => {
            let r = parseFloat(new Number(value[0]).toFixed(2)) / 255;
            let g = parseFloat(new Number(value[1]).toFixed(2)) / 255;
            let b = parseFloat(new Number(value[2]).toFixed(2)) / 255;
            let a = value[3] && alpha ? parseFloat(new Number(value[3]).toFixed(2)) : 1;
            return {
                position: parseFloat(new Number(palette[index].offset).toFixed(2)),
                color: {
                    r,
                    g,
                    b,
                    a,
                },
            };
        });
    return rgbaObjects;
};

const paletteFromGradientStops = (gradientStops: GradientStops, alpha: boolean = true) => {
    let palette = !gradientStops
        ? undefined
        : gradientStops.map((value, index) => {
              return {
                  offset: parseFloat(new Number(value.position).toFixed(2)),
                  color: !alpha
                      ? `rgb(${(value.color.r * 255).toFixed(0)}, ${(value.color.g * 255).toFixed(0)}, ${(
                            value.color.b * 255
                        ).toFixed(0)})`
                      : `rgba(${(value.color.r * 255).toFixed(0)}, ${(value.color.g * 255).toFixed(0)}, ${(
                            value.color.b * 255
                        ).toFixed(0)}, ${value.a || 1})`,
              };
          });
    return palette;
};

const gradientAngleFromTransform = (transform: any) => {
    for (let key in anglesTransform) {
        let angleTransform = anglesTransform[key];
        if (JSON.stringify(angleTransform) == JSON.stringify(transform)) {
            return parseInt(key);
        }
    }
    return 0;
};

const bgGradientColorsFromStops = (gradientStops: GradientStops) => {
    if (gradientStops && gradientStops.length) {
        return gradientStops.map((value, index) => {
            return `rgba(${value.color.r * 255},${value.color.g * 255},${value.color.b * 255},${value.color.a}) ${
                parseFloat(new Number(value.position).toFixed(2)) * 100
            }%`;
        });
    }
    return [];
};

const bgGradientFromColors = (gradientColors, angle = 0) => {
    //AGGIUNGERE GESTIONE GRADIENTI MULTIPLI
    return `linear(${angle}deg, ${gradientColors})`;
};

const colorStringToRGBAObject = (color) => {
    return color.match(/\d+/g);
};

export {
    hexToRgb,
    hexToRGBAObject,
    paletteToGradientStops,
    paletteFromGradientStops,
    gradientAngleFromTransform,
    bgGradientColorsFromStops,
    bgGradientFromColors,
    colorStringToRGBAObject,
    isHex,
    hexRegex,
    rgbRegex,
    rgbaRegex,
};
