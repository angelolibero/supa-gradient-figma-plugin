import * as React from 'react';
import {FC, useRef, useMemo} from 'react';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';
import useStopDragging from '../../../lib/hooks/useStopDragging';
import {chakra, BoxProps} from '@chakra-ui/react';
import {GradientStop} from '../../../typings';
import {colorStringToRGBAArray} from '../../../lib/colors';

type Props = {
    stop: GradientStop;
    color: string;
    limits?: any;
    onPosChange?: () => {};
    onDeleteColor?: (id: number) => {};
    onDragStart?: (id: number) => {};
    onDragEnd?: (id: number) => {};
    onEdit?: (stop: GradientStop) => {};
} & Omit<BoxProps, 'color'>;

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

    const rgbColor = useMemo(() => {
        const rgba = colorStringToRGBAArray(color);
        return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
    }, [color]);

    return (
        <chakra.div
            className={isActive ? 'cs active' : 'cs'}
            ref={colorStopRef}
            style={{left: position}}
            onMouseDown={drag}
            onTouchStart={drag}
            onClick={() => onEdit(stop)}
        >
            <chakra.div {...CHECKERED_GRADIENT_PROPS} bgSize="6px 6px" bgPos="0px 0px, 3px 3px" pos="absolute" />
            <chakra.div d="flex">
                <chakra.span style={{backgroundColor: color}} w="50%" h="100%" />
                <chakra.span style={{backgroundColor: rgbColor}} w="50%" h="100%" />
            </chakra.div>
        </chakra.div>
    );
};

export default ColorStop;
