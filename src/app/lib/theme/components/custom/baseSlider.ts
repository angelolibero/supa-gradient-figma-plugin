import {PartsStyleFunction} from '@chakra-ui/theme-tools';

const parts = ['container', 'thumb', 'inputWrap', 'input', 'inputIcon'];

const baseStyle: PartsStyleFunction = () => ({
    container: {
        borderRadius: 'sm',
        bgColor: 'white',
        py: 3,
        pl: 4,
        pr: 6,
        alignItems: 'center',
        h: 10,
    },
    inputWrap: {
        d: 'flex',
        py: 0,
        border: '1px solid',
        borderColor: 'white',
        px: 1,
        mr: 4,
        minH: 7,
        h: 7,
        //        overflow: 'hidden',
        _hover: {
            borderColor: 'gray.300',
            rounded: 'sm',
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
        bgColor: 'gray.200',
        borderColor: 'white',
        _active: {boxSize: 4},
        position: 'relative',
        transition: 'all 0.1s',
        cursor: 'pointer',
        shadow: 'none',
        boxSizing: 'content-box',
    },
});

const defaultProps = {};

export default {
    parts,
    baseStyle,
    variants: {},
    defaultProps,
};
