import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const ListIcon = (props: BoxProps) => {
    return (
        <chakra.div fill="#000" boxSize={5} {...props}>
            <svg className="svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6 6h2v1H6V6zm0 10h2v1H6v-1zm0-5h2v1H6v-1zm4-5h8v1h-8V6zm0 10h8v1h-8v-1zm0-5h8v1h-8v-1z"
                    fillRule="nonzero"
                    fillOpacity="1"
                    fill="inherit"
                    stroke="none"
                ></path>
            </svg>
        </chakra.div>
    );
};

export default ListIcon;
