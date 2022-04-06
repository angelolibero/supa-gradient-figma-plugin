import {string} from 'prop-types';
import * as React from 'react';
import {useRef} from 'react';
import {checkredGradientProps} from '../../../lib/constants';
import useStopDragging from '../../../lib/hooks/useStopDragging';
import {chakra} from '@chakra-ui/react';

const ColorStop = ({
    stop,
    color,
    limits = undefined,
    onPosChange = undefined,
    onDeleteColor = undefined,
    onDragStart = (id: number) => {},
    onDragEnd = (id: number) => {},
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
        >
            <chakra.div {...checkredGradientProps} bgSize="6px 6px" bgPos="0px 0px, 3px 3px" pos="absolute" />
            <div style={{backgroundColor: color}} />
        </div>
    );
};

export default ColorStop;
