import * as React from 'react';
import {FC, useCallback} from 'react';
import {Stack, IconButton, BoxProps} from '@chakra-ui/react';
import ColorPickerDrawerSwatch from '../Drawers/ColorPickerDrawerSwatch';
import {AiOutlineMinus} from 'react-icons/ai';

export type GradientStopsListItemProps = {
    stop: ColorStop;
    activeColorId?: number;
    editColorId?: number;
    index: number;
    onChange: (stop: ColorStop, index: number) => void;
    onDelete: (stop: ColorStop) => void;
} & Omit<BoxProps, 'onChange'>;

const GradientStopsListItem: FC<GradientStopsListItemProps> = ({
    stop,
    activeColorId,
    editColorId,
    index,
    onChange,
    onDelete,
    ...rest
}) => {
    const handleOnChangePickerColor = useCallback(
        (color: RGBA) => {
            const updatedStop: ColorStop = {
                ...stop,
                color,
            };
            onChange && onChange(updatedStop, index);
        },
        [onChange, stop, index]
    );

    // const handleOnChangeAlpha = React.useCallback(
    //     (alpha: number) => {
    //         const updatedStop: ColorStop = {
    //             ...stop,
    //             color: {...stop.color, a: alpha},
    //         };

    //         onChange && onChange(updatedStop, index);
    //     },
    //     [onChange, stop, index]
    // );

    const handleOnDelete = useCallback(() => {
        onDelete && onDelete(stop);
    }, [stop, onDelete]);

    return (
        <Stack direction="row" alignItems="center" spacing={2} rounded="xs" py={1} px={4} key={index}>
            <ColorPickerDrawerSwatch
                isActive={activeColorId - 1 == index}
                color={stop.color}
                onChange={handleOnChangePickerColor}
                showInput
                showOpacity
            />
            {/* <SegmentedSlider
                title={stop.color.a.toString()}
                min={0}
                max={1}
                step={0.1}
                flex="1"
                //  value={stop.color.a}
                defaultValue={stop.color.a}
                onChange={(alpha) => handleOnChangeAlpha(alpha)}
            /> */}
            <IconButton
                icon={<AiOutlineMinus />}
                onClick={handleOnDelete}
                size="sm"
                fontSize="sm"
                aria-label="delete color"
                bgColor="white"
                boxSize={7}
                maxW={7}
                minW={7}
                _focus={{
                    shadow: 'none',
                }}
            />
        </Stack>
    );
};

export default GradientStopsListItem;
