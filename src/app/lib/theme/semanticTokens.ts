const semanticTokens = {
  colors: {
    primary: {
      default: 'primary.500',
      _dark: 'primary.300',
    },
    secondary: {
      default: 'secondary.500',
      _dark: 'secondary.300',
    },
    error: {
      default: 'red.500',
      _dark: 'red.300',
    },
    success: {
      default: 'green.500',
      _dark: 'green.300',
    },
    warning: {
      default: 'yellow.500',
      _dark: 'yellow.300',
    },
    info: {
      default: 'cyan.500',
      _dark: 'cyan.300',
    },
    light: {
      default: 'gray.200',
      _dark: 'gray.300',
    },
    lighter: {
      default: 'gray.100',
      _dark: 'gray.200',
    },
    dark: {
      default: 'gray.500',
      _dark: 'gray.400',
    },
    darker: {
      default: 'gray.600',
      _dark: 'gray.500',
    },
    gray: {
      default: 'gray.700',
      _dark: 'gray.200',
    },
  },
  shadows: {
    depth: {
      default: 'depth-light',
      _dark: 'depth-dark',
    },
  },
}

export default semanticTokens
