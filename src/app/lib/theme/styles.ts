import {mode, Styles} from '@chakra-ui/theme-tools';

const styles: Styles = {
    global: (props) => ({
        body: {
            fontFamily: 'body',
            color: mode('gray.700', 'gray.200')(props),
            bg: mode('white', 'gray.800')(props),
            transitionProperty: 'background-color',
            transitionDuration: 'normal',
            lineHeight: 'base',
            overflowX: 'hidden',
            fontSize: 'xs',
        },
        '*::placeholder': {
            color: mode('gray.400', 'whiteAlpha.400')(props),
        },
        '*, *::before, &::after': {
            borderColor: mode('gray.200', 'whiteAlpha.300')(props),
            wordWrap: 'break-word',
        } /* Scrollbar */,
        '::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
            padding: '2px',
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            border: '1px solid',
            borderColor: mode('white', 'gray.800')(props),
            background: 'transparent',
        },
        '::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
            background: mode('gray.200', 'gray.600')(props),
            borderRadius: '100px',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: mode('white', 'gray.800')(props),
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: mode('gray.300', 'gray.500')(props),
        },
    }),
};

export default styles;
