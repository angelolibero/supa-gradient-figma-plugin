import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Badge, Button, Flex, Divider, Box} from '@chakra-ui/react';
import BaseSlider from '../shared/Sliders/BaseSlider';
import {GradientPaintType, GradientStops, Preferences} from '../../typings';
import {DEFAULT_ANGLE, DEFAULT_PREFERENCES} from '../../lib/constants';
import {filterGradientCompatibleNodes, isExternalStyleId} from '../../lib/figma';
import GradientPreview from '../shared/GradientPreview';
import GradientStylesPicker from '../shared/GradientStylesPicker/GradientStylesPicker';
import PreferencesDrawerButton from '../shared/Drawers/PreferencesDrawerButton';
import ImportButton from '../shared/ImportButton';
import Empty from '../shared/Empty';
import GradientTypeTabs from '../shared/GradientTypeTabs';
import GradientPicker from '../shared/GradientPicker';
import {degreesFromTransform, rotateTransform, scaleTransform, transformToMatrix} from '../../lib/matrix';
import ScaleSlider from '../shared/Sliders/ScaleSlider';
import {decomposeTSR} from 'transformation-matrix';
import {MdArrowUpward, MdCircle} from 'react-icons/md';

const GradientPage = ({}) => {
    const [selection, setSelection] = useState<RectangleNode[]>();
    const [gradientAngle, setGradientAngle] = useState<number>(DEFAULT_ANGLE);
    const [gradientStops, setGradientStops] = useState<GradientStops>(); //DEFAULT_GRADIENT_STOPS
    const [gradientTransform, setGradientTransform] = useState<Transform>(); //DEFAULT_GRADIENT_TRANSFORM
    const [gradientScale, setGradientScale] = useState<number>(1);
    const [gradientType, setGradientType] = React.useState<GradientPaintType>('GRADIENT_LINEAR');
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>();
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const scrollElementRef = React.useRef();

    const isSelection = React.useMemo(() => selection && selection.length > 0, [selection]);

    const hasExternalStyle = React.useMemo(() => {
        return currentPaintStyle && isExternalStyleId(currentPaintStyle.id);
    }, [currentPaintStyle, paintStyles]);

    const hasGradientInSelection = React.useMemo(() => {
        const gradientNodes = filterGradientCompatibleNodes(selection);
        return !!gradientNodes && gradientNodes.length > 0;
    }, [selection]);

    const isSelectionImportable = React.useMemo(
        () =>
            isSelection &&
            hasGradientInSelection &&
            currentPaintStyle &&
            selection[0].fillStyleId != currentPaintStyle.id,
        [isSelection, hasGradientInSelection, currentPaintStyle, selection, currentPaintStyle]
    );

    const isGradient = React.useMemo(() => !!gradientStops, [gradientStops]);

    const isChanged = React.useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        const decomposed = paint && decomposeTSR(transformToMatrix(paint.gradientTransform));
        return (
            (currentPaintStyle && JSON.stringify(gradientStops) != JSON.stringify(paint.gradientStops)) ||
            (currentPaintStyle && paint && gradientAngle != degreesFromTransform(paint.gradientTransform)) ||
            (gradientType && paint && gradientType != paint.type) ||
            (gradientScale && decomposed && gradientScale != +(decomposed.scale.sx || decomposed.scale.sy).toFixed(2))
        );
    }, [currentPaintStyle, gradientAngle, gradientStops, gradientType, gradientScale]);

    const editingPaint = React.useMemo(() => {
        return {gradientTransform, gradientStops, type: gradientType};
    }, [gradientStops, gradientTransform, gradientType]);

    const applyGradient = useCallback(
        (updateSelection = true) => {
            const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);

            if (isChanged && currentPaintStyle) {
                updateCurrentPaintStyle();
            }
            if (!updateSelection || !gradientTransform || hasExternalStyle) {
                console.log('external,invalid or not updated gradient');
                currentPaintStyle && console.log('hasExternalStyle', hasExternalStyle);
                return;
            } else if (updateSelection) {
                parent.postMessage(
                    {
                        pluginMessage: {
                            type: 'apply-gradient',
                            //    angle: gradientAngle, //gradientAngle,
                            gradientStops,
                            gradientTransform,
                            gradientType,
                            paintStyleId: currentPaintStyle && currentPaintStyle.id,
                        },
                    },
                    '*'
                );
            }
        },
        [currentPaintStyle, gradientStops, gradientTransform, gradientType, isChanged, hasExternalStyle]
    );

    const updateCurrentPaintStyle = useCallback(() => {
        let currentPaints = currentPaintStyle.paints as GradientPaint[];
        const _originalPaintStyle = paintStyles.filter((paint) => {
            if (paint.id == currentPaintStyle.id) return paint;
        })[0];
        const originalPaintStyleIndex = paintStyles.indexOf(_originalPaintStyle);
        console.log('updateCurrentPaintStyle');
        const updatedGradientPaint: GradientPaint = {
            ...currentPaints[0],
            gradientStops,
            gradientTransform: rotateTransform(gradientAngle),
            type: gradientType,
        };
        currentPaints.splice(originalPaintStyleIndex, 1, updatedGradientPaint);
        const updatedStyle = {...currentPaintStyle, paints: currentPaints};
        setCurrentPaintStyle(updatedStyle);
    }, [currentPaintStyle, gradientTransform, gradientStops, gradientType, gradientAngle, paintStyles]);

    //Select PaintGradient from a global PaintStyle
    const selectPaintStyle = useCallback(
        (paintStyle: PaintStyle) => {
            if (!paintStyle || !paintStyle.paints) return;
            const gradientPaint = paintStyle.paints[0] as GradientPaint;
            const decomposed = decomposeTSR(transformToMatrix(gradientPaint.gradientTransform));
            setCurrentPaintStyle(paintStyle);
            setGradientStops(gradientPaint.gradientStops);
            setGradientTransform(gradientPaint.gradientTransform);
            setGradientScale(+(decomposed.scale.sx || decomposed.scale.sy).toFixed(2));
            setGradientType(gradientPaint.type);
            setGradientAngle(degreesFromTransform(gradientPaint.gradientTransform));
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
            setGradientAngle(degreesFromTransform(paint.gradientTransform));
        },
        [selection]
    );

    //Check for paint styles changes and updates, if any change is found, updates paintStyles
    const checkPaintStylesChanged = useCallback(
        (_paintStyles: PaintStyle[]) => {
            const canUpdateStyles = JSON.stringify(_paintStyles) != JSON.stringify(paintStyles);
            if (canUpdateStyles) setPaintStyles(_paintStyles);
        },
        [paintStyles]
    );

    //Import a PaintGradient from current selection
    const importSelectionGradient = useCallback(() => {
        const gradientNode = selection && (selection[0] as RectangleNode);
        const _gradientPaint: GradientPaint = gradientNode.fills[0];
        selectGradientPaint(_gradientPaint);
        if (gradientNode.fillStyleId) {
            selectPaintStyle({
                ...gradientNode,
                paints: gradientNode.fills,
                id: !isExternalStyleId(gradientNode.fillStyleId) ? gradientNode.fillStyleId : undefined,
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
                const rotatedTransform = rotateTransform(angle);
                setGradientTransform(rotatedTransform);
                setGradientAngle(angle);
            }
        },
        [gradientAngle, gradientTransform]
    );

    const onChangeScale = useCallback(
        (scale) => {
            if (scale != gradientScale) {
                const scaledTransform = scaleTransform(scale / 100, scale / 100);
                setGradientTransform(scaledTransform);
                setGradientScale(scale / 100);
            }
        },
        [gradientAngle, gradientTransform, gradientScale]
    );

    const onChangeStops = useCallback(
        (_gradientStops: GradientStops) => {
            const updatedGradientStops: GradientStops = _gradientStops;
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
    }, [gradientStops, gradientAngle, gradientType, gradientScale]);

    useEffect(() => {
        if (isLoading && preferences) {
            setPreferences({...preferences});
        }
    }, [preferences]);

    useEffect(() => {
        if (selection && selection.length && !currentPaintStyle) {
            const selectionGradientPaint = selection[0];
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
    }, [selection]);

    useEffect(() => {
        const selectionGradientPaint = selection && selection.length && selection[0].fills[0];

        //- !currentGradientPaint
        if (paintStyles && paintStyles.length && !currentPaintStyle && !selectionGradientPaint) {
            //if there are paintStyle and no gradient is selected, loads it from first gradient paint style available
            selectPaintStyle(paintStyles[0]);
        } else if (paintStyles && paintStyles.length && currentPaintStyle && currentPaintStyle.id) {
            const _originalPaintStyle = paintStyles.filter((paint) => {
                if (paint.id == currentPaintStyle.id) return paint;
            })[0];
            if (_originalPaintStyle && JSON.stringify(_originalPaintStyle) != JSON.stringify(currentPaintStyle)) {
                //  setCurrentPaintStyle(_originalPaintStyle);
                const paintStyle = _originalPaintStyle ? _originalPaintStyle : currentPaintStyle;
                selectPaintStyle(paintStyle);

                // setGradientStops(paint.gradientStops);
                // setGradientTransform(paint.gradientTransform);
                // setGradientType(paint.type);
                // setGradientAngle(degreesFromTransform(paint.gradientTransform));
            }
        }

        isLoading && paintStyles && setIsLoading(false);
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
                        setSelection([]);
                    } else {
                        setSelection(objectMessage.selection);
                    }
                    break;
                case 'figma:styles:gradientschange':
                    const _paintStyles: PaintStyle[] = message.paintStyles.reverse();
                    checkPaintStylesChanged(_paintStyles);
                    break;
                case 'figma:preferencesupdate':
                    setPreferences(message.preferences);
                    break;
                case 'figma:selectstyle':
                    const selectedPaintStyle = message.paintStyle as PaintStyle;
                    console.log('figma:selectstyle', selectedPaintStyle);
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
        <>
            {/* <Fade in={!isLoading}> */}
            <Flex direction="column" h="100%" w="100%" overflow="hidden">
                <Stack
                    alignItems="center"
                    spacing={0}
                    boxSize="100%"
                    overflow="scroll"
                    pb={currentPaintStyle || gradientTransform ? 2 : 0}
                    boxSizing="content-box"
                    ref={scrollElementRef}
                >
                    <GradientStylesPicker
                        paintStyles={paintStyles}
                        currentPaintStyle={currentPaintStyle}
                        isChanged={isChanged}
                        editingPaint={editingPaint}
                        onSelect={selectPaintStyle}
                        onCreate={onCreateStyle}
                        pos="sticky"
                        top={0}
                        zIndex="1"
                    />
                    {isGradient ? (
                        <Flex direction="column" h="100%" w="100%" bgColor="white" transition="all 0.15s">
                            <GradientPreview
                                gradientStops={gradientStops}
                                gradientTransform={gradientTransform}
                                gradientType={gradientType}
                                gradientScale={gradientScale}
                                angle={gradientAngle}
                                name={currentPaintStyle && currentPaintStyle.id && currentPaintStyle.name}
                            />

                            <Stack h="100%" w="100%" pb={0} spacing={4}>
                                <Stack spacing={0}>
                                    <GradientTypeTabs
                                        gradientType={gradientType}
                                        onChange={onChangeType}
                                        transition="all 0.1s"
                                        h={'auto'}
                                        pt={2}
                                        pb={0}
                                        px={4}
                                    />
                                    {gradientType == 'GRADIENT_LINEAR' || gradientType == 'GRADIENT_ANGULAR' ? (
                                        <BaseSlider
                                            step={15}
                                            value={gradientAngle}
                                            icon={
                                                <Box transform={`rotate(${gradientAngle}deg)`}>
                                                    <MdArrowUpward />
                                                </Box>
                                            }
                                            symbol="°"
                                            onChange={onChangeAngle}
                                        />
                                    ) : (
                                        <BaseSlider
                                            value={gradientScale * 100}
                                            icon={
                                                <Box transform={`scale(${(1 - gradientScale) / 2 + 0.5})`}>
                                                    <MdCircle />
                                                </Box>
                                            }
                                            defaultValue={100}
                                            min={0}
                                            max={100}
                                            step={5}
                                            markDivisionCount={2}
                                            onChange={onChangeScale}
                                        />
                                    )}
                                    <Divider />
                                </Stack>
                                <GradientPicker onChange={onChangeStops} gradientStops={gradientStops} />
                            </Stack>
                        </Flex>
                    ) : (
                        !isLoading && <Empty />
                    )}
                </Stack>

                {isGradient && (
                    <>
                        <Divider borderColor="blackAlpha.100" />
                        <Stack direction="row" spacing={2} py={3} px={3}>
                            {isSelectionImportable && (
                                <ImportButton
                                    gradientPaint={selection[0].fills[0]}
                                    onImport={importSelectionGradient}
                                />
                            )}
                            <Button
                                size="sm"
                                colorScheme={'primary'}
                                w="full"
                                onClick={() => applyGradient()}
                                isDisabled={!isSelection || hasExternalStyle}
                            >
                                {!isSelection ? 'No selection' : 'Apply'}
                                {hasExternalStyle && 'external'}
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
                            <PreferencesDrawerButton DEFAULT_PREFERENCES={preferences} onChange={onChangePreferences} />
                        </Stack>
                    </>
                )}
            </Flex>
            {/* </Fade> */}
        </>
    );
};

export default GradientPage;
