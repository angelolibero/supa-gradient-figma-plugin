import * as React from 'react';
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
} from '@chakra-ui/react';
import {MdAdd} from 'react-icons/md';

type Props = {gradientPaint: GradientPaint; onSave: (name: string) => void} & ButtonProps;

const CreateStyleDrawerButton: React.FC<Props> = ({gradientPaint, onSave, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = React.useRef();
    const [value, setValue] = React.useState('');

    const handleChange = React.useCallback((event) => setValue(event.target.value), [value]);

    const handleOnSave = React.useCallback(() => {
        onSave(value);
        onClose();
    }, [value]);

    return (
        <>
            <Tooltip label="Create gradient style">
                <IconButton
                    icon={<MdAdd />}
                    aria-label="create gradient style"
                    boxSize={7}
                    minW={7}
                    maxW={7}
                    p={0}
                    rounded="full"
                    border="1px dashed"
                    borderColor="gray.200"
                    _focus={{
                        shadow: 'none',
                    }}
                    ref={btnRef}
                    onClick={onOpen}
                    {...rest}
                />
            </Tooltip>
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent textAlign="left">
                    <DrawerHeader pb={4}>Create gradient style {gradientPaint ? 'si' : 'no'}</DrawerHeader>
                    <DrawerBody>
                        <Stack direction="row" boxSize="100%" flex="1">
                            {/* {gradientPaint && <GradientSwatch defaultPaint={gradientPaint} boxSize={24} />} */}
                            <Input size="md" placeholder="Insert gradient name" onChange={handleChange} />
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter pt={4}>
                        <Stack direction="row">
                            <Button
                                colorScheme="primary"
                                onClick={handleOnSave}
                                isDisabled={!value || value.length == 0}
                            >
                                Save style
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </Stack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default CreateStyleDrawerButton;
