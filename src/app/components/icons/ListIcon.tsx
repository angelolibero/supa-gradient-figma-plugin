import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const ListIcon = (props: BoxProps) => {
    return (
        <chakra.div fill="#000" _dark={{fill: 'white'}} boxSize={8} {...props}>
            <svg width="inherit" height="inherit" viewBox="0 0 32 32" fill="inherit" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23 10H9V11H23V10ZM9 15.5H23V16.5H9V15.5ZM9 21H23V22H9V21Z"
                    fill="inherit"
                />
            </svg>
        </chakra.div>
    );
};

export default ListIcon;
