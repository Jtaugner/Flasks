import {getBoolFromLocalStorage, TOGGLE_START_FROM_FIRST_CELL} from "../common";

let startFromFirstCell = getBoolFromLocalStorage('startFromFirstCell');


export const startFromFirstCellReducer = (state = startFromFirstCell, action) => {
    if(action.type === TOGGLE_START_FROM_FIRST_CELL){
        localStorage.setItem('startFromFirstCell', String(!state));
        return !state;
    }
    return state;
};