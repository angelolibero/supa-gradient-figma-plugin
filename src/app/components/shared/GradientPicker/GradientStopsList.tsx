import * as React from 'react';
import {FC, useCallback} from 'react';
import {StackProps, Stack} from '@chakra-ui/react';
import {GradientStops} from '../../../typings';
import GradientStopsListItem from './GradientStopsListItem';
import '../../../styles/picker.css';

type Props = {
    gradientStops?: readonly ColorStop[];
    currentColor?: string;
    activeColorId?: number;
    editColorId?: number;
    onChange?: (gradientStops: GradientStops) => void;
    onSelect?: (stop: ColorStop) => void;
} & Omit<StackProps, 'onSelect' | 'children' | 'onChange'>;

const GradientStopsList: FC<Props> = ({
    gradientStops,
    currentColor,
    activeColorId,
    editColorId,
    onChange,
    onSelect,
    ...rest
}) => {
    const handleOnChange = useCallback(
        (stop: ColorStop, index: number) => {
            let stops = [...gradientStops];
            stops.splice(index, 1, stop);
            onChange && onChange(stops);
        },
        [gradientStops, onChange]
    );

    const handleOnDelete = useCallback(
        (stop: ColorStop) => {
            let stops = [...gradientStops];
            const index = gradientStops.indexOf(stop);
            if (index >= 0) {
                stops.splice(index, 1);
                onChange && onChange(stops);
            }
        },
        [gradientStops, onChange]
    );

    return (
        <Stack w="100%" maxW="100%" spacing={'1px'} {...rest}>
            {gradientStops &&
                gradientStops.map((stop, index) => {
                    return (
                        <GradientStopsListItem
                            stop={stop}
                            index={index}
                            activeColorId={activeColorId}
                            editColorId={editColorId}
                            onChange={handleOnChange}
                            onDelete={handleOnDelete}
                            key={index}
                        />
                    );
                })}
        </Stack>
    );
};

export default GradientStopsList;
