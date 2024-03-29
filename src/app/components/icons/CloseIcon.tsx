import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const CloseIcon = (props: BoxProps) => {
    return (
        <chakra.div fill="#000" _dark={{fill: 'white'}} {...props}>
            <svg className="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6 5.293l4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294z"
                    fillRule="nonzero"
                    fillOpacity="1"
                    fill="inherit"
                    stroke="none"
                ></path>
            </svg>
        </chakra.div>
    );
};

export default CloseIcon;
