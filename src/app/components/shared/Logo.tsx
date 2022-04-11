import * as React from 'react';
import {Box, BoxProps} from '@chakra-ui/react';
declare function require(path: string): any;
// @ts-ignore
import logo from '../../assets/logo.png';

type Props = {} & BoxProps;

const Logo: React.FC<Props> = ({...rest}) => {
    return <Box boxSize={10} bgImage={`url(${logo})`} bgSize="cover" {...rest}></Box>;
};

export default Logo;
