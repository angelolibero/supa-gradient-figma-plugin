import * as React from 'react';
import {useCallback, useState, FC} from 'react';
import {
    IconButton,
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
} from '@chakra-ui/react';
import {Preferences} from '../../../typings';
import {MdMoreVert} from 'react-icons/md';

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
                <DrawerHeader p={4} fontSize="md">
                    Preferences
                </DrawerHeader>
                <DrawerBody w="full" px={4}>
                    <Stack direction="row" boxSize="100%" flex="1">
                        <Stack w="full" spacing={3}>
                            {/* liveUpdates */}
                            <FormControl d="flex" w="full" alignItems="center" justifyContent="center">
                                <FormLabel htmlFor="live-mode" mx={0} mr={3} w="100%">
                                    <Stack flex="1" spacing={0}>
                                        <Text fontSize="xs">Live updates</Text>
                                        <Text fontSize="xs" color="gray.400">
                                            Update selection automatically or manually
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
                            {/* updateStyles */}
                            <FormControl d="flex" w="full" alignItems="center" justifyContent="center">
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
                            </FormControl>
                        </Stack>
                    </Stack>
                </DrawerBody>
                <DrawerFooter p={4}>
                    <Stack direction="row" w="full" spacing={2}>
                        <Button w="full" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </Stack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default PreferencesDrawerButton;