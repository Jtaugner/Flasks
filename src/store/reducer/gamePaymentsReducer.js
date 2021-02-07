import {CHANGE_GAME_PAYMENTS} from "../common";

export const gamePaymentsReducer = (state = false, action) => {
    if(action.type === CHANGE_GAME_PAYMENTS){
        return action.payments;
    }
    return state;
};