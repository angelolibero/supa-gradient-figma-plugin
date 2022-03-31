import * as React from 'react';
import {RadioGroup, IconButton, Tooltip, Center, RadioGroupProps, SimpleGrid} from '@chakra-ui/react';
import {MdAdd} from 'react-icons/md';
import GradientSwatch from './GradientSwatch';

type Props = {
    paintStyles: PaintStyle[];
    id?: string;
    onSelect: (paintStyle: PaintStyle) => void;
    onCreate?: () => void;
} & Omit<RadioGroupProps, 'onSelect' | 'children'>;

const PaintStyles: React.FC<Props> = ({paintStyles, id, onSelect, onCreate, ...rest}) => {
    return (
        <RadioGroup overflow="scroll" w="100%" maxW="100%" height={24} value={id} {...rest}>
            <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={3} p={4}>
                <Center>
                    <Tooltip label="Create gradient style">
                        <IconButton
                            onClick={onCreate}
                            // isDisabled={!isSelected}
                            icon={<MdAdd />}
                            aria-label="create gradient style"
                            boxSize={7}
                            minW={7}
                            maxW={7}
                            p={0}
                            rounded="full"
                            border="1px dashed"
                            borderColor="gray.200"
                            _focus={{
                                shadow: 'none',
                            }}
                        />
                    </Tooltip>
                </Center>
                {paintStyles &&
                    paintStyles.map((paintStyle, index) => {
                        return <GradientSwatch paintStyle={paintStyle} key={index} onSelect={onSelect} boxSize={6} />;
                    })}
            </SimpleGrid>
        </RadioGroup>
    );
};

export default PaintStyles;
