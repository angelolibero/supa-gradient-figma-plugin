import * as React from 'react';
import {FC, useRef, useCallback, useMemo, useState, useEffect, RefObject} from 'react';
import {
    Stack,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerProps,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    DrawerCloseButton,
    Button,
    Text,
    Box,
    DrawerFooter,
} from '@chakra-ui/react';
import ColorStopSwatch, {ColorStopSwatchProps} from '../Swatchs/ColorStopSwatch';
import {FocusableElement} from '@chakra-ui/utils';
import {RgbaColorPicker} from 'react-colorful';
import useDebounce from '../../../lib/hooks/useDebounce';
import {DEFAULT_DEBOUNCE_TIMEOUT} from '../../../lib/constants';
import CloseIcon from '../../icons/CloseIcon';

export type ColorPickerDrawerSwatchProps = {
    color: RGBA;
    id?: string;
    isActive?: boolean;
    defaultIsOpen?: boolean;
    onSelect?: (color: RGBA) => void;
    onChange?: (color: RGBA, id?: number) => void;
    onClose?: () => void;
} & Omit<ColorStopSwatchProps, 'onCreate' | 'onChange' | 'position'>;

const ColorPickerDrawerSwatch: FC<ColorPickerDrawerSwatchProps> = ({
    color,
    id,
    defaultIsOpen,
    onSelect,
    onChange,
    isActive,
    onClose: _onClose,
    ...rest
}) => {
    const {isOpen, onOpen, onClose} = useDisclosure({defaultIsOpen});
    const swatchRef = useRef<HTMLInputElement>();

    const handleOnChange = useCallback(
        (updatedColor: RGBA) => {
            if (!updatedColor) return;
            onChange && onChange({...updatedColor, a: +updatedColor.a.toFixed(2)}, id);
        },
        [onChange, id]
    );

    const handleOnClose = useCallback(() => {
        _onClose && _onClose();
        onClose();
    }, [_onClose, onClose]);

    return (
        <Box w="100%">
            <ColorStopSwatch
                color={color}
                onClick={onOpen}
                onChange={handleOnChange}
                id={id}
                ref={swatchRef}
                isActive={isActive}
                {...rest}
            />
            <ColorPickerDrawer
                color={color}
                isOpen={isOpen}
                placement="bottom"
                onClose={handleOnClose}
                onChange={handleOnChange}
                swatchRef={swatchRef}
            />
        </Box>
    );
};

type ColorPickerDrawerProps = {
    color?: RGBA;
    swatchRef: RefObject<FocusableElement>;
    onChange: (updatedColor: RGBA, id?: number) => void;
} & Omit<DrawerProps, 'children'>;

export const ColorPickerDrawer: FC<ColorPickerDrawerProps> = ({
    color: value,
    isOpen,
    onClose,
    onChange,
    swatchRef,
    ...rest
}) => {
    const [color, setColor] = useState(value);
    const debouncedColor = useDebounce(color, DEFAULT_DEBOUNCE_TIMEOUT);
    const inputRef = useRef<HTMLInputElement>();

    const pickerColor = useMemo(() => {
        return {
            r: parseInt((debouncedColor.r * 255).toString()),
            g: parseInt((debouncedColor.g * 255).toString()),
            b: parseInt((debouncedColor.b * 255).toString()),
            a: debouncedColor.a,
        };
    }, [debouncedColor]);

    const handleOnChange = useCallback(
        (updatedColor: RGBA) => {
            const rgbaColor = {
                r: +(updatedColor.r / 255).toFixed(2),
                g: +(updatedColor.g / 255).toFixed(2),
                b: +(updatedColor.b / 255).toFixed(2),
                a: updatedColor.a,
            };
            setColor(rgbaColor);
        },
        [onChange]
    );

    const handleSwatchOnChange = useCallback(
        (updatedColor: RGBA) => {
            setColor(updatedColor);
        },
        [onChange]
    );

    const handleOnClose = useCallback(() => {
        onClose && onClose();
    }, []);

    const selectColor = useCallback(() => {
        handleOnClose();
        setTimeout(() => {
            onChange(color);
        }, DEFAULT_DEBOUNCE_TIMEOUT);
    }, [onChange, color]);

    const resetColor = useCallback(() => {
        handleOnClose();
        onChange(value);
    }, [onChange, value]);

    useEffect(() => {
        if (isOpen && value != color) setColor(value);
    }, [isOpen]);

    return (
        <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={handleOnClose}
            finalFocusRef={swatchRef}
            initialFocusRef={inputRef}
            {...rest}
        >
            <DrawerOverlay />
            <DrawerContent textAlign="left">
                <DrawerCloseButton
                    boxSize={8}
                    size="sm"
                    rounded="sm"
                    _focus={{boxShadow: 'none'}}
                    children={<CloseIcon />}
                />
                <DrawerHeader px={4} pt={4} pb={0}>
                    <Stack direction="row" flex="1" spacing={2} alignItems="flex-start">
                        <Text>Edit color stop</Text>
                    </Stack>
                </DrawerHeader>
                <DrawerBody px={4} py={4}>
                    <Stack spacing={3}>
                        <RgbaColorPicker color={pickerColor} onChange={handleOnChange} />
                        <ColorStopSwatch color={debouncedColor} showInput showOpacity onChange={handleSwatchOnChange} />
                    </Stack>
                </DrawerBody>
                <DrawerFooter py={3} px={3} borderTop="1px solid" borderColor="blackAlpha.100">
                    <Stack direction="row" spacing={2} w="full">
                        <Button size="sm" colorScheme={'gray'} w="full" onClick={resetColor}>
                            Cancel
                        </Button>
                        <Button size="sm" colorScheme={'primary'} w="full" onClick={selectColor}>
                            Select color
                        </Button>
                    </Stack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ColorPickerDrawerSwatch;
