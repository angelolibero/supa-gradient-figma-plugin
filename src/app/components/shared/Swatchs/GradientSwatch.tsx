import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {Tooltip, Center, RadioProps, Box, useRadio} from '@chakra-ui/react';
import {bgColorsFromStops, bgGradientFromColors} from '../../../lib/colors';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
//import {MdRefresh} from 'react-icons/md';
import {degreesFromTransform} from '../../../lib/matrix';

type Props = {
    paintStyle?: PaintStyle;
    defaultPaint?: GradientPaint;
    isActive?: boolean;
    // showReset?: boolean;
    onSelect?: (paintStyle: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const GradientSwatch: React.FC<Props> = ({paintStyle, defaultPaint, isActive, size, onSelect, ...rest}) => {
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
        const angle = degreesFromTransform(currentPaint.gradientTransform);
        return bgGradientFromColors(bgGradientColors, angle, currentPaint.type);
    }, [currentPaint]);

    const handleSelectStyle = useCallback(() => {
        paintStyle && console.log('handleSelectStyle', paintStyle.paints[0]);
        onSelect && onSelect(paintStyle);
    }, [paintStyle, onSelect]);

    const onPressEnter = useCallback(
        (e) => {
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
                offset={[0, -1]}
            >
                <Center>
                    <Box
                        as="label"
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
                            border={size == 'lg' ? '4px solid' : '2px solid'}
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
                        {/* {showReset && (
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
                        )} */}
                    </Box>
                </Center>
            </Tooltip>
        </Box>
    );
};

export default GradientSwatch;
