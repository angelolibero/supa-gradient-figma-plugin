import {useState} from 'react';
import useDragging from './useDragging';

/**
 * Limits a client drag movement within given min / max
 * @param {Number} position - The current clientX
 * @param {Number} min - Min boundary
 * @param {Number} max - Max boundary
 * @returns {Number}
 */
const limitPos = (position, min, max) => Math.max(Math.min(position, max), min);

const getColorStopRefTop = (ref) => {
    if (!ref.current) return 0;
    return ref.current.getBoundingClientRect().top;
};

const useStopDragging = ({
    limits,
    stop,
    initialPos = 0,
    colorStopRef = undefined,
    onPosChange = undefined,
    onDragStart = undefined,
    onDragEnd = undefined,
    onDeleteColor = undefined,
}) => {
    const [posStart, setPosStart] = useState(initialPos);

    const handleDrag = ({clientX, clientY}) => {
        const {id, position} = stop;
        const {min, max} = limits;

        // Removing if out of drop limit on Y axis.
        const top = getColorStopRefTop(colorStopRef);
        if (Math.abs(clientY - top) > limits.drop) {
            //deactivate();
            return onDeleteColor(id);
        }

        // Limit movements
        const dragOffset = position - posStart;
        const limitedPos = limitPos(dragOffset + clientX, min, max);

        onPosChange({id, position: limitedPos});
    };

    const [drag] = useDragging({
        onDragStart: ({clientX, clientY}) => {
            setPosStart(clientX);
            onDragStart(stop.id);
            return {clientX, clientY};
        },
        onDrag: handleDrag,
        onDragEnd: () => onDragEnd(stop.id),
    });

    return [drag];
};

export default useStopDragging;
