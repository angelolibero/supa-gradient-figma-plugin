import * as React from 'react';
import {FC, useState, useCallback, useEffect, useMemo} from 'react';
import {Stack, Badge, Button, Flex, Divider, Box, Alert, AlertIcon, Fade} from '@chakra-ui/react';
import BaseSlider from '../shared/Sliders/BaseSlider';
import {GradientPaintType, GradientStops, Preferences} from '../../typings';
import {filterGradientCompatibleNodes, isExternalStyleId} from '../../lib/figma';
import GradientPreview from '../shared/GradientPreview';
import GradientStylesPicker from '../shared/GradientStylesPicker/GradientStylesPicker';
import PreferencesDrawerButton from '../shared/Drawers/PreferencesDrawerButton';
import ImportButton from '../shared/ImportButton';
import Empty from '../shared/Empty';
import GradientTypeTabs from '../shared/GradientTypeTabs';
import GradientPicker from '../shared/GradientPicker';
import {MdArrowUpward, MdCircle} from 'react-icons/md';
import {useRecoilState} from 'recoil';
import stylesState from '../../atoms/styles';
import useDebouncedCallback from '../../lib/hooks/useDebounceCallback';
import {decomposeTSR} from 'transformation-matrix';
import {
    compareGradients,
    compareObjects,
    degreesFromTransform,
    rotateTransform,
    scaleTransform,
    transformToMatrix,
} from '../../lib/matrix';
import {
    DEFAULT_ANGLE,
    DEFAULT_DEBOUNCE_TIMEOUT,
    DEFAULT_GRADIENT_PAINT,
    DEFAULT_PREFERENCES,
} from '../../lib/constants';

