import accordion from './accordion';
import badge from './badge';
import button from './button';
import checkbox from './checkbox';
import closeButton from './close-button';
import drawer from './drawer';
import heading from './heading';
import input from './input';
import link from './link';
import pinInput from './pin-input';
import radio from './radio';
import select from './select';
import _switch from './switch';
import tabs from './tabs';
import textarea from './textarea';
import tooltip from './tooltip';
import divider from './divider';

//Custom
import baseSlider from './custom/base-slider';
import buttonTabs from './custom/button-tabs';
import colorStopSwatch from './custom/color-stop-swatch';
import iconsSwitch from './custom/icons-switch';

export default {
    //CHAKRA components overrides
    Accordion: accordion,
    Badge: badge,
    Button: button,
    Checkbox: checkbox,
    CloseButton: closeButton,
    Divider: divider,
    Drawer: drawer,
    Heading: heading,
    Input: input,
    Link: link,
    PinInput: pinInput,
    Radio: radio,
    Select: select,
    Switch: _switch,
    Tabs: tabs,
    Tooltip: tooltip,
    Textarea: textarea,
    //CUSTOM components
    BaseSlider: baseSlider,
    ButtonTabs: buttonTabs,
    ColorStopSwatch: colorStopSwatch,
    IconsSwitch: iconsSwitch,
};
