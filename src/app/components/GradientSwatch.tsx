import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {Tooltip, Radio, Center, RadioProps, Box} from '@chakra-ui/react';
import {bgGradientColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../lib/colors';

type Props = {
    paintStyle: PaintStyle;
    onSelect?: (paintStyle: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

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

    const onSelectStyle = useCallback(() => {
        onSelect(paintStyle);
    }, [paintStyle, onSelect]);

    return (
        <Box>
            <Tooltip label={paintStyle.name}>
                <Center>
                    {/*DON'T remove wrapper, tooltips will not work properly without  */}
                    <Radio
                        bgGradient={bgGradient}
                        value={paintStyle.id}
                        onClick={onSelectStyle}
                        name={paintStyle.name}
                        id={paintStyle.id}
                        variant="swatch"
                        {...rest}
                        _checked={{
                            bgGradient: bgGradient,
                            border: '2px solid',
                            borderColor: 'white',
                            shadow: 'outline',
                            boxSize: 7,
                        }}
                    />
                </Center>
            </Tooltip>
        </Box>
    );
};

export default GradientSwatch;
