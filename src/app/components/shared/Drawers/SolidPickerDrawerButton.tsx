import * as React from 'react';
import {FC, RefObject, useRef, useCallback, useMemo} from 'react';
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
    Badge,
} from '@chakra-ui/react';
import StylesIcon from '../../icons/StylesIcon';
import stylesState from '../../../atoms/styles';
import {useRecoilState} from 'recoil';
import SolidSwatch from '../Swatchs/SolidSwatch';
import BackIcon from '../../icons/BackIcon';
import {groupBy} from '../../../lib/utils';

type Props = {
    selectedPaintStyle?: PaintStyle;
    onSelect: (style: PaintStyle) => void;
} & Omit<ButtonProps, 'onCreate' | 'onSelect'>;

const SolidPickerDrawerButton: FC<Props> = ({selectedPaintStyle, onSelect, ...rest}) => {
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
    const scrollOffsetTop = '48px';

    const handleSelect = useCallback((paint?: PaintStyle) => onSelect(paint), [onSelect]);

    const groupedStyles = useMemo(() => {
        const grouped = groupBy(styles.solid, (style: PaintStyle) => style.name.split('/')[0]);
        return grouped;
    }, [styles.solid]);

    const groupedList = useCallback(() => {
        return Object.keys(groupedStyles).map((groupName) => {
            const isGroup = groupName && groupedStyles[groupName].length > 1;
            return (
                <Stack
                    key={groupName}
                    py={4}
                    direction={isGroup ? 'column' : 'row-reverse'}
                    alignItems={!isGroup && 'center'}
                    justifyContent={!isGroup && 'flex-end'}
                >
                    {groupName && <Text>{groupName}</Text>}
                    <SimpleGrid
                        columns={isGroup ? 6 : 1}
                        w={isGroup ? 'full' : 'auto'}
                        height="auto"
                        alignItems="center"
                        spacing={2}
                    >
                        {groupedStyles[groupName].map((style, index) => (
                            <SolidSwatch style={style} key={index} onSelect={handleSelect} />
                        ))}
                    </SimpleGrid>
                </Stack>
            );
        });
    }, [groupedStyles]);

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
            initialFocusRef={inputRef}
            isFullHeight
            {...rest}
        >
            <DrawerOverlay />
            <DrawerContent textAlign="left" bgColor="white">
                <DrawerHeader
                    py={3}
                    px={0}
                    d="flex"
                    flexDir="column"
                    bgColor="whiteAlpha.700"
                    backdropFilter="blur(28px)"
                    pos="fixed"
                    top={0}
                    zIndex="max"
                    w="calc( 100% - 5px )"
                >
                    <Stack flex="1" spacing={0} px={4} alignItems="flex-start">
                        <Text d="flex" alignItems="center">
                            <DrawerCloseButton
                                boxSize={6}
                                minW={6}
                                maxW={6}
                                rounded="sm"
                                _focus={{boxShadow: 'none'}}
                                pos="relative"
                                top={0}
                                left={0}
                                children={<BackIcon />}
                                mr={1}
                            />
                            Solid colors
                            <Badge colorScheme="gray" size="xs" fontSize="xs" px={1} ml={1}>
                                {styles.solid.length}
                            </Badge>
                        </Text>
                    </Stack>
                </DrawerHeader>

                <DrawerBody px={4} pb={0} pt={scrollOffsetTop}>
                    {groupedStyles && groupedList()}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default SolidPickerDrawerButton;
