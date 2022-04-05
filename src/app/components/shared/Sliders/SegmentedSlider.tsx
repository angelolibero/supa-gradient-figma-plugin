import * as React from 'react';
import {useCallback} from 'react';
import {
    Text,
    Slider,
    SliderTrack,
    SliderProps,
    StackProps,
    Stack,
    SliderThumb,
    SliderMark,
    Box,
    Circle,
    Center,
    useControllableState,
    Flex,
} from '@chakra-ui/react';
import {MdArrowUpward, MdOutlineDragHandle} from 'react-icons/md';
import {AxisType} from '../../../typings';

type Props = {
    title?: string;
    onChange: (value: number) => void;
    value?: number;
    defaultValue?: number;
} & Omit<SliderProps, 'value' | 'defaultValue'> &
    StackProps;

const SegmentedSlider: React.FC<Props> = ({
    title,
    onChange,
    value,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 10,
    ...rest
}) => {
    const [sliderValue, setSliderValue] = useControllableState({value, defaultValue});

    const handleOnChange = useCallback(
        (newValue: number) => {
            onChange(newValue);
            setSliderValue(newValue);
        },
        [onChange]
    );

    const stopMarks = new Array(max / step + 1).fill(0);

    return (
        <Stack
            direction="row"
            borderRadius="sm"
            bgColor="gray.100"
            spacing={0}
            py={1}
            pl={2}
            pr={3}
            h={7}
            alignItems="center"
            {...rest}
        >
            {title && (
                <Flex alignItems="center" w={10} fontWeight={'semibold'}>
                    <Text fontSize="xs">{parseFloat(title).toFixed(1)}</Text>
                </Flex>
            )}
            <Slider value={sliderValue} min={min} max={max} step={step} onChange={(value) => handleOnChange(value)}>
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
                                {index % 2 == 0 ? <Circle size="2px" bgColor="gray.500" /> : ''}
                            </SliderMark>
                        );
                    })}
                <SliderTrack bgColor="transparent">
                    <Box position="relative" right={10} />
                </SliderTrack>
                <SliderThumb w={3} h={5} borderRadius="sm" _active={{w: 3}} transition="all 0.25s" position="relative">
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
        </Stack>
    );
};

export default SegmentedSlider;
