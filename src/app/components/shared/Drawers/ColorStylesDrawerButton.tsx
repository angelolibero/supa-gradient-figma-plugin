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
    Center,
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

const ColorStylesDrawerButton: FC<Props> = ({selectedPaintStyle, onSelect, ...rest}) => {
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
                        color="gray.700"
                        _dark={{
                            color: 'white',
                            bgColor: 'gray.800',
                            _hover: {
                                bgColor: 'gray.700',
                            },
                        }}
                        fontSize="md"
                        ref={btnRef}
                        onClick={onOpen}
                        {...rest}
                    />
                </Box>
            </Tooltip>
            <ColorStylesDrawer
                selectedPaintStyle={selectedPaintStyle}
                isOpen={isOpen}
                onClose={onClose}
                onSelect={handleOnSelect}
                btnRef={btnRef}
            />
        </>
    );
};

type ColorStylesDrawerProps = {
    selectedPaintStyle?: PaintStyle;
    btnRef: RefObject<HTMLButtonElement>;
    onSelect: (paint: PaintStyle) => void;
} & Omit<DrawerProps, 'children'>;

export const ColorStylesDrawer: FC<ColorStylesDrawerProps> = ({
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

    const GroupedList: any = useCallback(() => {
        return Object.keys(groupedStyles).map((groupName) => {
            const isGroup = groupName && groupedStyles[groupName].length > 1;
            return (
                <Stack
                    key={groupName}
                    direction={isGroup ? 'column' : 'row-reverse'}
                    alignItems={!isGroup && 'center'}
                    justifyContent={!isGroup && 'flex-end'}
                    spacing={0}
                >
                    {isGroup && <Text px={4}>{groupName}</Text>}

                    {!isGroup ? (
                        <Stack
                            direction="row"
                            onClick={() => handleSelect(groupedStyles[groupName][0])}
                            cursor="pointer"
                            alignItems="center"
                            w="100%"
                            _hover={{bgColor: 'gray.100'}}
                            _dark={{
                                _hover: {bgColor: 'gray.800'},
                            }}
                            px={4}
                            h={8}
                        >
                            <SolidSwatch style={groupedStyles[groupName][0]} />
                            <Text>{groupName}</Text>
                        </Stack>
                    ) : (
                        <SimpleGrid
                            columns={isGroup ? 6 : 1}
                            w={isGroup ? 'full' : 'auto'}
                            height="auto"
                            alignItems="center"
                            spacing={2}
                            px={4}
                            py={2}
                        >
                            {groupedStyles[groupName].map((style, index) => (
                                <SolidSwatch style={style} key={index} onSelect={handleSelect} />
                            ))}
                        </SimpleGrid>
                    )}
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
            <DrawerContent textAlign="left">
                <DrawerHeader
                    py={3}
                    px={0}
                    d="flex"
                    flexDir="column"
                    bgColor="whiteAlpha.700"
                    _dark={{
                        bgColor: 'transparent',
                    }}
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
                            Color Styles
                            <Badge colorScheme="gray" size="xs" fontSize="xs" px={1} ml={1}>
                                {styles.solid.length}
                            </Badge>
                        </Text>
                    </Stack>
                </DrawerHeader>

                <DrawerBody px={0} pb={0} pt={scrollOffsetTop}>
                    {!styles.solid ||
                        (styles.solid.length == 0 && (
                            <Center boxSize="100%">
                                <Text>No solid colors styles found</Text>
                            </Center>
                        ))}
                    {groupedStyles && (
                        <Stack spacing={3} pt={2} pb={4}>
                            <GroupedList />
                        </Stack>
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default ColorStylesDrawerButton;
