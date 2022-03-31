import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Badge, Button, Flex, Divider, Fade, ScaleFade} from '@chakra-ui/react';
import AngularSlider from '../shared/AngularSlider';
import LinearGradientPicker from '../shared/LinearGradientPicker';
import {GradientStops, Preferences} from '../../typings';
import {gradientAngleFromTransform} from '../../lib/colors';
import {defaultGradientStops, defaultAngle, defaultGradientTransform, defaultPreferences} from '../../lib/utils';
import GradientPreview from '../shared/GradientPreview';
import PaintStyles from '../shared/PaintStyles';
import PageSkeleton from './PageSkeleton';
import PreferencesDrawerButton from '../shared/PreferencesDrawerButton';
import StylesSkeleton from '../shared/StylesSkeleton';

const LinearGradientPage = ({}) => {
    const [selection, setSelection] = useState<NodeType[]>();
    const [gradientAngle, setGradientAngle] = useState(defaultAngle);
    const [gradientStops, setGradientStops] = useState<GradientStops>(defaultGradientStops);
    const [gradientTransform, setGradientTransform] = useState(defaultGradientTransform);
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>();
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isSelected = React.useMemo(() => selection && selection.length, [selection]);
    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);

    const onCancel = useCallback(() => {
        parent.postMessage({pluginMessage: {type: 'close-plugin'}}, '*');
    }, []);

    const applyGradient = useCallback(() => {
        let localPaintStyles: PaintStyle[] = [];
        paintStyles &&
            paintStyles.forEach((paintStyle) => {
                const gradientPaint = paintStyle.paints[0] as GradientPaint;
                if (
                    gradientStops &&
                    JSON.stringify(gradientPaint.gradientStops) == JSON.stringify(gradientStops) &&
                    gradientAngleFromTransform(gradientPaint.gradientTransform) == gradientAngle
                ) {
                    localPaintStyles.push(paintStyle);
                    return;
                }
            });
        if (localPaintStyles.length == 0 && currentPaintStyle) {
            console.log('NO merda cazzo');
            setCurrentPaintStyle(undefined);
        } else {
            setCurrentPaintStyle(currentPaintStyle || localPaintStyles[0]);
            console.log('VAI cazzo');
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'apply-gradient',
                        angle: gradientAngle,
                        gradientStops: gradientStops,
                        gradientTransform: gradientTransform,
                        id: currentPaintStyle
                            ? currentPaintStyle.id
                            : localPaintStyles.length && localPaintStyles[0].id,
                    },
                },
                '*'
            );
        }
    }, [currentPaintStyle, gradientStops, gradientAngle, gradientTransform, paintStyles]);

    const selectPaintStyle = useCallback((paintStyle: PaintStyle) => {
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

    const onChangePreferences = useCallback(
        (preferences) => {
            console.log('onChangePreferences', preferences);
            setPreferences(preferences);
        },
        [preferences]
    );

    useEffect(() => {
        console.log('preferences.liveUpdates', preferences.liveUpdates);
        preferences && preferences.liveUpdates && applyGradient();
    }, [gradientStops, gradientAngle, currentPaintStyle]);

    useEffect(() => {
        if (isLoading && preferences) {
            setPreferences({...preferences});
        }
    }, [preferences]);

    useEffect(() => {
        if (paintStyles && paintStyles.length && !currentPaintStyle) selectPaintStyle(paintStyles[0]);
        if (paintStyles) setIsLoading(false);
    }, [paintStyles, isLoading]);

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
                console.log('figma:gradientschange', message.paintStyles);
            } else if (type === 'figma:preferencesupdate') {
                console.log('figma:preferencesupdate!!!!!', message.preferences);
                setPreferences(message.preferences);
            }
        };
        window.onmessage = onMessage;
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    return (
        <ScaleFade in={!isLoading}>
            <Flex direction="column" h="100%" w="100%" overflow="hidden" zIndex={1}>
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
                    {isLoading ? (
                        <StylesSkeleton isLoading={true} />
                    ) : (
                        <PaintStyles
                            paintStyles={paintStyles}
                            gradientPaint={{
                                type: 'GRADIENT_LINEAR',
                                gradientStops,
                                gradientTransform: gradientTransform as Transform,
                            }}
                            currentPaintStyle={currentPaintStyle}
                            onSelect={selectPaintStyle}
                            onCreate={onCreateStyle}
                        />
                    )}

                    {/* 
                    CONTENT 
                */}
                    <Stack
                        h="100%"
                        w="100%"
                        px={4}
                        pt={4}
                        pb={!isGradient && 4}
                        bgColor="white"
                        shadow="0 -1px 20px rgba(0,0,0,0.01)"
                        overflow="scroll"
                    >
                        <GradientPreview
                            gradientStops={gradientStops}
                            gradientTransform={gradientTransform}
                            angle={gradientAngle}
                            minH={!isGradient && '100%'}
                            name={currentPaintStyle && currentPaintStyle.name}
                        />
                        {isGradient && (
                            <LinearGradientPicker
                                onChange={onChangeGradient}
                                value={gradientStops}
                                defaultValue={defaultGradientStops}
                            />
                        )}
                        {isGradient && (
                            <AngularSlider
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
                <Divider borderColor="blackAlpha.100" />
                {/* 
                FOOTER 
            */}
                <Stack direction="row" spacing={3} py={3} px={3}>
                    <PreferencesDrawerButton defaultPreferences={preferences} onChange={onChangePreferences} />
                    <Button
                        size="md"
                        colorScheme={isSelected && !isGradient ? 'gray' : 'primary'}
                        w="full"
                        rounded="md"
                        onClick={applyGradient}
                        isDisabled={!isSelected || !isGradient}
                    >
                        {!isGradient ? 'No gradients' : !isSelected ? 'No selection' : 'Apply'}
                        {selection && isSelected && isGradient ? (
                            <Badge
                                ml={2}
                                size="xs"
                                px={1}
                                boxSize={4}
                                lineHeight={4}
                                colorScheme="whiteAlpha"
                                color="whiteAlpha.700"
                            >
                                {selection.length}
                            </Badge>
                        ) : null}
                    </Button>
                </Stack>
            </Flex>
        </ScaleFade>
    );
};

export default LinearGradientPage;
