import {PartsStyleFunction} from '@chakra-ui/theme-tools';

const parts = ['inputWrap', 'input', 'divider'];

const baseStyle: PartsStyleFunction = ({isActive, showInput, showOpacity}) => ({
    container: {
        py: 0,
        border: (showInput || showOpacity) && '1px solid',
        borderColor: isActive ? 'gray.200' : 'white',
        pl: 0,
        alignItems: 'center',
        rounded: 'sm',
        overflow: 'hidden',
        h: 7,
        '> *': {
            borderColor: 'white',
        },
        _hover: {
            borderColor: (showInput || showOpacity) && 'gray.200',
            rounded: 'sm',
            '> *': {
                borderColor: 'gray.200',
            },
        },
        _focusWithin: {
            borderColor: (showInput || showOpacity) && 'primary.500',
            '> *': {
                borderColor: 'gray.200',
            },
        },
    },
    input: {
        borderRadius: 'sm',
        flex: '1',
        bgColor: 'white',
        border: 'none',
        color: 'gray.700',
        rounded: 'none',
        minH: 7,
        maxH: 7,
        px: 1,
        w: '100%',
        _focus: {
            shadow: 'none',
        },
    },
    divider: {
        borderColor: 'inherit',
    },
});

const defaultProps = {};

export default {
    parts,
    baseStyle,
    variants: {},
    defaultProps,
};
