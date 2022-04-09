import * as React from 'react';
import {FC, useMemo} from 'react';
import {IconButton, Tooltip, ButtonProps, Box} from '@chakra-ui/react';
import {CgColorPicker} from 'react-icons/cg';
import {bgColorsFromStops, bgGradientFromColors} from '../../lib/colors';
import {degreesFromTransform} from '../../lib/matrix';

type Props = {
    gradientPaint: GradientPaint;
    onImport?: () => void;
} & ButtonProps;

const ImportButton: FC<Props> = ({gradientPaint, onImport, ...rest}) => {
    const importBgGradient = useMemo(() => {
        if (!gradientPaint) return;
        const bgGradientColors = bgColorsFromStops(gradientPaint.gradientStops);
        return bgGradientFromColors(bgGradientColors, degreesFromTransform(gradientPaint.gradientTransform));
    }, [gradientPaint]);

    return (
        <>
            <Tooltip label="Import gradient" openDelay={300} placement="top-start">
                <Box pos="relative">
                    <IconButton
                        icon={<CgColorPicker />}
                        aria-label="import gradient"
                        onClick={onImport}
                        size="sm"
                        fontSize="md"
                        bgColor="gray.100"
                        {...rest}
                    />
                    {gradientPaint && (
                        <Box
                            boxSize="14px"
                            pos="absolute"
                            right="-3px"
                            top={-1}
                            rounded="full"
                            bgGradient={importBgGradient}
                            border="2px solid"
                            borderColor="white"
                            shadow="sm"
                        />
                    )}
                </Box>
            </Tooltip>
        </>
    );
};

export default ImportButton;
