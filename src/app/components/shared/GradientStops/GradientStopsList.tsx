import * as React from 'react';
import {FC} from 'react';
import {StackProps, Stack, IconButton, Input} from '@chakra-ui/react';
import {rgbaToHex} from '@ctrl/tinycolor';
import {GradientStopsType} from '../../../typings';
import SegmentedSlider from '../Sliders/SegmentedSlider';
import {hexToRGBAObject} from '../../../lib/colors';
import ColorPickerDrawerSwatch from '../Drawers/ColorPickerDrawerSwatch';
import {AiOutlineMinus} from 'react-icons/ai';

type Props = {
    gradientStops?: readonly ColorStop[];
    currentColor?: string;
    activeColorId?: number;
    onChange?: (gradientStops: GradientStopsType) => void;
    onSelect?: (stop: ColorStop) => void;
} & Omit<StackProps, 'onSelect' | 'children' | 'onChange'>;

const GradientStopsList: FC<Props> = ({gradientStops, currentColor, activeColorId, onChange, onSelect, ...rest}) => {
    const handleOnChange = React.useCallback(
        (stop: ColorStop, index: number) => {
            let stops = [...gradientStops];
            stops.splice(index, 1, stop);
            onChange && onChange(stops);
        },
        [gradientStops, onChange]
    );

    const handleOnDelete = React.useCallback(
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
                        <GradientStopItem
                            stop={stop}
                            index={index}
                            activeColorId={activeColorId}
                            onChange={handleOnChange}
                            onDelete={handleOnDelete}
                            key={index}
                        />
                    );
                })}
        </Stack>
    );
};

export type GradientStopItemProps = {
    stop: ColorStop;
    activeColorId: number;
    index: number;
    onChange: (stop: ColorStop, index: number) => void;
    onDelete: (stop: ColorStop) => void;
};

export const GradientStopItem: FC<GradientStopItemProps> = ({stop, activeColorId, index, onChange, onDelete}) => {
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
        <Stack direction="row" alignItems="center" spacing={2} rounded="xs" py={1} px={3} key={index}>
            <ColorPickerDrawerSwatch
                isActive={activeColorId - 1 == index}
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

export default GradientStopsList;
