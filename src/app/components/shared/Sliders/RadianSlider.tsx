import * as React from 'react';
import {useCallback} from 'react';
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
    Center,
    useControllableState,
} from '@chakra-ui/react';
import {MdArrowUpward, MdOutlineDragHandle} from 'react-icons/md';

type Props = {
    onChange: (angle) => void;
} & SliderProps;

const RadianSlider: React.FC<Props> = ({
    onChange,
    value,
    defaultValue = 180,
    min = 0,
    max = 315,
    step = 45,
    ...rest
}) => {
    const [sliderValue, setSliderValue] = useControllableState({value, defaultValue});

    const handleOnChange = useCallback(
        (angle) => {
            onChange(angle);
            setSliderValue(angle);
        },
        [sliderValue]
    );

    const stopMarks = new Array(max / step + 1).fill(0);

    return (
        <Stack
            direction="row"
            borderRadius="sm"
            bgColor="gray.100"
            spacing={1}
            py={2}
            pl={2}
            pr={4}
            alignItems="center"
            h={8}
        >
            <Box transform={`rotate(${sliderValue}deg)`} transition="all 0.25s" fontSize="10px">
                <MdArrowUpward />
            </Box>
            <Text fontWeight="semibold" fontSize="xs" maxW={8} minW={8} pos="relative" textAlign="left">
                {sliderValue}°
            </Text>

            <Box w="100%">
                <Slider value={sliderValue} min={min} max={max} step={step} onChange={handleOnChange} h={8} {...rest}>
                    {stopMarks &&
                        stopMarks.map((value, index) => {
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
                    <SliderThumb
                        w={4}
                        h={5}
                        borderRadius="sm"
                        _active={{w: 4}}
                        transition="all 0.25s"
                        position="relative"
                    >
                        <Center
                            pos="absolute"
                            top={0}
                            right={0}
                            boxSize="100%"
                            w="100%"
                            fontSize="xs"
                            transform="rotate(90deg)"
                        >
                            <MdOutlineDragHandle />
                        </Center>
                    </SliderThumb>
                </Slider>
            </Box>
        </Stack>
    );
};

export default RadianSlider;
