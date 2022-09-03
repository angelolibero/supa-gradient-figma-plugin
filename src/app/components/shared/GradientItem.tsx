import * as React from 'react';
import {FC, useMemo, useCallback} from 'react';
import {Box, BoxProps} from '@chakra-ui/react';
import {bgColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {CHECKBOARD_GRADIENT_PROPS} from '../../lib/constants';
import {degreesFromTransform} from '../../lib/matrix';

type Props = {
    defaultPaint?: GradientPaint;
    isActive?: boolean;
    onSelect?: (paint: GradientPaint) => void;
} & Omit<BoxProps, 'onSelect'>;

const GradientItem: FC<Props> = ({defaultPaint, isActive, onSelect, ...rest}) => {
    const bgGradient = useMemo(() => {
        const bgGradientColors = bgColorsFromStops(defaultPaint.gradientStops);
        const angle = degreesFromTransform(defaultPaint.gradientTransform);
        return bgGradientFromColors(bgGradientColors, angle, defaultPaint.type);
    }, [defaultPaint]);

    const handleSelectStyle = useCallback(() => {
        onSelect && onSelect(defaultPaint);
    }, [defaultPaint, onSelect]);

    return (
        <Box
            as="label"
            {...CHECKBOARD_GRADIENT_PROPS}
            bgSize="10px 10px"
            bgPos="0px 0px, 5px 5px"
            rounded="sm"
            pos="relative"
            h={12}
            w="100%"
            cursor="pointer"
            overflow="hidden"
            onClick={handleSelectStyle}
            shadow={isActive ? 'outline' : 'sm'}
            {...rest}
        >
            <Box bgGradient={bgGradient} boxSize="100%" />
        </Box>
    );
};

export default GradientItem;
