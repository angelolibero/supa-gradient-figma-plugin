import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const ArrowDownIcon = (props: BoxProps) => {
    return (
        <chakra.div {...props}>
            <svg
                className="svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_17_144)">
                    <path d="M1 6.2619L6 11.5M6 11.5L11 6.2619M6 11.5L6 0.5" stroke="black" />
                </g>
                <defs>
                    <clipPath id="clip0_17_144">
                        <rect width="12" height="12" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </chakra.div>
    );
};

export default ArrowDownIcon;
