import * as React from 'react';
import {FC, useRef} from 'react';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import useStopDragging from '../../../lib/hooks/useStopDragging';
import {chakra, BoxProps} from '@chakra-ui/react';
import {GradientStop} from '../../../typings';

type Props = {
    stop: GradientStop;
    color: string;
    limits?: any;
    onPosChange?: () => {};
    onDeleteColor?: (id: number) => {};
    onDragStart?: (id: number) => {};
    onDragEnd?: (id: number) => {};
    onEdit?: (stop: GradientStop) => {};
} & BoxProps;

const ColorStop: FC<Props> = ({stop, color, limits, onPosChange, onDeleteColor, onDragStart, onDragEnd, onEdit}) => {
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

    const {position, isActive} = stop;

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
