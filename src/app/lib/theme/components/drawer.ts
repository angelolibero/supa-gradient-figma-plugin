import {SystemStyleObject} from '@chakra-ui/theme-tools';

const baseStyleCloseButton: SystemStyleObject = {
    position: 'absolute',
    top: 2,
    insetEnd: 2,
};

const baseStyleHeader: SystemStyleObject = {
    px: 6,
    py: 4,
    fontSize: 'sm',
    fontWeight: 'semibold',
};

const baseStyle: SystemStyleObject = {
    overlay: {
        backdropFilter: 'blur(28px)',
        transition: 'all 0.15s',
    },
    closeButton: baseStyleCloseButton,
    header: baseStyleHeader,
    dialog: {
        _dark: {bgColor: 'gray.800'},
    },
};

const defaultProps = {};

export default {
    baseStyle,
    defaultProps,
};
