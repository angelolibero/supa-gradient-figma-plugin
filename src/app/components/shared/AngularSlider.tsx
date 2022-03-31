import * as React from 'react';
import {useState, useCallback} from 'react';
import {
    Text,
    Slider,
    SliderTrack,
    SliderProps,
    Stack,
    SliderThumb,
    SliderMark,
    Box,
    Circle,
    Badge,
    useControllableState,
} from '@chakra-ui/react';
import {MdArrowUpward} from 'react-icons/md';

type Props = {
    onChange: (angle) => void;
} & SliderProps;

const AngularSlider: React.FC<Props> = ({
    onChange,
    value,
    defaultValue = 180,
    min = 0,
    max = 315,
    step = 45,
    ...rest
}) => {
    const [sliderValue, setSliderValue] = useControllableState({value, defaultValue});

    const onChangeAngle = useCallback(
        (angle) => {
            onChange(angle);
            setSliderValue(angle);
        },
        [sliderValue]
    );

    const marks = new Array(max / step + 1).fill(0);

    return (
        <Box>
            <Stack direction="row" borderRadius="lg" bgColor="gray.100" py={2} px={2} alignItems="center">
                <Text fontWeight="bold" fontSize="sm" width={14} mr={5} pos="relative">
                    {sliderValue}°
                </Text>

                <Box w="100%" pr={4}>
                    <Slider value={sliderValue} min={min} max={max} step={step} onChange={onChangeAngle} {...rest}>
                        {marks &&
                            marks.map((value, index) => {
                                return (
                                    <SliderMark
                                        value={step * index}
                                        h="full"
                                        fontSize="sm"
                                        d="flex"
                                        alignItems="center"
                                        w="2px"
                                        top={0}
                                        key={index}
                                    >
                                        <Circle size="2px" bgColor="gray.500" />
                                    </SliderMark>
                                );
                            })}
                        <SliderTrack bgColor="transparent">
                            <Box position="relative" right={10} />
                        </SliderTrack>
                        <SliderThumb boxSize={7} borderRadius="md" _active={{boxSize: 8}} transition="all 0.2s">
                            <Box transform={`rotate(${sliderValue}deg)`}>
                                <MdArrowUpward />
                            </Box>
                        </SliderThumb>
                    </Slider>
                </Box>
            </Stack>
        </Box>
    );
};

export default AngularSlider;
