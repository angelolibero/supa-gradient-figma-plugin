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
import GradientSwatch from '../Swatchs/GradientSwatch';

type Props = {
    paintStyle?: PaintStyle;
    gradientPaint: GradientPaint;
    onCreate: (name: string, gradientPaint: GradientPaint) => void;
} & Omit<ButtonProps, 'onCreate'>;

const CreateStyleDrawerButton: React.FC<Props> = ({gradientPaint, paintStyle, onCreate, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnCreate = React.useCallback(
        (name: string) => {
            if (!name || name.length == 0) return;
            onCreate(name, gradientPaint);
            onClose();
        },
        [onCreate, onClose, gradientPaint]
    );

    return (
        <>
            <Tooltip label="Create style" openDelay={300} placement="bottom-start">
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
            </Tooltip>
            <CreateStyleDrawer
                gradientPaint={gradientPaint}
                paintStyle={paintStyle}
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                onCreate={handleOnCreate}
                btnRef={btnRef}
            />
        </>
    );
};

type CreateStyleDrawerProps = {
    paintStyle?: PaintStyle;
    gradientPaint: GradientPaint;
    btnRef: React.RefObject<HTMLButtonElement>;
    onCreate: (name: string) => void;
} & Omit<DrawerProps, 'children'>;

export const CreateStyleDrawer: React.FC<CreateStyleDrawerProps> = ({
    gradientPaint,
    paintStyle,
    isOpen,
    onClose,
    onCreate,
    btnRef,
    ...rest
}) => {
    const [name, setName] = React.useState('');
    const inputRef = useRef<HTMLInputElement>();

    const handleChange = React.useCallback((event) => setName(event.target.value), [name]);

    const handleCreate = React.useCallback((event) => onCreate(name), [name]);

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
                        <GradientSwatch
                            defaultPaint={gradientPaint}
                            boxSize={12}
                            pointerEvents="none"
                            size="lg"
                            shadow="md"
                        />
                        <Text>Create style</Text>
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
                            onCreate(name);
                        }}
                    >
                        <Input
                            ref={inputRef}
                            placeholder="Insert style name"
                            onChange={handleChange}
                            w="100%"
                            size="sm"
                            variant="filled"
                            mb={4}
                        />
                        <chakra.div>
                            <Badge colorScheme="green" size="sm" fontSize="xs" mb={1}>
                                Tip
                            </Badge>
                            <Text fontSize="xs" color="gray.400">
                                Use slash naming convention to name and organize gradient styles (E.g.
                                Gradients/Primary).
                            </Text>
                        </chakra.div>
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
                            Save style
                        </Button>
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateStyleDrawerButton;
