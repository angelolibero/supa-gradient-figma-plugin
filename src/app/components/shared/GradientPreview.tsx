import * as React from 'react';
import {useEffect} from 'react';
import {useMemo} from 'react';
import {Flex, Button, FlexProps, Text, Tooltip} from '@chakra-ui/react';
import {GradientStops} from '../../typings';
import {useClipboard} from '@chakra-ui/react';
import {MdCode, MdCopyAll} from 'react-icons/md';
import {bgGradientColorsFromStops, bgGradientFromColors} from '../../lib/colors';

type Props = {
    gradientStops: GradientStops;
    angle: number;
} & FlexProps;

const GradientPreview: React.FC<Props> = ({gradientStops, angle, ...rest}) => {
    const [value, setValue] = React.useState('');
    const {hasCopied, onCopy} = useClipboard(value);

    const bgGradientColors = useMemo(() => {
        return bgGradientColorsFromStops(gradientStops);
    }, [gradientStops, angle]);

    const bgGradient = useMemo(() => {
        return bgGradientFromColors(bgGradientColors, angle);
    }, [angle, gradientStops]);

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
            w="100%"
            h="100px"
            borderRadius="md"
            bgGradient={bgGradient}
            alignItems="flex-start"
            justifyContent="flex-end"
            p={2}
            bgColor={!gradientStops && 'gray.100'}
            {...rest}
        >
            {!gradientStops && <Text>No gradient selected</Text>}
            {gradientStops && (
                <Tooltip label="Copy CSS code">
                    <Button h={5} w={5} minW={5} px={0} onClick={onCopy} colorScheme={hasCopied ? 'primary' : 'gray'}>
                        <MdCode />
                    </Button>
                </Tooltip>
            )}
        </Flex>
    );
};

export default GradientPreview;
