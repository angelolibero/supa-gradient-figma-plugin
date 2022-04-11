import {SystemStyleObject} from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {
    boxShadow: 'depth-light',
    _hover: {
        borderColor: 'rgba(125, 125, 125, 0.45)',
    },
    _focus: {
        zIndex: 1,
        borderColor: 'rgba(125, 125, 125, 0.3)',
        boxShadow: 'outline !important',
    },
};

const defaultProps = {};

export default {
    baseStyle,
    defaultProps,
};
