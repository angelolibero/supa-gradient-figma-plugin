import {SystemStyleObject, mode} from '@chakra-ui/theme-tools';

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
        const {colorScheme: c, orientation} = props;
        const isVertical = orientation === 'vertical';
        // const borderProp = orientation === 'vertical' ? 'borderStart' : 'borderBottom'
        const marginProp = isVertical ? 'marginStart' : 'marginBottom';

        return {
            tablist: {
                bg: mode('white', 'gray.800')(props),
                borderColor: 'inherit',
                borderBottom: '0',
                overflow: 'visible',
                shadow: mode('depth-light', 'depth-dark')(props),
            },
            tab: {
                pos: 'relative',
                borderBottom: 'none',
                overflow: 'visible',
                [marginProp]: '-1px',

                _selected: {
                    color: mode(`${c}.600`, `${c}.300`)(props),
                    borderRightColor: mode('gray.100', 'whiteAlpha.400')(props),
                    '&::before': {
                        opacity: 1,
                        bottom: '-1px',
                        bg: mode('primary.500', 'primary.500')(props),
                    },
                },
                _active: {
                    bg: mode('gray.200', 'whiteAlpha.300')(props),
                },
                _disabled: {
                    opacity: 0.4,
                    cursor: 'not-allowed',
                },
            },
        };
    },
};

const defaultProps = {};

export default {
    baseStyle,
    variants,
    defaultProps,
};
