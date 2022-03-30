import * as React from 'react';
import {useState} from 'react';
import {Box, useControllableState} from '@chakra-ui/react';
import {Panel as ColorPicker} from 'rc-color-picker';
import {GradientPicker} from 'react-linear-gradient-picker';
import 'react-linear-gradient-picker/dist/index.css';
import {Palette} from '../typings';

type Props = {
    onChangePalette: (palette: Palette) => void;
    defaultValue?: Palette;
    value?: Palette;
};

const LinearGradientPicker: React.FC<Props> = ({onChangePalette, value, defaultValue}) => {
    const [palette, setPalette] = useControllableState({value, defaultValue});

    const didChangePalette = React.useCallback(
        (palette) => {
            setPalette(palette);
            onChangePalette && onChangePalette(palette);
        },
        [palette]
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
