import * as React from 'react';
import {FC, useMemo, useCallback} from 'react';
import {RadioGroup, Center, BoxProps, Stack, Box} from '@chakra-ui/react';
import GradientSwatch from '../Swatchs/GradientSwatch';
import CreateStyleDrawerButton from '../Drawers/CreateStyleDrawerButton';
import {bgColorsFromStops, bgGradientFromColors} from '../../../lib/colors';
import GradientStylesSkeleton from './GradientStylesSkeleton';
import {degreesFromTransform} from '../../../lib/matrix';
import CollectionDrawerButton from '../Drawers/CollectionDrawerButton';

type Props = {
    styles: PaintStyle[];
    selectedStyle?: PaintStyle;
    editingPaint?: GradientPaint;
    isChanged?: boolean;
    onSelectStyle: (style: PaintStyle) => void;
    onSelectPaint: (paint: GradientPaint) => void;
    onCreate?: (name: string, gradientPaint?: GradientPaint) => void;
} & Omit<BoxProps, 'onSelect' | 'children'>;

const GradientStylesPicker: FC<Props> = ({
    styles,
    selectedStyle,
    editingPaint,
    isChanged,
    onSelectStyle,
    onSelectPaint,
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

    //Select gradient style from a global Styles
    const handleOnSelectStyle = useCallback(
        (paintStyle: PaintStyle) => {
            if (selectedStyle && selectedStyle.id == paintStyle.id) return;
            onSelectStyle(paintStyle);
        },
        [onSelectStyle, selectedStyle, styles]
    );

    //Select GradientPaint
    const handleOnSelectPaint = useCallback(
        (paint: GradientPaint) => {
            onSelectPaint(paint);
        },
        [onSelectPaint]
    );

    return !styles ? (
        <GradientStylesSkeleton />
    ) : (
        <Box
            w="100%"
            maxW="100%"
            flexDir={'column'}
            transition="all 0.25s"
            bgColor="white"
            _dark={{bgColor: 'gray.800'}}
            {...rest}
        >
            <RadioGroup
                overflowX={styles && styles.length > 5 ? 'scroll' : 'hidden'}
                overflowY="hidden"
                w="100%"
                maxW="100%"
                value={selectedStyle ? selectedStyle.id : undefined}
                transition="all 0.25s"
            >
                <Stack direction="row" spacing={2} w="fit-content" height="auto" alignItems="center" p={3}>
                    <CollectionDrawerButton onSelect={handleOnSelectPaint} />
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
                                    _dark={{
                                        borderColor: 'gray.900',
                                    }}
                                    shadow="sm"
                                />
                            )}
                        </Center>
                    )}
                    {/* {editingPaint && editingPaint.gradientTransform && styles.length == 0 && (
                        <Box>
                            <Text fontSize="xs" textAlign="left" px={1}>
                                0 styles
                            </Text>
                        </Box>
                    )} */}
                    {styles &&
                        styles.map((style, index) => {
                            return (
                                <GradientSwatch
                                    style={style}
                                    key={index}
                                    onSelect={handleOnSelectStyle}
                                    isActive={selectedStyle && style.id == selectedStyle.id}
                                />
                            );
                        })}
                </Stack>
            </RadioGroup>
        </Box>
    );
};

export default GradientStylesPicker;
