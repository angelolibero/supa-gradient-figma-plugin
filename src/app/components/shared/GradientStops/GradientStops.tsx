import * as React from 'react';
import {useState, useMemo, useEffect} from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import GradientPalette from './GradientPalette';
import {Box} from '@chakra-ui/react';
import {sortPalette, getPaletteColor, mapIdToPalette, mapPaletteToStops} from '../../../lib/palette';
import {
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    DEFAULT_STOP_REMOVAL_DROP,
    DEFAULT_MIN_STOPS,
    DEFAULT_MAX_STOPS,
    HALF_STOP_WIDTH,
} from '../../../lib/constants';
import GradientStopsList from './GradientStopsList';
import '../../../styles/picker.css';
import {paletteToGradientStops} from '../../../lib/colors';

const nextColorId = (palette) => Math.max(...palette.map(({id}) => id)) + 1;

const GradientStops = ({
    gradientStops,
    palette,
    paletteHeight = DEFAULT_HEIGHT,
    width = DEFAULT_WIDTH,
    stopRemovalDrop = DEFAULT_STOP_REMOVAL_DROP,
    minStops = DEFAULT_MIN_STOPS,
    maxStops = DEFAULT_MAX_STOPS,
    onChange,
    onColorStopSelect,
    ...rest
}) => {
    palette = mapIdToPalette(palette);

    const [defaultActiveColor] = palette;
    const [activeColorId, setActiveColorId] = useState(defaultActiveColor.id);

    const limits = useMemo(() => {
        const min = -HALF_STOP_WIDTH;
        const max = width - HALF_STOP_WIDTH;

        return {min, max, drop: stopRemovalDrop};
    }, [width]);

    const handleColorAdd = ({offset}) => {
        if (palette.length >= maxStops) return;

        const {color} = getPaletteColor(palette, activeColorId);
        const entry = {id: nextColorId(palette), offset: offset / width, color};

        const updatedPalette = [...palette, entry];

        setActiveColorId(entry.id);
        handlePaletteChange(updatedPalette);
    };

    const handleColorDelete = (id) => {
        if (palette.length <= minStops) return;

        const updatedPalette = palette.filter((c) => c.id !== id);
        const activeId = updatedPalette.reduce((a, x) => (x.offset < a.offset ? x : a), updatedPalette[0]).id;

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
        palette = palette.map((c) => (activeColorId === c.id ? {...c, color, opacity} : c));
        handlePaletteChange(palette);
    };

    const handlePaletteChange = (palette) => {
        const sortedPalette = sortPalette(palette).map(({offset, id, ...rest}) => ({
            ...rest,
            id,
            offset: Number(offset).toFixed(3),
            active: id === activeColorId,
        }));

        onChange && onChange(paletteToGradientStops(sortedPalette));
    };

    const handleStopPosChange = ({id, offset}) => {
        const updatedPalette = palette.map((c) =>
            id === c.id ? {...c, offset: (offset + HALF_STOP_WIDTH) / width} : c
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
        <Box d="flex" flexDirection="column" alignItems="center" width={220} {...rest}>
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
