import * as React from 'react';
import {useRef, useCallback} from 'react';
import {
    Tooltip,
    Stack,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerProps,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    DrawerCloseButton,
    chakra,
    useControllableState,
    Text,
} from '@chakra-ui/react';
import ColorSwatch, {ColorSwatchProps} from '../Swatchs/ColorSwatch';
import {FocusableElement} from '@chakra-ui/utils';
import {RgbaColorPicker} from 'react-colorful';

export type ColorPickerDrawerSwatchProps = {
    color: RGBA;
    id?: string;
    isActive?: boolean;
    onSelect?: (color: RGBA) => void;
    onChange?: (color: RGBA) => void;
} & Omit<ColorSwatchProps, 'onCreate' | 'onChange'>;

const ColorPickerDrawerSwatch: React.FC<ColorPickerDrawerSwatchProps> = ({color, onSelect, onChange, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const swatchRef = useRef<HTMLInputElement>();

    const handleOnChange = useCallback(
        (newColor: RGBA) => {
            if (!newColor) return;
            onChange(newColor);
        },
        [onChange]
    );

    const handleOnSelect = useCallback(
        (event) => {
            onSelect(color);
        },
        [onChange, color]
    );

    return (
        <>
            <Tooltip label="Create style" openDelay={300} hasArrow>
                <ColorSwatch color={color} onClick={onOpen} ref={swatchRef} {...rest} />
            </Tooltip>
            <ColorPickerDrawer
                color={color}
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                onChange={handleOnChange}
                swatchRef={swatchRef}
            />
        </>
    );
};

type ColorPickerDrawerProps = {
    color?: RGBA;
    defaultColor?: RGBA;
    swatchRef: React.RefObject<FocusableElement>;
    onChange: (newColor: RGBA) => void;
} & Omit<DrawerProps, 'children'>;

export const ColorPickerDrawer: React.FC<ColorPickerDrawerProps> = ({
    color: value,
    defaultColor: defaultValue,
    isOpen,
    onClose,
    onChange,
    swatchRef,
    ...rest
}) => {
    const [color, setColor] = useControllableState({value, defaultValue});
    const inputRef = useRef<HTMLInputElement>();

    const handleOnChange = React.useCallback(
        (pickerColor) => {
            const newColor = {
                r: +(pickerColor.r / 255).toFixed(2),
                g: +(pickerColor.g / 255).toFixed(2),
                b: +(pickerColor.b / 255).toFixed(2),
                a: +(pickerColor.a / 100).toFixed(2),
            };
            setColor(newColor);
            onChange(newColor);
        },
        [color]
    );

    const pickerColor = React.useMemo(() => {
        return {
            r: parseInt((color.r * 255).toString()),
            g: parseInt((color.g * 255).toString()),
            b: parseInt((color.b * 255).toString()),
            a: color.a * 100,
        };
    }, [color]);

    return (
        <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={onClose}
            finalFocusRef={swatchRef}
            initialFocusRef={inputRef}
            {...rest}
        >
            <DrawerOverlay />
            <DrawerContent textAlign="left">
                <DrawerCloseButton />
                <DrawerHeader px={4} pt={4} fontSize="md">
                    <Stack direction="row" flex="1" spacing={2} alignItems="flex-start">
                        <ColorSwatch color={color} />
                        <Text>Edit color</Text>
                    </Stack>
                </DrawerHeader>
                <DrawerBody px={4} py={4} pt={0}>
                    <chakra.form
                        m={0}
                        pb={4}
                        onSubmit={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            //   onClose();
                        }}
                    >
                        <RgbaColorPicker color={pickerColor} onChange={handleOnChange} />
                    </chakra.form>
                    {/* <Stack direction="row" w="full">
                        <Button onClick={onClose} w="100%" size="sm">
                            Close
                        </Button>
                    </Stack> */}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default ColorPickerDrawerSwatch;
