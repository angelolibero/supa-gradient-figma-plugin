import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {Flex, Button, FlexProps, Text, Tooltip, Badge, Box, Center} from '@chakra-ui/react';
import {GradientPaintType, GradientStops} from '../../typings';
import {useClipboard} from '@chakra-ui/react';
import {MdArrowUpward, MdCode} from 'react-icons/md';
import {bgColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {CHECKERED_GRADIENT_PROPS} from '../../lib/constants';

type Props = {
    name?: string;
    angle: number;
    gradientStops: GradientStops;
    gradientTransform: Transform;
    gradientType: GradientPaintType;
} & FlexProps;

const GradientPreview: React.FC<Props> = ({name, angle, gradientStops, gradientTransform, gradientType, ...rest}) => {
    const [value, setValue] = React.useState('');
    const {hasCopied, onCopy} = useClipboard(value);

    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);

    const bgGradient = useMemo(() => {
        const bgGradientColors = bgColorsFromStops(gradientStops);
        return bgGradientFromColors(bgGradientColors, angle, gradientType);
    }, [gradientStops, gradientType, angle]);

    useEffect(() => {
        bgGradient && setValue(`background-image: ${bgGradient};`);
    }, [bgGradient]);

    useEffect(() => {
        if (hasCopied) {
            parent.postMessage({pluginMessage: {type: 'notify', title: 'CSS code copied!', timeout: 1000}}, '*');
        }
    }, [hasCopied]);

    return (
        isGradient && (
            <Flex {...CHECKERED_GRADIENT_PROPS} w="100%" overflow="hidden" minH="100px" maxH="100px" {...rest}>
                <Flex
                    w="100%"
                    h="inherit"
                    bgGradient={bgGradient}
                    alignItems={isGradient ? 'flex-start' : 'center'}
                    justifyContent={isGradient ? 'flex-end' : 'center'}
                    p={2}
                    transition="all 0.25s"
                >
                    <Flex w="100%" alignItems="flex-start">
                        {/* <SlideFade in={!!name} offsetY={-2}> */}
                        {name && (
                            <Badge
                                size="sm"
                                fontSize="xs"
                                borderRadius="sm"
                                bgColor={'blackAlpha.500'}
                                color="gray.100"
                                maxW="150px"
                                h={5}
                                lineHeight={5}
                            >
                                <Text isTruncated>{name}</Text>
                            </Badge>
                        )}
                        {/* </SlideFade> */}
                    </Flex>

                    <Tooltip label="Copy CSS" placement="auto-end">
                        <Button
                            h={5}
                            w={5}
                            minW={5}
                            px={0}
                            onClick={onCopy}
                            size="sm"
                            fontSize="sm"
                            bgColor={hasCopied ? 'primary.500' : 'blackAlpha.500'}
                            color="gray.100"
                            _hover={{
                                bgColor: hasCopied ? 'primary.600' : 'gray.800',
                            }}
                        >
                            <MdCode />
                        </Button>
                    </Tooltip>
                </Flex>
            </Flex>
        )
    );
};

export default GradientPreview;