const GradientPage: FC<any> = ({}) => {
    const [gradientAngle, setGradientAngle] = useState<number>(DEFAULT_ANGLE);
    const [gradientStops, setGradientStops] = useState<GradientStops>();
    const [gradientTransform, setGradientTransform] = useState<Transform>();
    const [gradientScale, setGradientScale] = useState<number>(1);
    const [gradientType, setGradientType] = React.useState<GradientPaintType>('GRADIENT_LINEAR');
    const [currentPaintStyle, setCurrentPaintStyle] = useState<PaintStyle>();
    const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
    const [selection, setSelection] = useState<RectangleNode[]>();
    const [selectionGradient, setSelectionGradient] = useState<GradientPaint>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const scrollElementRef = React.useRef();
    const [styles, setStyles] = useRecoilState(stylesState);

    //MEMOS

    const hasExternalStyle = useMemo(() => {
        return currentPaintStyle && isExternalStyleId(currentPaintStyle.id);
    }, [currentPaintStyle]);

    const hasGradientInSelection = useMemo(() => {
        const gradientNodes = filterGradientCompatibleNodes(selection);
        return !!gradientNodes && gradientNodes.length > 0;
    }, [selection]);

    const isGradient = useMemo(() => !!gradientStops, [gradientStops]);

    const isChanged = useMemo(() => {
        const paint = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);
        const decomposed = paint && decomposeTSR(transformToMatrix(paint.gradientTransform));
        return (
            (currentPaintStyle && !compareObjects(gradientStops, paint.gradientStops)) ||
            (currentPaintStyle && paint && gradientAngle != degreesFromTransform(paint.gradientTransform)) ||
            (gradientType && paint && gradientType != paint.type) ||
            (gradientScale && decomposed && gradientScale != +(decomposed.scale.sx || decomposed.scale.sy).toFixed(2))
        );
    }, [currentPaintStyle, gradientAngle, gradientStops, gradientType, gradientScale]);

    const isSelection = useMemo(() => selection && selection.length > 0, [selection]);

    const editingPaint = useMemo(() => {
        return gradientTransform && gradientStops
            ? {gradientTransform, gradientStops, type: gradientType}
            : DEFAULT_GRADIENT_PAINT;
    }, [gradientStops, gradientTransform, gradientType, selectionGradient]);

    const isSelectionImportable = useMemo(() => {
        const gradient = currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint);

        return (
            isSelection &&
            hasGradientInSelection &&
            selectionGradient &&
            !compareObjects(selectionGradient.gradientTransform, gradient && gradient.gradientTransform)
        );
    }, [isSelection, hasGradientInSelection, currentPaintStyle, selection, selectionGradient, gradientTransform]);

    //METHODS

    //Apply current gradient to selected layers
    const applyGradient = useCallback(() => {
        if (gradientTransform && !hasExternalStyle) {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'apply-gradient',
                        gradientStops,
                        gradientTransform,
                        gradientType,
                        paintStyleId: currentPaintStyle && currentPaintStyle.id,
                    },
                },
                '*'
            );
        }
    }, [currentPaintStyle, gradientStops, gradientTransform, gradientType, hasExternalStyle]);

    const debouncedApply = useDebouncedCallback(() => {
        applyGradient();
    }, DEFAULT_DEBOUNCE_TIMEOUT);

    const updatePaintInStyles = useCallback(
        (updatedPaint: GradientPaint) => {
            if (!currentPaintStyle) return;
            const updatedPaints = [...currentPaintStyle.paints];
            updatedPaints.splice(0, 1, {...editingPaint, ...updatedPaint});
            const _originalPaintStyle: PaintStyle = styles.gradients.find(
                (paintStyle) => paintStyle.id == currentPaintStyle.id
            );
            const updateIndex = styles.gradients.indexOf(_originalPaintStyle);
            const gradients = [...styles.gradients];
            gradients.splice(updateIndex, 1, {
                ..._originalPaintStyle,
                ...{...currentPaintStyle, paints: updatedPaints},
            });
            setStyles({...styles, gradients});

            if (selectionGradient) {
                console.log('NOOOOOOOOOOOOOOO');
                setSelectionGradient(updatedPaints[0] as GradientPaint);
            }
        },
        [currentPaintStyle, styles, editingPaint]
    );

    //Select a paint style
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
            setSelectionGradient(undefined);
            debouncedApply();
        },
        [styles]
    );

    //Select PaintGradient
    const selectGradientPaint = useCallback(
        (paint: GradientPaint) => {
            //Selects a gradient paint to edit without changing selection
            setGradientStops(paint.gradientStops);
            setGradientTransform(paint.gradientTransform);
            setGradientType(paint.type);
            setGradientAngle(degreesFromTransform(paint.gradientTransform));
            //  applyGradient();
        },
        [selection]
    );

    //Import a PaintGradient from current selection
    const importSelectionGradient = useCallback(() => {
        const gradientNode = selection && (selection[0] as RectangleNode);
        if (gradientNode && gradientNode.fillStyleId) {
            const importedStyle = styles.gradients.find((gradient) => gradient.id == gradientNode.fillStyleId);
            selectPaintStyle(
                importedStyle ||
                    ({
                        paints: gradientNode.fills,
                        id: gradientNode.fillStyleId,
                    } as any)
            );
        } else {
            setCurrentPaintStyle(undefined);
        }
        selectionGradient && selectGradientPaint(selectionGradient);
    }, [selection, selectionGradient, styles]);

    //EVENT HANDLERS

    const onChangeType = useCallback(
        (type: GradientPaintType): void => {
            setGradientType(type);
            updatePaintInStyles({type: type} as GradientPaint);
            debouncedApply();
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
                            ...gradientPaint,
                        },
                    },
                },
                '*'
            );
        },
        [currentPaintStyle, styles, gradientStops, gradientTransform]
    );

    const onChangeAngle = useCallback(
        (angle) => {
            if (angle != gradientAngle) {
                const rotatedTransform = rotateTransform(angle);
                setGradientTransform(rotatedTransform);
                setGradientAngle(angle);
                updatePaintInStyles({gradientTransform: rotatedTransform} as GradientPaint);
                debouncedApply();
            }
        },
        [gradientAngle, gradientTransform, editingPaint, currentPaintStyle]
    );

    const onChangeScale = useCallback(
        (scale) => {
            if (scale != gradientScale) {
                const scaledTransform = scaleTransform(scale / 100, scale / 100);
                setGradientTransform(scaledTransform);
                setGradientScale(+(scale / 100).toFixed(2));
                updatePaintInStyles({gradientTransform: scaledTransform} as GradientPaint);
                debouncedApply();
            }
        },
        [gradientAngle, gradientTransform, gradientScale]
    );

    const onChangeStops = useCallback(
        (_gradientStops: GradientStops) => {
            const updatedGradientStops: GradientStops = _gradientStops;
            if (!compareObjects(gradientStops, updatedGradientStops)) {
                setGradientStops(updatedGradientStops);
                updatePaintInStyles({gradientStops: updatedGradientStops} as GradientPaint);
                debouncedApply();
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

    //EFFECTS

    useEffect(() => {
        if (preferences && preferences.liveUpdates) {
            setSelectionGradient(undefined);
        }
    }, [gradientStops, gradientAngle, gradientType, gradientScale]);

    useEffect(() => {
        if (isLoading && preferences) {
            setPreferences({...preferences});
        }
    }, [preferences]);

    useEffect(() => {
        const selectionGradientNode =
            selection && selection.find((node: RectangleNode) => node && node.fills[0] && node.fills[0].gradientStops);

        if (selection && selection.length && !currentPaintStyle) {
            //if selection and no currentPaintStyle
            if (selectionGradientNode && selectionGradientNode.fillStyleId && !gradientTransform) {
                //if selection has a paint style, select it
                !gradientTransform &&
                    selectPaintStyle({
                        paints: selectionGradientNode.fills,
                        id: selectionGradientNode.fillStyleId,
                    } as any);
                selectionGradient && setSelectionGradient(undefined);
            } else if (selectionGradientNode && selectionGradientNode.fills) {
                //if is a stored paint style, select it
                const gradient =
                    editingPaint && compareGradients(selectionGradientNode.fills[0], editingPaint)
                        ? undefined
                        : selectionGradientNode.fills[0];
                !gradientTransform && selectGradientPaint(selectionGradientNode.fills[0]);
                setSelectionGradient(gradient);
            }
        } else if (selection && selection.length) {
            if (selectionGradientNode && selectionGradientNode.fills) {
                //if selection has a gradient that is not a style
                setSelectionGradient(selectionGradientNode.fills[0]);
            }
        } else {
            //No selection, remove selectionGradient
            selectionGradient && setSelectionGradient(undefined);
        }
    }, [selection]);

    useEffect(() => {
        const selectionGradientPaint = selection && selection[0] && selection[0].fills && selection[0].fills[0];

        // if (styles.gradients && styles.gradients.length && currentPaintStyle && currentPaintStyle.id) {
        //     const _originalPaintStyle: PaintStyle = styles.gradients.find(
        //         (paintStyle) => paintStyle.id == currentPaintStyle.id
        //     );
        //     const isStyleChanged =
        //         _originalPaintStyle && currentPaintStyle && !compareObjects(_originalPaintStyle, currentPaintStyle);

        //     if (isStyleChanged && selectionGradientPaint && currentPaintStyle.id == selection[0].fillStyleId) {
        //         //&& selectionGradientPaint && currentPaintStyle.id == selection[0].fillStyleId
        //         //If original style is different from current and selection style is different from current one
        //         const paintStyle = _originalPaintStyle ? _originalPaintStyle : currentPaintStyle;
        //         const paint = paintStyle.paints[0] as GradientPaint;
        //         let angle = degreesFromTransform(paint.gradientTransform);
        //         if (angle == 0 && gradientAngle == 360) {
        //             //avoid the problem with 360° rotation that becomes 0 (0 == 360)
        //             const updatedGradientPaint = {
        //                 ...paintStyle.paints[0],
        //                 gradientTransform: rotateTransform(360),
        //             } as GradientPaint;
        //             const paints = [...paintStyle.paints];
        //             paints.splice(0, 1, updatedGradientPaint);
        //             const updatedPaintStyle = {...paintStyle, paints};
        //             // setCurrentPaintStyle(updatedPaintStyle);
        //             // selectPaintStyle(updatedPaintStyle);
        //             //  selectGradientPaint(updatedGradientPaint);
        //             setGradientStops(updatedGradientPaint.gradientStops);
        //             setGradientTransform(updatedGradientPaint.gradientTransform);
        //             setGradientType(updatedGradientPaint.type);

        //             console.log('1');
        //         } else {
        //             console.log('2');

        //             // setCurrentPaintStyle(paintStyle);
        //             // selectGradientPaint(paintStyle.paints[0] as GradientPaint);
        //             if (paint && isStyleChanged) {
        //                 setGradientTransform(paint.gradientTransform);
        //                 //    setGradientStops(paint.gradientStops);
        //                 console.log('2.1', paint);
        //                 //  selectGradientPaint(paint);
        //             }
        //         }
        //     } else if (isStyleChanged) {
        //         const paintStyle = _originalPaintStyle ? _originalPaintStyle : currentPaintStyle;
        //         const paint = paintStyle && (paintStyle.paints[0] as GradientPaint);

        //         if (paint) {
        //             console.log('3', paint);
        //             !compareObjects(paint.gradientTransform, gradientTransform) &&
        //                 setGradientTransform(paint.gradientTransform);
        //             // setGradientStops(paint.gradientStops);
        //         }
        //         //   paintStyle && setCurrentPaintStyle(paintStyle);
        //         // paintStyle && selectGradientPaint(paintStyle.paints[0] as GradientPaint);
        //         // if (selectionGradient) {
        //         //     console.log('3.1', selectGradientPaint, paintStyle.paints[0]);
        //         //     setSelectionGradient(paintStyle.paints[0] as GradientPaint);
        //         // }
        //     }
        // } else

        if (styles && styles.gradients.length && !currentPaintStyle && !selectionGradientPaint && !gradientTransform) {
            //if there are gradient styles and no gradient is selected, loads it from first gradient style available
            selectPaintStyle(styles.gradients[0]);
        } else if (styles.gradients.length == 0 && currentPaintStyle) {
            setCurrentPaintStyle(undefined);
        }

        isLoading && setIsLoading(false);
    }, [styles]);

    //FIGMA MESSAGES

    useEffect(() => {
        // This is how we read messages sent from the plugin controller
        const onMessage = (event) => {
            if (!event.data.pluginMessage) return;
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
                    const gradientStyles: PaintStyle[] = message.styles.gradients.reverse();
                    const solidStyles: PaintStyle[] = message.styles.solid.reverse();
                    if (
                        message.styles &&
                        !compareObjects(gradientStyles, styles.gradients) &&
                        !compareObjects(solidStyles, styles.solid)
                    ) {
                        setStyles({solid: solidStyles, gradients: gradientStyles});
                    } else {
                        setStyles({solid: solidStyles || [], gradients: gradientStyles || []});
                    }

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
        <Flex direction="column" h="100%" w="100%" overflow="hidden">
            <Stack
                alignItems="center"
                spacing={0}
                boxSize="100%"
                overflow="scroll"
                pb={currentPaintStyle || gradientTransform ? 0 : 0}
                boxSizing="content-box"
                ref={scrollElementRef}
            >
                <Fade
                    in={!isLoading && styles && styles.gradients && !styles.gradients.length && !gradientTransform}
                    unmountOnExit
                    style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}
                >
                    <Empty />
                </Fade>
                <Fade in={isGradient && !isLoading} unmountOnExit style={{width: '100%', height: '100%'}}>
                    {styles && (
                        <GradientStylesPicker
                            styles={styles.gradients}
                            selectedStyle={currentPaintStyle}
                            isChanged={isChanged}
                            editingPaint={editingPaint}
                            onSelect={selectPaintStyle}
                            onCreate={onCreateStyle}
                            pos="sticky"
                            top={0}
                            zIndex="1"
                        />
                    )}
                    <Flex direction="column" w="100%" bgColor="white">
                        <GradientPreview
                            gradientStops={gradientStops}
                            gradientTransform={gradientTransform}
                            gradientType={gradientType}
                            gradientScale={gradientScale}
                            angle={gradientAngle}
                            name={currentPaintStyle && currentPaintStyle.id && currentPaintStyle.name}
                        />
                        <Stack spacing={0} mb={4}>
                            {hasExternalStyle && (
                                <Alert status="warning" h={6}>
                                    <AlertIcon boxSize={3} mr={2} />
                                    Can't update external styles
                                </Alert>
                            )}
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
                    </Flex>
                </Fade>
            </Stack>

            {isGradient && (
                <GradientPageFooter
                    isGradient={isGradient}
                    isSelectionImportable={isSelectionImportable}
                    isSelection={isSelection}
                    hasExternalStyle={hasExternalStyle}
                    selection={selection}
                    selectionGradient={selectionGradient}
                    preferences={preferences}
                    onImport={importSelectionGradient}
                    onChangePreferences={onChangePreferences}
                    onApply={applyGradient}
                />
            )}
        </Flex>
    );
};

type GradientPageFooterProps = {
    isGradient: boolean;
    isSelectionImportable: boolean;
    isSelection: boolean;
    hasExternalStyle: boolean;
    selection;
    selectionGradient;
    preferences;
    onImport;
    onChangePreferences;
    onApply;
};

const GradientPageFooter: FC<GradientPageFooterProps> = ({
    isGradient,
    isSelectionImportable,
    isSelection,
    hasExternalStyle,
    selection,
    selectionGradient,
    preferences,
    onImport,
    onChangePreferences,
    onApply,
}) => {
    return (
        isGradient && (
            <Stack direction="row" spacing={2} py={3} px={3} borderTop="1px solid" borderColor="blackAlpha.100">
                {isSelectionImportable && <ImportButton gradientPaint={selectionGradient} onImport={onImport} />}
                <Button
                    size="sm"
                    colorScheme={'primary'}
                    w="full"
                    onClick={() => onApply()}
                    isDisabled={!isSelection || hasExternalStyle}
                >
                    {!isSelection ? 'No selection' : 'Fill selection'}
                    {selection && isSelection && isGradient ? (
                        <Badge
                            ml={2}
                            size="xs"
                            px={0}
                            boxSize="14px"
                            lineHeight="14px"
                            bgColor="whiteAlpha.300"
                            color="whiteAlpha.900"
                            fontSize="xs"
                            borderRadius="full"
                        >
                            {selection.length}
                        </Badge>
                    ) : null}
                </Button>
                <PreferencesDrawerButton DEFAULT_PREFERENCES={preferences} onChange={onChangePreferences} />
            </Stack>
        )
    );
};

export default GradientPage;
