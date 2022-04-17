import * as React from 'react';
import {FC, useCallback} from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';
import {RGBAObjetToString} from '../../../lib/colors';
import ColorStop from './ColorStop';

const getStopsHolderStyle = (width, disabled) => ({
    width,
    height: 17,
    position: 'relative',
    cursor: disabled ? 'default' : 'crosshair',
});

type Props = {
    width;
    limits;
    stops;
    disabled: boolean;
    onAddColor;
    onEdit;
    onPosChange;
    onDeleteColor;
    onDragStart;
} & Omit<BoxProps, 'color'>;

const ColorStopsHolder: FC<Props> = ({
    width,
    stops,
    disabled = false,
    limits,
    onEdit,
    onAddColor,
    onDeleteColor,
    onDragStart,
    onPosChange,
    ...rest
}) => {
    const handleColorAdd = useCallback(
        (e) => {
            e.preventDefault();
            if (e.button) return;
            const position = e.clientX - e.target.getBoundingClientRect().left;
            onAddColor({position});
        },
        [onAddColor]
    );

    return (
        <chakra.div
            className="csh"
            style={getStopsHolderStyle(width, disabled) as any}
            onMouseDown={handleColorAdd}
            {...rest}
        >
            {stops.map((stop, index) => (
                <ColorStop
                    key={stop.id || index}
                    stop={stop}
                    color={RGBAObjetToString(stop.color)}
                    onEdit={onEdit}
                    onDeleteColor={onDeleteColor}
                    onDragStart={onDragStart}
                    onPosChange={onPosChange}
                    limits={limits}
                />
            ))}
        </chakra.div>
    );
};

export default ColorStopsHolder;
