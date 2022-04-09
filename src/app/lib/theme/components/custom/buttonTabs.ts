import {mode, PartsStyleFunction} from '@chakra-ui/theme-tools';

const parts = ['tabs', 'tab'];

const baseStyle: PartsStyleFunction = (props) => ({
    tabs: {
        w: '100%',
        alignItems: 'flex-start',
    },
    tab: {
        fontWeight: 'medium',
        color: mode('gray.400', 'gray.500')(props),
        bgColor: 'transparent',
        h: '1.25rem',
        p: 0,
        borderRadius: 'sm',
        _focus: {
            boxShadow: 'none',
        },
        _hover: {
            bgColor: 'transparent',
            color: mode('gray.700', 'gray.500')(props),
        },
        _active: {
            fontWeight: 'semibold',
            color: mode('gray.700', 'gray.500')(props),
            //  bgColor: mode('gray.200', 'gray.700')(props),
        },
    },
});

const defaultProps = {};

export default {
    parts,
    baseStyle,
    variants: {},
    defaultProps,
};
