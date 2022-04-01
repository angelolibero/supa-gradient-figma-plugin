import * as React from 'react';
import {useMemo, FC} from 'react';
import {RadioGroup, Center, RadioGroupProps, SimpleGrid, Box} from '@chakra-ui/react';
import GradientSwatch from './GradientSwatch';
import CreateStyleDrawerButton from './CreateStyleDrawerButton';
import {bgGradientColorsFromStops, bgGradientFromColors, gradientAngleFromTransform} from '../../lib/colors';

type Props = {
    paintStyles: PaintStyle[];
    currentPaintStyle?: PaintStyle;
    newPaintStyle?: PaintStyle;
    gradientPaint?: GradientPaint;
    onSelect: (paintStyle: PaintStyle) => void;
    onCreate?: (name: string) => void;
} & Omit<RadioGroupProps, 'onSelect' | 'children'>;

const PaintStyles: FC<Props> = ({
    gradientPaint,
    paintStyles,
    currentPaintStyle,
    newPaintStyle,
    onSelect,
    onCreate,
    ...rest
}) => {
    const height = useMemo(() => {
        if (paintStyles && paintStyles.length > 5) return '72px';
        else if (paintStyles && paintStyles.length > 0) return '60px';
        else return '0px';
    }, [paintStyles]);

    const newBgGradient = useMemo(() => {
        if (!newPaintStyle) return;
        // const newPaint = newPaintStyle.paints[0] as GradientPaint;
        const bgGradientColors = bgGradientColorsFromStops(gradientPaint.gradientStops);
        return bgGradientFromColors(bgGradientColors, gradientAngleFromTransform(gradientPaint.gradientTransform));
    }, [currentPaintStyle, gradientPaint, newPaintStyle]);

    return (
        <Box
            w="100%"
            maxW="100%"
            boxShadow="inset 0 -1px 24px rgba(0,0,0,0.075)"
            bgGradient="linear(to-br, white, gray.100)"
        >
            {currentPaintStyle && currentPaintStyle.id}
            <RadioGroup
                overflow="scroll"
                w="100%"
                maxW="100%"
                height={height}
                value={currentPaintStyle ? currentPaintStyle.id : undefined}
                transition="all 0.5s"
                {...rest}
            >
                <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={3} p={4}>
                    {gradientPaint && (
                        <Center pos="relative">
                            <CreateStyleDrawerButton
                                // isDisabled={!newPaintStyle}
                                paintStyle={currentPaintStyle}
                                gradientPaint={gradientPaint}
                                onCreate={onCreate}
                            />
                            {newPaintStyle && (
                                <Box
                                    boxSize={4}
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
                    {paintStyles &&
                        paintStyles.map((paintStyle, index) => {
                            return (
                                <>
                                    {currentPaintStyle && paintStyle.id == currentPaintStyle.id ? 'uguali' : 'no'}
                                    <GradientSwatch paintStyle={paintStyle} key={index} onSelect={onSelect} />
                                </>
                            );
                        })}
                </SimpleGrid>
            </RadioGroup>
        </Box>
    );
};

export default PaintStyles;
