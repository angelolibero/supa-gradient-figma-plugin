import * as React from 'react';
import {useMemo} from 'react';
import {Flex, Button} from '@chakra-ui/react';
import {GradientStops} from '../typings';
import {useClipboard} from '@chakra-ui/react';
import {MdCopyAll} from 'react-icons/md';
import {bgGradientColorsFromStops, bgGradientFromColors} from '../lib/colors';

type Props = {
    gradientStops: GradientStops;
    angle: number;
};

const GradientPreview: React.FC<Props> = ({gradientStops, angle}) => {
    const [value, setValue] = React.useState('');
    const {hasCopied, onCopy} = useClipboard(value);

    const bgGradientColors = useMemo(() => {
        return bgGradientColorsFromStops(gradientStops);
    }, [gradientStops, angle]);

    const bgGradient = useMemo(() => {
        return bgGradientFromColors(bgGradientColors, angle);
    }, [angle, gradientStops]);

    React.useEffect(() => {
        bgGradient && setValue(`background-image: ${bgGradient};`);
    }, [bgGradient]);

    return (
        <Flex
            w="100%"
            h="80px"
            borderRadius="md"
            bgGradient={bgGradient}
            alignItems="flex-start"
            justifyContent="flex-end"
            p={2}
        >
            <Button size="xs" h={4} w={4} p={0} onClick={onCopy} colorScheme={hasCopied ? 'primary' : 'gray'}>
                <MdCopyAll />
            </Button>
        </Flex>
    );
};

export default GradientPreview;
