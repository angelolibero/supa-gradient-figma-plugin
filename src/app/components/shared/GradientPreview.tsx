import * as React from 'react';
import {useEffect} from 'react';
import {useMemo, useCallback} from 'react';
import {
    Flex,
    Button,
    FlexProps,
    Text,
    Tooltip,
    SlideFade,
    Badge,
    Stack,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react';
import {GradientStops} from '../../typings';
import {useClipboard} from '@chakra-ui/react';
import {MdCheckCircle, MdCode} from 'react-icons/md';
import {bgGradientColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {checkredGradientProps} from '../../lib/constants';
import CreateStyleDrawerButton from './CreateStyleDrawerButton';

type Props = {
    name?: string;
    angle: number;
    gradientStops: GradientStops;
    gradientTransform: Transform;
} & FlexProps;

const GradientPreview: React.FC<Props> = ({name, angle, gradientStops, gradientTransform, ...rest}) => {
    const [value, setValue] = React.useState('');
    const {hasCopied, onCopy} = useClipboard(value);

    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);

    const bgGradientColors = useMemo(() => {
        return bgGradientColorsFromStops(gradientStops);
    }, [gradientStops, angle]);

    const bgGradient = useMemo(() => {
        return bgGradientFromColors(bgGradientColors, angle);
    }, [angle, gradientStops]);

    const InvalidSelection = useCallback(() => {
        return (
            <Stack py={4} px={4} spacing={3} alignItems="center" justifyContent="center">
                <Stack>
                    <Text textAlign="center" fontSize="sm" fontWeight="bold">
                        Selection has't gradients fills
                    </Text>
                    <Text textAlign="center" fontSize="xs">
                        Here is what you can do:
                    </Text>
                </Stack>
                <List fontSize="xs" w="100%" textAlign="center" alignItems="center" justifyContent="center">
                    <ListItem d="flex">
                        <ListIcon as={MdCheckCircle} color="primary.500" d="inline-block" />
                        <Text>Select a layer with linear gradient or create new gradient</Text>
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
    }, []);

    useEffect(() => {
        bgGradient && setValue(`background-image: ${bgGradient};`);
    }, [bgGradient]);

    useEffect(() => {
        if (hasCopied) {
            parent.postMessage({pluginMessage: {type: 'notify', title: 'CSS code copied!', timeout: 1000}}, '*');
        }
    }, [hasCopied]);

    return (
        <Flex
            {...checkredGradientProps}
            w="100%"
            h="100%"
            // h={!isGradient ? '100%' : '100px'}
            borderRadius="md"
            overflow="hidden"
        >
            <Flex
                w="100%"
                h="inherit"
                bgGradient={bgGradient}
                alignItems={isGradient ? 'flex-start' : 'center'}
                justifyContent={isGradient ? 'flex-end' : 'center'}
                p={2}
                bgColor={!isGradient && 'gray.100'}
                transition="all 0.25s"
                {...rest}
            >
                {/* {!isGradient && <InvalidSelection />} */}
                {1 && (
                    <Flex w="100%" alignItems="flex-start">
                        <SlideFade in={!!name} offsetY={-2}>
                            <Badge size="sm" fontSize="xs" borderRadius="sm" maxW="150px" h={5} lineHeight={5}>
                                <Text isTruncated>{name}</Text>
                            </Badge>
                        </SlideFade>
                    </Flex>
                )}

                {isGradient && (
                    <Tooltip label="Copy CSS">
                        <Button
                            h={5}
                            w={5}
                            minW={5}
                            px={0}
                            onClick={onCopy}
                            colorScheme={hasCopied ? 'primary' : 'gray'}
                            size="sm"
                            fontSize="sm"
                        >
                            <MdCode />
                        </Button>
                    </Tooltip>
                )}
            </Flex>
        </Flex>
    );
};

export default GradientPreview;
