import * as React from 'react';
import {FC, useRef, useMemo} from 'react';
import {CHECKERED_GRADIENT_PROPS, DEFAULT_PALETTE_WIDTH, HALF_STOP_WIDTH} from '../../../lib/constants';
import useStopDragging from '../../../lib/hooks/useStopDragging';
import {chakra, BoxProps, Tooltip} from '@chakra-ui/react';
import {GradientStop} from '../../../typings';
import {colorStringToRGBAArray} from '../../../lib/colors';

type Props = {
    stop: GradientStop;
    color: string;
    limits?: any;
    onPosChange?: (stop) => {};
    onDeleteColor?: (id: number) => {};
    onDragStart?: (id: number) => {};
    onDragEnd?: (id: number) => {};
    onEdit?: (stop: GradientStop) => {};
} & Omit<BoxProps, 'color'>;

const ColorStop: FC<Props> = ({stop, color, limits, onPosChange, onDeleteColor, onDragStart, onDragEnd, onEdit}) => {
    const colorStopRef = useRef();

    const {position, isActive} = stop;

    const percentage = useMemo(() => {
        return (((stop.position + HALF_STOP_WIDTH) / DEFAULT_PALETTE_WIDTH) * 100).toFixed(0);
    }, [stop]);

    const [drag] = useStopDragging({
        stop,
        limits,
        onPosChange,
        onDragStart,
        onDragEnd,
        onDeleteColor,
        colorStopRef,
    });

    const rgbColor = useMemo(() => {
        const rgba = colorStringToRGBAArray(color);
        return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
    }, [color]);

    return (
        <chakra.div
            className={isActive ? 'cs active' : 'cs'}
            ref={colorStopRef}
            onMouseDown={drag}
            onTouchStart={drag}
            onClick={() => onEdit(stop)}
            style={{left: position}}
        >
            <chakra.div {...CHECKERED_GRADIENT_PROPS} bgSize="6px 6px" bgPos="0px 0px, 3px 3px" pos="absolute" />
            <Tooltip label={percentage + '%'} placement="top" offset={[0, 10]}>
                <chakra.div d="flex">
                    <chakra.span style={{backgroundColor: color}} w="50%" h="100%" />
                    <chakra.span style={{backgroundColor: rgbColor}} w="50%" h="100%" />
                </chakra.div>
            </Tooltip>
        </chakra.div>
    );
};

export default ColorStop;
