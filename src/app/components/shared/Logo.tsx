import * as React from 'react';
import {Box, BoxProps, Image} from '@chakra-ui/react';
declare function require(path: string): any;
// @ts-ignore
import logo from '../../assets/logo.png';

type Props = {} & BoxProps;

const Logo: React.FC<Props> = ({...rest}) => {
    return (
        <Box {...rest}>
            <Image src={logo} boxSize={rest.boxSize || 9} />
        </Box>
    );
};

export default Logo;
