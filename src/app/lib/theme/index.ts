import {extendTheme} from '@chakra-ui/react';
import components from './components';
import foundations from './foundations';
import semanticTokens from './semanticTokens';
import styles from './styles';

const direction = 'ltr';

const config = {
    useSystemColorMode: false,
    initialColorMode: 'light',
    cssVarPrefix: 'supa-ui',
};

export const theme = extendTheme({
    direction,
    ...foundations,
    semanticTokens,
    components,
    styles,
    config,
});

export default theme;
