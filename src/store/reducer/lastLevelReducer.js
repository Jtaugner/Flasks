import {CHANGE_FROM_PLAYER_DATA, INCREASE_LAST_LEVEL} from "../common";
import {gameLevels, getLastLevel} from "../../projectCommon";

let lastLevel = getLastLevel();

export const lastLevelReducer = (state = lastLevel, action) => {
    if(action.type === INCREASE_LAST_LEVEL){
        localStorage.setItem('lastLevel', String(state + 1));
        if(state + 1 >= gameLevels.length){
            localStorage.setItem('lastLevel', String(gameLevels.length-1));
            return gameLevels.length-1;
        }
        return state + 1;
    }else if(action.type === CHANGE_FROM_PLAYER_DATA && action.id === 'lastLevel'){
        return action.data;
    }
    return state;
};