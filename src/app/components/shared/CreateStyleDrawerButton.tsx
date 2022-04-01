import * as React from 'react';
import {useRef, useMemo} from 'react';
import {
    IconButton,
    Tooltip,
    Input,
    Stack,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    ButtonProps,
    chakra,
    InputLeftAddon,
    Badge,
    Text,
} from '@chakra-ui/react';
import {MdAdd} from 'react-icons/md';
import GradientSwatch from './GradientSwatch';

type Props = {
    paintStyle?: PaintStyle;
    gradientPaint: GradientPaint;
    onCreate: (name: string, gradientPaint: GradientPaint) => void;
} & Omit<ButtonProps, 'onCreate'>;

const CreateStyleDrawerButton: React.FC<Props> = ({gradientPaint, paintStyle, onCreate, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();
    const [value, setValue] = React.useState('');
    const inputRef = useRef<HTMLInputElement>();

    const handleChange = React.useCallback((event) => setValue(event.target.value), [value]);

    const handleOnSave = React.useCallback(() => {
        if (!inputRef.current.value || inputRef.current.value.length == 0) return;
        onCreate(value, gradientPaint);
        onClose();
    }, [value]);

    return (
        <>
            <Tooltip label="New style" openDelay={300}>
                <IconButton
                    icon={<MdAdd />}
                    aria-label="New style"
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
            <Drawer
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                finalFocusRef={btnRef}
                initialFocusRef={inputRef}
            >
                <DrawerOverlay />
                <DrawerContent textAlign="left">
                    <DrawerHeader>
                        <Stack flex="1" spacing={2} alignItems="flex-start">
                            <GradientSwatch
                                paintStyle={{...paintStyle, id: undefined, name: undefined}}
                                h={12}
                                pointerEvents="none"
                                size="lg"
                                shadow="md"
                            />
                            <Text>New style</Text>
                            {/* <Text fontSize="sm" color="gray.400">
                                Create a gradient style to reuse all over the project:
                            </Text> */}
                        </Stack>
                    </DrawerHeader>
                    <DrawerBody pb={6}>
                        <chakra.form
                            m={0}
                            pb={4}
                            onSubmit={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                handleOnSave();
                            }}
                        >
                            <Input
                                ref={inputRef}
                                placeholder="Insert style name"
                                onChange={handleChange}
                                w="100%"
                                type="text"
                                size="md"
                                variant="filled"
                                mb={2}
                            />
                            <Text fontSize="sm" color="gray.400">
                                <Badge colorScheme="green">Tip</Badge> Use slash naming convention to name and organize
                                gradient styles (E.g. Gradients/Primary).
                            </Text>
                        </chakra.form>
                        <Stack direction="row" w="full">
                            <Button onClick={onClose} w="100%">
                                Cancel
                            </Button>
                            <Button
                                colorScheme="primary"
                                onClick={handleOnSave}
                                isDisabled={!value || value.length == 0}
                                w="100%"
                            >
                                Save style
                            </Button>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default CreateStyleDrawerButton;
