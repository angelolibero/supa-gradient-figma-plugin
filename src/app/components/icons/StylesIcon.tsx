import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const StylesIcon = (props: BoxProps) => {
    return (
        <chakra.div fill="#fff" _dark={{fill: 'white'}} {...props}>
            <svg
                className="svg-icon"
                fill="inherit"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M.5 2c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C3.5 1.172 2.828.5 2 .5 1.172.5.5 1.172.5 2zm6 0c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5C9.5 1.172 8.828.5 8 .5c-.828 0-1.5.672-1.5 1.5zM8 9.5c-.828 0-1.5-.672-1.5-1.5 0-.828.672-1.5 1.5-1.5.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5zM.5 8c0 .828.672 1.5 1.5 1.5.828 0 1.5-.672 1.5-1.5 0-.828-.672-1.5-1.5-1.5C1.172 6.5.5 7.172.5 8z"
                    fillRule="nonzero"
                    fillOpacity="1"
                    fill="inherit"
                    stroke="none"
                ></path>
            </svg>
        </chakra.div>
    );
};

export default StylesIcon;
