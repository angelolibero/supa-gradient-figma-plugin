import * as React from 'react';
import {useRef} from 'react';
import {
    IconButton,
    Tooltip,
    Input,
    Stack,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerProps,
    DrawerHeader,
    DrawerOverlay,
    DrawerCloseButton,
    useDisclosure,
    ButtonProps,
    chakra,
    Badge,
    Text,
} from '@chakra-ui/react';
import {MdAdd} from 'react-icons/md';
import StylesIcon from '../../icons/StylesIcon';

type Props = {
    selectedPaint?: SolidPaint;
    onSelect: (paint?: SolidPaint) => void;
} & Omit<ButtonProps, 'onCreate'>;

const StylesPickerDrawerButton: React.FC<Props> = ({selectedPaint, onSelect, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnSelect = React.useCallback(
        (paint: SolidPaint) => {
            onSelect(paint);
            onClose();
        },
        [onSelect, onClose, selectedPaint]
    );

    return (
        <>
            <Tooltip label="Styles" openDelay={300} placement="bottom">
                <IconButton
                    icon={<StylesIcon />}
                    aria-label="Create style"
                    boxSize={7}
                    minW={7}
                    maxW={7}
                    p={0}
                    rounded="sm"
                    bgColor="white"
                    fontSize="md"
                    ref={btnRef}
                    onClick={onOpen}
                    {...rest}
                />
            </Tooltip>
            <StylesPickerDrawer
                selectedPaint={selectedPaint}
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                onSelect={handleOnSelect}
                btnRef={btnRef}
            />
        </>
    );
};

type StylesPickerDrawerProps = {
    selectedPaint?: SolidPaint;
    btnRef: React.RefObject<HTMLButtonElement>;
    onSelect: (paint: SolidPaint) => void;
} & Omit<DrawerProps, 'children'>;

export const StylesPickerDrawer: React.FC<StylesPickerDrawerProps> = ({
    selectedPaint,
    isOpen,
    btnRef,
    onClose,
    onSelect,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>();

    const handleSelect = React.useCallback((paint?: SolidPaint) => onSelect(paint), [onSelect]);

    return (
        <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={onClose}
            finalFocusRef={btnRef}
            initialFocusRef={inputRef}
            {...rest}
        >
            <DrawerOverlay />
            <DrawerContent textAlign="left">
                <DrawerHeader p={4} fontSize="md">
                    <DrawerCloseButton boxSize={8} size="sm" rounded="sm" _focus={{boxShadow: 'none'}} />
                    <Stack flex="1" spacing={2} alignItems="flex-start">
                        <Text>Select solid style</Text>
                        {/* <Text fontSize="sm" color="gray.400">
                                Create a gradient style to reuse all over the project:
                            </Text> */}
                    </Stack>
                </DrawerHeader>
                <DrawerBody px={4} pb={4} pt={0}>
                    <chakra.div m={0} pb={4}>
                        <Badge colorScheme="green" size="sm" fontSize="xs" mb={1}>
                            Selec
                        </Badge>
                        <Text fontSize="xs" color="gray.400">
                            Use slash naming convention to name and organize gradient styles (E.g. Gradients/Primary).
                        </Text>
                    </chakra.div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default StylesPickerDrawerButton;
