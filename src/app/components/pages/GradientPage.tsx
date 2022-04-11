import * as React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {Stack, Badge, Button, Flex, Divider, Box} from '@chakra-ui/react';
import BaseSlider from '../shared/Sliders/BaseSlider';
import {GradientPaintType, GradientStops, Preferences} from '../../typings';
import {DEFAULT_ANGLE, DEFAULT_GRADIENT_PAINT, DEFAULT_PREFERENCES} from '../../lib/constants';
import {filterGradientCompatibleNodes, isExternalStyleId} from '../../lib/figma';
import GradientPreview from '../shared/GradientPreview';
import GradientStylesPicker from '../shared/GradientStylesPicker/GradientStylesPicker';
import PreferencesDrawerButton from '../shared/Drawers/PreferencesDrawerButton';
import ImportButton from '../shared/ImportButton';
import Empty from '../shared/Empty';
import GradientTypeTabs from '../shared/GradientTypeTabs';
import GradientPicker from '../shared/GradientPicker';
import {degreesFromTransform, rotateTransform, scaleTransform, transformToMatrix} from '../../lib/matrix';
import {decomposeTSR} from 'transformation-matrix';
import {MdArrowUpward, MdCircle} from 'react-icons/md';
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue} from 'recoil';
import stylesState from '../../atoms/styles';

