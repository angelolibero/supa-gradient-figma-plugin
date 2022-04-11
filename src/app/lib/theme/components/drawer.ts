import {SystemStyleObject} from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {
    overlay: {
        backdropFilter: 'blur(28px)',
        transition: 'all 0.15s',
    },
};

const defaultProps = {};

export default {
    baseStyle,
    defaultProps,
};
