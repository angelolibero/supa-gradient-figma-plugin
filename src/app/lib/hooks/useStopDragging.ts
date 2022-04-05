import {useState} from 'react';
import useDragging from './useDragging';

/**
 * Limits a client drag movement within given min / max
 * @param {Number} offset - The current clientX
 * @param {Number} min - Min boundary
 * @param {Number} max - Max boundary
 * @returns {Number}
 */
const limitPos = (offset, min, max) => Math.max(Math.min(offset, max), min);

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
        const {id, offset} = stop;
        const {min, max} = limits;

        // Removing if out of drop limit on Y axis.
        const top = getColorStopRefTop(colorStopRef);
        if (Math.abs(clientY - top) > limits.drop) {
            //deactivate();
            return onDeleteColor(id);
        }

        // Limit movements
        const dragOffset = offset - posStart;
        const limitedPos = limitPos(dragOffset + clientX, min, max);

        onPosChange({id, offset: limitedPos});
    };

    const [drag] = useDragging({
        onDragStart: ({clientX, clientY}) => {
            setPosStart(clientX);
            onDragStart(stop.id);
        },
        onDrag: handleDrag,
        onDragEnd: () => onDragEnd(stop.id),
    });

    return [drag];
};

export default useStopDragging;
