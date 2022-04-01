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
import {MdAdd, MdCheckCircle, MdCode, MdCopyAll} from 'react-icons/md';
import {bgGradientColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {checkredGradient} from '../../lib/utils';
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

    // const clearSelection = useCallback(() => {
    //     parent.postMessage(
    //         {
    //             pluginMessage: {
    //                 type: 'clear-selection',
    //             },
    //         },
    //         '*'
    //     );
    // }, []);

    const handleCreateStyle = useCallback(
        (name: string, gradientPaing: GradientPaint) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'create-style',
                        gradientStops: gradientStops,
                        gradientTransform: gradientTransform,
                        name: name,
                    },
                },
                '*'
            );
        },
        [gradientStops, gradientTransform]
    );

    useEffect(() => {
        bgGradient && setValue(`background-image: ${bgGradient};`);
    }, [bgGradient]);

    useEffect(() => {
        if (hasCopied) {
            parent.postMessage({pluginMessage: {type: 'notify', title: 'CSS code copied!', timeout: 1000}}, '*');
        }
    }, [hasCopied]);

    return (
        <Flex {...checkredGradient} w="100%" h={!isGradient ? '100%' : '100px'} borderRadius="md" overflow="hidden">
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
                {!isGradient && (
                    <Stack py={4} px={8} spacing={4} alignItems="center" justifyContent="center">
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
                                <Text>Select a layer with linear gradient fill to edit</Text>
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
                        <CreateStyleDrawerButton
                            gradientPaint={{type: 'GRADIENT_ANGULAR', gradientStops, gradientTransform}}
                            onCreate={handleCreateStyle}
                        />
                    </Stack>
                )}
                {name && (
                    <Flex w="100%" alignItems="flex-start">
                        <SlideFade in={!!name} offsetY={-2}>
                            <Badge size="sm" fontSize="xs" rounded="md" maxW="150px" h={5} lineHeight={5}>
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
