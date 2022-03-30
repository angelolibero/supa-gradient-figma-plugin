import { SystemStyleObject } from '@chakra-ui/theme-tools'

const baseStyle: SystemStyleObject = {
  baseStyle: {
    container: {
      borderTopWidth: '1px',
      borderColor: 'inherit',
      _first: {
        borderTopWidth: '0px',
      },
      _last: {
        borderBottomWidth: '0px',
      },
    },
  },
}

const defaultProps = {}

export default {
  baseStyle,
  defaultProps,
}
