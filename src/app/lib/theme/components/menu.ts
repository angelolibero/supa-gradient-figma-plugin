import {mode} from '@chakra-ui/theme-tools';

const baseStyle = (props: Record<string, any>) => ({
    list: {
        p: 1,
        borderWidth: '0px',
        overflow: 'visible',
        boxShadow: mode('depth-light', 'depth-dark')(props),
    },
});

const defaultProps = {};

export default {
    baseStyle,
    defaultProps,
};
