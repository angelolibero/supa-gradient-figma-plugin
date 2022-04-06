import * as React from 'react';
import {FC} from 'react';
import {Stack, IconButton, Input} from '@chakra-ui/react';
import {rgbaToHex} from '@ctrl/tinycolor';
import SegmentedSlider from '../Sliders/SegmentedSlider';
import {hexToRGBAObject} from '../../../lib/colors';
import ColorPickerDrawerSwatch from '../Drawers/ColorPickerDrawerSwatch';
import {AiOutlineMinus} from 'react-icons/ai';
import '../../../styles/picker.css';

export type GradientStopsListItemProps = {
    stop: ColorStop;
    activeColorId: number;
    editColorId?: number;
    index: number;
    onChange: (stop: ColorStop, index: number) => void;
    onDelete: (stop: ColorStop) => void;
};

const GradientStopsListItem: FC<GradientStopsListItemProps> = ({
    stop,
    activeColorId,
    editColorId,
    index,
    onChange,
    onDelete,
}) => {
    const hexColor = React.useMemo(() => {
        return stop.color && rgbaToHex(stop.color.r * 255, stop.color.g * 255, stop.color.b * 255, stop.color.a, false);
    }, [stop]);

    const handleOnChangeInputColor = React.useCallback(
        (color: string) => {
            const updatedStop: ColorStop = {
                ...stop,
                color: hexToRGBAObject(color),
            };
            onChange && onChange(updatedStop, index);
        },
        [onChange, stop, index]
    );

    const handleOnChangePickerColor = React.useCallback(
        (color: RGBA) => {
            const updatedStop: ColorStop = {
                ...stop,
                color,
            };
            onChange && onChange(updatedStop, index);
        },
        [onChange, stop, index]
    );

    const handleOnChangeAlpha = React.useCallback(
        (alpha: number) => {
            const updatedStop: ColorStop = {
                ...stop,
                color: {...stop.color, a: alpha},
            };

            onChange && onChange(updatedStop, index);
        },
        [onChange, stop, index]
    );

    const handleOnDelete = React.useCallback(() => {
        onDelete && onDelete(stop);
    }, [stop, onDelete]);

    return (
        <Stack direction="row" alignItems="center" spacing={2} rounded="xs" py={1} px={4} key={index}>
            <ColorPickerDrawerSwatch
                isActive={activeColorId - 1 == index}
                isOpen={editColorId - 1 == index}
                color={stop.color}
                onChange={(color: RGBA) => {
                    handleOnChangePickerColor(color);
                }}
            />
            <Input
                value={hexColor}
                onChange={(event) => {
                    handleOnChangeInputColor(event.target.value);
                }}
                borderRadius="sm"
                flex="1"
                bgColor="white"
                size="sm"
            />
            <SegmentedSlider
                title={stop.color.a.toString()}
                min={0}
                max={1}
                step={0.1}
                flex="1"
                //  value={stop.color.a}
                defaultValue={stop.color.a}
                onChange={(alpha) => handleOnChangeAlpha(alpha)}
            />
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
