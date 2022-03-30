import { mode } from '@chakra-ui/theme-tools'

const baseStyle = (props) => ({
  control: {
    _checked: {
      bg: mode('primary.500', 'primary.200')(props),
      borderColor: mode('primary.500', 'primary.200')(props),
      color: mode('white', 'gray.900')(props),

      _hover: {
        bg: mode('v.600', 'primary.300')(props),
        borderColor: mode('primary.600', 'primary.300')(props),
      },

      _disabled: {
        borderColor: mode('gray.200', 'transparent')(props),
        bg: mode('gray.200', 'whiteAlpha.300')(props),
        color: mode('gray.500', 'whiteAlpha.500')(props),
      },
    },
  },
})

export default {
  baseStyle,
}
