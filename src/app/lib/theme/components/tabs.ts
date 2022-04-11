import {tabsAnatomy as parts} from '@chakra-ui/anatomy';
import {SystemStyleObject, mode, PartsStyleObject} from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {};

const variants = {
    'enclosed-colored': (props) => ({
        tablist: {
            borderWidth: mode('1px', '1px')(props),
            borderColor: mode('white', 'gray.800')(props),
            overflow: 'visible',
            bgColor: mode('transparent', 'transparent')(props),
            p: 1,
            borderRadius: 'md',
        },
        tab: {
            borderWidth: '0',
            borderRightWidth: '1px',
            transition: 'all 0.25s',
            bgColor: 'transparent',
            _selected: {
                bgColor: 'primary.500',
                color: 'white',
                borderRadius: 'md',
            },
            _first: {
                borderStartRadius: 'md',
            },
            _last: {
                borderEndRadius: 'md',
                borderRightWidth: '0px',
            },
        },
    }),

    line: (props: any) => {
        const {orientation} = props;
        const isVertical = orientation === 'vertical';
        // const borderProp = orientation === 'vertical' ? 'borderStart' : 'borderBottom'
        const marginProp = isVertical ? 'marginStart' : 'marginBottom';

        return {
            tablist: {
                borderColor: 'inherit',
                borderBottom: '0',
                overflow: 'visible',
                shadow: 'none',
            },
            tab: {
                pos: 'relative',
                borderBottom: 'none',
                px: 2,
                py: 0,
                overflow: 'visible',
                [marginProp]: '-1px',
                fontWeight: 'medium',
                color: mode(`gray.400`, `gray.500`)(props),
                _selected: {
                    fontWeight: 'semibold',
                    color: mode(`gray.700`, `gray.200`)(props),
                    borderRightColor: mode('gray.100', 'whiteAlpha.400')(props),
                    '&::before': {
                        opacity: 1,
                        bottom: '-1px',
                        bg: mode('primary.500', 'primary.500')(props),
                    },
                },
                _active: {
                    bg: 'transparent',
                    boxShadow: 'none',
                },
                _focus: {
                    bg: 'transparent',
                    boxShadow: 'none',
                },
                _disabled: {
                    opacity: 0.4,
                    cursor: 'not-allowed',
                },
            },
        };
    },
};

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
    sm: {
        tab: {
            py: 1,
            px: 4,
            fontSize: 'xs',
        },
    },
    md: {
        tab: {
            fontSize: 'sm',
            py: 2,
            px: 4,
        },
    },
    lg: {
        tab: {
            fontSize: 'md',
            py: 3,
            px: 4,
        },
    },
};

const defaultProps = {};

export default {
    baseStyle,
    variants,
    defaultProps,
    sizes,
};
