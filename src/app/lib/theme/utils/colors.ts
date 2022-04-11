import {mode, SystemStyleFunction, transparentize} from '@chakra-ui/theme-tools';

export const variantSolid = (props: Record<string, any>) => {
    const {colorScheme: c} = props;

    if (c === 'gray') {
        const bg = mode('gray.100', 'gray.700')(props);
        return {
            bg,
            color: 'gray.700',
            _hover: {
                bg: [mode('gray.100', 'whiteAlpha.100')(props), '!important'],
                textDecor: 'none',
                _disabled: {
                    bg,
                },
                shadow: 'none',
            },
            '&:hover, &:[data-focus], &:[data-hover]': {
                shadow: 'none',
                bgColor: mode('gray.100', 'whiteAlpha.100')(props),
            },
            _focus: {
                shadow: 'none',
                bg: mode('gray.100', 'whiteAlpha.100')(props),
            },
            _active: {bg: mode('gray.200', 'whiteAlpha.200')(props)},
        };
    }

    const {bg = `${c}.500`, color = 'white', hoverBg = mode(`${c}.600`, `${c}.300`)(props), activeBg = `${c}.700`} = {};
    const background = mode(bg, `${c}.400`)(props);

    return {
        bg: background,
        color: mode(color, 'gray.800')(props),
        // shadow: c == 'primary' && 'button',
        shadow: 'none',
        _focus: {
            shadow: 'none',
            bg: mode(`${c}.600`, `${c}.300`)(props),
        },
        '&:hover, &:[data-focus]': {
            shadow: 'none',
            bg: hoverBg,
        },
        _hover: {
            bg: hoverBg,
            shadow: 'none',
            textDecor: 'none',
            _disabled: {
                bg: background,
            },
        },
        _active: {bg: mode(activeBg, `${c}.400`)(props)},
    };
};

export const variantGhost: SystemStyleFunction = (props) => {
    const {colorScheme: c, theme} = props;

    if (c === 'gray') {
        return {
            color: mode(`inherit`, `whiteAlpha.900`)(props),
            _hover: {
                bg: mode(`gray.100`, `whiteAlpha.200`)(props),
            },
            _active: {bg: mode(`gray.200`, `whiteAlpha.300`)(props)},
        };
    }

    const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme);
    const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme);

    return {
        color: mode(`${c}.600`, `${c}.200`)(props),
        bg: 'transparent',
        _hover: {
            bg: mode(`${c}.50`, darkHoverBg)(props),
        },
        _active: {
            bg: mode(`${c}.100`, darkActiveBg)(props),
        },
    };
};

export const variantOutline: SystemStyleFunction = (props) => {
    const {colorScheme: c} = props;
    const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);
    return {
        ...variantGhost(props),
        border: 'none',
        _hover: {
            border: '1px solid',
            borderColor: c === 'gray' ? borderColor : 'currentColor',
        },
    };
};

export const variantGradient = (props: Record<string, any>) => {
    const {colorScheme: c} = props;

    return {
        bgColor: `${c}.500`,
        bgGradient: `linear(65deg, ${c}.500, ${c}.300)`,
        color: 'white',
        _hover: {
            bgGradient: `linear(65deg, ${c}.600, ${c}.400)`,
            shadow: 'sm',
            textDecor: 'none',
            _disabled: {
                opacity: 0.5,
            },
        },
    };
};