const GradientPage = ({}) => {
    const [gradientAngle, setGradientAngle] = useState<number>(DEFAULT_ANGLE);
    const [gradientStops, setGradientStops] = useState<GradientStops>(); //DEFAULT_GRADIENT_STOPS
    const [gradientTransform, setGradientTransform] = useState<Transform>(); //DEFAULT_GRADIENT_TRANSFORM
    const [gradientScale, setGradientScale] = useState<number>(1);
    const [gradientType, setGradientType] = React.useState<GradientPaintType>('GRADIENT_LINEAR');
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [paintStyles, setPaintStyles] = useState<PaintStyle[]>();
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [selection, setSelection] = useState<RectangleNode[]>();
    const [selectionGradient, setSelectionGradient] = useState<GradientPaint>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const scrollElementRef = React.useRef();
    const [styles, setStyles] = useRecoilState(stylesState);

    const hasExternalStyle = React.useMemo(() => {
        return currentPaintStyle && isExternalStyleId(currentPaintStyle.id);
    }, [currentPaintStyle, paintStyles]);

    const hasGradientInSelection = React.useMemo(() => {
        const gradientNodes = filterGradientCompatibleNodes(selection);
        return !!gradientNodes && gradientNodes.length > 0;
    }, [selection]);

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

    const isSelection = React.useMemo(() => selection && selection.length > 0, [selection]);

    const isSelectionImportable = React.useMemo(() => {
        return isSelection && hasGradientInSelection && currentPaintStyle && selection && selectionGradient;
    }, [isSelection, hasGradientInSelection, currentPaintStyle, selection, selectionGradient]);

    const editingPaint = React.useMemo(() => {
        return gradientTransform && gradientStops
            ? {gradientTransform, gradientStops, type: gradientType}
            : DEFAULT_GRADIENT_PAINT;
    }, [gradientStops, gradientTransform, gradientType]);

    //Apply current gradient to selected layers
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
                            updateStyles: preferences.updateStyles,
                        },
                    },
                    '*'
                );
            }
        },
        [currentPaintStyle, gradientStops, gradientTransform, gradientType, isChanged, hasExternalStyle]
    );

    const updateCurrentPaintStyle = useCallback(() => {
        let currentPaints = [...currentPaintStyle.paints];
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
        (paintStyle: PaintStyle, updatePaintStyle: boolean = true) => {
            if (!paintStyle || !paintStyle.paints) return;
            const gradientPaint = paintStyle.paints[0] as GradientPaint;
            const decomposed = decomposeTSR(transformToMatrix(gradientPaint.gradientTransform));
            const scale = +(decomposed.scale.sx || decomposed.scale.sy).toFixed(2);
            const angle = degreesFromTransform(gradientPaint.gradientTransform);
            updatePaintStyle && setCurrentPaintStyle(paintStyle);
            setGradientStops(gradientPaint.gradientStops);
            setGradientTransform(gradientPaint.gradientTransform);
            setGradientScale(scale);
            setGradientType(gradientPaint.type);
            setGradientAngle(angle == 0 && gradientAngle == 360 ? 360 : angle);
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
        // const _gradientPaint: GradientPaint = gradientNode.fills[0];
        if (currentPaintStyle && currentPaintStyle.id) {
            //  setCurrentPaintStyle(undefined);
        }
        if (gradientNode.fillStyleId) {
            console.log('BBB1');
            selectPaintStyle({
                paints: gradientNode.fills,
                id: gradientNode.fillStyleId,
            } as any);
        } else {
            setCurrentPaintStyle(undefined);
        }
        selectionGradient && selectGradientPaint(selectionGradient);
        // if (gradientNode.fillStyleId) {
        //     selectPaintStyle({
        //         // ...gradientNode,
        //         paints: gradientNode.fills,
        //         id: !isExternalStyleId(gradientNode.fillStyleId) ? gradientNode.fillStyleId : undefined,
        //     } as any);
        // }
    }, [selection, selectionGradient]);

    const onChangeType = useCallback(
        (type: GradientPaintType): void => {
            setGradientType(type);
        },
        [gradientType]
    );

    const onCreateStyle = useCallback(
        (newName: string, gradientPaint: GradientPaint) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'create-style',
                        name: newName,
                        gradientPaint: {
                            gradientStops,
                            gradientTransform,
                            // gradientType,
                            ...gradientPaint,
                        },
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
                setGradientScale(+(scale / 100).toFixed(2));
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
            const selectionGradientNode = selection[0];
            if (selectionGradientNode.fillStyleId) {
                selectPaintStyle({
                    // ...selectionGradientNode,
                    paints: selectionGradientNode.fills,
                    id: selectionGradientNode.fillStyleId,
                } as any);
                setSelectionGradient(undefined);
            } else if (selectionGradientNode.fills) {
                selectGradientPaint(selectionGradientNode.fills[0]);
                setSelectionGradient(selectionGradientNode.fills[0]);
            }
            console.log('AAA');
        } else if (selection && selection.length) {
            console.log('BBB');
            if (selection[0].fills) {
                setSelectionGradient(selection[0].fills[0]);
                // if (selection[0] && selection[0].fillStyleId) {
                //     console.log('BBB1');
                //     selectPaintStyle({
                //         ...selection[0],
                //         paints: selection[0].fills,
                //         id: selection[0].fillStyleId,
                //     } as any);
                // }
            }
        } else {
            console.log('CCCC');
            setSelectionGradient(undefined);
        }
    }, [selection]);

    useEffect(() => {
        const selectionGradientPaint = selection && selection[0] && selection[0].fills && selection[0].fills[0];

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
                //  selectPaintStyle(paintStyle, false);
                setCurrentPaintStyle(paintStyle);
                selectGradientPaint(paintStyle.paints[0] as GradientPaint);
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

                    if (!objectMessage.selection) {
                        setSelection([]);
                    } else {
                        setSelection(objectMessage.selection);
                    }
                    break;
                case 'figma:styles:gradientschange':
                    const gradientsStyles: PaintStyle[] = message.styles.gradients.reverse();
                    if (message.styles.gradients) checkPaintStylesChanged(gradientsStyles);
                    setStyles(message.styles);
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
                {/* {selectionGradient ? 'si' : 'no'}
                {isSelectionImportable ? 'si' : 'no'} */}
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
                                        value={gradientType}
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
                                            symbol={<Box>°</Box>}
                                            onChange={onChangeAngle}
                                        />
                                    ) : (
                                        <BaseSlider
                                            value={+(gradientScale * 100).toFixed(2)}
                                            icon={
                                                <Box transform={`scale(${(1 - gradientScale) / 2 + 0.5})`}>
                                                    <MdCircle />
                                                </Box>
                                            }
                                            symbol={
                                                <Box fontSize="xs" h={'18px'}>
                                                    %
                                                </Box>
                                            }
                                            defaultValue={100}
                                            min={5}
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
                                <ImportButton gradientPaint={selectionGradient} onImport={importSelectionGradient} />
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
