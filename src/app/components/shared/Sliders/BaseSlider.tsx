import * as React from 'react';
import {useCallback} from 'react';
import {
    Flex,
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
import {MdOutlineDragHandle} from 'react-icons/md';
import {DEFAULT_DEBOUNCE_TIMEOUT} from '../../../lib/constants';
import useDebouncedCallback from '../../../lib/hooks/useDebounceCallback';

type Props = {
    showHalfMarks?: boolean;
    markDivisionCount?: number;
    icon?: React.ReactElement;
    symbol?: React.ReactElement;
    onChange: (angle: number) => void;
} & SliderProps;

const BaseSlider: React.FC<Props> = ({
    value,
    defaultValue = 180,
    min = 0,
    max = 360,
    step = 45,
    markDivisionCount = 2,
    icon: iconComponent,
    symbol: symbolComponent,
    onChange,
    ...rest
}) => {
    const [sliderValue, setSliderValue] = useControllableState({value, defaultValue});
    const styles = useMultiStyleConfig('BaseSlider', rest);
    const stopMarks = new Array(max / step + 1).fill(0);

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

    const handleSliderOnChange = useCallback(
        (angle) => {
            onChange(angle);
            setSliderValue(angle);
        },
        [onChange]
    );

    const handleInputOnChange = useCallback(
        (e) => {
            if (e.target.value >= 0 && e.target.value <= 360) {
                setSliderValue(e.target.value);
            } else {
                if (e.target.value < 0) {
                    setSliderValue(0);
                    return;
                }
                setSliderValue(360);
            }
        },
        [onChange]
    );

    const handleOnBlur = useCallback(() => {
        onChange && onChange(sliderValue);
    }, [onChange, sliderValue]);

    return (
        <Stack sx={styles.container} direction="row" spacing="0">
            <Box sx={styles.inputWrap}>
                {iconComponent && (
                    <Flex alignItems="center" alignSelf="center" mr={1}>
                        {React.cloneElement(iconComponent, {sx: styles.inputIcon})}
                    </Flex>
                )}
                <Input
                    value={sliderValue}
                    onChange={handleInputOnChange}
                    onBlur={handleOnBlur}
                    size="sm"
                    type="number"
                    variant="unstyled"
                    sx={styles.input}
                />
                {symbolComponent && (
                    <Flex alignItems="center" alignSelf="center">
                        {React.cloneElement(symbolComponent)}
                    </Flex>
                )}
            </Box>

            <Stack w="100%" spacing={0}>
                <Slider
                    value={sliderValue}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleSliderOnChange}
                    px={1}
                    h={9}
                    {...rest}
                >
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
            </Stack>
        </Stack>
    );
};

export default BaseSlider;
