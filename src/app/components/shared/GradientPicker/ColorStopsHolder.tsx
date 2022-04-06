import * as React from 'react';
import {RGBAObjetToString} from '../../../lib/colors';
import ColorStop from './ColorStop';

const getStopsHolderStyle = (width, disabled) => ({
    width,
    height: 17,
    position: 'relative',
    cursor: disabled ? 'default' : 'crosshair',
});

const ColorStopsHolder = ({width, stops, disabled = false, onAddColor, ...rest}) => {
    const handleColorAdd = (e) => {
        e.preventDefault();
        if (e.button) return;
        const position = e.clientX - e.target.getBoundingClientRect().left;
        onAddColor({position});
    };

    return (
        <div className="csh" style={getStopsHolderStyle(width, disabled) as any} onMouseDown={handleColorAdd}>
            {stops.map((stop) => (
                <>
                    <ColorStop key={stop.id} stop={stop} color={RGBAObjetToString(stop.color)} {...rest} />
                </>
            ))}
        </div>
    );
};

export default ColorStopsHolder;
