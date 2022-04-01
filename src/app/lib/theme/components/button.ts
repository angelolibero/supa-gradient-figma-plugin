import {SystemStyleObject} from '@chakra-ui/theme-tools';
import {variantSolid, variantGradient} from '../utils/colors';

const baseStyle: SystemStyleObject = {
    fontWeight: 'semibold',
};

const sizes: Record<string, SystemStyleObject> = {
    sm: {
        fontSize: 'xs',
        borderRadius: 'sm',
        h: 8,
    },
    md: {
        px: 4,
        h: 10,
        fontSize: 'sm',
        borderRadius: 'sm',
    },
    lg: {
        px: 6,
        h: 12,
        fontSize: 'button-primary',
    },
    xl: {
        px: 6,
        h: 14,
        fontSize: 'button-primary',
    },
};

const variants = {
    solid: variantSolid,
    gradient: variantGradient,
};

const defaultProps = {
    size: 'sm',
};

export default {
    baseStyle,
    sizes,
    variants,
    defaultProps,
};
