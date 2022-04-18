import * as React from 'react';
import {FC, useRef, useState, useCallback, useEffect, useMemo, RefObject} from 'react';
import {
    IconButton,
    Tooltip,
    Input,
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
    Stack,
    Box,
    useControllableState,
} from '@chakra-ui/react';
import {MdAdd} from 'react-icons/md';
import GradientSwatch from '../Swatchs/GradientSwatch';
import GradientTypeTabs from '../GradientTypeTabs';
import {GRADIENT_TYPES} from '../../../lib/constants';
import {GradientPaintType} from '../../../typings';
import CloseIcon from '../../icons/CloseIcon';

type Props = {
    style?: PaintStyle;
    gradientPaint: GradientPaint;
    onCreate?: (name: string, gradientPaint: GradientPaint) => void;
} & Omit<ButtonProps, 'onCreate'>;

const CreateStyleDrawerButton: FC<Props> = ({gradientPaint, style, onCreate, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnCreate = useCallback(
        (name: string, paint: GradientPaint) => {
            if (!name || name.length == 0) return;
            onCreate(name, paint);
            onClose();
        },
        [onCreate, onClose, gradientPaint]
    );

    return (
        <>
            <Tooltip label="Create style" openDelay={300} placement="bottom-start">
                <Box>
                    <IconButton
                        icon={<MdAdd />}
                        aria-label="Create style"
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
            <CreateStyleDrawer
                gradientPaint={gradientPaint}
                style={style}
                isOpen={isOpen}
                onClose={onClose}
                onCreate={handleOnCreate}
                btnRef={btnRef}
            />
        </>
    );
};

type CreateStyleDrawerProps = {
    style?: PaintStyle;
    gradientPaint: GradientPaint;
    btnRef: RefObject<HTMLButtonElement>;
    onCreate: (name: string, gradientPaint: GradientPaint) => void;
} & Omit<DrawerProps, 'children'>;

export const CreateStyleDrawer: FC<CreateStyleDrawerProps> = ({
    gradientPaint,
    style,
    isOpen,
    onClose,
    onCreate,
    btnRef,
    ...rest
}) => {
    const [name, setName] = useState('');
    const [gradientType, setGradientType] = useControllableState<GradientPaintType>({
        defaultValue: gradientPaint ? gradientPaint.type : GRADIENT_TYPES[0],
    });
    const inputRef = useRef<HTMLInputElement>();

    const newPaint = useMemo(() => {
        return {...gradientPaint, type: gradientType};
    }, [gradientPaint, gradientType]);

    const onChangeName = useCallback((event) => setName(event.target.value), [name]);

    const onChangeType = useCallback(
        (type: GradientPaintType): void => {
            setGradientType(type);
        },
        [gradientType]
    );

    const handleCreate = useCallback((_event) => onCreate(name, newPaint), [name, newPaint]);

    useEffect(() => {
        gradientPaint && setGradientType(gradientPaint.type);
    }, [gradientPaint]);

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
                <DrawerHeader p={4}>
                    <DrawerCloseButton
                        boxSize={8}
                        size="sm"
                        rounded="sm"
                        _focus={{boxShadow: 'none'}}
                        children={<CloseIcon />}
                    />
                    <Stack flex="1" spacing={2} alignItems="flex-start">
                        {newPaint && newPaint.gradientTransform && (
                            <GradientSwatch
                                defaultPaint={newPaint}
                                boxSize={12}
                                pointerEvents="none"
                                size="lg"
                                shadow="md"
                            />
                        )}
                        <Text>New gradient style</Text>
                        {/* <Text fontSize="sm" color="gray.400">
                                Create a gradient style to reuse all over the project:
                            </Text> */}
                    </Stack>
                </DrawerHeader>
                <DrawerBody px={4} pb={4} pt={0}>
                    <chakra.form
                        m={0}
                        pb={4}
                        onSubmit={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleCreate(event);
                        }}
                    >
                        <GradientTypeTabs value={gradientType} onChange={onChangeType} mb={3} />

                        <Input
                            ref={inputRef}
                            placeholder="Insert style name"
                            onChange={onChangeName}
                            w="100%"
                            size="sm"
                            variant="filled"
                            mb={4}
                        />
                        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start">
                            <Badge colorScheme="green" size="sm" fontSize="xs" px={1}>
                                Tip
                            </Badge>
                            <Text fontSize="xs" color="gray.400">
                                Use slash naming convention to name and organize gradient styles (E.g.
                                Gradients/Primary).
                            </Text>
                        </Stack>
                    </chakra.form>
                    <Stack direction="row" w="full">
                        {/* <Button onClick={onClose} w="100%" size="sm">
                            Cancel
                        </Button> */}
                        <Button
                            colorScheme="primary"
                            onClick={handleCreate}
                            isDisabled={!name || name.length == 0}
                            w="100%"
                            size="sm"
                        >
                            Create style
                        </Button>
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateStyleDrawerButton;
