import { SystemStyleObject } from '@chakra-ui/theme-tools'

const sizes: Record<string, SystemStyleObject> = {
  hero: {
    fontSize: ['headline-1', null, 'hero'],
    lineHeight: ['86px'],
    fontWeight: 'bold',
  },
  'headline-1': {
    fontSize: ['headline-2', null, 'headline-1'],
    lineHeight: ['72px'],
  },
  'headline-2': {
    fontSize: ['headline-3', null, 'headline-2'],
    lineHeight: ['56px'],
  },
  'headline-3': {
    fontSize: ['headline-4', null, 'headline-3'],
    lineHeight: ['48px'],
  },
  'headline-4': {
    fontSize: ['headline-5', null, 'headline-4'],
    lineHeight: ['40px'],
  },
  'headline-5': {
    fontSize: ['body-1', null, 'headline-5'],
    lineHeight: ['32px'],
  },
}

const defaultProps = {
  size: 'headline-3',
}

export default { sizes, defaultProps }
