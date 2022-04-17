import * as React from 'react';
import {useEffect, useCallback, useRef, useState} from 'react';
import {
    RadioProps,
    Box,
    useRadio,
    forwardRef,
    Input,
    Stack,
    Divider,
    Flex,
    Center,
    useMultiStyleConfig,
} from '@chakra-ui/react';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import {rgbToHex} from '@ctrl/tinycolor';
import {alphanumericRegex, checkIsHex, hexToRGBAObject, numericRegex} from '../../../lib/colors';

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
        const [opacity, setOpacity] = useState(color && parseInt('' + color.a * 100) + '%');
        const [hex, setHex] = useState(color && rgbToHex(color.r * 255, color.g * 255, color.b * 255, false));
        const hexInputRef = useRef<HTMLInputElement>();
        const opacityInputRef = useRef<HTMLInputElement>();
        const styles = useMultiStyleConfig('ColorStopSwatch', {isActive, showInput, showOpacity});

        const handleSelectPaint = useCallback(() => {
            onSelect && onSelect(color);
        }, [color, onSelect]);

        const handleOnChangeHex = useCallback((event) => {
            setHex(event.target.value.replace(alphanumericRegex, ''));
        }, []);

        const handleOnBlurHex = useCallback(
            (event) => {
                let hexColor = event.target.value;
                if (!checkIsHex(hexColor, true)) return;
                const rgbaObject = hexToRGBAObject('#' + hexColor);
                const rgbaFormattedObject = {
                    r: +(rgbaObject.r / 255).toFixed(2),
                    g: +(rgbaObject.g / 255).toFixed(2),
                    b: +(rgbaObject.b / 255).toFixed(2),
                    a: parseInt(opacityInputRef.current.value) / 100,
                };
                setHex(hexColor);
                onChange && onChange(rgbaFormattedObject, id);
            },
            [onChange, opacityInputRef, id]
        );

        const handleOnChangeOpacity = useCallback((event) => {
            setOpacity(event.target.value.replace(numericRegex, ''));
        }, []);

        const handleOnBlurOpacity = useCallback(
            (event) => {
                const alpha = event.target.value;
                let formattedAlpha = parseInt(alpha.replace('%', '')) || 0;
                if (formattedAlpha > 100) formattedAlpha = 100;
                else if (formattedAlpha < 0) formattedAlpha = 0;
                event.target.value = formattedAlpha + '%';
                const rgbaObject = hexToRGBAObject('#' + hexInputRef.current.value);
                const rgbaFormattedObject = {
                    r: +(rgbaObject.r / 255).toFixed(2),
                    g: +(rgbaObject.g / 255).toFixed(2),
                    b: +(rgbaObject.b / 255).toFixed(2),
                    a: formattedAlpha / 100,
                };
                setOpacity(formattedAlpha + '%');
                onChange && onChange(rgbaFormattedObject, id);
            },
            [hex, hexInputRef, onChange, id]
        );

        const handleOnKeyDown = useCallback((event) => {
            //enter key code:
            if (event.key === 'Enter' || event.keyCode === 13) {
                if (event.target == opacityInputRef.current) handleOnBlurOpacity(event);
                if (event.target == hexInputRef.current) handleOnBlurHex(event);
            }
        }, []);

        const handleOnFocus = useCallback((event) => event.target.select(), []);

        useEffect(() => {
            const newHex = rgbToHex(color.r * 255, color.g * 255, color.b * 255, false);
            const newOpacity = '' + color.a * 100;
            if (newHex != hex || opacity != newOpacity) {
                setHex(newHex);
                setOpacity(parseInt(newOpacity) + '%');
            }
        }, [color]);

        return (
            <Stack direction="row" spacing={'0px'} sx={styles.container} ref={ref}>
                <Box as="label" {...CHECKERED_GRADIENT_PROPS} pos="relative">
                    {/* <input {...input} ref={ref} /> */}
                    <Box
                        //     {...checkbox}
                        bgColor={`#${hex}`}
                        boxSize={7}
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
                            <Divider orientation="vertical" sx={styles.divider} />
                        </Center>
                        <Input
                            ref={hexInputRef}
                            value={hex}
                            onChange={handleOnChangeHex}
                            onBlur={handleOnBlurHex}
                            onFocus={handleOnFocus}
                            onKeyDown={handleOnKeyDown}
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
                            placeholder="Hex color"
                            minH={7}
                            maxH={7}
                            px={1}
                            w="100%"
                            maxLength={6}
                        />
                    </Flex>
                )}
                {showOpacity && (
                    <Flex direction="row" borderColor="inherit" maxW={12} minW={12}>
                        <Center h={7} borderColor="inherit">
                            <Divider orientation="vertical" sx={styles.divider} />
                        </Center>
                        <Input
                            ref={opacityInputRef}
                            value={opacity}
                            onChange={handleOnChangeOpacity}
                            onBlur={handleOnBlurOpacity}
                            onFocus={handleOnFocus}
                            onKeyDown={handleOnKeyDown}
                            placeholder="Alpha"
                            maxLength={3}
                            size="sm"
                            sx={styles.input}
                        />
                    </Flex>
                )}
            </Stack>
        );
    }
);

export default ColorStopSwatch;
