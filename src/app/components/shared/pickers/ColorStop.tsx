import * as React from 'react';
import {useRef} from 'react';
import useStopDragging from '../../../lib/hooks/useStopDragging';
//import 'react-linear-gradient-picker/src/components/ColorStop/index.css';

const ColorStop = ({
    stop,
    limits,
    onPosChange,
    onDeleteColor,
    onDragStart = (clientX, clientY) => {},
    onDragEnd = (clientX, clientY) => {},
}) => {
    const colorStopRef = useRef();
    const [drag] = useStopDragging({
        stop,
        limits,
        onPosChange,
        onDragStart,
        onDragEnd,
        onDeleteColor,
        colorStopRef,
    });

    const {offset, color, isActive, opacity} = stop;

    return (
        <div
            className={isActive ? 'cs active' : 'cs'}
            ref={colorStopRef}
            style={{left: offset}}
            onMouseDown={drag}
            onTouchStart={drag}
        >
            <div style={{backgroundColor: color, opacity}} />
        </div>
    );
};

export default ColorStop;
