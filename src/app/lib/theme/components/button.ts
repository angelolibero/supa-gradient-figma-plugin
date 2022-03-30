import {SystemStyleObject} from '@chakra-ui/theme-tools';
import {variantSolid, variantGradient} from '../utils/colors';

const baseStyle: SystemStyleObject = {};

const sizes: Record<string, SystemStyleObject> = {
    sm: {
        fontSize: 'button-secondary',
        h: 8,
    },
    md: {
        px: 4,
        h: 10,
        fontSize: 'button-secondary',
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

const defaultProps = {};

export default {
    baseStyle,
    sizes,
    variants,
    defaultProps,
};
