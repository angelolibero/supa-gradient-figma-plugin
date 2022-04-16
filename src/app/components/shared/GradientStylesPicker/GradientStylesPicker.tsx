import * as React from 'react';
import {FC, useMemo, useCallback} from 'react';
import {RadioGroup, Center, BoxProps, Stack, Box, Text} from '@chakra-ui/react';
import GradientSwatch from '../Swatchs/GradientSwatch';
import CreateStyleDrawerButton from '../Drawers/CreateStyleDrawerButton';
import {bgColorsFromStops, bgGradientFromColors} from '../../../lib/colors';
import GradientStylesSkeleton from './GradientStylesSkeleton';
import {degreesFromTransform} from '../../../lib/matrix';

type Props = {
    styles: PaintStyle[];
    selectedStyle?: PaintStyle;
    editingPaint?: GradientPaint;
    isChanged?: boolean;
    onSelect: (style: PaintStyle) => void;
    onCreate?: (name: string, gradientPaint?: GradientPaint) => void;
} & Omit<BoxProps, 'onSelect' | 'children'>;

const GradientStylesPicker: FC<Props> = ({
    styles,
    selectedStyle,
    editingPaint,
    isChanged,
    onSelect,
    onCreate,
    ...rest
}) => {
    const currentGradientPaint = useMemo(() => {
        return (selectedStyle && (selectedStyle.paints[0] as GradientPaint)) || editingPaint;
    }, [selectedStyle, styles, editingPaint]);

    const newBgGradient = useMemo(() => {
        if (currentGradientPaint && currentGradientPaint.gradientTransform) {
            const bgGradientColors = bgColorsFromStops(currentGradientPaint.gradientStops);
            return bgGradientFromColors(
                bgGradientColors,
                degreesFromTransform(currentGradientPaint.gradientTransform),
                editingPaint.type
            );
        }
    }, [selectedStyle, currentGradientPaint, editingPaint]);

    //Select PaintGradient from a global PaintStyle
    const handleOnSelect = useCallback(
        (paintStyle: PaintStyle) => {
            if (selectedStyle && selectedStyle.id == paintStyle.id) return;
            onSelect(paintStyle);
        },
        [onSelect, selectedStyle, styles]
    );

    return !styles ? (
        <GradientStylesSkeleton />
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
                value={selectedStyle ? selectedStyle.id : undefined}
                transition="all 0.25s"
            >
                <Stack direction="row" spacing={3} w="fit-content" height="auto" alignItems="center" p={3}>
                    {editingPaint && (
                        <Center pos="relative">
                            <CreateStyleDrawerButton
                                style={selectedStyle}
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
                    {editingPaint && editingPaint.gradientTransform && styles.length == 0 && (
                        <Box>
                            <Text fontSize="xs" textAlign="left">
                                Create gradient style
                            </Text>
                        </Box>
                    )}
                    {styles &&
                        styles.map((style, index) => {
                            return (
                                <GradientSwatch
                                    style={style}
                                    key={index}
                                    onSelect={handleOnSelect}
                                    isActive={selectedStyle && style.id == selectedStyle.id}
                                    //    showReset={isChanged && selectedStyle && paintStyle.id == selectedStyle.id}
                                />
                            );
                        })}
                </Stack>
            </RadioGroup>
        </Box>
    );
};

export default GradientStylesPicker;
