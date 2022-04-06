import * as React from 'react';
import {useMemo} from 'react';
import {Box, BoxProps, useControllableState} from '@chakra-ui/react';
import {GradientStopsType, Palette} from '../../typings';
import {paletteFromGradientStops, paletteToGradientStops} from '../../lib/colors';
import GradientStops from './GradientStops/GradientStops';

type Props = {
    onChange: (stops: GradientStopsType) => void;
    defaultValue?: GradientStopsType;
    value?: GradientStopsType;
} & Omit<BoxProps, 'value' | 'defaultValue' | 'onChange'>;

const GradientStopsEditor: React.FC<Props> = ({onChange, value, defaultValue, children, ...rest}) => {
    const [gradientStops, setGradientStops] = useControllableState<GradientStopsType>({value, defaultValue});
    const palette = useMemo(() => paletteFromGradientStops(gradientStops), [gradientStops]);

    //    const debouncedPalette = useDebounce(palette, 200);

    // const handleOnChangePalette = React.useCallback(
    //     (palette) => {
    //         console.log('handleOnChangePalette', gradientStops);
    //         setGradientStops(palette);
    //         onChange && onChange(paletteToGradientStops(palette));
    //     },
    //     [palette, defaultValue, gradientStops]
    // );

    const handleOnColorStopSelect = React.useCallback(
        (color) => {
            console.log('handleOnColorStopSelect', gradientStops);
            //            setGradientStops(gradientStops);
            //  onChange && onChange(updatedStops);
        },
        [palette, defaultValue, gradientStops]
    );

    // const handleOnChangeStops = React.useCallback(
    //     (stops) => {
    //         //  if (JSON.stringify(stops) != JSON.stringify(debouncedPalette)) {
    //         console.log('handleOnChangeStops', stops);
    //         onChange && onChange(stops);
    //         setGradientStops(stops);
    //     },
    //     [onChange]
    // );

    return (
        <GradientStops
            gradientStops={gradientStops}
            palette={palette}
            onChange={onChange}
            onColorStopSelect={handleOnColorStopSelect}
            {...rest}
            width={220}
        />
    );
};

export default GradientStopsEditor;
