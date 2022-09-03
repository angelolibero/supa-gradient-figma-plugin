import * as React from 'react';
import IndexPage from './pages/Index';
import {RecoilRoot} from 'recoil';
import FigmaColorModeProvider from './FigmaColorModeProvider';
import CustomThemeProvider from './CustomThemeProvider';

const App = () => {
    return (
        <CustomThemeProvider>
            <FigmaColorModeProvider>
                <RecoilRoot>
                    <IndexPage />
                </RecoilRoot>
            </FigmaColorModeProvider>
        </CustomThemeProvider>
    );
};

export default App;
