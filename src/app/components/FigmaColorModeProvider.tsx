import {useEffect, useState} from 'react';
import {useColorMode} from '@chakra-ui/react';

const FigmaColorModeProvider = ({children}) => {
    const {colorMode, setColorMode} = useColorMode();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes') {
                    const isFigmaDarkMode = window.document.documentElement.className.indexOf('figma-dark') >= 0;
                    const isFigmaLightMode = window.document.documentElement.className.indexOf('figma-light') >= 0;
                    if (isFigmaDarkMode) {
                        setColorMode('dark');
                        setIsLoaded(true);
                    } else if (isFigmaLightMode) {
                        setColorMode('light');
                        setIsLoaded(true);
                    }
                }
            });
        });
        observer.observe(window.document.documentElement, {
            attributes: true, //configure it to listen to attribute changes
        });
    }, []);
    return colorMode && isLoaded ? children : null;
};

export default FigmaColorModeProvider;
