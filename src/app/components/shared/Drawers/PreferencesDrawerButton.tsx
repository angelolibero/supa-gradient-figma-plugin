import * as React from 'react';
import {useCallback, useState, FC} from 'react';
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
} from '@chakra-ui/react';
import {Preferences} from '../../../typings';
import {MdMoreVert} from 'react-icons/md';
import Logo from '../Logo';

type Props = {
    DEFAULT_PREFERENCES: Preferences;
    onChange: (preferences: Preferences) => void;
} & Omit<ButtonProps, 'onCreate'>;

const PreferencesDrawerButton: FC<Props> = ({DEFAULT_PREFERENCES, onChange, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = React.useRef();
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

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
    btnRef: React.RefObject<HTMLButtonElement>;
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
                    <DrawerCloseButton boxSize={8} size="sm" rounded="sm" _focus={{boxShadow: 'none'}} />
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
                                        <Text fontSize="xs">Live editing</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            Edit styles and fills with real-time preview.
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
                                <Text color="gray.600" ml={1}>
                                    @angelolibero
                                </Text>
                            </Flex>
                        </Stack>
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default PreferencesDrawerButton;
