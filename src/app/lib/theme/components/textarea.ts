import { mode } from '@chakra-ui/theme-tools'

const baseStyle = (props) => ({
  boxShadow: mode('depth-light', 'depth-dark')(props),
  border: 'none',
})

const variants = {
  outline: {
    outline: 'rgba(125, 125, 125, 0.3)',
    borderColor: 'rgba(125, 125, 125, 0.3)',
    boxShadow: 'depth-light',
    _hover: {
      borderColor: 'rgba(125, 125, 125, 0.45)',
    },
    _focus: {
      zIndex: 1,
      borderColor: 'rgba(125, 125, 125, 0.3)',
      boxShadow: 'outline',
    },
  },
}

const defaultProps = {}

export default {
  baseStyle,
  variants,
  defaultProps,
}
