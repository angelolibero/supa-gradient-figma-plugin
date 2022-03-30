import { SystemStyleObject } from '@chakra-ui/theme-tools'

const baseStyle: SystemStyleObject = {}

const sizes: Record<string, SystemStyleObject> = {
  md: {
    field: {
      px: 3,
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
      borderRadius: 'md',
    },
  },
}

const variants = {
  unstyled: {
    field: {
      boxShadow: 'none',
    },
  },
  outline: {
    field: {
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
  },
}

const defaultProps = {
  h: 14,
}

export default {
  baseStyle,
  sizes,
  variants,
  defaultProps,
}
