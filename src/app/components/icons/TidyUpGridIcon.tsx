import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const TidyUpGridIcon = (props: BoxProps) => {
    return (
        <chakra.div fill="#000" width="32px" height="32px" {...props}>
            <svg width="inherit" height="inherit" viewBox="0 0 32 32" fill="inherit" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 10H12V12H10V10ZM20 10H22V12H20V10ZM12 15H10V17H12V15ZM20 15H22V17H20V15ZM12 20H10V22H12V20ZM20 20H22V22H20V20ZM17 10H15V12H17V10ZM15 15H17V17H15V15ZM17 20H15V22H17V20Z"
                    fill="inherit"
                />
            </svg>
        </chakra.div>
    );
};

export default TidyUpGridIcon;
