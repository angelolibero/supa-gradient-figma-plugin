import {mode} from '@chakra-ui/theme-tools';

const baseStyle = (props) => ({
    control: {
        _checked: {
            bg: mode('primary.500', 'primary.200')(props),
            borderColor: mode('primary.500', 'primary.200')(props),
            color: mode('white', 'gray.900')(props),

            _hover: {
                bg: mode('v.600', 'primary.300')(props),
                borderColor: mode('primary.600', 'primary.300')(props),
            },

            _disabled: {
                borderColor: mode('gray.200', 'transparent')(props),
                bg: mode('gray.200', 'whiteAlpha.300')(props),
                color: mode('gray.500', 'whiteAlpha.500')(props),
            },
        },
    },
});

const sizes = {
    md: {
        control: {w: 4, h: 4},
        label: {fontSize: 'md'},
    },
    lg: {
        control: {w: 6, h: 6},
        label: {fontSize: 'lg'},
    },
    sm: {
        control: {width: 3, height: 3},
        label: {fontSize: 'sm'},
    },
};

const defaultProps = {};

export default {
    baseStyle,
    sizes,
    defaultProps,
    variants: {
        swatch: (props) => {
            return {
                control: {
                    boxSize: props.size == 'lg' ? 10 : 7,
                    shadow: 'sm',
                    rounded: 'full',
                    outline: 'none',
                    border: '2px solid',
                    borderColor: 'white',
                    p: 0,
                    cursor: 'pointer',
                    _checked: {
                        boxSize: props.size == 'lg' ? 12 : 8,
                    },
                },
            };
        },
    },
};
