import * as React from 'react';
import {useMemo, FC} from 'react';
import {StackProps, Stack, Box, Divider, IconButton, Input} from '@chakra-ui/react';
import {rgbaToHex} from '@ctrl/tinycolor';
import {GradientStops} from '../../typings';
import SegmentedSlider from './SegmentedSlider';
import {hexToRGBAObject} from '../../lib/colors';
import ColorPickerDrawerSwatch from './pickers/ColorPickerDrawerSwatch';
import {MdClose} from 'react-icons/md';

type Props = {
    gradientStops?: readonly ColorStop[];
    currentColor?: string;
    activeColorId?: number;
    onChange?: (gradientStops: GradientStops) => void;
    onSelect?: (stop: ColorStop) => void;
} & Omit<StackProps, 'onSelect' | 'children'>;

const GradientStopsList: FC<Props> = ({gradientStops, currentColor, activeColorId, onChange, onSelect, ...rest}) => {
    const paintColor = React.useCallback(
        (color: RGBA) => {
            return color && rgbaToHex(color.r * 255, color.g * 255, color.b * 255, color.a, false);
        },
        [gradientStops]
    );

    const handleOnChangeInputColor = React.useCallback(
        (color: string, stop: ColorStop, index: number) => {
            let stops = [...gradientStops];
            stops.splice(index, 1, {
                ...stop,
                color: hexToRGBAObject(color),
            });
            onChange && onChange(stops);
        },
        [gradientStops, onChange]
    );

    const handleOnChangePickerColor = React.useCallback(
        (color: RGBA, stop: ColorStop, index: number) => {
            let stops = [...gradientStops];
            stops.splice(index, 1, {
                ...stop,
                color,
            });
            onChange && onChange(stops);
        },
        [gradientStops, onChange]
    );

    const handleOnChangeAlpha = React.useCallback(
        (alpha: number, stop: ColorStop, index: number) => {
            let stops = [...gradientStops];
            stops[index] = {
                ...stop,
                color: {...stop.color, a: alpha},
            };

            onChange && onChange(stops);
        },
        [gradientStops, onChange]
    );

    const handleOnDelete = React.useCallback(
        (stop: ColorStop, index: number) => {
            let stops = [...gradientStops];
            stops.splice(index, 1);
            onChange && onChange(stops);
        },
        [gradientStops, onChange]
    );

    return (
        <Stack w="100%" maxW="100%" divider={<Divider />} spacing={0} {...rest}>
            {gradientStops &&
                gradientStops.map((stop, index) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={2} rounded="xs" py={2} px={4} key={index}>
                            <ColorPickerDrawerSwatch
                                isActive={activeColorId - 1 == index}
                                color={stop.color}
                                onChange={(color: RGBA) => {
                                    handleOnChangePickerColor(color, stop, index);
                                }}
                            />
                            <Input
                                value={paintColor(stop.color)}
                                onChange={(event) => {
                                    handleOnChangeInputColor(event.target.value, stop, index);
                                }}
                                borderRadius="sm"
                                px={1}
                                color="gray.700"
                                size={'xs'}
                                h={7}
                                flex="1"
                            />
                            <SegmentedSlider
                                title={stop.color.a.toString()}
                                min={0}
                                max={1}
                                step={0.1}
                                flex="1"
                                //  value={stop.color.a}
                                defaultValue={stop.color.a}
                                onChange={(alpha) => {
                                    handleOnChangeAlpha(alpha, stop, index);
                                }}
                            />
                            <IconButton
                                icon={<MdClose />}
                                onClick={(event) => {
                                    handleOnDelete(stop, index);
                                }}
                                size="sm"
                                fontSize="sm"
                                aria-label="delete color"
                                bgColor="white"
                                minH={7}
                                maxW={5}
                                minW={5}
                                variant="link"
                                _hover={{bgColor: 'white'}}
                            />
                        </Stack>
                    );
                })}
        </Stack>
    );
};

export default GradientStopsList;
