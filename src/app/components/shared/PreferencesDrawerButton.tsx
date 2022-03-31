import * as React from 'react';
import {useCallback, useEffect, useState, FC} from 'react';
import {
    IconButton,
    Tooltip,
    Text,
    Stack,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerProps,
    useDisclosure,
    ButtonProps,
    FormControl,
    FormLabel,
    Switch,
    Flex,
} from '@chakra-ui/react';
import {MdAdd, MdMoreVert} from 'react-icons/md';
import {Preferences} from '../../typings';

type Props = {
    defaultPreferences: Preferences;
    onChange: (preferences: Preferences) => void;
} & Omit<ButtonProps, 'onCreate'>;

const PreferencesDrawerButton: FC<Props> = ({defaultPreferences, onChange, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = React.useRef();
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

    const updatePrefrences = useCallback(
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
        // This is how we read messages sent from the plugin controller
        const onMessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'figma:preferencesupdate') {
                console.log('figma:preferencesupdate!!!!!');
                setPreferences(message.preferences);
            }
        };
        window.onmessage = onMessage;
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return (
        <>
            <Tooltip label="Preferences">
                <IconButton
                    icon={<MdMoreVert />}
                    aria-label="Show preferences"
                    ref={btnRef}
                    onClick={onOpen}
                    size="md"
                    fontSize="md"
                    {...rest}
                />
            </Tooltip>
            <PreferencesDrawer
                preferences={preferences}
                isOpen={isOpen}
                placement="bottom"
                onClose={onClose}
                btnRef={btnRef}
                onUpdate={updatePrefrences}
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
                <DrawerHeader pb={4}>Preferences</DrawerHeader>
                <DrawerBody w="full">
                    <Stack direction="row" boxSize="100%" flex="1">
                        <Stack w="full" spacing={4}>
                            {/* liveUpdates */}
                            <FormControl d="flex" w="full" alignItems="center" justifyContent="center">
                                <FormLabel htmlFor="live-mode" mx={0} mr={3} w="100%">
                                    <Stack flex="1" spacing={0}>
                                        <Text fontSize="sm">Live updates</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            Update selection automatically or manually
                                        </Text>
                                    </Stack>
                                </FormLabel>
                                <Switch
                                    isChecked={preferences.liveUpdates}
                                    size="md"
                                    colorScheme="green"
                                    id="live-mode"
                                    onChange={(event) => onUpdate('liveUpdates', !preferences.liveUpdates)}
                                />
                            </FormControl>
                            {/* updateStyles */}
                            <FormControl d="flex" w="full" alignItems="center" justifyContent="center">
                                <FormLabel htmlFor="update-styles" fontSize="sm" mx={0} mr={3} w="100%">
                                    Update color styles
                                </FormLabel>
                                <Switch
                                    isChecked={preferences.updateStyles}
                                    size="md"
                                    colorScheme="green"
                                    id="update-styles"
                                    onChange={(event) => onUpdate('updateStyles', !preferences.updateStyles)}
                                />
                            </FormControl>
                        </Stack>
                    </Stack>
                </DrawerBody>
                <DrawerFooter pt={4}>
                    <Stack direction="row" w="full">
                        <Button w="full" size="md" onClick={onClose}>
                            Close
                        </Button>
                    </Stack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default PreferencesDrawerButton;
