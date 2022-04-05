import type {SystemStyleObject} from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {
    opacity: 0.6,
    borderColor: 'gray.200',
};

const variantSolid: SystemStyleObject = {
    borderStyle: 'solid',
};

const variantDashed: SystemStyleObject = {
    borderStyle: 'dashed',
};

const variants = {
    solid: variantSolid,
    dashed: variantDashed,
};

const defaultProps = {
    variant: 'solid',
};

export default {
    baseStyle,
    variants,
    defaultProps,
};
