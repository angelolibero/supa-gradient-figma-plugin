import * as React from 'react';
import {FC} from 'react';
import {COLORS} from 'react-linear-gradient-picker/src/components/ColorPicker/constants';
import './index.css';

type ColorPickerProps = {
    color: string;
    onSelect?: (value) => void;
};

const ColorPicker: FC<ColorPickerProps> = ({color, onSelect}) => (
    <div className="cp">
        {COLORS.map(({value, name}) => (
            <div onClick={() => onSelect && onSelect(value)} key={name} title={name} style={{backgroundColor: value}} />
        ))}
    </div>
);

export default ColorPicker;
