import * as React from 'react';
import {FC, RefObject, useRef, useCallback, useState, useEffect} from 'react';
import {
    IconButton,
    // Tooltip,
    Stack,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerProps,
    DrawerHeader,
    DrawerCloseButton,
    useDisclosure,
    ButtonProps,
    SimpleGrid,
    Text,
    Box,
    Badge,
    Circle,
    Flex,
    Center,
    DrawerOverlay,
} from '@chakra-ui/react';
import GradientItem from '../GradientItem';
import {GradientPaintType} from '../../../typings';
import BackIcon from '../../icons/BackIcon';
import ListIcon from '../../icons/ListIcon';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import {GRADIENTS_COLOR_CATEGORIES, LINEAR_GRADIENTS_LIBRARY} from '../../../lib/gradients';

type Props = {
    gradientType?: GradientPaintType;
    selectedPaint?: GradientPaint;
    onSelect?: (paint: GradientPaint, name?: string) => void;
} & Omit<ButtonProps, 'onCreate' | 'onSelect'>;

const CollectionDrawerButton: FC<Props> = ({gradientType = 'GRADIENT_LINEAR', selectedPaint, onSelect, ...rest}) => {
    const [latestScrollTop, setLatestScrollTop] = useState<number>(0);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();
    const scrollRef = useRef<HTMLDivElement>();

    const handleOnSelect = useCallback(
        (paint: GradientPaint, name: string) => {
            onSelect && onSelect(paint, name);
            if (scrollRef && scrollRef.current) {
                setLatestScrollTop(scrollRef.current.scrollTop);
            }

            onClose();
        },
        [onSelect, onClose, selectedPaint]
    );

    return (
        <>
            {/* <Tooltip label="Collection" openDelay={1000} placement="bottom">
                <Box> */}
            <IconButton
                icon={<ListIcon />}
                aria-label="collection"
                boxSize={6}
                minW={6}
                maxW={6}
                p={0}
                rounded="full"
                fontSize="md"
                ref={btnRef}
                onClick={onOpen}
                {...rest}
            />
            {/* </Box>
            </Tooltip> */}
            <CollectionDrawer
                isOpen={isOpen}
                latestScrollTop={latestScrollTop}
                onClose={onClose}
                onSelect={handleOnSelect}
                btnRef={btnRef}
                scrollRef={scrollRef}
            />
        </>
    );
};

type CollectionDrawerProps = {
    selectedPaint?: GradientPaint;
    latestScrollTop?: number;
    btnRef: RefObject<HTMLButtonElement>;
    scrollRef?: RefObject<HTMLDivElement>;
    onSelect: (paint: GradientPaint, name?: string) => void;
} & Omit<DrawerProps, 'children' | 'onSelect'>;

export const CollectionDrawer: FC<CollectionDrawerProps> = ({
    selectedPaint,
    latestScrollTop,
    isOpen,
    btnRef,
    scrollRef = useRef<HTMLDivElement>(),
    onClose,
    onSelect,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>();
    const gradients = LINEAR_GRADIENTS_LIBRARY;
    const categories = GRADIENTS_COLOR_CATEGORIES;
    const scrollOffsetTop = 45;

    const handleOnSelect = useCallback((name: string, paint: GradientPaint) => onSelect(paint, name), [onSelect]);

    const handleOnSelectCategory = useCallback(
        (index: number) => {
            const name = categories[index].name;
            const group = document.getElementById('group-' + name);
            scrollRef.current.scrollTo({top: group.offsetTop - scrollOffsetTop, behavior: 'smooth'});
        },
        [scrollRef]
    );

    useEffect(() => {
        if (latestScrollTop >= 0 && isOpen) {
            setTimeout(() => {
                scrollRef.current.scrollTo({top: latestScrollTop});
            }, 0);
        }
    }, [isOpen]);

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
                    w="calc( 100% )"
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
                            Collection
                            <Badge colorScheme="green" size="xs" fontSize="xs" px={1} ml={1}>
                                New
                            </Badge>
                        </Text>
                    </Stack>
                </DrawerHeader>
                <DrawerBody pt={scrollOffsetTop} pb={0} px={4} ref={scrollRef}>
                    <SimpleGrid columns={5} spacing={2} pt={2} w="100%">
                        {categories.map((category, index) => (
                            <Center key={index}>
                                <Box
                                    as="label"
                                    {...CHECKERED_GRADIENT_PROPS}
                                    bgSize="10px 10px"
                                    bgPos="0px 0px, 5px 5px"
                                    rounded="full"
                                    pos="relative"
                                    cursor="pointer"
                                    onClick={() => handleOnSelectCategory(index)}
                                    _hover={{
                                        opacity: 0.6,
                                    }}
                                    transition="all 0.25s"
                                >
                                    <Box
                                        bgColor={category.bgColor}
                                        boxSize={6}
                                        rounded="full"
                                        outline="none"
                                        border={'2px solid'}
                                        borderColor="white"
                                        p={0}
                                        cursor="pointer"
                                        _focus={{
                                            boxShadow: 'outline',
                                        }}
                                    />
                                </Box>
                            </Center>
                        ))}
                    </SimpleGrid>
                    <Stack spacing={3} py={4}>
                        {gradients.map((gradientGroup) => {
                            return (
                                <Box key={gradientGroup.name} id={'group-' + gradientGroup.name} py={1}>
                                    <Flex mb={1} textTransform="capitalize" alignItems="center">
                                        <Circle size={2} minH={2} bgColor={gradientGroup.bgColor} mr={1} />
                                        {gradientGroup.name}
                                    </Flex>
                                    <SimpleGrid columns={3} w="100%" height="auto" alignItems="center" spacing={2}>
                                        {gradientGroup.paints.map((gradient: any, index) => {
                                            return (
                                                <GradientItem
                                                    defaultPaint={gradient}
                                                    key={index}
                                                    onSelect={(paint) => handleOnSelect(gradient.name, paint)}
                                                    _hover={{
                                                        opacity: 0.6,
                                                    }}
                                                    transition="all 0.25s"
                                                />
                                            );
                                        })}
                                    </SimpleGrid>
                                </Box>
                            );
                        })}
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default CollectionDrawerButton;
