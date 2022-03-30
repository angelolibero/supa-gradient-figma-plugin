import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {BoxProps, Circle} from '@chakra-ui/react';
import {bgGradientColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../lib/colors';
import {GradientStops} from '../typings';

type Props = {
    paintStyle: PaintStyle;
    onSelect?: (angle) => void;
} & BoxProps;

const GradientSwatch: React.FC<Props> = ({paintStyle, onSelect, ...rest}) => {
    const angle = 180;
    const paint = paintStyle.paints[0] as GradientPaint;
    const bgGradientColors = useMemo(() => {
        if (paintStyle.paints[0].type == 'GRADIENT_LINEAR') {
            return bgGradientColorsFromStops(paint.gradientStops);
        }
    }, [paintStyle]);

    const bgGradient = useMemo(() => {
        return bgGradientFromColors(bgGradientColors, gradientAngleFromTransform(paint.gradientTransform));
    }, [angle, paintStyle, bgGradientColors]);

    return <Circle bgGradient={bgGradient} border="1px solid #000" size={5} {...rest}></Circle>;
};

export default GradientSwatch;
