import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Badge, Button, Flex, Divider, Fade, Box, Tab, TabList, TabPanels, TabPanel} from '@chakra-ui/react';
import RadianSlider from '../shared/Sliders/RadianSlider';
import GradientStopsEditor from '../shared/GradientStopsEditor';
import {GradientPaintType, GradientStops, Preferences} from '../../typings';
import {gradientAngleFromTransform} from '../../lib/colors';
import {defaultGradientStops, defaultAngle, defaultPreferences} from '../../lib/constants';
import {filterGradientCompatibleNodes} from '../../lib/figma';
import GradientPreview from '../shared/GradientPreview';
import PaintStyles from '../shared/PaintStyles';
import PreferencesDrawerButton from '../shared/Drawers/PreferencesDrawerButton';
import StylesSkeleton from '../shared/StylesSkeleton';
import {linearTransforms} from '../../lib/constants';
import ImportButton from '../shared/ImportButton';
import Empty from '../shared/Empty';
import GradientTypeTabs from '../shared/GradientTypeTabs';
import useScrollPosition from '../../lib/hooks/useScrollPosition';

const GradientPage = ({}) => {
    const [selection, setSelection] = useState<RectangleNode[]>();
    const [gradientAngle, setGradientAngle] = useState<number>(defaultAngle);
    const [gradientStops, setGradientStops] = useState<GradientStops>(); //defaultGradientStops
    const [gradientTransform, setGradientTransform] = useState<Transform>(); //defaultGradientTransform
    const [gradientType, setGradientType] = React.useState<GradientPaintType>('GRADIENT_LINEAR');
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>([]);
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const scrollElementRef = React.useRef();
    const scrollPosition = useScrollPosition(scrollElementRef);

    const currentGradientPaint: GradientPaint = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        return gradientStops && gradientTransform ? {...paint, gradientStops, gradientTransform} : undefined;
    }, [gradientTransform, gradientStops, currentPaintStyle]);

    const isSelection = React.useMemo(() => selection && selection.length > 0, [selection]);

    const hasGradientInSelection = React.useMemo(() => {
        const gradientNodes = filterGradientCompatibleNodes(selection);
        return !!gradientNodes && gradientNodes.length > 0;
    }, [selection]);

    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);

    const isChanged = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        return (
            (currentPaintStyle && JSON.stringify(gradientStops) != JSON.stringify(paint.gradientStops)) ||
            (currentPaintStyle && gradientAngle != gradientAngleFromTransform(paint.gradientTransform)) ||
            (gradientType && paint && gradientType != paint.type)
        );
    }, [currentPaintStyle, gradientAngle, gradientStops, gradientType]);

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
        (forceUpdate = false) => {
            if (isChanged && currentPaintStyle && currentPaintStyle.id) {
                //current style changed
                setCurrentPaintStyle(currentPaintStyle);
            } else if (!(paintStyle && currentPaintStyle && !currentPaintStyle.id)) {
                //Current style is a global style without changes, we assign the global style to currentpaintstyle
                setCurrentPaintStyle(currentPaintStyle);
            }

            //if (!selection || (!selection.length && !forceUpdate)) return;

            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'apply-gradient',
                        angle: gradientAngle,
                        gradientStops,
                        gradientTransform,
                        gradientType,
                        // gradientType: currentPaintStyle.paints[0].type,
                        paintStyleId: currentPaintStyle && currentPaintStyle.id,
                    },
                },
                '*'
            );
        },
        [
            currentPaintStyle,
            gradientStops,
            gradientTransform,
            gradientAngle,
            gradientType,
            paintStyles,
            selection,
            isChanged,
        ]
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
            setGradientType(gradientPaint.type);
            setGradientAngle(gradientAngleFromTransform(gradientPaint.gradientTransform));
        },
        [paintStyles]
    );

    //Select PaintGradient
    const selectGradientPaint = useCallback(
        (paint: GradientPaint) => {
            //Selects a gradient paint to edit without changing selection
            setGradientStops(paint.gradientStops);
            setGradientTransform(paint.gradientTransform);
            setGradientType(paint.type);
            setGradientAngle(gradientAngleFromTransform(paint.gradientTransform));
        },
        [selection]
    );

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
        }
    }, [selection]);

    const onChangeType = useCallback(
        (type: GradientPaintType): void => {
            setGradientType(type);
        },
        [gradientType]
    );

    const onCreateStyle = useCallback(
        (newName: string) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'create-style',
                        gradientStops,
                        gradientTransform,
                        gradientType,
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
                setGradientTransform(linearTransforms[angle]);
            }
        },
        [gradientAngle, gradientStops]
    );

    const onChangeStops = useCallback(
        (_gradientStops: GradientStops) => {
            const updatedGradientStops: GradientStops = _gradientStops;
            console.log('SSSSSDDDDDD', _gradientStops);
            if (JSON.stringify(gradientStops) != JSON.stringify(updatedGradientStops)) {
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
    }, [gradientStops, gradientAngle, gradientType]);

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

        if (
            paintStyles &&
            paintStyles.length &&
            !currentPaintStyle &&
            !selectionGradientPaint &&
            !currentGradientPaint
        ) {
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
                        setSelection([]);
                    } else {
                        setSelection(objectMessage.selection);
                    }
                    break;
                case 'figma:styles:gradientschange':
                    const _paintStyles: PaintStyle[] = message.paintStyles.reverse();
                    console.log('figma:styles:gradientschange', _paintStyles);
                    setPaintStyles(_paintStyles);
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
            <Flex direction="column" h="100%" w="100%" overflow="hidden">
                <Stack
                    direction="column"
                    alignItems="center"
                    spacing={0}
                    w="100%"
                    h="100%"
                    minW="100%"
                    maxW="100%"
                    overflow="scroll"
                    pb={2}
                    boxSizing="content-box"
                    ref={scrollElementRef}
                >
                    <Flex
                        flexDir={'column'}
                        w="100%"
                        bgGradient="linear(to-b, white, gray.100)"
                        //boxShadow="inset 0 -1px 20px rgba(0,0,0,0.05)"
                        pos="sticky"
                        top={0}
                        zIndex="1"
                        transition="all 0.25s"
                    >
                        {!isLoading ? (
                            <PaintStyles
                                paintStyles={paintStyles}
                                currentPaintStyle={currentPaintStyle}
                                isChanged={isChanged}
                                gradientPaint={currentGradientPaint}
                                onSelect={selectPaintStyle}
                                onCreate={onCreateStyle}
                            />
                        ) : (
                            <StylesSkeleton />
                        )}
                    </Flex>
                    {isGradient ? (
                        <Flex
                            direction="column"
                            h="100%"
                            w="100%"
                            bgColor="white"
                            transition="all 0.15s"
                            //  shadow="0 -2px 20px rgba(0,0,0,0.03)"
                        >
                            <GradientPreview
                                gradientStops={gradientStops}
                                gradientTransform={gradientTransform}
                                gradientType={gradientType}
                                angle={gradientAngle}
                                name={currentPaintStyle && currentPaintStyle.id && currentPaintStyle.name}
                                // pos="sticky"
                                // top={0}
                                // zIndex="modal"
                                // transition="all 0.25s"
                                // height={scrollPosition ? 50 : 100}
                                // minH={scrollPosition ? 50 : 100}
                            />
                            <GradientTypeTabs
                                gradientType={gradientType}
                                onChange={onChangeType}
                                transition="all 0.1s"
                                h={'auto'}
                                // opacity={scrollPosition ? 0 : 1}
                                pt={2}
                                px={3}
                            />
                            <Stack h="100%" w="100%" pt={2} pb={0} spacing={3}>
                                <Box px={3}>
                                    <RadianSlider
                                        onChange={onChangeAngle}
                                        defaultValue={180}
                                        min={0}
                                        max={360}
                                        step={45}
                                        value={gradientAngle}
                                    />
                                </Box>
                                <GradientStopsEditor
                                    onChange={onChangeStops}
                                    value={gradientStops}
                                    defaultValue={gradientStops}
                                />
                                <GradientStops
                                    onChange={onChangeStops}
                                    gradientStops={gradientStops}
                                    palette={palette}
                                    // onColorStopSelect={handleOnColorStopSelect}
                                />
                            </Stack>
                        </Flex>
                    ) : (
                        <Empty />
                    )}
                </Stack>

                {isGradient && (
                    <>
                        <Divider borderColor="blackAlpha.100" />
                        {/* <Stack direction="row" fontSize="xx-small" spacing="2px">
                    <span>{hasGradientInSelection ? 'hasGradientInSelection' : ''}</span>
                    <span>{isChanged ? 'isChanged' : ''}</span>
                    <span>{isSelection ? 'isSelection' : ''}</span>
                    <span>{isGradient ? 'isGradient' : ''}</span>
                    <span>{currentGradientPaint ? 'currentGradientPaint' : ''}</span>
                </Stack> */}
                        <Stack direction="row" spacing={2} py={3} px={3}>
                            {isSelection && hasGradientInSelection && (
                                <ImportButton onImport={importSelectionGradient} />
                            )}
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
                    </>
                )}
            </Flex>
        </Fade>
    );
};

export default GradientPage;
