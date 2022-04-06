import * as React from 'react';
import {useRef} from 'react';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import useStopDragging from '../../../lib/hooks/useStopDragging';
import {chakra} from '@chakra-ui/react';
import {GradientStop} from '../../../typings';

const ColorStop = ({
    stop,
    color,
    limits = undefined,
    onPosChange = undefined,
    onDeleteColor = undefined,
    onDragStart = (id: number) => {},
    onDragEnd = (id: number) => {},
    onEdit = (stop: GradientStop) => {},
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

    const {position, isActive, opacity} = stop;

    return (
        <div
            className={isActive ? 'cs active' : 'cs'}
            ref={colorStopRef}
            style={{left: position}}
            onMouseDown={drag}
            onTouchStart={drag}
            onClick={() => onEdit(stop)}
        >
            <chakra.div {...CHECKERED_GRADIENT_PROPS} bgSize="6px 6px" bgPos="0px 0px, 3px 3px" pos="absolute" />
            <div style={{backgroundColor: color}} />
        </div>
    );
};

export default ColorStop;
