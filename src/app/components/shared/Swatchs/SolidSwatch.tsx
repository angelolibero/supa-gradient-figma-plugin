import * as React from 'react';
import {useCallback, useMemo} from 'react';
import {Tooltip, Center, RadioProps, Box, useRadio} from '@chakra-ui/react';
import {CHECKERED_GRADIENT_PROPS} from '../../../lib/constants';

type Props = {
    style?: PaintStyle;
    isActive?: boolean;
    onSelect?: (style: PaintStyle) => void;
} & Omit<RadioProps, 'onSelect'>;

const SolidSwatch: React.FC<Props> = ({style, isActive, size, onSelect, ...rest}) => {
    const {getInputProps, getCheckboxProps} = useRadio({
        value: style ? style.id : 'custom',
        name: style && style.name,
        ...rest,
    });
    const input = getInputProps();
    const checkbox = getCheckboxProps();

    const paint = useMemo(() => {
        return style && style.paints && (style.paints[0] as SolidPaint);
    }, [style]);

    const bgColor = useMemo(() => {
        return paint && paint.color
            ? `rgba(${paint.color.r * 255}, ${paint.color.g * 255}, ${paint.color.b * 255}, ${
                  (paint.opacity * 100 || 100) + '%'
              })`
            : undefined;
    }, [paint]);

    const handleSelectStyle = useCallback(() => {
        onSelect && onSelect(style);
    }, [style, onSelect]);

    const onPressEnter = useCallback(
        (e) => {
            //enter and space key code:
            if (e.key === 'Enter' || e.keyCode === 13 || e.keyCode === 32) {
                handleSelectStyle();
            }
        },
        [handleSelectStyle]
    );

    return (
        <Box>
            {style && style.paints && (
                <Tooltip
                    label={style && style.name}
                    openDelay={300}
                    isDisabled={!style || !(style && style.id)}
                    offset={[0, -1]}
                >
                    <Center>
                        <Box
                            as="label"
                            {...CHECKERED_GRADIENT_PROPS}
                            bgSize="10px 10px"
                            bgPos="0px 0px, 5px 5px"
                            rounded="full"
                            pos="relative"
                        >
                            <input {...input} onKeyDown={onPressEnter} />
                            <Box
                                bgColor={bgColor}
                                boxSize={size == 'lg' ? 10 : 6}
                                shadow={isActive ? 'outline' : 'sm'}
                                rounded="full"
                                outline="none"
                                border={size == 'lg' ? '4px solid' : '2px solid'}
                                borderColor="white"
                                p={0}
                                cursor="pointer"
                                _focus={{
                                    boxShadow: 'outline',
                                }}
                                onClick={handleSelectStyle}
                                {...rest}
                                {...checkbox}
                            />
                        </Box>
                    </Center>
                </Tooltip>
            )}
        </Box>
    );
};

export default SolidSwatch;
