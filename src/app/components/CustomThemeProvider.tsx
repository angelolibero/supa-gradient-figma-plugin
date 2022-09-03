import * as React from 'react';
import {CSSReset, ThemeProvider, ColorModeProvider, GlobalStyle} from '@chakra-ui/react';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '../styles/global.css';
import theme from '../lib/theme';

const CustomThemeProvider = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <ColorModeProvider
                options={{useSystemColorMode: false, initialColorMode: undefined}}
                colorModeManager={undefined}
            >
                <CSSReset />
                <GlobalStyle />
                {children}
            </ColorModeProvider>
        </ThemeProvider>
    );
};

export default CustomThemeProvider;
