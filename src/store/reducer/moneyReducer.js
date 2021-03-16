import {CHANGE_FROM_PLAYER_DATA, getFromLocalStorage, SUBTRACT_MONEY} from "../common";
import {ADD_MONEY} from "../common";
import {moneyPerLevel} from "../../projectCommon";

let gameMoney = getFromLocalStorage('gameMoney', 15);
if(isNaN(gameMoney)) gameMoney = 15;

export const moneyReducer = (state = gameMoney, action) => {
    if(action.type === SUBTRACT_MONEY){
        const subtract = state - 1;
        localStorage.setItem('gameMoney', String(subtract));
        return subtract;
    }else if(action.type === ADD_MONEY){
        const sum = state + moneyPerLevel;
        localStorage.setItem('gameMoney', String(sum));
        return sum;
    }else if(action.type === CHANGE_FROM_PLAYER_DATA && action.id === 'money'){
        return action.data;
    }
    return state;
};