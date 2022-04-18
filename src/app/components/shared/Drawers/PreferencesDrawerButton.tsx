import * as React from 'react';
import {FC, useCallback, useState, RefObject, useRef, useEffect} from 'react';
import {
    IconButton,
    Text,
    Stack,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    DrawerProps,
    DrawerCloseButton,
    useDisclosure,
    ButtonProps,
    FormControl,
    FormLabel,
    Divider,
    Switch,
    Flex,
    Link,
} from '@chakra-ui/react';
import {Preferences} from '../../../typings';
import {MdMoreVert} from 'react-icons/md';
import Logo from '../Logo';
import CloseIcon from '../../icons/CloseIcon';

type Props = {
    preferences: Preferences;
    onChange: (preferences: Preferences) => void;
} & Omit<ButtonProps, 'onCreate'>;

const PreferencesDrawerButton: FC<Props> = ({preferences: value, onChange, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef();
    const [preferences, setPreferences] = useState<Preferences>(value);

    const handleOnUpdate = useCallback(
        (key: string, value: string | number | boolean) => {
            setPreferences({...preferences, [key]: value});
            onChange(preferences);
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'preferences-update',
                        preferences: {...preferences, [key]: value},
                    },
                },
                '*'
            );
        },
        [preferences, isOpen]
    );

    useEffect(() => {
        if (value != preferences) setPreferences(value);
    }, [value]);

    return (
        <>
            {/* <Tooltip label="Preferences" openDelay={300}> */}
            <IconButton
                icon={<MdMoreVert />}
                aria-label="Show preferences"
                ref={btnRef}
                onClick={onOpen}
                size="sm"
                fontSize="lg"
                bgColor="white"
                _focus={{
                    shadow: 'none',
                }}
                {...rest}
            />
            {/* </Tooltip> */}
            <PreferencesDrawer
                preferences={preferences}
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                btnRef={btnRef}
                onUpdate={handleOnUpdate}
            />
        </>
    );
};

type PreferencesDrawerProps = {
    preferences: Preferences;
    btnRef: RefObject<HTMLButtonElement>;
    onUpdate: (key: string, value: string | number | boolean) => void;
} & Omit<DrawerProps, 'children'>;

export const PreferencesDrawer: FC<PreferencesDrawerProps> = ({
    preferences,
    isOpen,
    onUpdate,
    onClose,
    btnRef,
    ...rest
}) => {
    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} finalFocusRef={btnRef} {...rest}>
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
                    <Stack direction="row" alignItems="center">
                        <Logo />
                        <Stack spacing={0} justifyContent="flex-start">
                            <Text>Supa Gradient</Text>
                            <Text color="gray.400" fontSize="xs" fontWeight="normal">
                                {!!process.env.APP_VERSION && process.env.APP_VERSION}
                            </Text>
                        </Stack>
                    </Stack>
                </DrawerHeader>
                <DrawerBody w="full" px={4} pb={6}>
                    <Stack direction="row" boxSize="100%" flex="1">
                        <Stack w="full" spacing={3}>
                            {/* liveUpdates */}
                            <FormControl d="flex" w="full" alignItems="center" justifyContent="center">
                                <FormLabel htmlFor="live-mode" mx={0} mr={3} w="100%">
                                    <Stack flex="1" spacing={0}>
                                        <Text fontSize="xs">Live update</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            Apply changes immediately
                                        </Text>
                                    </Stack>
                                </FormLabel>
                                <Switch
                                    isChecked={preferences.liveUpdates}
                                    size="sm"
                                    colorScheme="green"
                                    id="live-mode"
                                    onChange={() => onUpdate('liveUpdates', !preferences.liveUpdates)}
                                />
                            </FormControl>
                            {/* <FormControl d="flex" w="full" alignItems="center" justifyContent="center">
                                <FormLabel htmlFor="update-styles" fontSize="xs" mx={0} mr={3} w="100%">
                                    Update color styles
                                </FormLabel>
                                <Switch
                                    isChecked={preferences.updateStyles}
                                    size="sm"
                                    colorScheme="green"
                                    id="update-styles"
                                    onChange={() => onUpdate('updateStyles', !preferences.updateStyles)}
                                />
                            </FormControl> */}
                            <Divider />
                            <Flex color="gray.400" d="flex">
                                Made with ❤️ by
                                <Link color="gray.600" ml={1} href="https://www.figma.com/@angelolibero" isExternal>
                                    @angelolibero
                                </Link>
                            </Flex>
                        </Stack>
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default PreferencesDrawerButton;
