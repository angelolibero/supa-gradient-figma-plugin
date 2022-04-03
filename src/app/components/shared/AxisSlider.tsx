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
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
} from '@chakra-ui/react';
import {MdArrowUpward, MdOutlineDragHandle} from 'react-icons/md';
import {AxisType} from '../../typings';

type Props = {
    onChange: (AxisType) => void;
    value?: AxisType;
    defaultValue?: AxisType;
} & Omit<SliderProps, 'value' | 'defaultValue'>;

const AxisSlider: React.FC<Props> = ({
    onChange,
    value,
    defaultValue = {x: 50, y: 50},
    min = 0,
    max = 100,
    step = 10,
    ...rest
}) => {
    const [sliderValue, setSliderValue] = useControllableState({value, defaultValue});

    const handleOnChange = useCallback(
        (newValue: AxisType) => {
            console.log('SSSSSSSS', newValue);
            onChange(newValue);
            setSliderValue(newValue);
        },
        [sliderValue]
    );

    const marks = new Array(max / step + 1).fill(0);

    return (
        <Stack direction="row">
            <Stack
                direction="row"
                borderRadius="md"
                bgColor="gray.100"
                spacing={4}
                py={1}
                pl={2}
                pr={3}
                alignItems="center"
                flex="1"
            >
                <Flex alignItems="center">
                    <Text fontSize="xs">X</Text>
                    {/* <Editable
                        value={sliderValue.x.toString()}
                        minW={6}
                        maxW={6}
                        fontWeight="semibold"
                        fontSize="xs"
                        size="sm"
                    >
                        <EditablePreview />
                        <EditableInput
                            type="number"
                            onChange={(event) =>
                                handleOnChange({x: parseInt(event.target.value) || sliderValue.x, y: sliderValue.y})
                            }
                            borderRadius="xs"
                            px={1}
                            mx={1}
                        />
                    </Editable>
                    <Text fontSize="xs">%</Text> */}
                </Flex>

                <Box w="100%">
                    <Slider
                        value={sliderValue.x}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(value) => handleOnChange({x: value, y: sliderValue.y})}
                        {...rest}
                    >
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
                                        {index % 2 == 0 ? <Circle size="2px" bgColor="gray.500" /> : ''}
                                    </SliderMark>
                                );
                            })}
                        <SliderTrack bgColor="transparent">
                            <Box position="relative" right={10} />
                        </SliderTrack>
                        <SliderThumb
                            w={4}
                            h={6}
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
            <Stack
                direction="row"
                borderRadius="md"
                bgColor="gray.100"
                spacing={2}
                py={1}
                pl={2}
                pr={3}
                alignItems="center"
                flex="1"
            >
                <Flex alignItems="center">
                    <Text fontSize="xs">Y</Text>
                    {/* <Editable
                        value={sliderValue.y.toString()}
                        minW={6}
                        maxW={6}
                        fontWeight="semibold"
                        fontSize="xs"
                        size="sm"
                    >
                        <EditablePreview />
                        <EditableInput
                            type="number"
                            onChange={(event) =>
                                handleOnChange({x: sliderValue.x, y: parseInt(event.target.value) || sliderValue.y})
                            }
                            borderRadius="xs"
                            px={1}
                            mx={1}
                        />
                    </Editable>
                    <Text fontSize="xs">%</Text> */}
                </Flex>

                <Box w="100%">
                    <Slider
                        value={sliderValue.y}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(value) => handleOnChange({x: sliderValue.x, y: value})}
                        {...rest}
                    >
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
                                        {index % 2 == 0 ? <Circle size="2px" bgColor="gray.500" /> : ''}
                                    </SliderMark>
                                );
                            })}
                        <SliderTrack bgColor="transparent">
                            <Box position="relative" right={10} />
                        </SliderTrack>
                        <SliderThumb
                            w={4}
                            h={6}
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
        </Stack>
    );
};

export default AxisSlider;
