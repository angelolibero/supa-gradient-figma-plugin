import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {Tooltip, Radio, Center, RadioProps, Box, useRadio} from '@chakra-ui/react';
import {bgGradientColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../../lib/colors';
import {defaultAngle} from '../../lib/constants';

type Props = {
    paintStyle?: PaintStyle;
    defaultPaint?: GradientPaint;
    isActive?: boolean;
    onSelect?: (paintStyle: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const GradientSwatch: React.FC<Props> = ({paintStyle, defaultPaint, isActive, size, onSelect, ...rest}) => {
    const angle = defaultAngle;
    const paint = defaultPaint ? defaultPaint : (paintStyle.paints[0] as GradientPaint);
    const {getInputProps, getCheckboxProps} = useRadio({value: paintStyle.id, name: paintStyle.id, ...rest});
    const input = getInputProps();
    const checkbox = getCheckboxProps();

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

    const onPressEnter = useCallback(
        (e) => {
            console.log('ket', e.keyCode);
            //enter and space key code:
            if (e.key === 'Enter' || e.keyCode === 13 || e.keyCode === 32) {
                onSelectStyle();
            }
        },
        [onSelectStyle]
    );

    return (
        <Box>
            <Tooltip label={paintStyle.name} openDelay={300} isDisabled={!paintStyle.id}>
                <Center>
                    <Box as="label">
                        <input {...input} onKeyDown={onPressEnter} />
                        <Box
                            {...checkbox}
                            bgGradient={bgGradient}
                            boxSize={size == 'lg' ? 10 : 7}
                            shadow="sm"
                            rounded="full"
                            outline="none"
                            border="2px solid"
                            borderColor="white"
                            p={0}
                            cursor="pointer"
                            _focus={{
                                boxShadow: 'outline',
                            }}
                            onClick={onSelectStyle}
                        />
                    </Box>
                </Center>
            </Tooltip>
        </Box>
    );
};

export default GradientSwatch;
