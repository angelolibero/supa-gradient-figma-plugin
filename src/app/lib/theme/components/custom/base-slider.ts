import {PartsStyleFunction, mode} from '@chakra-ui/theme-tools';

const parts = ['container', 'thumb', 'inputWrap', 'input', 'inputIcon'];

const baseStyle: PartsStyleFunction = (props) => ({
    container: {
        borderRadius: 'sm',
        py: 3,
        pl: 4,
        pr: 4,
        alignItems: 'center',
        h: 10,
    },
    inputWrap: {
        d: 'flex',
        py: 0,
        border: '1px solid',
        borderColor: mode('white', 'gray.800')(props),
        px: 1,
        mr: 4,
        minH: 7,
        h: 7,
        //        overflow: 'hidden',
        _hover: {
            borderColor: mode('gray.200', 'whiteAlpha.200')(props),
            rounded: 'sm',
        },
        _focusWithin: {
            borderColor: 'primary.500',
        },
    },
    input: {
        maxW: 6,
        minW: 6,
        minH: 6,
        maxH: 6,
        h: '100%',
        w: '100%',
        flex: '1',
        bgColor: 'white',
        border: 'none',
        color: 'gray.700',
        fontWeight: 'semibold',
        rounded: 'none',
        px: 0,
        _focus: {
            shadow: 'none',
        },
        _dark: {
            bgColor: 'gray.800',
        },
    },
    inputIcon: {
        transition: 'all 0.25s',
        fontSize: '10px',
    },
    thumb: {
        boxSize: 4,
        minH: 6,
        borderRadius: 'sm',
        border: '1px solid',
        bgColor: mode('gray.200', 'gray.600')(props),
        borderColor: mode('white', 'gray.800')(props),
        _active: {boxSize: 4},
        position: 'relative',
        // transition: 'all 0.1s',
        cursor: 'pointer',
        shadow: 'none',
        boxSizing: 'content-box',
        zIndex: 0,
    },
});

const defaultProps = {};

export default {
    parts,
    baseStyle,
    variants: {},
    defaultProps,
};
