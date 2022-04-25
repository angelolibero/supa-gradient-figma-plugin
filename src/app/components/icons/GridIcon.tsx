import * as React from 'react';
import {chakra, BoxProps} from '@chakra-ui/react';

const GridIcon = (props: BoxProps) => {
    return (
        <chakra.div {...props}>
            <svg className="svg" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 1H1v3h3V1zM0 0v5h5V0H0zm11 1H8v3h3V1zM7 0v5h5V0H7zM4 8H1v3h3V8zM0 7v5h5V7H0zm11 1H8v3h3V8zM7 7v5h5V7H7z"
                    fillRule="evenodd"
                    fillOpacity="1"
                    fill="#454545"
                    stroke="none"
                ></path>
            </svg>
        </chakra.div>
    );
};

export default GridIcon;
