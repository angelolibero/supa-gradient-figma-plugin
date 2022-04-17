import * as React from 'react';
import {useMemo, useCallback} from 'react';
import {sortPalette} from '../../../lib/palette';
import {chakra} from '@chakra-ui/react';
import {RGBAObjetToString} from '../../../lib/colors';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import {Palette} from '../../../typings';

const generateGradientId = () => '' + Math.random().toString(36).substr(2, 9);

type Props = {palette: Palette; width: number; height: number};

const GradientPalette = ({palette, width, height}: Props) => {
    const gradientId = useMemo(generateGradientId, [palette.length]);
    const sortedPalette = useMemo(() => sortPalette(palette), [palette]);

    const rgbaColor = useCallback(RGBAObjetToString, [palette]);

    return (
        <chakra.div className="palette" width={width} height={height} {...CHECKERED_GRADIENT_PROPS}>
            <svg width="100%" height="100%">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0.5" x2="1" y2="0.5">
                        {sortedPalette.map(({id, position, color, opacity}) => (
                            <stop
                                key={id}
                                offset={position}
                                style={{stopColor: rgbaColor(color), stopOpacity: opacity}}
                            />
                        ))}
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
            </svg>
        </chakra.div>
    );
};

export default GradientPalette;
