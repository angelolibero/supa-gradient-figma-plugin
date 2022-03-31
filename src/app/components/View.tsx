import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Box, Button, FormControl, Flex, Switch, FormLabel, Divider} from '@chakra-ui/react';
import SegmetedSlider from './SegmetedSlider';
import LinearGradientPicker from './LinearGradientPicker';
import {GradientStops, Preferences} from '../typings';
import {gradientAngleFromTransform} from '../lib/colors';
import GradientPreview from './GradientPreview';
import PaintStyles from './PaintStyles';
import {anglesTransform} from '../lib/angles';

const defaultGradientStops = [
    {position: 0.0, color: {r: 238 / 255, g: 241 / 255, b: 11 / 255, a: 1}},
    {position: 0.5, color: {r: 215 / 255, g: 128 / 255, b: 37 / 255, a: 1}},
    {position: 1.0, color: {r: 126 / 255, g: 32 / 255, b: 207 / 255, a: 1}},
];
const defaultAngle = 180;
const defaultGradientTransform = anglesTransform[defaultAngle];

const View = ({}) => {
    const [selection, setSelection] = useState<any>();
    const [gradientAngle, setGradientAngle] = useState(defaultAngle);
    const [gradientStops, setGradientStops] = useState<GradientStops>(defaultGradientStops);
    const [gradientTransform, setGradientTransform] = useState(defaultGradientTransform);
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>();
    const [liveEditMode, setLiveEditMode] = useState(false);
    const [preferences, setPreferences] = useState<Preferences>();

    const isSelected = React.useMemo(() => selection && selection.length, [selection]);

    const onCancel = useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'close-plugin'}}, '*');
    }, []);

    const applyGradient = useCallback(() => {
        let localPaintStyles: PaintStyle[] = [];
        paintStyles.forEach((paintStyle) => {
            const gradientPaint = paintStyle.paints[0] as GradientPaint;
            console.log(gradientPaint.gradientStops, gradientStops);
            if (
                gradientStops &&
                JSON.stringify(gradientPaint.gradientStops) == JSON.stringify(gradientStops) &&
                gradientAngleFromTransform(gradientPaint.gradientTransform) == gradientAngle
            ) {
                console.log('SAME!', gradientPaint.gradientTransform, gradientStops);
                localPaintStyles.push(paintStyle);
                return;
            }
        });
        if (localPaintStyles.length == 0) {
            console.log('DIFFERENT!');
            setCurrentPaintStyle(undefined);
        } else {
            console.log('SAME!');
            setCurrentPaintStyle(localPaintStyles[0]);
        }

        parent.postMessage(
            {
                pluginMessage: {
                    type: 'apply-gradient',
                    angle: gradientAngle,
                    gradientStops: gradientStops,
                    gradientTransform: gradientTransform,
                    id: currentPaintStyle ? currentPaintStyle.id : localPaintStyles.length && localPaintStyles[0].id,
                },
            },
            '*'
        );
    }, [gradientAngle, gradientStops, currentPaintStyle, paintStyles]);

    const onSelectPaintStyle = useCallback((paintStyle: PaintStyle) => {
        const gradientPaint = paintStyle.paints[0] as GradientPaint;
        setCurrentPaintStyle(paintStyle);
        setGradientStops(gradientPaint.gradientStops);
        setGradientTransform(gradientPaint.gradientTransform);
        setGradientAngle(gradientAngleFromTransform(gradientPaint.gradientTransform));
    }, []);

    const onCreateStyle = useCallback(
        (newName: string) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'create-style',
                        gradientStops: gradientStops,
                        gradientTransform: gradientTransform,
                        name: newName,
                    },
                },
                '*'
            );
        },
        [currentPaintStyle, paintStyles, gradientStops, gradientTransform]
    );

    const onChangeAngle = useCallback(
        (angle) => {
            if (angle != gradientAngle) {
                setGradientAngle(angle);
            }
        },
        [gradientAngle, gradientStops]
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
        const onMessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'figma:selectionchange') {
                const fills = message.fills;
                setSelection(message.selection);
                setCurrentPaintStyle(undefined);
                if (fills) {
                    setGradientStops(fills[0].gradientStops);
                    fills[0].gradientTransform &&
                        setGradientAngle(gradientAngleFromTransform(fills[0].gradientTransform));
                }
            } else if (type === 'figma:styles:gradientschange') {
                const _paintStyles: PaintStyle[] = message.paintStyles;
                setPaintStyles(_paintStyles.reverse());
            } else if (type === 'figma:preferencesupdate') {
                setPreferences(message.preferences);
            }
        };
        window.onmessage = onMessage;
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return (
        <Flex direction="column" h="100%" w="100%" overflow="hidden" pos="relative">
            <Stack
                direction="column"
                overflow="hidden"
                flex="1"
                alignItems="center"
                spacing={0}
                w="100%"
                h="100%"
                minW="100%"
                maxW="100%"
            >
                <PaintStyles
                    paintStyles={paintStyles}
                    gradientPaint={{
                        type: 'GRADIENT_LINEAR',
                        gradientStops,
                        gradientTransform: gradientTransform as Transform,
                    }}
                    currentPaintStyle={currentPaintStyle}
                    onSelect={onSelectPaintStyle}
                    onCreate={onCreateStyle}
                />
                <Divider borderColor="blackAlpha.50" />
                <Stack h="100%" w="100%" px={4} pt={4} bgColor="white" shadow="0 -4px -16px rgba(0,0,0,0.1)">
                    <GradientPreview
                        gradientStops={gradientStops}
                        angle={gradientAngle}
                        minH={!gradientStops && '100%'}
                    />
                    {gradientStops && (
                        <LinearGradientPicker
                            onChange={onChangeGradient}
                            value={gradientStops}
                            defaultValue={defaultGradientStops}
                        />
                    )}
                    {gradientStops && (
                        <SegmetedSlider
                            onChange={onChangeAngle}
                            defaultValue={180}
                            min={0}
                            max={360}
                            step={45}
                            value={gradientAngle}
                        />
                    )}
                </Stack>
            </Stack>
            <Stack direction="row" spacing={4} py={4} px={4}>
                <Button size="md" colorScheme="primary" w="full" onClick={applyGradient} isDisabled={!isSelected}>
                    {isSelected ? 'Apply' : 'No selection'}
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
