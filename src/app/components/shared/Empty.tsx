import * as React from 'react';
import {FC} from 'react';
import {StackProps, Stack, List, ListIcon, ListItem, Text} from '@chakra-ui/react';
import {MdCheckCircle} from 'react-icons/md';

type Props = {} & StackProps;

const Empty: FC<Props> = ({...rest}) => {
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
            <Stack>
                <Text textAlign="center" fontSize="sm" fontWeight="semibold">
                    Selection has't gradients fills
                </Text>
                <Text textAlign="center" fontSize="xs">
                    Here is what you can do:
                </Text>
            </Stack>
            <List fontSize="xs" w="100%" textAlign="center" alignItems="center" justifyContent="center">
                <ListItem d="flex">
                    <ListIcon as={MdCheckCircle} color="primary.500" d="inline-block" />
                    <Text>Select a layer with linear gradient</Text>
                </ListItem>
                <ListItem d="flex">
                    <ListIcon as={MdCheckCircle} color="primary.500" d="inline-block" />
                    <Text> Select a existing gradient</Text>
                </ListItem>
                <ListItem d="flex">
                    <ListIcon as={MdCheckCircle} color="primary.500" d="inline-block" />
                    <Text> Or create a new gradient</Text>
                </ListItem>
            </List>
        </Stack>
    );
};

export default Empty;
