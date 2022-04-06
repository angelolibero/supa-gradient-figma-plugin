import * as React from 'react';
import {RGBAObjetToString} from '../../../lib/colors';
import ColorStop from './ColorStop';

const getStopsHolderStyle = (width, disabled) => ({
    width,
    height: 17,
    position: 'relative',
    cursor: disabled ? 'default' : 'crosshair',
});

const ColorStopsHolder = ({width, stops, disabled = false, onAddColor, onEdit, ...rest}) => {
    const handleColorAdd = React.useCallback(
        (e) => {
            e.preventDefault();
            if (e.button) return;
            const position = e.clientX - e.target.getBoundingClientRect().left;
            onAddColor({position});
        },
        [onAddColor]
    );

    return (
        <div className="csh" style={getStopsHolderStyle(width, disabled) as any} onMouseDown={handleColorAdd}>
            {stops.map((stop, index) => (
                <>
                    <ColorStop
                        key={stop.id || index}
                        stop={stop}
                        color={RGBAObjetToString(stop.color)}
                        {...rest}
                        onEdit={onEdit}
                    />
                </>
            ))}
        </div>
    );
};

export default ColorStopsHolder;
