import * as React from 'react';
import {ChakraProvider} from '@chakra-ui/react';
import LinearGradientPage from './pages/LinearGradientPage';
import theme from '../lib/theme';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '../styles/ui.css';

const App = ({}) => {
    return (
        <ChakraProvider theme={theme}>
            <LinearGradientPage />
        </ChakraProvider>
    );
};

export default App;
