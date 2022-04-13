import * as React from 'react';
import {FC, useMemo, useCallback} from 'react';
import {RadioGroup, Center, BoxProps, SimpleGrid, Box, Text, GridItem} from '@chakra-ui/react';
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
    const height = useMemo(() => {
        // if (styles && styles.length > 11) return '88px';
        if (styles && styles.length > 5) return '56px';
        else return '48px';
    }, [styles]);

    const currentGradientPaint = useMemo(() => {
        return (selectedStyle && (selectedStyle.paints[0] as GradientPaint)) || editingPaint;
    }, [selectedStyle, styles]);

    const newBgGradient = useMemo(() => {
        if (currentGradientPaint && currentGradientPaint.gradientTransform) {
            const bgGradientColors = bgColorsFromStops(currentGradientPaint.gradientStops);
            return bgGradientFromColors(
                bgGradientColors,
                degreesFromTransform(currentGradientPaint.gradientTransform),
                editingPaint.type
            );
        }
    }, [selectedStyle, currentGradientPaint]);

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
                height={height}
                value={selectedStyle ? selectedStyle.id : undefined}
                transition="all 0.5s"
            >
                <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={2} p={3}>
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
                        <GridItem colSpan={5} textAlign="left">
                            <Text fontSize="xs">Create gradient style</Text>
                        </GridItem>
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
                </SimpleGrid>
            </RadioGroup>
        </Box>
    );
};

export default GradientStylesPicker;
