import {getBoolFromLocalStorage, TOGGLE_DELETE_WRONG_WORD} from "../common";

let deleteWrongWord = getBoolFromLocalStorage('deleteWrongWord');


export const deleteWrongWordReducer = (state = deleteWrongWord, action) => {
    if(action.type === TOGGLE_DELETE_WRONG_WORD){
        localStorage.setItem('deleteWrongWord', String(!state));
        return !state;
    }
    return state;
};