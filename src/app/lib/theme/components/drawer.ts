import {SystemStyleObject} from '@chakra-ui/theme-tools';
import {variantSolid} from '../utils/colors';

const baseStyle: SystemStyleObject = {
    overlay: {
        backdropFilter: 'blur(32px)',
        transition: 'all 0.1s',
    },
};

const defaultProps = {};

export default {
    baseStyle,
    defaultProps,
};
