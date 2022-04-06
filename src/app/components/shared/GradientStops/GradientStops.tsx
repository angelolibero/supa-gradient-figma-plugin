import * as React from 'react';
import {useState, useMemo} from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import GradientPalette from './GradientPalette';
import {Box} from '@chakra-ui/react';
import {sortPalette, getPaletteColor, mapIdToPalette, mapPaletteToStops} from '../../../lib/palette';
import GradientStopsList from './GradientStopsList';
import {paletteToGradientStops} from '../../../lib/colors';
import {
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    DEFAULT_STOP_REMOVAL_DROP,
    DEFAULT_MIN_STOPS,
    DEFAULT_MAX_STOPS,
    HALF_STOP_WIDTH,
} from '../../../lib/constants';

const nextColorId = (palette) => Math.max(...palette.map(({id}) => id)) + 1;

const GradientStops = ({
    gradientStops,
    paletteHeight = DEFAULT_HEIGHT,
    width = DEFAULT_WIDTH,
    stopRemovalDrop = DEFAULT_STOP_REMOVAL_DROP,
    minStops = DEFAULT_MIN_STOPS,
    maxStops = DEFAULT_MAX_STOPS,
    onChange,
    onColorStopSelect = undefined,
    ...rest
}) => {
    const palette = mapIdToPalette(gradientStops);

    const [defaultActiveColor] = palette;
    const [activeColorId, setActiveColorId] = useState(defaultActiveColor.id);

    const limits = useMemo(() => {
        const min = -HALF_STOP_WIDTH;
        const max = width - HALF_STOP_WIDTH;

        return {min, max, drop: stopRemovalDrop};
    }, [width]);

    const handleColorAdd = ({position}) => {
        if (palette.length >= maxStops) return;

        const {color} = getPaletteColor(palette, activeColorId);
        const entry = {id: nextColorId(palette), position: position / width, color};

        const updatedPalette = [...palette, entry];

        setActiveColorId(entry.id);
        handlePaletteChange(updatedPalette);
    };

    const handleColorDelete = (id) => {
        if (palette.length <= minStops) return;

        const updatedPalette = palette.filter((c) => c.id !== id);
        const activeId = updatedPalette.reduce((a, x) => (x.position < a.position ? x : a), updatedPalette[0]).id;

        setActiveColorId(activeId);
        handlePaletteChange(updatedPalette);
    };

    const onStopDragStart = (id) => {
        if (id !== activeColorId) {
            setActiveColorId(id);

            const color = palette.find((color) => color.id === id);
            onColorStopSelect(color);
        }
    };

    const handleColorSelect = (color, opacity = 1) => {
        const updatedPalette = palette.map((c) => (activeColorId === c.id ? {...c, color, opacity} : c));
        handlePaletteChange(updatedPalette);
    };

    const handlePaletteChange = (palette) => {
        const sortedPalette = sortPalette(palette).map(({position, id, ...rest}) => ({
            ...rest,
            id,
            position: Number(position).toFixed(3),
            active: id === activeColorId,
        }));

        onChange && onChange(paletteToGradientStops(sortedPalette));
    };

    const handleStopPosChange = ({id, position}) => {
        const updatedPalette = palette.map((c) =>
            id === c.id ? {...c, position: (position + HALF_STOP_WIDTH) / width} : c
        );

        handlePaletteChange(updatedPalette);
    };

    const activePaletteColor = React.useMemo(() => {
        const {color, opacity} = getPaletteColor(palette, activeColorId);
        return {currentColor: color, opacity};
    }, [palette, activeColorId]);

    const paletteWidth = width - HALF_STOP_WIDTH;
    const stopsHolderDisabled = palette.length >= maxStops;

    return (
        <Box d="flex" flexDirection="column" alignItems="center" w="100%" {...rest}>
            <GradientPalette width={paletteWidth} height={paletteHeight} palette={palette} />
            <ColorStopsHolder
                width={paletteWidth}
                disabled={stopsHolderDisabled}
                stops={mapPaletteToStops({
                    palette,
                    width: paletteWidth,
                    activeId: activeColorId,
                })}
                limits={limits}
                onPosChange={handleStopPosChange}
                onAddColor={handleColorAdd}
                onDeleteColor={handleColorDelete}
                onDragStart={onStopDragStart}
            />
            <GradientStopsList
                pt={3}
                pb={2}
                activeColorId={activeColorId}
                gradientStops={gradientStops}
                onChange={onChange}
                onSelect={handleColorSelect}
                {...activePaletteColor}
            />
        </Box>
    );
};

export default GradientStops;
