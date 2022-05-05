import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const LayoutGridUniformIcon = (props: BoxProps) => {
    return (
        <chakra.div fill="#000" width="32px" height="32px" {...props}>
            <svg width="inherit" height="inherit" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="3" height="3" fill="black" />
                <rect x="20" y="9" width="3" height="3" fill="black" />
                <rect x="14.5" y="9" width="3" height="3" fill="black" />
                <rect x="9" y="14.5" width="3" height="3" fill="black" />
                <rect x="20" y="14.5" width="3" height="3" fill="black" />
                <rect x="14.5" y="14.5" width="3" height="3" fill="black" />
                <rect x="9" y="20" width="3" height="3" fill="black" />
                <rect x="20" y="20" width="3" height="3" fill="black" />
                <rect x="14.5" y="20" width="3" height="3" fill="black" />
            </svg>
        </chakra.div>
    );
};

export default LayoutGridUniformIcon;
