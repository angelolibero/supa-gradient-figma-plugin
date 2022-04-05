import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {Flex, Button, FlexProps, Text, Tooltip, SlideFade, Badge} from '@chakra-ui/react';
import {GradientPaintType, GradientStops} from '../../typings';
import {useClipboard} from '@chakra-ui/react';
import {MdCode} from 'react-icons/md';
import {bgColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {checkredGradientProps} from '../../lib/constants';

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
            <Flex {...checkredGradientProps} w="100%" h="100%" overflow="hidden" minH="100px" {...rest}>
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
                            <Badge size="sm" fontSize="xs" borderRadius="sm" maxW="150px" h={5} lineHeight={5}>
                                <Text isTruncated>{name}</Text>
                            </Badge>
                        )}
                        {/* </SlideFade> */}
                    </Flex>

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
                </Flex>
            </Flex>
        )
    );
};

export default GradientPreview;
