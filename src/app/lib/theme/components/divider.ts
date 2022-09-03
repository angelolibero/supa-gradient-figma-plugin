import {SystemStyleObject, mode} from '@chakra-ui/theme-tools';

const baseStyle = (props) => ({
    opacity: 0.6,
    borderColor: mode('gray.200', 'whiteAlpha.200')(props),
});

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
