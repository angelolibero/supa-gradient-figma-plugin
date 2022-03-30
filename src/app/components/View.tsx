import * as React from 'react';
import {useRef, useState, useCallback, useEffect} from 'react';
import {Stack, Box, Button, FormControl, Flex, Switch, FormLabel, Text} from '@chakra-ui/react';
import SegmetedSlider from './SegmetedSlider';
import LinearGradientPicker from './LinearGradientPicker';
import {GradientStops, Preferences} from '../typings';
import {
    hexToRgb,
    isHex,
    paletteFromGradientStops,
    gradientAngleFromTransform,
    colorStringToRGBAObject,
    hexToRGBAObject,
} from '../lib/colors';
import GradientPreview from './GradientPreview';
import GradientSwatch from './GradientSwatch';
import {defaults} from 'lodash';

const defaultGradientStops = [
    {position: 0.0, color: {r: 238 / 255, g: 241 / 255, b: 11 / 255, a: 1}},
    {position: 0.5, color: {r: 215 / 255, g: 128 / 255, b: 37 / 255, a: 1}},
    {position: 1.0, color: {r: 126 / 255, g: 32 / 255, b: 207 / 255, a: 1}},
];
const defaultAngle = 180;

const View = ({}) => {
    const [selection, setSelection] = useState<any>();
    const [gradientAngle, setGradientAngle] = useState(defaultAngle);
    const [gradientStops, setGradientStops] = useState<GradientStops>(defaultGradientStops);
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>();
    const [liveEditMode, setLiveEditMode] = useState(false);
    const [preferences, setPreferences] = useState<Preferences>();

    const isSelected = React.useMemo(() => selection && selection.length, [selection]);

    const onCancel = useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'close-plugin'}}, '*');
    }, []);

    const applyGradient = useCallback(() => {
        parent.postMessage(
            {pluginMessage: {type: 'apply-gradient', angle: gradientAngle, gradientStops: gradientStops}},
            '*'
        );
    }, [gradientAngle, gradientStops]);

    const onChangeAngle = useCallback(
        (angle) => {
            if (angle != gradientAngle) {
                setGradientAngle(angle);
            }
        },
        [gradientAngle]
    );

    const onChangeGradient = useCallback(
        (_gradientStops: GradientStops) => {
            const updatedGradientStops: GradientStops = _gradientStops.map((value, index) => {
                return {
                    color: value.color,
                    position: value.position,
                };
            });
            if (gradientStops != updatedGradientStops) {
                setGradientStops(updatedGradientStops);
            }
        },
        [gradientStops]
    );

    const onChangeLiveEditMode = useCallback(
        (event) => {
            setLiveEditMode(event.target.checked);
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'preferences-update',
                        preferences: {...preferences, liveEditMode: event.target.checked},
                    },
                },
                '*'
            );
        },
        [liveEditMode]
    );

    useEffect(() => {
        liveEditMode && applyGradient();
    }, [gradientStops, gradientAngle]);

    useEffect(() => {
        if (preferences) {
            setLiveEditMode(preferences.liveEditMode);
        }
    }, [preferences]);

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message} = event.data.pluginMessage;

            if (type === 'figma:selectionchange') {
                const fills = message.fills;
                setSelection(message.selection);
                if (fills) {
                    setGradientStops(fills[0].gradientStops);
                    fills[0].gradientTransform &&
                        setGradientAngle(gradientAngleFromTransform(fills[0].gradientTransform));
                }
            } else if (type === 'figma:styles:gradientschange') {
                const _paintStyles: PaintStyle[] = message.paintStyles;
                setPaintStyles(_paintStyles);
            } else if (type === 'figma:preferencesupdate') {
                setPreferences(message.preferences);
            }
        };
    }, []);

    return (
        <Flex direction="column" h="100%">
            <Stack direction="row">
                {paintStyles &&
                    paintStyles.map((paintStyle, index) => {
                        return <GradientSwatch paintStyle={paintStyle} key={index} />;
                    })}
            </Stack>
            <Stack p={4} h="100%">
                <GradientPreview gradientStops={gradientStops} angle={gradientAngle} />
                <LinearGradientPicker
                    onChange={onChangeGradient}
                    value={gradientStops}
                    defaultValue={defaultGradientStops}
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
                        defaultChecked={false}
                        isChecked={liveEditMode}
                        size="sm"
                        colorScheme="green"
                        id="live-mode"
                        onChange={onChangeLiveEditMode}
                    />
                </FormControl>
            </Stack>
        </Flex>
    );
};

export default View;
