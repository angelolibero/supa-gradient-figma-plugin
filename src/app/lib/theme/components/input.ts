import {getColor, mode, PartsStyleFunction, SystemStyleObject} from '@chakra-ui/theme-tools';
import {inputAnatomy as parts} from '@chakra-ui/anatomy';

const baseStyle: SystemStyleObject = {};

const sizes: Record<string, SystemStyleObject> = {
    sm: {
        field: {
            fontSize: 'xs',
            borderRadius: 'sm',
            h: 8,
        },
    },
    md: {
        field: {
            px: 4,
            h: 10,
            fontSize: 'sm',
            borderRadius: 'sm',
        },
    },
    lg: {
        field: {
            px: 4,
            h: 14,
        },
    },
    xl: {
        field: {
            px: 6,
            h: 16,
            borderRadius: 'md',
        },
    },
};

function getDefaults(props: Record<string, any>) {
    const {focusBorderColor: fc, errorBorderColor: ec} = props;
    return {
        focusBorderColor: fc || mode('gray.200', 'gray.600')(props),
        errorBorderColor: ec || mode('red.500', 'red.300')(props),
    };
}

const variantFilled: PartsStyleFunction<typeof parts> = (props) => {
    const {theme} = props;
    const {focusBorderColor: fc, errorBorderColor: ec} = getDefaults(props);

    return {
        field: {
            border: '1px solid',
            bg: mode('white', 'whiteAlpha.50')(props),
            borderColor: 'gray.200',
            _hover: {
                bg: mode('white', 'whiteAlpha.100')(props),
                borderColor: 'gray.200',
            },
            _readOnly: {
                boxShadow: 'none !important',
                userSelect: 'all',
            },
            _disabled: {
                opacity: 0.4,
                cursor: 'not-allowed',
            },
            _invalid: {
                borderColor: getColor(theme, ec),
            },
            _focus: {
                bg: 'transparent',
                borderColor: getColor(theme, fc),
            },
        },
        addon: {
            border: '2px solid',
            borderColor: 'transparent',
            bg: mode('gray.100', 'whiteAlpha.50')(props),
        },
    };
};

const variants = {
    unstyled: {
        field: {
            shadow: 'none',
            _focus: {
                shadow: 'outline',
            },
        },
    },
    outline: {
        field: {
            outline: 'rgba(125, 125, 125, 0.3)',
            borderColor: 'rgba(125, 125, 125, 0.3)',
            boxShadow: 'depth-light',
            _hover: {
                borderColor: 'rgba(125, 125, 125, 0.45)',
            },
            _focus: {
                zIndex: 1,
                borderColor: 'rgba(125, 125, 125, 0.3)',
                boxShadow: 'outline',
            },
        },
    },
    filled: variantFilled,
};

const defaultProps = {
    variant: 'filled',
};

export default {
    baseStyle,
    sizes,
    variants,
    defaultProps,
};
