import * as React from 'react';
import {FC} from 'react';
import {Stack, Button, StackProps, useMultiStyleConfig} from '@chakra-ui/react';
import {GradientPaintType} from '../../typings';

type Props = {
    gradientType?: GradientPaintType;
    onChange?: (gradientType: GradientPaintType) => void;
} & Omit<StackProps, 'onChange' | 'children'>;

const GradientTypeTabs: FC<Props> = ({gradientType, onChange, ...rest}) => {
    const styles = useMultiStyleConfig('ButtonTabs', rest);

    return (
        <Stack direction="row" sx={styles.tabs} {...rest}>
            <Button
                size="xs"
                onClick={() => onChange('GRADIENT_LINEAR')}
                isActive={gradientType == 'GRADIENT_LINEAR'}
                sx={styles.tab}
            >
                Linear
            </Button>
            <Button
                size="xs"
                onClick={() => onChange('GRADIENT_RADIAL')}
                isActive={gradientType == 'GRADIENT_RADIAL'}
                sx={styles.tab}
            >
                Radial
            </Button>
            <Button
                size="xs"
                onClick={() => onChange('GRADIENT_ANGULAR')}
                isActive={gradientType == 'GRADIENT_ANGULAR'}
                sx={styles.tab}
            >
                Angular
            </Button>
            <Button
                size="xs"
                onClick={() => onChange('GRADIENT_DIAMOND')}
                isActive={gradientType == 'GRADIENT_DIAMOND'}
                sx={styles.tab}
            >
                Diamond
            </Button>
        </Stack>
    );
};

export default GradientTypeTabs;
