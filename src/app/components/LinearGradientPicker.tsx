import * as React from 'react';
import {Box, useControllableState} from '@chakra-ui/react';
import {Panel as ColorPicker} from 'rc-color-picker';
import {GradientPicker} from 'react-linear-gradient-picker';
import {GradientStops, Palette} from '../typings';
import {paletteFromGradientStops, paletteToGradientStops} from '../lib/colors';

type Props = {
    onChange: (palette: GradientStops) => void;
    defaultValue?: GradientStops;
    value?: GradientStops;
};

const LinearGradientPicker: React.FC<Props> = ({onChange, value, defaultValue}) => {
    const [palette, setPalette] = useControllableState<Palette>({
        value: paletteFromGradientStops(value),
        defaultValue: paletteFromGradientStops(defaultValue),
    });

    const didChangePalette = React.useCallback(
        (palette) => {
            setPalette(palette);
            onChange && onChange(paletteToGradientStops(palette));
        },
        [palette, defaultValue, value]
    );

    return (
        <Box>
            <GradientPicker
                {...{
                    width: 268,
                    paletteHeight: 24,
                    palette,
                    onPaletteChange: didChangePalette,
                }}
            ></GradientPicker>
        </Box>
    );
};

const WrappedColorPicker = ({onSelect, ...rest}) => (
    <ColorPicker
        {...rest}
        onChange={(c) => {
            onSelect(c.color, c.alpha / 100);
        }}
    />
);

export default LinearGradientPicker;
