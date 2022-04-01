import {mode} from '@chakra-ui/theme-tools';

export const variantSolid = (props: Record<string, any>) => {
    const {colorScheme: c} = props;

    if (c === 'gray') {
        const bg = mode('gray.100', 'gray.700')(props);
        return {
            bg,
            color: 'gray.500',
            _hover: {
                bg: mode('gray.100', 'whiteAlpha.100')(props),
                textDecor: 'none',
                _disabled: {
                    bg,
                },
            },
            _active: {bg: mode('gray.200', 'whiteAlpha.200')(props)},
        };
    }

    const {bg = `${c}.500`, color = 'white', hoverBg = `${c}.600`, activeBg = `${c}.700`} = {};
    const background = mode(bg, `${c}.400`)(props);

    return {
        bg: background,
        color: mode(color, 'gray.800')(props),
        // shadow: c == 'primary' && 'button',
        _hover: {
            bg: mode(hoverBg, `${c}.300`)(props),
            shadow: 'none',
            textDecor: 'none',
            _disabled: {
                bg: background,
            },
        },
        _active: {bg: mode(activeBg, `${c}.400`)(props)},
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
