import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {Tooltip, Radio, Center, RadioProps, Box, useRadio} from '@chakra-ui/react';
import {bgGradientColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../../lib/colors';
import {checkredGradientProps, defaultAngle} from '../../lib/constants';
import {MdRefresh} from 'react-icons/md';
import {GradientPaintType} from '../../typings';

type Props = {
    paintStyle?: PaintStyle;
    defaultPaint?: GradientPaint;
    isActive?: boolean;
    showReset?: boolean;
    onSelect?: (paintStyle: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const GradientSwatch: React.FC<Props> = ({paintStyle, defaultPaint, isActive, showReset, size, onSelect, ...rest}) => {
    // const angle = defaultAngle;

    const {getInputProps, getCheckboxProps} = useRadio({
        value: paintStyle ? paintStyle.id : 'custom',
        name: paintStyle && paintStyle.name,
        ...rest,
    });
    const input = getInputProps();
    const checkbox = getCheckboxProps();

    const currentPaint = useMemo(() => {
        return defaultPaint ? defaultPaint : paintStyle && (paintStyle.paints[0] as GradientPaint);
    }, [defaultPaint, paintStyle]);

    const bgGradient = useMemo(() => {
        const bgGradientColors = bgGradientColorsFromStops(currentPaint.gradientStops);
        const angle = gradientAngleFromTransform(currentPaint.gradientTransform);
        return bgGradientFromColors(bgGradientColors, angle, currentPaint.type);
    }, [currentPaint]);

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
            <Tooltip
                label={paintStyle && paintStyle.name}
                openDelay={300}
                isDisabled={!paintStyle || !(paintStyle && paintStyle.id)}
            >
                <Center>
                    <Box as="label" {...checkredGradientProps} rounded="full" pos="relative">
                        <input {...input} onKeyDown={onPressEnter} />
                        <Box
                            bgGradient={bgGradient}
                            boxSize={size == 'lg' ? 10 : 6}
                            shadow={isActive ? 'outline' : 'sm'}
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
                            {...rest}
                            {...checkbox}
                        />
                        {/* // show reset original style  */}
                        {/* {isActive ? 'si' : 'no'} */}
                        {showReset && (
                            <Center
                                boxSize={3}
                                pos="absolute"
                                right="-3px"
                                top={-1}
                                rounded="full"
                                border="2px solid"
                                borderColor="white"
                                shadow="sm"
                                fontSize="md"
                                overflow="hidden"
                                pointerEvents="none"
                                bgColor="white"
                            >
                                <MdRefresh />
                            </Center>
                        )}
                    </Box>
                </Center>
            </Tooltip>
        </Box>
    );
};

export default GradientSwatch;
