import {getBoolFromLocalStorage, TOGGLE_SOUNDS} from "../common";

let isSounds = getBoolFromLocalStorage('sounds');

export const soundsReducer = (state = isSounds, action) => {
    if(action.type === TOGGLE_SOUNDS){
        localStorage.setItem('sounds', String(!state));
        return !state;
    }
    return state;
};