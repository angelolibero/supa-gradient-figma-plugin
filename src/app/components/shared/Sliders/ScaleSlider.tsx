import * as React from 'react';
import {useCallback} from 'react';
import {
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
    useMultiStyleConfig,
    Input,
} from '@chakra-ui/react';
import {MdCircle, MdOutlineDragHandle} from 'react-icons/md';
import {DEFAULT_DEBOUNCE_TIMEOUT} from '../../../lib/constants';
import useDebouncedCallback from '../../../lib/hooks/useDebounceCallback';

type Props = {
    showHalfMarks?: boolean;
    markDivisionCount?: number;
    onChange: (angle) => void;
} & SliderProps;

const ScaleSlider: React.FC<Props> = ({
    onChange,
    value,
    defaultValue = 1,
    min = 0,
    max = 1,
    step = 0.05,
    markDivisionCount = 2,
    ...rest
}) => {
    const [sliderValue, setSliderValue] = useControllableState({value, defaultValue});
    const styles = useMultiStyleConfig('BaseSlider', rest);

    const debouncedOnChange = useDebouncedCallback((value: number) => {
        if (value >= 0 && value <= 360) {
            onChange(value);
        } else {
            if (value < 0) {
                onChange(0);
                return;
            }
            onChange(360);
        }
    }, DEFAULT_DEBOUNCE_TIMEOUT);

    const handleOnChange = useCallback(
        (scale: number) => {
            const fixedScale = +scale.toFixed(2);
            onChange(fixedScale);
            setSliderValue(fixedScale);
        },
        [onChange]
    );

    const handleInputOnChange = useCallback(
        (e) => {
            if (e.target.value >= 0 && e.target.value <= 360) {
                debouncedOnChange(e.target.value);
                setSliderValue(e.target.value);
            } else {
                if (e.target.value < 0) {
                    debouncedOnChange(0);
                    setSliderValue(0);
                    return;
                }
                debouncedOnChange(360);
                setSliderValue(360);
            }
        },
        [onChange]
    );

    const stopMarks = new Array(max / step + 1).fill(0);

    return (
        <Stack direction="row" spacing={0} sx={styles.container}>
            <Box sx={styles.inputWrap}>
                <Box alignItems="center" alignSelf="center">
                    <Box transform={`scale(${(1 - sliderValue) / 2 + 0.5})`} sx={styles.inputIcon}>
                        <MdCircle />
                    </Box>
                </Box>
                <Input
                    value={sliderValue}
                    onChange={handleInputOnChange}
                    placeholder="Hex code"
                    size="sm"
                    type="number"
                    variant="unstyled"
                    sx={styles.input}
                />
                <Box>°</Box>
            </Box>

            <Box w="100%">
                <Slider value={sliderValue} min={min} max={max} step={step} onChange={handleOnChange} h={9} {...rest}>
                    {stopMarks &&
                        stopMarks.map((_value, index) => {
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
                                    opacity={markDivisionCount && index % markDivisionCount != 0 ? 0 : 1}
                                >
                                    <Circle size="2px" bgColor="gray.500" />
                                </SliderMark>
                            );
                        })}
                    <SliderTrack bgColor="transparent">
                        <Box position="relative" right={10} />
                    </SliderTrack>
                    <SliderThumb sx={styles.thumb}>
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

export default ScaleSlider;
