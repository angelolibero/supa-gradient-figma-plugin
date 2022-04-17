import * as React from 'react';
import {FC, useEffect, useMemo, useState} from 'react';
import {Flex, Button, FlexProps, Text, Tooltip} from '@chakra-ui/react';
import {GradientPaintType, GradientStops} from '../../typings';
import {useClipboard} from '@chakra-ui/react';
import {MdCode} from 'react-icons/md';
import {bgColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {CHECKERED_GRADIENT_PROPS, DEFAULT_FIGMA_NOTIFICATION_TIMEOUT} from '../../lib/constants';

type Props = {
    name?: string;
    angle: number;
    gradientStops: GradientStops;
    gradientTransform: Transform;
    gradientType: GradientPaintType;
    gradientScale: number;
} & FlexProps;

const GradientPreview: FC<Props> = ({
    name,
    angle,
    gradientStops,
    gradientTransform,
    gradientType,
    gradientScale,
    ...rest
}) => {
    const [value, setValue] = useState('');
    const {hasCopied, onCopy} = useClipboard(value);

    const isGradient = useMemo(() => !!gradientStops, [gradientStops]);

    const styleName = useMemo(() => {
        const splittedName = name && name.split('/');
        return name && splittedName[splittedName.length - 1];
    }, [name]);

    // const stylePath = useMemo(() => {
    //     const splittedName = name && name.split('/');
    //     splittedName.splice(splittedName.length - 1, 1);
    //     return splittedName;
    // }, [name]);

    const bgGradient = useMemo(() => {
        const bgGradientColors = bgColorsFromStops(gradientStops);
        return bgGradientFromColors(bgGradientColors, angle, gradientType);
    }, [gradientStops, gradientType, gradientScale, angle]);

    const bgSize = useMemo(() => {
        return gradientType == 'GRADIENT_RADIAL' && `${100 / gradientScale}% ${100 / gradientScale}%;`;
    }, [gradientScale, gradientType]);

    useEffect(() => {
        bgGradient &&
            setValue(
                `background-image: ${bgGradient};` +
                    (gradientType == 'GRADIENT_RADIAL'
                        ? `background-size: ${100 / gradientScale}% ${100 / gradientScale}%;`
                        : '') +
                    'background-position: center center;'
            );
    }, [bgGradient, gradientType, gradientScale]);

    useEffect(() => {
        if (hasCopied) {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'notify',
                        title: 'CSS code copied!',
                        timeout: DEFAULT_FIGMA_NOTIFICATION_TIMEOUT,
                    },
                },
                '*'
            );
        }
    }, [hasCopied]);

    return (
        isGradient && (
            <Flex {...CHECKERED_GRADIENT_PROPS} w="100%" overflow="hidden" minH="96px" maxH="96px" {...rest}>
                <Flex
                    w="100%"
                    h="inherit"
                    bgGradient={bgGradient}
                    bgSize={bgSize}
                    bgRepeat="no-repeat"
                    bgPos="center center"
                    alignItems={isGradient ? 'flex-end' : 'center'}
                    justifyContent={isGradient ? 'flex-end' : 'center'}
                    p={2}
                    transition="all 0.25s"
                >
                    <Flex w="100%" alignItems="flex-start">
                        {/* <SlideFade in={!!name} offsetY={-2}> */}
                        {styleName && (
                            <Flex
                                borderRadius="sm"
                                bgColor={'blackAlpha.500'}
                                color="gray.100"
                                flexDir="column"
                                py={1}
                                px={2}
                                textAlign="left"
                                alignItems="flex-start"
                                lineHeight={3}
                            >
                                {/* <Text fontSize="xxs" isTruncated>
                                    {stylePath.join('/')}/
                                </Text> */}
                                <Text isTruncated maxW="150px">
                                    {styleName}
                                </Text>
                            </Flex>
                        )}
                        {/* </SlideFade> */}
                    </Flex>

                    <Tooltip label="Copy CSS" placement="top-start">
                        <Button
                            h={5}
                            w={5}
                            minW={5}
                            px={0}
                            onClick={onCopy}
                            size="sm"
                            fontSize="sm"
                            colorScheme="blackAlpha"
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
