import {SELECT_LEVEL} from "../common";
import {getLastLevel} from "../../projectCommon";

let lastLevel = getLastLevel();

export const levelReducer = (state = lastLevel, action) => {
    if(action.type === SELECT_LEVEL){
        return action.level;
    }
    return state;
};