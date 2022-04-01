import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {Tooltip, Radio, Center, RadioProps, Box, useMultiStyleConfig} from '@chakra-ui/react';
import {bgGradientColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../../lib/colors';

type Props = {
    paintStyle?: PaintStyle;
    defaultPaint?: GradientPaint;
    onSelect?: (paintStyle: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const GradientSwatch: React.FC<Props> = ({paintStyle, defaultPaint, onSelect, ...rest}) => {
    const angle = 180;
    const paint = defaultPaint ? defaultPaint : (paintStyle.paints[0] as GradientPaint);

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
            <Tooltip label={paintStyle.name} openDelay={300} isDisabled={!paintStyle.id}>
                <Center>
                    {/*DON'T remove wrapper, tooltips will not work properly without  */}
                    <Radio
                        bgGradient={bgGradient}
                        value={paintStyle.id}
                        name={paintStyle.name}
                        id={paintStyle.id}
                        variant="swatch"
                        onClick={onSelectStyle}
                        {...rest}
                        _checked={{
                            bgGradient: bgGradient,
                            border: '2px solid',
                            borderColor: 'gray.300',
                            shadow: 'outline',
                        }}
                    />
                </Center>
            </Tooltip>
        </Box>
    );
};

export default GradientSwatch;
