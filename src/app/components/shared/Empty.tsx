import * as React from 'react';
import {FC, useRef, useCallback} from 'react';
import {StackProps, Stack, Button, Text, useDisclosure} from '@chakra-ui/react';
import {MdAdd} from 'react-icons/md';
import {CreateStyleDrawer} from './Drawers/CreateStyleDrawerButton';
import {DEFAULT_GRADIENT_PAINT} from '../../lib/constants';

type Props = {onCreate?: (name: string, paint: GradientPaint) => void} & StackProps;

const Empty: FC<Props> = ({onCreate, ...rest}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>();

    const handleOnCreate = useCallback((name: string, paint: GradientPaint) => {
        if (!name || name.length == 0) return;
        onCreate(name, paint);
        onClose();
    }, []);

    return (
        <Stack
            py={4}
            px={4}
            spacing={3}
            alignItems="center"
            justifyContent="center"
            bgColor={'gray.100'}
            boxSize={'100%'}
            {...rest}
        >
            <Text textAlign="center" fontSize="sm" fontWeight="semibold">
                No gradients styles found
            </Text>
            <Button
                leftIcon={<MdAdd />}
                aria-label="Create style"
                rounded="full"
                border="1px dashed"
                borderColor="gray.200"
                bgColor="white"
                size="sm"
                ref={btnRef}
                onClick={onOpen as any}
            >
                Create gradient
            </Button>
            <CreateStyleDrawer
                gradientPaint={DEFAULT_GRADIENT_PAINT}
                isOpen={isOpen}
                onClose={onClose}
                onCreate={handleOnCreate}
                btnRef={btnRef}
            />
        </Stack>
    );
};

export default Empty;
