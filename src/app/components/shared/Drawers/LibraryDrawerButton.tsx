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
    Badge,
    Divider,
    Circle,
    Flex,
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
    onSelect?: (paint: GradientPaint) => void;
} & Omit<ButtonProps, 'onCreate' | 'onSelect'>;

const LibraryDrawerButton: FC<Props> = ({gradientType = 'GRADIENT_LINEAR', selectedPaint, onSelect, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnSelect = useCallback(
        (paint: GradientPaint) => {
            onSelect && onSelect(paint);
            onClose();
        },
        [onSelect, onClose, selectedPaint]
    );

    return (
        <>
            <Tooltip label="Library" openDelay={300} placement="bottom">
                <Box>
                    <IconButton
                        icon={<ListIcon color="inherit" />}
                        aria-label="library"
                        boxSize={7}
                        minW={7}
                        maxW={7}
                        p={0}
                        rounded="full"
                        bgColor="gray.100"
                        fill="primary.500"
                        fontSize="md"
                        ref={btnRef}
                        onClick={onOpen}
                        {...rest}
                    />
                </Box>
            </Tooltip>
            <LibraryDrawer isOpen={isOpen} onClose={onClose} onSelect={handleOnSelect} btnRef={btnRef} />
        </>
    );
};

type LibraryDrawerProps = {
    selectedPaint?: GradientPaint;
    btnRef: RefObject<HTMLButtonElement>;
    onSelect: (paint: GradientPaint) => void;
} & Omit<DrawerProps, 'children'>;

export const LibraryDrawer: FC<LibraryDrawerProps> = ({selectedPaint, isOpen, btnRef, onClose, onSelect, ...rest}) => {
    const inputRef = useRef<HTMLInputElement>();
    const gradients = LINEAR_GRADIENTS_LIBRARY;
    const categories = GRADIENTS_COLOR_CATEGORIES;

    const handleSelect = useCallback((paint?: GradientPaint) => onSelect(paint), [onSelect]);

    const handleSelectCatergory = useCallback((categoryName?: string) => {
        const group = document.getElementById('group-' + categoryName);
        group.scrollIntoView({behavior: 'smooth'});
    }, []);

    return (
        <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
            initialFocusRef={inputRef}
            {...rest}
        >
            <DrawerOverlay />
            <DrawerContent textAlign="left" h="100vh">
                <DrawerBody p={0}>
                    <DrawerHeader py={0} px={0} d="flex" flexDir="column">
                        <Stack flex="1" spacing={0} px={4} alignItems="flex-start" pt={3}>
                            <Text d="flex" alignItems="center">
                                <DrawerCloseButton
                                    boxSize={5}
                                    rounded="sm"
                                    _focus={{boxShadow: 'none'}}
                                    pos="relative"
                                    top={0}
                                    left={0}
                                    children={<BackIcon />}
                                    mr={1}
                                />
                                Library
                                <Badge colorScheme="green" size="xs" fontSize="xs" px={1} ml={1}>
                                    New
                                </Badge>
                            </Text>
                        </Stack>
                        <Stack direction="row" spacing={3} py={2} px={4} w="100%" overflowX="auto">
                            {categories.map((category, index) => (
                                <Box
                                    as="label"
                                    {...CHECKERED_GRADIENT_PROPS}
                                    bgSize="10px 10px"
                                    bgPos="0px 0px, 5px 5px"
                                    rounded="full"
                                    pos="relative"
                                    key={index}
                                    cursor="pointer"
                                    onClick={() => handleSelectCatergory(category.name)}
                                >
                                    <Box
                                        bgColor={category.bgColor}
                                        boxSize={6}
                                        //      shadow={isActive ? 'outline' : 'sm'}
                                        rounded="full"
                                        outline="none"
                                        border={'2px solid'}
                                        borderColor="white"
                                        p={0}
                                        cursor="pointer"
                                        _focus={{
                                            boxShadow: 'outline',
                                        }}
                                        //     onClick={handleSelectStyle}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </DrawerHeader>
                    <Divider />
                    <Stack spacing={3} py={4} px={4}>
                        {gradients.map((gradientGroup) => {
                            return (
                                <Box key={gradientGroup.name} id={'group-' + gradientGroup.name} py={1}>
                                    <Flex mb={1} textTransform="capitalize" alignItems="center">
                                        <Circle size={2} bgColor={gradientGroup.bgColor} mr={1} />
                                        {gradientGroup.name}
                                    </Flex>
                                    <SimpleGrid columns={3} w="100%" height="auto" alignItems="center" spacing={2}>
                                        {gradientGroup.paints.map((gradient: any, index) => {
                                            return (
                                                <GradientItem
                                                    defaultPaint={gradient}
                                                    key={index}
                                                    onSelect={handleSelect}
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

export default LibraryDrawerButton;
