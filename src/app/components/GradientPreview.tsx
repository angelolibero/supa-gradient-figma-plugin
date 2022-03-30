import * as React from 'react';
import {useMemo} from 'react';
import {Box} from '@chakra-ui/react';
import {Palette} from '../typings';

type Props = {
    palette: Palette;
    angle: number;
};

const GradientPreview: React.FC<Props> = ({palette, angle}) => {
    const gradientColors = useMemo(() => {
        if (palette && palette.length) {
            const g = palette.map((value, index) => {
                return value.color + ' ' + parseFloat(new Number(value.offset).toFixed(2)) * 100 + '%';
            });
            return g;
        }
        return [];
    }, [palette]);

    const bgGradient = useMemo(() => {
        return `linear(${angle}deg, ${gradientColors})`;
    }, [angle, palette, gradientColors]);

    return <Box w="100%" h="80px" borderRadius="md" bgGradient={bgGradient} />;
};

export default GradientPreview;
