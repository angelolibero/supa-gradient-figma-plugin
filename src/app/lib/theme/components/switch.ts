import {switchAnatomy as parts} from '@chakra-ui/anatomy';
import type {
    PartsStyleFunction,
    PartsStyleObject,
    SystemStyleFunction,
    SystemStyleObject,
} from '@chakra-ui/theme-tools';
import {calc, cssVar, mode} from '@chakra-ui/theme-tools';

const $width = cssVar('switch-track-width');
const $height = cssVar('switch-track-height');

const $diff = cssVar('switch-track-diff');
const diffValue = calc.subtract($width, $height);

const $translateX = cssVar('switch-thumb-x');

const baseStyleTrack: SystemStyleFunction = (props) => {
    const {colorScheme: c} = props;

    return {
        borderRadius: 'full',
        p: props.size == 'sm' ? '2px' : '8px',
        width: [$width.reference],
        height: [$height.reference],
        transitionProperty: 'common',
        transitionDuration: 'fast',
        bg: mode('gray.200', 'whiteAlpha.100')(props),
        _focus: {
            boxShadow: 'outline',
        },
        _disabled: {
            opacity: 0.4,
            cursor: 'not-allowed',
        },
        _checked: {
            bg: mode(`${c}.500`, `${c}.300`)(props),
        },
    };
};

const baseStyleThumb: SystemStyleObject = {
    bg: 'white',
    transitionProperty: 'transform',
    transitionDuration: 'normal',
    borderRadius: 'inherit',
    width: [$height.reference],
    height: [$height.reference],
    shadow: 'depth',
    _checked: {
        transform: `translateX(${$translateX.reference})`,
    },
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
    container: {
        [$diff.variable]: diffValue,
        [$translateX.variable]: $diff.reference,
        _rtl: {
            [$translateX.variable]: calc($diff).negate().toString(),
        },
    },
    track: baseStyleTrack(props),
    thumb: baseStyleThumb,
});

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
    sm: {
        container: {
            [$width.variable]: '28px',
            [$height.variable]: '14px',
        },
    },
    md: {
        container: {
            [$width.variable]: '44px',
            [$height.variable]: '20px',
        },
        track: {
            width: '44px',
            height: '20px',
        },
    },
    lg: {
        container: {
            [$width.variable]: '64px',
            [$height.variable]: '28px',
        },
        track: {
            width: '64px',
            height: '28px',
        },
    },
};

export const variantRound = (props: Record<string, any>) => {
    return {
        container: {},
        track: {
            borderRadius: props.size == 'lg' ? 'md' : 'sm',
        },
        thumb: {borderRadius: props.size == 'lg' ? 'md' : 'sm'},
    };
};

// export const variantIcon = (props: Record<string, any>) => {
//   return {
//     container: {
//       [$width.variable]: '52px',
//       [$height.variable]: '20px',
//     },
//     track: {
//       width: '64px',
//       height: '24px',
//       p: props.size == 'sm' ? '4px' : '6px',
//       borderRadius: props.size == 'lg' ? 12 : 8,
//       bg: mode('gray.200', 'gray.700')(props),
//       _checked: {
//         bg: mode(`gray.200`, 'gray.700')(props),
//       },
//     },
//     thumb: {
//       [$width.variable]: '24px',
//       [$height.variable]: '24px',
//       w: '32px',
//       borderRadius: props.size == 'lg' ? 8 : 6,
//     },
//   }
// }

const defaultProps = {
    size: 'md',
    colorScheme: 'primary',
};

export default {
    parts: parts.keys,
    baseStyle,
    variants: {
        round: variantRound,
        //  icon: variantIcon,
    },
    sizes,
    defaultProps,
};
