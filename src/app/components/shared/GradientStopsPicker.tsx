import * as React from 'react';
import {useMemo, useState} from 'react';
import {Box, BoxProps, useControllableState} from '@chakra-ui/react';
import {GradientStopsType, Palette} from '../../typings';
import {paletteFromGradientStops, paletteToGradientStops} from '../../lib/colors';
import GradientStopsList from './GradientStopsList';
import useDebounce from '../../lib/hooks/useDebounce';
import GradientStops from './GradientStops/GradientStops';

type Props = {
    onChange: (stops: GradientStopsType) => void;
    defaultValue?: GradientStopsType;
    value?: GradientStopsType;
} & Omit<BoxProps, 'value' | 'defaultValue' | 'onChange'>;

const GradientStopsPicker: React.FC<Props> = ({onChange, value, defaultValue, children, ...rest}) => {
    const [gradientStops, setGradientStops] = useControllableState<GradientStopsType>({value, defaultValue});
    const palette = useMemo(() => paletteFromGradientStops(gradientStops), [gradientStops]);

    //    const debouncedPalette = useDebounce(palette, 200);

    const handleOnChangePalette = React.useCallback(
        (palette) => {
            console.log('handleOnChangePalette', gradientStops);
            setGradientStops(palette);
            onChange && onChange(paletteToGradientStops(palette));
        },
        [palette, defaultValue, gradientStops]
    );

    const handleOnColorStopSelect = React.useCallback(
        (color) => {
            console.log('handleOnColorStopSelect', gradientStops);
            setGradientStops(gradientStops);
            //  onChange && onChange(updatedStops);
        },
        [palette, defaultValue, gradientStops]
    );

    const handleOnChangeStops = React.useCallback(
        (stops) => {
            //  if (JSON.stringify(stops) != JSON.stringify(debouncedPalette)) {
            console.log('handleOnChangeStops', stops);
            onChange && onChange(stops);
            setGradientStops(stops);
        },
        [onChange]
    );

    const gradientPickerProps = React.useMemo(() => {
        return {
            width: 220,
            palette,
            paletteHeight: 16,
            onPaletteChange: handleOnChangePalette,
            onColorStopSelect: handleOnColorStopSelect,
        };
    }, [onChange, palette]);

    return (
        <Box {...rest}>
            <GradientStops {...gradientPickerProps} />
            <WrapperStopsList gradientStops={gradientStops} onChange={handleOnChangeStops} />
        </Box>
    );
};

const WrapperStopsList = ({
    gradientStops,
    onChange,
    onSelect = undefined,
    color = undefined,
    activeColorId = undefined,
    ...rest
}) => {
    return (
        <>
            <GradientStopsList
                pt={3}
                pb={0}
                gradientStops={gradientStops}
                onChange={onChange}
                onSelect={(c) => {
                    console.log(c);
                    //   onSelect && onSelect('#666666', c.color.a);
                }}
                currentColor={color}
                activeColorId={activeColorId}
            />
        </>
    );
};
export default GradientStopsPicker;
