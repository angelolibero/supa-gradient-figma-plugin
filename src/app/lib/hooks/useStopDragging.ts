import {MutableRefObject, useState} from 'react';
import {StopCoordiantes, GradientStop} from '../../typings';
import {DEFAULT_DEBOUNCE_TIMEOUT} from '../constants';
import useDebounce from './useDebounce';
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

type useStopDraggingProps = {
    limits;
    stop;
    initialPos?: number;
    id?: number;
    colorStopRef?: MutableRefObject<any>;
    onPosChange?: (stop: GradientStop) => void;
    onDragStart?: (id: number) => void;
    onDragEnd?: (id: number) => void;
    onDeleteColor?: (id: number) => void;
};

const useStopDragging = ({
    initialPos = 0,
    stop,
    limits,
    colorStopRef,
    onPosChange,
    onDragStart,
    onDragEnd,
    onDeleteColor,
}: useStopDraggingProps) => {
    const [posStart, setPosStart] = useState(initialPos);

    const handleDrag = ({clientX, clientY}: StopCoordiantes): any => {
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
        onPosChange({...stop, id, position: limitedPos});
    };

    const [drag] = useDragging({
        onDragStart: ({clientX, clientY}) => {
            setPosStart(clientX);
            onDragStart && onDragStart(stop.id);
            return {clientX, clientY};
        },
        onDrag: handleDrag,
        onDragEnd: () => onDragEnd && onDragEnd(stop.id),
    });

    return [drag];
};

export default useStopDragging;
