import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {Tooltip, Radio, Center, RadioProps, Box, useRadio} from '@chakra-ui/react';
import {bgColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../../../lib/colors';
import {CHECKERED_GRADIENT_PROPS, DEFAULT_ANGLE} from '../../../lib/constants';
import {MdRefresh} from 'react-icons/md';
import {GradientPaintType} from '../../../typings';

type Props = {
    paintStyle?: PaintStyle;
    defaultPaint?: GradientPaint;
    isActive?: boolean;
    showReset?: boolean;
    onSelect?: (paintStyle: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const GradientSwatch: React.FC<Props> = ({paintStyle, defaultPaint, isActive, showReset, size, onSelect, ...rest}) => {
    // const angle = DEFAULT_ANGLE;

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
        const bgGradientColors = bgColorsFromStops(currentPaint.gradientStops);
        const angle = gradientAngleFromTransform(currentPaint.gradientTransform);
        return bgGradientFromColors(bgGradientColors, angle, currentPaint.type);
    }, [currentPaint]);

    const handleSelectStyle = useCallback(() => {
        onSelect && onSelect(paintStyle);
    }, [paintStyle, onSelect]);

    const onPressEnter = useCallback(
        (e) => {
            console.log('ket', e.keyCode);
            //enter and space key code:
            if (e.key === 'Enter' || e.keyCode === 13 || e.keyCode === 32) {
                handleSelectStyle();
            }
        },
        [handleSelectStyle]
    );

    return (
        <Box>
            <Tooltip
                label={paintStyle && paintStyle.name}
                openDelay={300}
                isDisabled={!paintStyle || !(paintStyle && paintStyle.id)}
            >
                <Center>
                    <Box
                        as="label"
                        {...CHECKERED_GRADIENT_PROPS}
                        {...CHECKERED_GRADIENT_PROPS}
                        bgSize="10px 10px"
                        bgPos="0px 0px, 5px 5px"
                        rounded="full"
                        pos="relative"
                    >
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
                            onClick={handleSelectStyle}
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
