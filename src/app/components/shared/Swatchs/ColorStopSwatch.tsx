import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {RadioProps, Box, useRadio, forwardRef, Input, Stack, Divider, Flex, Center} from '@chakra-ui/react';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import {rgbToHex} from '@ctrl/tinycolor';
import {hexToRGBAObject} from '../../../lib/colors';

export type ColorStopSwatchProps = {
    color?: RGBA;
    id?: number;
    isActive?: boolean;
    showInput?: boolean;
    showOpacity?: boolean;
    onSelect?: (paintStyle: RGBA, fillStyleId?: string) => void;
    onChange?: (color: RGBA, id: number) => void;
} & Omit<RadioProps, 'onSelect' | 'color' | 'onChange'>;

const ColorStopSwatch = forwardRef<ColorStopSwatchProps, 'input'>(
    ({color, id, isActive, showInput, showOpacity, size, onSelect, onChange, ...rest}, ref) => {
        const {getInputProps, getCheckboxProps} = useRadio({
            value: JSON.stringify(color),
            ...rest,
        });
        const input = getInputProps({}, ref);
        const checkbox = getCheckboxProps();

        const hexColor = useMemo(() => {
            return color && rgbToHex(color.r * 255, color.g * 255, color.b * 255, false);
        }, [color]);

        const opacity = useMemo(() => {
            return color && parseInt('' + color.a * 100);
        }, [color]);

        const handleSelectPaint = useCallback(() => {
            onSelect && onSelect(color);
        }, [color, onSelect]);

        const handleOnKeyDown = useCallback(
            (e) => {
                //enter and space key code:
                if (e.key === 'Enter' || e.keyCode === 13 || e.keyCode === 32) {
                    handleSelectPaint();
                }
            },
            [handleSelectPaint]
        );

        const handleOnChangeInputColor = React.useCallback(
            (hexColor: string) => {
                onChange && onChange(hexToRGBAObject(hexColor), id);
            },
            [onChange, id]
        );

        const handleOnChangeInputAlpha = React.useCallback(
            (alphaPercentage: string) => {
                onChange && onChange({...color, a: +parseInt(alphaPercentage.replace('%', '')).toFixed(2) / 100}, id);
            },
            [onChange, color]
        );

        const borderStyle = {
            py: 0,
            border: '1px solid',
            borderColor: 'white',
            pl: 0,
            _hover: {
                borderColor: 'gray.300',
                rounded: 'sm',
            },
        };

        return (
            <Stack
                direction="row"
                alignItems="center"
                rounded="sm"
                overflow="hidden"
                h={7}
                spacing={'0px'}
                sx={showInput || showOpacity ? borderStyle : undefined}
            >
                <Box as="label" {...CHECKERED_GRADIENT_PROPS} pos="relative">
                    <input {...input} onKeyDown={handleOnKeyDown} ref={ref} />
                    <Box
                        {...checkbox}
                        bgColor={`#${hexColor}`}
                        boxSize={7}
                        shadow={isActive ? 'outline' : 'none'}
                        rounded="xs"
                        outline="none"
                        border="6px solid"
                        borderColor="white"
                        p={0}
                        cursor="pointer"
                        overflow="hidden"
                        _focus={{
                            boxShadow: !showInput && 'outline',
                        }}
                        onClick={handleSelectPaint}
                        {...rest}
                    />
                </Box>
                {showInput && (
                    <Flex direction="row" borderColor="inherit">
                        <Center h={7} borderColor="inherit">
                            <Divider orientation="vertical" borderColor="inherit" />
                        </Center>
                        <Input
                            value={hexColor}
                            onChange={(event) => {
                                handleOnChangeInputColor(event.target.value);
                            }}
                            borderRadius="sm"
                            flex="1"
                            bgColor="white"
                            size="sm"
                            variant="unstyled"
                            border={'none'}
                            color="gray.700"
                            _focus={{
                                shadow: 'none',
                            }}
                            rounded="none"
                            placeholder="Hex code"
                            minH={7}
                            maxH={7}
                            px={1}
                            w="100%"
                        />
                    </Flex>
                )}
                {showOpacity && (
                    <Flex direction="row" borderColor="inherit" maxW={12} minW={12}>
                        <Center h={7} borderColor="inherit">
                            <Divider orientation="vertical" borderColor="inherit" />
                        </Center>
                        <Input
                            value={`${opacity}%`}
                            onChange={(event) => {
                                handleOnChangeInputAlpha(event.target.value);
                            }}
                            borderRadius="sm"
                            flex="1"
                            bgColor="white"
                            size="sm"
                            border={'none'}
                            color="gray.700"
                            _focus={{
                                shadow: 'none',
                            }}
                            placeholder="Opacity"
                            rounded="none"
                            minH={7}
                            maxH={7}
                            px={1}
                            w="100%"
                        />
                    </Flex>
                )}
            </Stack>
        );
    }
);

export default ColorStopSwatch;
