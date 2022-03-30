import * as React from 'react';
import {useRef, useState, useCallback, useEffect} from 'react';
import {Stack, Box, Button, FormControl, Flex, Switch, FormLabel, Text} from '@chakra-ui/react';
import SegmetedSlider from './SegmetedSlider';
import LinearGradientPicker from './LinearGradientPicker';
import {Palette} from '../typings';
import {hexToRgb, isHex, paletteFromGradientStops, gradientAngleFromTransform} from '../lib/colors';
import GradientPreview from './GradientPreview';

const defaultPalette = [
    {offset: '0.00', color: 'rgba(238, 241, 11,1)'},
    {offset: '0.5', color: 'rgba(215, 128, 37,1)'},
    {offset: '1.00', color: 'rgba(126, 32, 207,1)'},
];

const View = ({}) => {
    const [selection, setSelection] = useState<any>();
    const [gradientAngle, setGradientAngle] = useState(180);
    const [gradientFills, setGradientFills] = useState<Palette>();
    const [liveEditMode, setLiveEditMode] = useState(true);

    const isSelected = React.useMemo(() => selection && selection.length, [selection]);

    const onCancel = useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'close-plugin'}}, '*');
    }, []);

    const applyGradient = useCallback(() => {
        parent.postMessage(
            {pluginMessage: {type: 'apply-gradient', angle: gradientAngle, palette: gradientFills}},
            '*'
        );
    }, [gradientAngle, gradientFills]);

    const onChangeAngle = useCallback(
        (angle) => {
            setGradientAngle(angle);
        },
        [gradientAngle]
    );

    const onChangePalette = useCallback(
        (palette) => {
            const updatedPalette = palette.map((value, index) => {
                return {
                    color: isHex(value.color) ? hexToRgb(value.color) : value.color,
                    offset: value.offset,
                };
            });
            setGradientFills(updatedPalette);
        },
        [gradientFills]
    );

    useEffect(() => {
        liveEditMode && applyGradient();
    }, [gradientAngle, gradientFills]);

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            const {selection: _selection, fills} = message;
            if (type === 'figma:selectionchange') {
                setSelection(_selection);
                if (fills) {
                    setGradientFills(paletteFromGradientStops(fills[0].gradientStops));
                    setGradientAngle(gradientAngleFromTransform(fills[0].gradientTransform) || gradientAngle);
                }
            }
        };
    }, []);

    return (
        <Flex direction="column" h="100%">
            {JSON.stringify(gradientFills)}
            {gradientAngle}
            <Stack p={4} h="100%">
                {/* <img src={require('../assets/logo.svg')} />
                <Text mb={4}>Gradient Creator</Text> */}
                <GradientPreview palette={gradientFills} angle={gradientAngle} />
                <LinearGradientPicker
                    onChangePalette={onChangePalette}
                    value={gradientFills}
                    defaultValue={defaultPalette}
                />
                <SegmetedSlider
                    onChange={onChangeAngle}
                    defaultValue={180}
                    min={0}
                    max={315}
                    step={45}
                    value={gradientAngle}
                />
            </Stack>
            <Stack direction="row" spacing={4} p={4}>
                <Button size="md" colorScheme="primary" w="full" onClick={applyGradient} isDisabled={!isSelected}>
                    {isSelected ? 'Apply to selection' : 'No selection'}
                </Button>
                <FormControl d="flex" flexDir="column" alignItems="end" w="auto">
                    <FormLabel whiteSpace="nowrap" htmlFor="live-mode" fontSize="xs" mx={0} mb={1} textAlign="right">
                        Live:
                    </FormLabel>
                    <Switch
                        defaultChecked={liveEditMode}
                        size="sm"
                        colorScheme="green"
                        id="live-mode"
                        onChange={(event) => setLiveEditMode(event.target.checked)}
                    />
                </FormControl>
            </Stack>
        </Flex>
    );
};

export default View;
