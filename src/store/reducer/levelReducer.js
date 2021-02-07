import {getFromLocalStorage, INCREASE_LEVEL, SELECT_LEVEL} from "../common";

let lastLevel = getFromLocalStorage('lastLevel', 0);

export const levelReducer = (state = lastLevel, action) => {
    if(action.type === SELECT_LEVEL){
        return action.level;
    }else if(action.type === INCREASE_LEVEL){
        return state + 1;
    }
    return state;
};