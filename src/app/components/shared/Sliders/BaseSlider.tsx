import * as React from 'react';
import {FC, useCallback, useState, useEffect, useRef, ReactElement, cloneElement} from 'react';
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
    useMultiStyleConfig,
    Input,
} from '@chakra-ui/react';
import {MdOutlineDragHandle} from 'react-icons/md';
import {numericRegex} from '../../../lib/colors';

type Props = {
    showHalfMarks?: boolean;
    markDivisionCount?: number;
    icon?: ReactElement;
    symbol?: ReactElement;
    onChange: (angle: number) => void;
} & SliderProps;

const BaseSlider: FC<Props> = ({
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
    const [sliderValue, setSliderValue] = useState(value);
    const [inputValue, setInputValue] = useState(value);
    const stopMarks = new Array(max / step + 1).fill(0);
    const inputRef = useRef<HTMLInputElement>();
    const styles = useMultiStyleConfig('BaseSlider', rest);

    const handleSliderOnChange = useCallback(
        (angle) => {
            onChange(angle);
            setSliderValue(angle);
            setInputValue(angle);
        },
        [onChange]
    );

    const handleInputOnChange = useCallback(
        (event) => {
            const newValue = +event.target.value.replace(numericRegex, '');
            if (newValue >= 0 && newValue <= 360) {
                setInputValue(parseInt('' + newValue));
            } else if (newValue < 0) {
                setInputValue(0);
            } else {
                setInputValue(360);
            }
        },
        [onChange]
    );

    const handleOnBlur = useCallback(
        (event) => {
            setSliderValue(inputValue);
            onChange && onChange(inputValue);
        },
        [onChange, inputValue]
    );

    const handleOnFocus = useCallback((event) => event.target.select(), []);

    const handleOnKeyDown = useCallback((event) => {
        //enter key code:
        if (event.key === 'Enter' || event.keyCode === 13) {
            handleOnBlur(event);
        }
    }, []);

    useEffect(() => {
        if (value != sliderValue) {
            setSliderValue(value);
            setInputValue(value);
        }
    }, [value]);

    return (
        <Stack sx={styles.container} direction="row" spacing="0">
            <Box sx={styles.inputWrap}>
                {iconComponent && (
                    <Flex alignItems="center" alignSelf="center" mr={1}>
                        {cloneElement(iconComponent, {sx: styles.inputIcon})}
                    </Flex>
                )}
                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputOnChange}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    onKeyDown={handleOnKeyDown}
                    size="sm"
                    type="number"
                    variant="unstyled"
                    sx={styles.input}
                    maxLength={3}
                />
                {symbolComponent && (
                    <Flex alignItems="center" alignSelf="center">
                        {cloneElement(symbolComponent)}
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
