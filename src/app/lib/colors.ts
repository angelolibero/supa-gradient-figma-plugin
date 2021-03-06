import {GradientPaintType, GradientStops, Palette} from '../typings';

const hexRegex = /^#([0-9a-f]{3}){1,2}$/i;
const hexWithoutRegex = /^([0-9a-f]{3}){1,2}$/i;
const rgbRegex =
    /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/i;
const rgbaRegex =
    /^rgba[(](?: \s * 0 * (?: \d\d ? (?: \.\d +) ? (?: \s*%)?|\.\d +\s *%| 100(?: \.0 *) ?\s *%| (?: 1\d\d | 2[0 - 4]\d | 25[0 - 5]) (?: \.\d +)?) \s *,) { 3 } \s * 0 * (?: \.\d +| 1(?: \.0 *) ?) \s * [)]$/i;

const alphanumericRegex = /[^a-z0-9]/gi;
const numericRegex = /[^0-9]/gi;

const checkIsHex = (color: string, withoutHash = false) => {
    return !withoutHash ? hexRegex.test(color) : hexWithoutRegex.test(color);
};

const checkIsGradient = (paint: Paint | GradientPaint) => {
    const gradientPaint = paint as GradientPaint;
    return !!(gradientPaint.gradientStops && gradientPaint.gradientTransform);
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
    if (hexRegex.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return !alpha && {r: (c >> 16) & 255, g: (c >> 8) & 255, b: c & 255, a: 1};
    }
    throw new Error('Bad Hex');
};

const RGBAObjetToString = (color: RGBA) => {
    return `rgba(${parseInt((color.r * 255).toString())}, ${parseInt((color.g * 255).toString())}, ${parseInt(
        (color.b * 255).toString()
    )}, ${color.a})`;
};

const paletteToRgbArray = (palette: Palette) => {
    return palette && palette.map((value) => RGBAObjetToString(value.color));
};

const paletteToGradientStops = (palette: Palette, alpha: boolean = false) => {
    let rgbArray = paletteToRgbArray(palette);
    let rgbaObjects =
        rgbArray &&
        rgbArray.map((value, index) => {
            let r = parseFloat(new Number(value[0]).toFixed(2)) / 255;
            let g = parseFloat(new Number(value[1]).toFixed(2)) / 255;
            let b = parseFloat(new Number(value[2]).toFixed(2)) / 255;
            let a = value[3] && alpha ? parseFloat(new Number(value[3]).toFixed(2)) : 1;
            return {
                position: parseFloat(new Number(palette[index].position).toFixed(2)),
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
        : gradientStops.map((value) => {
              return {
                  position: parseFloat(new Number(value.position).toFixed(2)),
                  color: !alpha
                      ? `rgb(${(value.color.r * 255).toFixed(0)}, ${(value.color.g * 255).toFixed(0)}, ${(
                            value.color.b * 255
                        ).toFixed(0)})`
                      : `rgba(${(value.color.r * 255).toFixed(0)}, ${(value.color.g * 255).toFixed(0)}, ${(
                            value.color.b * 255
                        ).toFixed(0)}, ${value.color.a || 1})`,
              };
          });
    return palette;
};

const bgColorsFromStops = (gradientStops: GradientStops) => {
    if (gradientStops && gradientStops.length) {
        return gradientStops.map((value) => {
            return `rgba(${parseInt('' + value.color.r * 255)},${parseInt('' + value.color.g * 255)},${parseInt(
                '' + value.color.b * 255
            )},${value.color.a.toFixed(2)}) ${parseFloat('' + value.position * 100).toFixed(0)}%`;
        });
    }
    return [];
};

const bgGradientFromColors = (gradientColors, angle = 0, type: GradientPaintType = 'GRADIENT_LINEAR') => {
    let gradientTypeMethod;
    switch (type) {
        case 'GRADIENT_LINEAR':
            gradientTypeMethod = 'linear-gradient';
            return `${gradientTypeMethod}(${angle}deg, ${gradientColors})`;
        case 'GRADIENT_ANGULAR':
            gradientTypeMethod = 'conic-gradient';
            return `${gradientTypeMethod}(from ${angle}deg, ${gradientColors})`;
        case 'GRADIENT_RADIAL':
            gradientTypeMethod = 'radial-gradient';
            return `${gradientTypeMethod}(${gradientColors})`;
        case 'GRADIENT_DIAMOND':
            gradientTypeMethod = 'radial-gradient';
            break;
    }

    //AGGIUNGERE GESTIONE GRADIENTI MULTIPLI
};

const colorStringToRGBAArray = (color) => {
    return color.match(/\d+/g);
};

export {
    checkIsHex,
    checkIsGradient,
    hexToRgb,
    hexToRGBAObject,
    RGBAObjetToString,
    paletteToGradientStops,
    paletteFromGradientStops,
    // gradientAngleFromTransform,
    //gradientAngleToTransform,
    bgColorsFromStops,
    bgGradientFromColors,
    colorStringToRGBAArray,
    hexRegex,
    rgbRegex,
    rgbaRegex,
    alphanumericRegex,
    numericRegex,
};
