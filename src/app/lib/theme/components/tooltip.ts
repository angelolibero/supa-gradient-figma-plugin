import {mode, cssVar, SystemStyleFunction} from '@chakra-ui/theme-tools';

const $bg = cssVar('tooltip-bg');
const $arrowBg = cssVar('popper-arrow-bg');

const baseStyle: SystemStyleFunction = (props) => {
    const bg = mode('gray.900', 'gray.300')(props);
    return {
        [$bg.variable]: `colors.${bg}`,
        px: '8px',
        py: '2px',
        bg: [$bg.reference],
        [$arrowBg.variable]: [$bg.reference],
        color: mode('whiteAlpha.900', 'gray.900')(props),
        borderRadius: 'xs',
        fontWeight: 'medium',
        fontSize: 'xs',
        boxShadow: 'md',
        maxW: '320px',
        zIndex: 'tooltip',
    };
};

export default {
    baseStyle,
};
