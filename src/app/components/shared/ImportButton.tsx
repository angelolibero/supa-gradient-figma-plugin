import * as React from 'react';
import {FC, useMemo} from 'react';
import {Tooltip, ButtonProps, Box, Center, IconButton} from '@chakra-ui/react';
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
        return bgGradientFromColors(
            bgGradientColors,
            degreesFromTransform(gradientPaint.gradientTransform),
            gradientPaint.type
        );
    }, [gradientPaint]);

    return (
        <Tooltip label="Import gradient" openDelay={300} placement="top-start">
            <Center pos="relative" h="100%">
                <IconButton
                    icon={<CgColorPicker />}
                    aria-label="import gradient"
                    boxSize={7}
                    minW={7}
                    maxW={7}
                    p={0}
                    rounded="full"
                    border="1px dashed"
                    borderColor="gray.200"
                    bgColor="white"
                    _dark={{
                        borderColor: 'gray.500',
                        bgColor: 'gray.800',
                    }}
                    fontSize="md"
                    onClick={onImport}
                    {...rest}
                />
                {gradientPaint && (
                    <Box
                        boxSize="14px"
                        pos="absolute"
                        left="-3px"
                        bottom={-1}
                        rounded="full"
                        bgGradient={importBgGradient}
                        border="2px solid"
                        borderColor="white"
                        _dark={{
                            bgColor: 'gray.900',
                        }}
                        shadow="sm"
                    />
                )}
            </Center>
        </Tooltip>
    );
};

export default ImportButton;
