import * as React from 'react';
import {RadioGroup, Center, RadioGroupProps, SimpleGrid, Box} from '@chakra-ui/react';
import GradientSwatch from './GradientSwatch';
import CreateStyleDrawerButton from './CreateStyleDrawerButton';

type Props = {
    paintStyles: PaintStyle[];
    currentPaintStyle?: PaintStyle;
    gradientPaint?: GradientPaint;
    onSelect: (paintStyle: PaintStyle) => void;
    onCreate?: (name: string) => void;
} & Omit<RadioGroupProps, 'onSelect' | 'children'>;

const PaintStyles: React.FC<Props> = ({gradientPaint, paintStyles, currentPaintStyle, onSelect, onCreate, ...rest}) => {
    return (
        <Box
            w="100%"
            maxW="100%"
            boxShadow="inset 0 -1px 8px rgba(0,0,0,0.075)"
            bgGradient="linear(to-b, white, gray.100)"
        >
            <RadioGroup
                overflow="scroll"
                w="100%"
                maxW="100%"
                height="72px"
                value={currentPaintStyle ? currentPaintStyle.id : undefined}
                {...rest}
            >
                <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={3} p={4}>
                    <Center>
                        <CreateStyleDrawerButton
                            isDisabled={!!(currentPaintStyle && currentPaintStyle.id)}
                            gradientPaint={gradientPaint}
                            onSave={onCreate}
                        />
                    </Center>
                    {paintStyles &&
                        paintStyles.map((paintStyle, index) => {
                            return (
                                <GradientSwatch paintStyle={paintStyle} key={index} onSelect={onSelect} boxSize={6} />
                            );
                        })}
                </SimpleGrid>
            </RadioGroup>
        </Box>
    );
};

export default PaintStyles;
