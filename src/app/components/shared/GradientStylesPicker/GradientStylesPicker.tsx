import * as React from 'react';
import {FC, useMemo, useCallback} from 'react';
import {RadioGroup, Center, BoxProps, SimpleGrid, Box, Text, GridItem} from '@chakra-ui/react';
import GradientSwatch from '../Swatchs/GradientSwatch';
import CreateStyleDrawerButton from '../Drawers/CreateStyleDrawerButton';
import {bgColorsFromStops, bgGradientFromColors} from '../../../lib/colors';
import PaintStylesSkeleton from './GradientStylesSkeleton';
import {degreesFromTransform} from '../../../lib/matrix';

type Props = {
    paintStyles: PaintStyle[];
    currentPaintStyle?: PaintStyle;
    editingPaint?: GradientPaint;
    isChanged?: boolean;
    onSelect: (paintStyle: PaintStyle) => void;
    onCreate?: (name: string, gradientPaint?: GradientPaint) => void;
} & Omit<BoxProps, 'onSelect' | 'children'>;

const GradientStylesPicker: FC<Props> = ({
    paintStyles,
    currentPaintStyle,
    editingPaint,
    isChanged,
    onSelect,
    onCreate,
    ...rest
}) => {
    const height = useMemo(() => {
        if (paintStyles && paintStyles.length > 11) return '88px';
        else if (paintStyles && paintStyles.length > 5) return '80px';
        else return '48px';
    }, [paintStyles]);

    const currentGradientPaint = useMemo(() => {
        return (currentPaintStyle && (currentPaintStyle.paints[0] as GradientPaint)) || editingPaint;
    }, [currentPaintStyle, paintStyles]);

    const newBgGradient = useMemo(() => {
        if (currentGradientPaint && currentGradientPaint.gradientTransform) {
            const bgGradientColors = bgColorsFromStops(currentGradientPaint.gradientStops);
            return bgGradientFromColors(bgGradientColors, degreesFromTransform(currentGradientPaint.gradientTransform));
        }
    }, [currentPaintStyle, currentGradientPaint]);

    //Select PaintGradient from a global PaintStyle
    const handleOnSelect = useCallback(
        (paintStyle: PaintStyle) => {
            if (currentPaintStyle && currentPaintStyle.id == paintStyle.id) return;
            onSelect(paintStyle);
        },
        [onSelect, currentPaintStyle, paintStyles]
    );

    return !paintStyles ? (
        <PaintStylesSkeleton />
    ) : (
        <Box
            w="100%"
            maxW="100%"
            flexDir={'column'}
            bgGradient="linear(to-b, white, gray.100)"
            transition="all 0.25s"
            {...rest}
        >
            <RadioGroup
                overflow="scroll"
                w="100%"
                maxW="100%"
                height={height}
                value={currentPaintStyle ? currentPaintStyle.id : undefined}
                transition="all 0.5s"
            >
                <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={2} p={3}>
                    {editingPaint && (
                        <Center pos="relative">
                            <CreateStyleDrawerButton
                                paintStyle={currentPaintStyle}
                                // || ({paints: [gradientPaint]} as any
                                gradientPaint={currentGradientPaint || editingPaint}
                                onCreate={onCreate}
                                boxSize={6}
                                minW={6}
                                maxW={6}
                            />
                            {currentGradientPaint && (
                                <Box
                                    boxSize="14px"
                                    pos="absolute"
                                    right="-3px"
                                    top={-1}
                                    rounded="full"
                                    bgGradient={newBgGradient}
                                    border="2px solid"
                                    borderColor="white"
                                    shadow="sm"
                                />
                            )}
                        </Center>
                    )}
                    {editingPaint && editingPaint.gradientTransform && paintStyles.length == 0 && (
                        <GridItem colSpan={5} textAlign="left">
                            <Text fontSize="xs">Create first gradient style</Text>
                        </GridItem>
                    )}
                    {paintStyles &&
                        paintStyles.map((paintStyle, index) => {
                            return (
                                <GradientSwatch
                                    paintStyle={paintStyle}
                                    key={index}
                                    onSelect={handleOnSelect}
                                    isActive={currentPaintStyle && paintStyle.id == currentPaintStyle.id}
                                    //    showReset={isChanged && currentPaintStyle && paintStyle.id == currentPaintStyle.id}
                                />
                            );
                        })}
                </SimpleGrid>
            </RadioGroup>
        </Box>
    );
};

export default GradientStylesPicker;
