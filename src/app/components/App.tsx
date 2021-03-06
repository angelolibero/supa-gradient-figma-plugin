import * as React from 'react';
import {ChakraProvider} from '@chakra-ui/react';
import IndexPage from './pages/Index';
import {RecoilRoot} from 'recoil';
import theme from '../lib/theme';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '../styles/global.css';

const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <RecoilRoot>
                <IndexPage />
            </RecoilRoot>
        </ChakraProvider>
    );
};

export default App;
