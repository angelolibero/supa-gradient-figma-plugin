import {atom} from 'recoil';

const stylesState = atom({
    key: 'stylesState', // unique ID (with respect to other atoms/selectors)
    default: {
        gradients: [],
        solid: [],
    }, // default value (aka initial value)
});

export default stylesState;
