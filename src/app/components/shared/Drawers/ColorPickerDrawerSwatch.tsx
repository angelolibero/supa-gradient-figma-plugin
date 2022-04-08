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
import ColorStopSwatch, {ColorStopSwatchProps} from '../Swatchs/ColorStopSwatch';
import {FocusableElement} from '@chakra-ui/utils';
import {RgbaColorPicker} from 'react-colorful';

export type ColorPickerDrawerSwatchProps = {
    color: RGBA;
    id?: string;
    isActive?: boolean;
    defaultIsOpen?: boolean;
    onSelect?: (color: RGBA) => void;
    onChange?: (color: RGBA, id?: number) => void;
    onClose?: () => void;
} & Omit<ColorStopSwatchProps, 'onCreate' | 'onChange'>;

const ColorPickerDrawerSwatch: React.FC<ColorPickerDrawerSwatchProps> = ({
    color,
    id,
    defaultIsOpen,
    onSelect,
    onChange,
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
        [onChange]
    );

    const handleOnClose = useCallback(() => {
        _onClose && _onClose();
        onClose();
    }, [_onClose, onClose]);

    return (
        <>
            <ColorStopSwatch
                color={color}
                onClick={onOpen}
                onChange={handleOnChange}
                id={id}
                ref={swatchRef}
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
        </>
    );
};

type ColorPickerDrawerProps = {
    color?: RGBA;
    defaultColor?: RGBA;
    swatchRef: React.RefObject<FocusableElement>;
    onChange: (updatedColor: RGBA, id?: number) => void;
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
        (updatedColor: RGBA) => {
            const rgbaColor = {
                r: +(updatedColor.r / 255).toFixed(2),
                g: +(updatedColor.g / 255).toFixed(2),
                b: +(updatedColor.b / 255).toFixed(2),
                a: updatedColor.a,
            };
            setColor(rgbaColor);
            onChange(rgbaColor);
        },
        [color]
    );

    const pickerColor = React.useMemo(() => {
        return {
            r: parseInt((color.r * 255).toString()),
            g: parseInt((color.g * 255).toString()),
            b: parseInt((color.b * 255).toString()),
            a: color.a,
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
                <DrawerCloseButton boxSize={8} size="sm" rounded="sm" _focus={{boxShadow: 'none'}} />
                <DrawerHeader px={4} pt={4} pb={0} fontSize="md">
                    <Stack direction="row" flex="1" spacing={2} alignItems="flex-start">
                        <Text>Edit color</Text>
                    </Stack>
                </DrawerHeader>
                <DrawerBody px={4} py={4}>
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
                    <Stack direction="row" w="full">
                        <ColorStopSwatch color={color} showInput showOpacity />
                        {/* <Button onClick={onClose} w="100%" size="sm">
                            Close
                        </Button> */}
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default ColorPickerDrawerSwatch;