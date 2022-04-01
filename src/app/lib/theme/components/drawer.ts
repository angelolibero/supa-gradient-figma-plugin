import {SystemStyleObject} from '@chakra-ui/theme-tools';
import {variantSolid} from '../utils/colors';

const baseStyle: SystemStyleObject = {
    overlay: {
        backdropFilter: 'blur(28px)',
        transition: 'all 0.15s',
    },
};

const defaultProps = {};

export default {
    baseStyle,
    defaultProps,
};
