import * as React from 'react';
import {RadioGroup, IconButton, Tooltip, Stack, RadioGroupProps, chakra} from '@chakra-ui/react';
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
        <RadioGroup overflowX="scroll" overflowY="visible" w="100%" maxW="100%" minH={9} value={id} {...rest}>
            <Stack direction="row" w="100%" h="full" alignItems="center" spacing={3}>
                <Tooltip label="Create gradient style">
                    <IconButton
                        onClick={onCreate}
                        // isDisabled={!isSelected}
                        icon={<MdAdd />}
                        aria-label="create gradient style"
                        boxSize={8}
                        minW={8}
                        maxW={8}
                        p={0}
                        rounded="full"
                        border="1px dashed"
                        borderColor="gray.200"
                        _focus={{
                            shadow: 'none',
                        }}
                    />
                </Tooltip>
                {paintStyles &&
                    paintStyles.map((paintStyle, index) => {
                        return <GradientSwatch paintStyle={paintStyle} key={index} onSelect={onSelect} boxSize={6} />;
                    })}
            </Stack>
        </RadioGroup>
    );
};

export default PaintStyles;
