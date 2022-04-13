import * as React from 'react';
import {FC, useCallback} from 'react';
import {Stack, IconButton, BoxProps, Center, Box, Flex} from '@chakra-ui/react';
import ColorPickerDrawerSwatch from '../Drawers/ColorPickerDrawerSwatch';
import StylesPickerDrawerButton from '../Drawers/SolidPaintPickerDrawerButton';
import {AiOutlineMinus} from 'react-icons/ai';

export type GradientStopsListItemProps = {
    stop: ColorStop;
    activeColorId?: number;
    editColorId?: number;
    index: number;
    onChange: (stop: ColorStop, index: number) => void;
    onDelete: (stop: ColorStop) => void;
} & Omit<BoxProps, 'onChange'>;

const GradientStopsListItem: FC<GradientStopsListItemProps> = ({
    stop,
    activeColorId,
    editColorId,
    index,
    onChange,
    onDelete,
    ...rest
}) => {
    const handleOnSelectStyle = useCallback(
        (style: PaintStyle) => {
            const paint = style.paints[0] as SolidPaint;
            const updatedStop: ColorStop = {
                ...stop,
                color: {...paint.color, a: paint.opacity},
            };
            onChange && onChange(updatedStop, index);
        },
        [onChange, stop, index]
    );

    const handleOnChangePickerColor = useCallback(
        (color: RGBA) => {
            const updatedStop: ColorStop = {
                ...stop,
                color,
            };
            onChange && onChange(updatedStop, index);
        },
        [onChange, stop, index]
    );

    const isActive = React.useMemo(() => {
        return activeColorId - 1 == index;
    }, [activeColorId, index]);

    const handleOnDelete = useCallback(() => {
        onDelete && onDelete(stop);
    }, [stop, onDelete]);

    return (
        <Stack
            direction="row"
            position="relative"
            alignItems="center"
            spacing={2}
            rounded="xs"
            py={1}
            px={4}
            key={index}
            {...rest}
        >
            <Flex w="100%">
                <Center pos="absolute" left={2} opacity={isActive ? 1 : 0} minH={7}>
                    <Box rounded="sm" boxSize="4px" bg="primary.500" transition="all 0.1s" />
                </Center>
                <ColorPickerDrawerSwatch
                    color={stop.color}
                    isActive={isActive}
                    onChange={handleOnChangePickerColor}
                    showInput
                    showOpacity
                />
            </Flex>
            <Flex>
                <StylesPickerDrawerButton onSelect={handleOnSelectStyle} />
                <IconButton
                    icon={<AiOutlineMinus />}
                    onClick={handleOnDelete}
                    size="sm"
                    fontSize="sm"
                    aria-label="delete color"
                    bgColor="white"
                    boxSize={7}
                    maxW={7}
                    minW={7}
                    _focus={{
                        shadow: 'none',
                    }}
                />
            </Flex>
        </Stack>
    );
};

export default GradientStopsListItem;
