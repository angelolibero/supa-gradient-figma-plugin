import { switchAnatomy as parts } from '@chakra-ui/anatomy'
import type {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
  SystemStyleObject,
} from '@chakra-ui/theme-tools'
import { calc, cssVar, mode } from '@chakra-ui/theme-tools'

const $width = cssVar('switch-track-width')
const $height = cssVar('switch-track-height')

const $diff = cssVar('switch-track-diff')
const diffValue = calc.subtract($width, $height)

const $translateX = cssVar('switch-thumb-x')

const baseStyleTrack: SystemStyleFunction = (props) => {
  return {
    borderRadius: props.size == 'md' ? 12 : 8,
    p: props.size == 'md' ? '6px' : '4px',
    transitionProperty: 'common',
    transitionDuration: 'fast',
    width: '64px',
    height: '24px',
    bg: mode('gray.200', 'gray.700')(props),
    _focus: {
      boxShadow: 'outline',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    _checked: {
      bg: mode('gray.200', 'gray.700')(props),
    },
  }
}

const baseStyleThumb: SystemStyleFunction = (props) => ({
  bg: mode('white', 'gray.800')(props),
  transitionProperty: 'transform',
  transitionDuration: 'normal',
  borderRadius: 8,
  shadow: 'depth',
  _checked: {
    transform: `translateX(${props.size == 'md' ? 40 : 32}px)`,
  },
})

const baseStyleIcon: SystemStyleFunction = (props) => ({
  w: props.size == 'md' ? '40px' : '32px',
  h: props.size == 'md' ? '32px' : '24px',
  d: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: '4px',
  color: mode('gray.400', 'gray.400')(props),
})

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  container: {
    [$diff.variable]: diffValue,
    [$translateX.variable]: $diff.reference,
    [$width.variable]: '52px',
    [$height.variable]: '20px',
    _rtl: {
      [$translateX.variable]: calc($diff).negate().toString(),
    },
  },
  track: baseStyleTrack(props),
  thumb: baseStyleThumb(props),
  icon: baseStyleIcon(props),
})

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  sm: {
    container: {
      [$width.variable]: '64px',
      [$height.variable]: '32px',
    },
    thumb: {
      [$width.variable]: '24px',
      [$height.variable]: '24px',
      w: '32px',
    },
    track: {
      width: '64px',
      height: '24px',
    },
  },
  md: {
    container: {
      [$width.variable]: '84px',
      [$height.variable]: '28px',
    },
    thumb: {
      [$width.variable]: '40px',
      [$height.variable]: '32px',
      w: '40px',
    },
    track: {
      width: '82px',
      height: '28px',
    },
  },
}

const defaultProps = {
  size: 'sm',
  colorScheme: 'primary',
  variant: 'round',
}

export default {
  parts: [...parts.keys, 'icon'],
  baseStyle,
  variants: {},
  sizes,
  defaultProps,
}
