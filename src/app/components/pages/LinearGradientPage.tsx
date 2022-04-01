import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Badge, Button, Flex, Divider, Fade} from '@chakra-ui/react';
import AngularSlider from '../shared/AngularSlider';
import LinearGradientPicker from '../shared/LinearGradientPicker';
import {GradientStops, Preferences} from '../../typings';
import {gradientAngleFromTransform} from '../../lib/colors';
import {defaultGradientStops, defaultAngle, defaultPreferences} from '../../lib/constants';
import GradientPreview from '../shared/GradientPreview';
import PaintStyles from '../shared/PaintStyles';
import PreferencesDrawerButton from '../shared/PreferencesDrawerButton';
import StylesSkeleton from '../shared/StylesSkeleton';
import {anglesTransform} from '../../lib/constants';

const LinearGradientPage = ({}) => {
    const [selection, setSelection] = useState<NodeType[]>();
    const [gradientAngle, setGradientAngle] = useState<number>(defaultAngle);
    const [gradientStops, setGradientStops] = useState<GradientStops>(); //defaultGradientStops
    const [gradientTransform, setGradientTransform] = useState<Transform>(); //defaultGradientTransform
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>([]);
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const currentGradientPaint: GradientPaint = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        return {...paint, gradientStops, gradientTransform};
    }, [gradientTransform, gradientStops]);

    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);
    const isChanged = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        return (
            (currentPaintStyle && JSON.stringify(gradientStops) != JSON.stringify(paint.gradientStops)) ||
            (currentPaintStyle && gradientAngle != gradientAngleFromTransform(paint.gradientTransform))
        );
    }, [currentPaintStyle, gradientAngle, gradientStops]);
    const isSelected = React.useMemo(() => selection && selection.length, [selection]);

    const paintStyle: PaintStyle = React.useMemo(() => {
        //check if current style is similar to one existing style and return it
        if (currentPaintStyle && currentPaintStyle.paints && currentPaintStyle.paints.length) {
            for (const index in paintStyles) {
                const paintStyle = paintStyles[index];
                //bisogna fare un compare tra tutti i paintStyle.paints locali e il currentPaintStyle.paints
                if (JSON.stringify(paintStyle.paints) == JSON.stringify(currentPaintStyle.paints)) {
                    return paintStyle;
                }
            }
        }
        return undefined;
    }, [currentPaintStyle]);

    const applyGradient = useCallback(
        (force = false) => {
            let localPaintStyles: PaintStyle[] = [];

            if (isChanged && currentPaintStyle && currentPaintStyle.id) {
                //current style changed
                setCurrentPaintStyle(currentPaintStyle);
            } else {
                //current style is not changed
                if (paintStyle && currentPaintStyle && !currentPaintStyle.id) {
                    //Current style is a global style without changes, we assign the global
                    //   selectPaintStyle(paintStyle);
                } else {
                    setCurrentPaintStyle(currentPaintStyle || localPaintStyles[0]);
                }
            }
            if (!selection || (!selection.length && !force)) return;

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
        },
        [currentPaintStyle, gradientStops, gradientTransform, gradientAngle, paintStyles]
    );

    const selectPaintStyle = useCallback(
        (paintStyle: PaintStyle) => {
            if (!paintStyle) return;
            const gradientPaint = paintStyle.paints[0] as GradientPaint;
            setCurrentPaintStyle(paintStyle);
            setGradientStops(gradientPaint.gradientStops);
            setGradientTransform(gradientPaint.gradientTransform);
            setGradientAngle(gradientAngleFromTransform(gradientPaint.gradientTransform));
        },
        [paintStyles]
    );

    const importGradientPaint = useCallback((paint: GradientPaint) => {}, []);

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
                setGradientTransform(anglesTransform[angle]);
            }
        },
        [gradientAngle, gradientStops]
    );

    const onChangeGradient = useCallback(
        (_gradientStops: GradientStops) => {
            const updatedGradientStops: GradientStops = _gradientStops.map((value) => {
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
            setPreferences(preferences);
        },
        [preferences]
    );

    useEffect(() => {
        preferences && preferences.liveUpdates && applyGradient();
    }, [gradientStops, gradientAngle, currentPaintStyle]);

    useEffect(() => {
        if (isLoading && preferences) {
            setPreferences({...preferences});
        }
    }, [preferences]);

    useEffect(() => {
        if (paintStyles && paintStyles.length && !currentPaintStyle) {
            selectPaintStyle(paintStyles[0]);
        }
        if (isLoading) setIsLoading(false);
    }, [paintStyles, isLoading]);

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        const onMessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'figma:selectionchange') {
                //   const fills = message.fills;

                if (message.fills) {
                    console.log('GRADIENT FILL FROM SELECTION');
                    const fills: GradientPaint[] = JSON.parse(message.fills);
                    setGradientStops(fills[0].gradientStops);
                    setGradientTransform(fills[0].gradientTransform);
                }

                setSelection(message.selection);
                //setCurrentPaintStyle(undefined);
                // if (fills) {
                //     setGradientStops(fills[0].gradientStops);
                //     fills[0].gradientTransform &&
                //         setGradientAngle(gradientAngleFromTransform(fills[0].gradientTransform));
                // }
            } else if (type === 'figma:styles:gradientschange' && message.paintStyles) {
                const _paintStyles: PaintStyle[] = message.paintStyles.reverse();
                if (
                    (paintStyles && JSON.stringify(message.paintStyles) != JSON.stringify(paintStyles)) ||
                    !paintStyles
                ) {
                    setPaintStyles(_paintStyles);
                }
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
        <Fade in={!isLoading}>
            <Flex direction="column" h="100%" w="100%" overflow="hidden" zIndex={1}>
                {/* {isChanged ? 'UPDATED PAINT' : 'LOCAL paunt'} */}
                {/* {JSON.stringify(isChanged)} */}

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
                            currentPaintStyle={currentPaintStyle}
                            newPaintStyle={isChanged && currentPaintStyle}
                            gradientPaint={currentGradientPaint}
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
                            name={!isChanged && currentPaintStyle && currentPaintStyle.name}
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
                <Stack direction="row" spacing={2} py={3} px={3}>
                    <Button
                        size="md"
                        colorScheme={isSelected && !isGradient ? 'gray' : 'primary'}
                        w="full"
                        rounded="md"
                        onClick={() => applyGradient(true)}
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
                    <PreferencesDrawerButton defaultPreferences={preferences} onChange={onChangePreferences} />
                </Stack>
            </Flex>
        </Fade>
    );
};

export default LinearGradientPage;
