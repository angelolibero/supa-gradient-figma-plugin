import * as React from 'react';
import {FC, useMemo, useCallback} from 'react';
import {Tooltip, Center, RadioProps, Box, useRadio} from '@chakra-ui/react';
import {bgColorsFromStops, bgGradientFromColors} from '../../../lib/colors';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import {degreesFromTransform} from '../../../lib/matrix';

type Props = {
    style?: PaintStyle;
    defaultPaint?: GradientPaint;
    isActive?: boolean;
    onSelect?: (style: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const GradientSwatch: FC<Props> = ({style, defaultPaint, isActive, size, onSelect, ...rest}) => {
    const {getInputProps, getCheckboxProps} = useRadio({
        value: style ? style.id : 'custom',
        name: style && style.name,
        ...rest,
    });
    const input = getInputProps();
    const checkbox = getCheckboxProps();

    const currentPaint = useMemo(() => {
        return defaultPaint ? defaultPaint : style && (style.paints[0] as GradientPaint);
    }, [defaultPaint, style]);

    const bgGradient = useMemo(() => {
        const bgGradientColors = bgColorsFromStops(currentPaint.gradientStops);
        const angle = degreesFromTransform(currentPaint.gradientTransform);
        return bgGradientFromColors(bgGradientColors, angle, currentPaint.type);
    }, [currentPaint]);

    const handleSelectStyle = useCallback(() => {
        onSelect && onSelect(style);
    }, [style, onSelect]);

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
            <Tooltip label={style && style.name} openDelay={300} isDisabled={!style || !(style && style.id)}>
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
                    </Box>
                </Center>
            </Tooltip>
        </Box>
    );
};

export default GradientSwatch;
