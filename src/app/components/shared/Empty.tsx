import * as React from 'react';
import {FC, useRef, useCallback} from 'react';
import {StackProps, Stack, Button, Text, useDisclosure} from '@chakra-ui/react';
import {CreateStyleDrawer} from './Drawers/CreateStyleDrawerButton';
import {DEFAULT_GRADIENT_PAINT} from '../../lib/constants';
import {CollectionDrawer} from './Drawers/CollectionDrawerButton';
import {MdAdd} from 'react-icons/md';
import TidyUpGridIcon from '../icons/TidyUpGridIcon';

type Props = {
    onCreate?: (name: string, paint: GradientPaint) => void;
    onSelect?: (paint: GradientPaint, name?: string) => void;
} & Omit<StackProps, 'onSelect'>;

const Empty: FC<Props> = ({onCreate, onSelect, ...rest}) => {
    const {isOpen: isCreateOpen, onOpen: onOpenCreate, onClose: onCloseCreate} = useDisclosure();
    const {isOpen: isLibraryOpen, onOpen: onOpenLibrary, onClose: onCloseLibrary} = useDisclosure();

    const btnRef = useRef<HTMLButtonElement>();

    const handleOnCreate = useCallback(
        (name: string, paint: GradientPaint) => {
            if (!name || name.length == 0) return;
            onCreate(name, paint);
            onCloseCreate();
        },
        [onCreate]
    );

    const handleOnSelect = useCallback(
        (paint: GradientPaint, name?: string) => {
            onSelect(paint, name);
            onCloseLibrary();
        },
        [onSelect]
    );

    return (
        <Stack
            py={4}
            px={8}
            spacing={3}
            alignItems="center"
            justifyContent="center"
            bgColor={'gray.100'}
            _dark={{
                bgColor: 'gray.800',
            }}
            boxSize={'100%'}
            {...rest}
        >
            <Stack pb={4} spacing={1}>
                <Text textAlign="center" fontSize="sm" fontWeight="semibold">
                    No gradients found
                </Text>
                <Text textAlign="center" fontSize="xs" color="gray.500">
                    Create a new gradient or explore our collection of supa-gradients.
                </Text>
            </Stack>
            <Button
                w="full"
                leftIcon={<MdAdd />}
                bgColor="white"
                _hover={{bgColor: 'gray.50'}}
                _dark={{
                    bgColor: 'gray.700',
                    _hover: {bgColor: 'gray.600'},
                }}
                size="sm"
                ref={btnRef}
                onClick={onOpenCreate as any}
            >
                Create gradient
            </Button>
            <Button
                w="full"
                leftIcon={<TidyUpGridIcon fill="white" />}
                size="sm"
                ref={btnRef}
                onClick={onOpenLibrary as any}
                colorScheme="primary"
            >
                Explore collection
            </Button>
            <CreateStyleDrawer
                gradientPaint={DEFAULT_GRADIENT_PAINT}
                isOpen={isCreateOpen}
                onClose={onCloseCreate}
                onCreate={handleOnCreate}
                btnRef={btnRef}
            />
            <CollectionDrawer
                isOpen={isLibraryOpen}
                onClose={onCloseLibrary}
                onSelect={handleOnSelect}
                btnRef={btnRef}
            />
        </Stack>
    );
};

export default Empty;
