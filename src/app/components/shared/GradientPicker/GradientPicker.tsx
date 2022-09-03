import * as React from 'react';
import {FC, useState, useMemo, useCallback} from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import GradientPalette from './GradientPalette';
import {Box} from '@chakra-ui/react';
import {sortPalette, getPaletteColor, mapPalette, mapPaletteToStops} from '../../../lib/palette';
import GradientStopsList from './GradientStopsList';
import {
    DEFAULT_PALETTE_HEIGHT,
    DEFAULT_PALETTE_WIDTH,
    DEFAULT_STOP_REMOVAL_DROP,
    DEFAULT_MIN_STOPS,
    DEFAULT_MAX_STOPS,
    HALF_STOP_WIDTH,
} from '../../../lib/constants';
import {GradientStop, GradientStops} from '../../../typings';

const nextColorId = (palette) => Math.max(...palette.map(({id}) => id)) + 1;

type Props = {
    gradientStops: GradientStops;
    paletteHeight?: number;
    width?: number;
    stopRemovalDrop?: number;
    minStops?: number;
    maxStops?: number;
    onChange: (gradientStops: GradientStop[]) => void;
    onColorStopSelect?: (stop: GradientStop) => void;
};

const GradientPicker: FC<Props> = ({
    gradientStops,
    paletteHeight = DEFAULT_PALETTE_HEIGHT,
    width = DEFAULT_PALETTE_WIDTH,
    stopRemovalDrop = DEFAULT_STOP_REMOVAL_DROP,
    minStops = DEFAULT_MIN_STOPS,
    maxStops = DEFAULT_MAX_STOPS,
    onChange,
    onColorStopSelect,
    ...rest
}) => {
    const palette = useMemo(() => mapPalette(gradientStops), [gradientStops]);

    const [defaultActiveColor] = palette;
    const [activeColorId, setActiveColorId] = useState(defaultActiveColor.id);
    const [editColorId, setEditColorId] = useState(undefined);

    const paletteWidth = width;
    const stopsHolderDisabled = palette.length >= maxStops;

    const activePaletteColor = useMemo(() => {
        const {color, opacity} = getPaletteColor(palette, activeColorId);
        return {currentColor: color, opacity};
    }, [palette, activeColorId]);

    const limits = useMemo(() => {
        const min = -HALF_STOP_WIDTH;
        const max = width - HALF_STOP_WIDTH;

        return {min, max, drop: stopRemovalDrop};
    }, [width]);

    const stops = useMemo(() => {
        return mapPaletteToStops({
            palette: palette,
            width: paletteWidth,
            activeId: activeColorId,
        });
    }, [palette, paletteWidth, activeColorId]);

    const handleColorAdd = useCallback(
        ({position}) => {
            if (palette.length >= maxStops) return;

            const {color} = getPaletteColor(palette, activeColorId);
            const entry = {id: nextColorId(palette), position: position / width, color};

            const updatedPalette = [...palette, entry];
            setActiveColorId(entry.id);
            handlePaletteChange(updatedPalette);
        },
        [palette, activeColorId]
    );

    const handleColorDelete = useCallback(
        (id) => {
            if (palette.length <= minStops) return;

            const updatedPalette = palette.filter((c) => c.id !== id);
            const activeId = updatedPalette.reduce((a, x) => (x.position < a.position ? x : a), updatedPalette[0]).id;

            setActiveColorId(activeId);
            handlePaletteChange(updatedPalette);
        },
        [palette]
    );

    const onStopDragStart = useCallback(
        (id) => {
            if (id !== activeColorId) {
                setActiveColorId(id);
                const color = palette.find((color) => color.id === id);
                onColorStopSelect && onColorStopSelect(color);
            }
        },
        [activeColorId, palette, onColorStopSelect]
    );

    const handleColorSelect = useCallback(
        (color, opacity = 1) => {
            const updatedPalette = palette.map((c) => (activeColorId === c.id ? {...c, color, opacity} : c));
            handlePaletteChange(updatedPalette);
        },
        [palette, activeColorId]
    );

    const handlePaletteChange = useCallback(
        (updatedPalette) => {
            const sortedPalette = sortPalette(updatedPalette).map(({position, id, ...rest}) => ({
                ...rest,
                //   id,
                position: +Number(position).toFixed(2),
                //   active: id === activeColorId,
            }));
            onChange && onChange(sortedPalette);
        },
        [onChange, palette]
    );

    const handleStopPosChange = useCallback(
        ({id, position}) => {
            const updatedPalette = palette.map((c) =>
                id === c.id ? {...c, position: +((position + HALF_STOP_WIDTH) / width).toFixed(2)} : c
            );
            handlePaletteChange(updatedPalette);
        },
        [palette, width]
    );

    const handleEditColor = useCallback(
        (editStop) => {
            setEditColorId(editStop.id);
        },
        [setEditColorId]
    );

    return (
        <Box d="flex" flexDirection="column" alignItems="center" w="100%" {...rest}>
            <GradientPalette width={paletteWidth} height={paletteHeight} palette={palette} />
            <ColorStopsHolder
                width={paletteWidth}
                disabled={stopsHolderDisabled}
                stops={stops}
                limits={limits}
                onPosChange={handleStopPosChange}
                onAddColor={handleColorAdd}
                onDeleteColor={handleColorDelete}
                onDragStart={onStopDragStart}
                onEdit={handleEditColor}
            />
            <GradientStopsList
                pt={5}
                pb={2}
                activeColorId={activeColorId}
                editColorId={editColorId}
                gradientStops={gradientStops}
                onChange={onChange}
                onSelect={handleColorSelect}
                {...activePaletteColor}
            />
        </Box>
    );
};

export default GradientPicker;
