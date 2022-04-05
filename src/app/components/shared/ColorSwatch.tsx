import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {RadioProps, Box, useRadio, forwardRef} from '@chakra-ui/react';
import {checkredGradientProps} from '../../lib/constants';
import {rgbToHex} from '@ctrl/tinycolor';

export type ColorSwatchProps = {
    color?: RGBA;
    isActive?: boolean;
    showReset?: boolean;
    onSelect?: (paintStyle: RGBA, fillStyleId?: string) => void;
} & Omit<RadioProps, 'onSelect' | 'color'>;

const ColorSwatch = forwardRef<ColorSwatchProps, 'input'>(
    ({color, isActive, showReset, size, onSelect, ...rest}, ref) => {
        const {getInputProps, getCheckboxProps} = useRadio({
            value: JSON.stringify(color),
            ...rest,
        });
        const input = getInputProps({}, ref);
        const checkbox = getCheckboxProps();

        const paintColor = useMemo(() => {
            console.log(color);
            return color && rgbToHex(color.r * 255, color.g * 255, color.b * 255, false);
        }, [color]);

        const handleSelectPaint = useCallback(() => {
            onSelect && onSelect(color);
        }, [color, onSelect]);

        const handleOnKeyDown = useCallback(
            (e) => {
                console.log('ket', e.keyCode);
                //enter and space key code:
                if (e.key === 'Enter' || e.keyCode === 13 || e.keyCode === 32) {
                    handleSelectPaint();
                }
            },
            [handleSelectPaint]
        );

        return (
            <Box
                as="label"
                {...checkredGradientProps}
                rounded="full"
                pos="relative"
                boxSize={rest.boxSize || size == 'lg' ? 10 : 6}
            >
                <input {...input} onKeyDown={handleOnKeyDown} ref={ref} />
                <Box
                    bgColor={`#${paintColor}`}
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
                    onClick={handleSelectPaint}
                    {...rest}
                    {...checkbox}
                />
            </Box>
        );
    }
);

export default ColorSwatch;
