import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Badge, Button, Flex, Divider, Fade, SlideFade} from '@chakra-ui/react';
import AngularSlider from '../shared/AngularSlider';
import LinearGradientPicker from '../shared/LinearGradientPicker';
import {GradientStops, Preferences} from '../../typings';
import {gradientAngleFromTransform} from '../../lib/colors';
import {defaultGradientStops, defaultAngle, defaultPreferences} from '../../lib/constants';
import {filterGradientCompatibleNodes} from '../../lib/figma';
import GradientPreview from '../shared/GradientPreview';
import PaintStyles from '../shared/PaintStyles';
import PreferencesDrawerButton from '../shared/PreferencesDrawerButton';
import StylesSkeleton from '../shared/StylesSkeleton';
import {anglesTransform} from '../../lib/constants';
import ImportButton from '../shared/ImportButton';

const LinearGradientPage = ({}) => {
    const [selection, setSelection] = useState<RectangleNode[]>();
    const [gradientAngle, setGradientAngle] = useState<number>(defaultAngle);
    const [gradientStops, setGradientStops] = useState<GradientStops>(); //defaultGradientStops
    const [gradientTransform, setGradientTransform] = useState<Transform>(); //defaultGradientTransform
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>([]);
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const currentGradientPaint: GradientPaint = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        console.log(
            'CURRENT GRADIENT',
            gradientStops && gradientTransform ? {...paint, gradientStops, gradientTransform} : undefined
        );
        return gradientStops && gradientTransform ? {...paint, gradientStops, gradientTransform} : undefined;
    }, [gradientTransform, gradientStops, currentPaintStyle]);

    const isSelection = React.useMemo(() => selection && selection.length > 0, [selection]);

    const hasGradientInSelection = React.useMemo(() => {
        const gradientNodes = filterGradientCompatibleNodes(selection);
        console.log('hasGradientInSelection:', !!gradientNodes && gradientNodes.length > 0);
        return !!gradientNodes && gradientNodes.length > 0;
    }, [selection]);

    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);

    const isChanged = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        return (
            (currentPaintStyle && JSON.stringify(gradientStops) != JSON.stringify(paint.gradientStops)) ||
            (currentPaintStyle && gradientAngle != gradientAngleFromTransform(paint.gradientTransform))
        );
    }, [currentPaintStyle, gradientAngle, gradientStops]);

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

    //Select PaintGradient from a global PaintStyle
    const selectPaintStyle = useCallback(
        (paintStyle: PaintStyle) => {
            console.log('selectPaintStyle', paintStyle);
            if (!paintStyle || !paintStyle.paints) return;
            const gradientPaint = paintStyle.paints[0] as GradientPaint;
            setCurrentPaintStyle(paintStyle);
            setGradientStops(gradientPaint.gradientStops);
            setGradientTransform(gradientPaint.gradientTransform);
            setGradientAngle(gradientAngleFromTransform(gradientPaint.gradientTransform));
        },
        [paintStyles]
    );

    //Select PaintGradient
    const selectGradientPaint = useCallback((paint: GradientPaint) => {
        //Selects a gradient paint to edit without changing selection
        setGradientStops(paint.gradientStops);
        setGradientTransform(paint.gradientTransform);
    }, []);

    //Import a PaintGradient from current selection
    const importSelectionGradient = useCallback(() => {
        const gradientNode = selection && (selection[0] as RectangleNode);
        const _gradientPaint = gradientNode.fills[0];
        console.log('IMPORT SELECTION FILL', gradientNode.fills, _gradientPaint);
        selectGradientPaint(_gradientPaint);

        if (gradientNode.fillStyleId) {
            selectPaintStyle({
                ...gradientNode,
                paints: gradientNode.fills,
                id: gradientNode.fillStyleId,
            } as any);
        } else {
            selectGradientPaint(_gradientPaint);
        }
    }, [selection]);

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
    }, [gradientStops, gradientAngle]);

    useEffect(() => {
        if (isLoading && preferences) {
            setPreferences({...preferences});
        }
    }, [preferences]);

    useEffect(() => {
        if (selection && selection.length) {
            const selectionGradientPaint = selection[0];

            if (!currentGradientPaint) {
                console.log('AUTO import', currentPaintStyle, currentGradientPaint, selectionGradientPaint);
                if (selectionGradientPaint.fillStyleId) {
                    selectPaintStyle({
                        ...selectionGradientPaint,
                        paints: selectionGradientPaint.fills,
                        id: selectionGradientPaint.fillStyleId,
                    } as any);
                } else {
                    selectGradientPaint(selectionGradientPaint.fills[0]);
                }
            }
        }
    }, [selection]);

    useEffect(() => {
        const selectionGradientPaint = selection && selection.length && selection[0].fills[0];

        if (paintStyles && paintStyles.length && !currentPaintStyle && !selectionGradientPaint) {
            selectPaintStyle(paintStyles[0]);
        }
        setIsLoading(false);
    }, [paintStyles]);

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        const onMessage = (event) => {
            const {type, message} = event.data.pluginMessage;

            switch (type) {
                case 'figma:selectionchange':
                    const objectMessage = JSON.parse(message);
                    console.log('figma:selectionchange', objectMessage);

                    if (!objectMessage.selectionFills) {
                        console.log('NO GRADIENT IN SELECTION', objectMessage.selection);
                        //  setSelection(undefined);
                        setSelection(objectMessage.selection);
                        return;
                    } else {
                        // const selectionGradientPaint = objectMessage.selectionFills[0];
                        // if (!currentGradientPaint) {
                        //     console.log(
                        //         'AUTO import',
                        //         currentPaintStyle,
                        //         currentGradientPaint,
                        //         objectMessage.selection
                        //     );
                        //     selectGradientPaint(selectionGradientPaint);
                        // }
                        setSelection(objectMessage.selection);
                    }

                    //setCurrentPaintStyle(undefined);
                    // if (fills) {
                    //     setGradientStops(fills[0].gradientStops);
                    //     fills[0].gradientTransform &&
                    //         setGradientAngle(gradientAngleFromTransform(fills[0].gradientTransform));
                    // }
                    break;
                case 'figma:styles:gradientschange':
                    const _paintStyles: PaintStyle[] = message.paintStyles.reverse();
                    console.log('figma:styles:gradientschange', _paintStyles);
                    setPaintStyles(_paintStyles);

                    // if (
                    //     (paintStyles && JSON.stringify(message.paintStyles) != JSON.stringify(paintStyles)) ||
                    //     (paintStyles && !paintStyles.length)
                    // ) {
                    //     setPaintStyles(_paintStyles);
                    // }
                    break;
                case 'figma:preferencesupdate':
                    setPreferences(message.preferences);
                    break;
                case 'figma:selectstyle':
                    const selectedPaintStyle = message.paintStyle as PaintStyle;
                    console.log('selectedPaintStyle', selectedPaintStyle);
                    if (selectedPaintStyle) selectPaintStyle(selectedPaintStyle);
                    break;
                default:
                    break;
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
                            isChanged={isChanged}
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
                        pb={4}
                        bgColor="white"
                        shadow="0 -1px 20px rgba(0,0,0,0.01)"
                        overflow="hidden"
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
                {/* <Stack direction="row" fontSize="xx-small" spacing="2px">
                    <span>{hasGradientInSelection ? 'hasGradientInSelection' : ''}</span>
                    <span>{isChanged ? 'isChanged' : ''}</span>
                    <span>{isSelection ? 'isSelection' : ''}</span>
                    <span>{isGradient ? 'isGradient' : ''}</span>
                    <span>{currentGradientPaint ? 'currentGradientPaint' : ''}</span>
                </Stack> */}

                <Stack direction="row" spacing={2} py={3} px={3}>
                    {isSelection && hasGradientInSelection && <ImportButton onImport={importSelectionGradient} />}
                    <Button
                        size="sm"
                        colorScheme={'primary'}
                        w="full"
                        onClick={() => applyGradient(true)}
                        isDisabled={!isSelection}
                    >
                        {!isSelection ? 'No selection' : 'Apply'}
                        {selection && isSelection && isGradient ? (
                            <Badge
                                ml={2}
                                size="xs"
                                px={1}
                                boxSize={4}
                                lineHeight={4}
                                colorScheme="whiteAlpha"
                                color="whiteAlpha.700"
                                fontSize="xs"
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
