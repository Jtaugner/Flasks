import {} from "../common";
import {TOGGLE_SETTINGS} from "../common";

export const settingsReducer = (state = false, action) => {
    if(action.type === TOGGLE_SETTINGS){
        return  !state;
    }
    return state;
};