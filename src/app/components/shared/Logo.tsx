import * as React from 'react';
import {FC} from 'react';
import {Box, BoxProps, Image} from '@chakra-ui/react';
// @ts-ignore
import logo from '../../assets/logo.png';

type Props = {} & BoxProps;

const Logo: FC<Props> = ({...rest}) => {
    return (
        <Box {...rest}>
            <Image src={logo} boxSize={rest.boxSize || 9} />
        </Box>
    );
};

export default Logo;
