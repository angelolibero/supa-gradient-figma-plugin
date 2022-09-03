import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const BackIcon = (props: BoxProps) => {
    return (
        <chakra.div stroke="#000" _dark={{stroke: 'white'}} {...props}>
            <svg className="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_16_139)">
                    <path d="M5.7381 1L0.5 6M0.5 6L5.7381 11M0.5 6H11.5" stroke="inherit" />
                </g>
                <defs>
                    <clipPath id="clip0_16_139">
                        <rect width="12" height="12" fill="inherit" />
                    </clipPath>
                </defs>
            </svg>
        </chakra.div>
    );
};

export default BackIcon;
