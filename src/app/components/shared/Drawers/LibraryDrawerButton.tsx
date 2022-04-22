import * as React from 'react';
import {FC, RefObject, useRef, useCallback} from 'react';
import {
    IconButton,
    Tooltip,
    Stack,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerProps,
    DrawerHeader,
    DrawerOverlay,
    DrawerCloseButton,
    useDisclosure,
    ButtonProps,
    SimpleGrid,
    Text,
    Box,
} from '@chakra-ui/react';
import CloseIcon from '../../icons/CloseIcon';
import LibraryIcon from '../../icons/LibraryIcon';
import {LINEAR_GRADIENTS_LIBRARY} from '../../../lib/gradients';
import GradientSwatch from '../Swatchs/GradientSwatch';

type Props = {
    selectedPaintStyle?: PaintStyle;
    onSelect?: (style: PaintStyle) => void;
} & Omit<ButtonProps, 'onCreate' | 'onSelect'>;

const LibraryDrawerButton: FC<Props> = ({selectedPaintStyle, onSelect, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnSelect = useCallback(
        (style: PaintStyle) => {
            onSelect && onSelect(style);
            onClose();
        },
        [onSelect, onClose, selectedPaintStyle]
    );

    return (
        <>
            <Tooltip label="Library" openDelay={300} placement="bottom">
                <Box>
                    <IconButton
                        icon={<LibraryIcon />}
                        aria-label="library"
                        boxSize={7}
                        minW={7}
                        maxW={7}
                        p={0}
                        rounded="full"
                        border="1px dashed"
                        borderColor="gray.200"
                        bgColor="white"
                        fontSize="md"
                        ref={btnRef}
                        onClick={onOpen}
                        {...rest}
                    />
                </Box>
            </Tooltip>
            <LibraryDrawer
                selectedPaintStyle={selectedPaintStyle}
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                onSelect={handleOnSelect}
                btnRef={btnRef}
            />
        </>
    );
};

type LibraryDrawerProps = {
    selectedPaintStyle?: PaintStyle;
    btnRef: RefObject<HTMLButtonElement>;
    onSelect: (paint: PaintStyle) => void;
} & Omit<DrawerProps, 'children'>;

export const LibraryDrawer: FC<LibraryDrawerProps> = ({
    selectedPaintStyle,
    isOpen,
    btnRef,
    onClose,
    onSelect,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>();
    const gradients = LINEAR_GRADIENTS_LIBRARY;

    const handleSelect = useCallback((paint?: PaintStyle) => onSelect(paint), [onSelect]);
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
            <DrawerContent textAlign="left" maxH="75vh">
                <DrawerBody px={4} pb={4} pt={0}>
                    <DrawerHeader py={4} px={0}>
                        <DrawerCloseButton
                            boxSize={8}
                            size="sm"
                            rounded="sm"
                            _focus={{boxShadow: 'none'}}
                            zIndex={1}
                            bgColor="whiteAlpha.600"
                            backdropFilter="blur(28px)"
                            children={<CloseIcon />}
                        />
                        <Stack flex="1" spacing={0} alignItems="flex-start">
                            <Text>Gradients library</Text>
                            <Text color="gray.400" fontWeight="normal" fontSize="xs">
                                {gradients.length} gradients
                            </Text>
                        </Stack>
                    </DrawerHeader>
                    <SimpleGrid columns={5} w="100%" height="auto" alignItems="center" spacing={2} pb={4}>
                        {gradients.map((gradient: any, index) => (
                            <GradientSwatch defaultPaint={gradient} key={index} onSelect={handleSelect} />
                        ))}
                    </SimpleGrid>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default LibraryDrawerButton;
