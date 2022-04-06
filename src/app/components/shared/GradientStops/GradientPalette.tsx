import * as React from 'react';
import {useMemo} from 'react';
import {sortPalette} from '../../../lib/palette';
import {Box} from '@chakra-ui/react';

const generateGradientId = () => '' + Math.random().toString(36).substr(2, 9);

const GradientPalette = ({palette, width, height}) => {
    const sortedPalette = sortPalette(palette);
    const gradientId = useMemo(generateGradientId, [palette.length]);

    return (
        <Box className="palette" width={width} height={height}>
            <svg width="100%" height="100%">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0.5" x2="1" y2="0.5">
                        {sortedPalette.map(({id, offset, color, opacity = 1}) => (
                            <stop key={id} offset={offset} style={{stopColor: color, stopOpacity: opacity}} />
                        ))}
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
            </svg>
        </Box>
    );
};

export default GradientPalette;
