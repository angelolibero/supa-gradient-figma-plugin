import { SystemStyleObject, mode } from '@chakra-ui/theme-tools'

const baseStyle = (props: Record<string, any>) => ({
  field: {
    boxShadow: mode('depth-light', 'depth-dark')(props),
    border: 'none',
  },
})

const sizes: Record<string, SystemStyleObject> = {
  md: {
    field: {
      px: 4,
      h: 12,
    },
  },
  lg: {
    field: {
      px: 4,
      h: 14,
    },
  },
  xl: {
    field: {
      px: 6,
      h: 16,
    },
  },
}

const defaultProps = {}

export default {
  baseStyle,
  sizes,
  defaultProps,
}
