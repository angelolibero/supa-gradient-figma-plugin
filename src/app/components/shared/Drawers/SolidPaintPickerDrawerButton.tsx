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
import StylesIcon from '../../icons/StylesIcon';
import stylesState from '../../../atoms/styles';
import {useRecoilState} from 'recoil';
import SolidSwatch from '../Swatchs/SolidSwatch';
import CloseIcon from '../../icons/CloseIcon';

type Props = {
    selectedPaintStyle?: PaintStyle;
    onSelect: (style: PaintStyle) => void;
} & Omit<ButtonProps, 'onCreate' | 'onSelect'>;

const SolidPaintPickerDrawerButton: FC<Props> = ({selectedPaintStyle, onSelect, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnSelect = useCallback(
        (style: PaintStyle) => {
            onSelect(style);
            onClose();
        },
        [onSelect, onClose, selectedPaintStyle]
    );

    return (
        <>
            <Tooltip label="Styles" openDelay={300} placement="bottom">
                <Box>
                    <IconButton
                        icon={<StylesIcon />}
                        aria-label="styles"
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
                </Box>
            </Tooltip>
            <SolidPaintPickerDrawer
                selectedPaintStyle={selectedPaintStyle}
                isOpen={isOpen}
                onClose={onClose}
                onSelect={handleOnSelect}
                btnRef={btnRef}
            />
        </>
    );
};

type SolidPaintPickerDrawerProps = {
    selectedPaintStyle?: PaintStyle;
    btnRef: RefObject<HTMLButtonElement>;
    onSelect: (paint: PaintStyle) => void;
} & Omit<DrawerProps, 'children'>;

export const SolidPaintPickerDrawer: FC<SolidPaintPickerDrawerProps> = ({
    selectedPaintStyle,
    isOpen,
    btnRef,
    onClose,
    onSelect,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>();
    const [styles] = useRecoilState(stylesState);

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
                            <Text>Solid colors</Text>
                            <Text color="gray.400" fontWeight="normal" fontSize="xs">
                                {styles.solid.length} styles
                            </Text>
                        </Stack>
                    </DrawerHeader>
                    <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={2} pb={4}>
                        {styles.solid.map((style, index) => (
                            <SolidSwatch style={style} key={index} onSelect={handleSelect} />
                        ))}
                    </SimpleGrid>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default SolidPaintPickerDrawerButton;
