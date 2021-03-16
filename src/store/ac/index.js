import {
    ADD_MONEY,
    CHANGE_FROM_PLAYER_DATA,
    CHANGE_GAME_SDK,
    INCREASE_LAST_LEVEL,
    SELECT_LEVEL,
    SUBTRACT_MONEY,
    TOGGLE_SOUNDS,
} from "../common";





export const toggleSounds = () => ({
    type: TOGGLE_SOUNDS,
});
export const changeGameSDK= (gameSDK) => ({
    type: CHANGE_GAME_SDK,
    gameSDK
});


export const chooseLevel = (level) => ({
    type: SELECT_LEVEL,
    level
});
export const increaseLastLevel = () => ({
    type: INCREASE_LAST_LEVEL
});


export const changeFromPlayerData = (id, data) => ({
    type: CHANGE_FROM_PLAYER_DATA,
    id, data
});


//Деньги
export const subtractMoney = () => ({
    type: SUBTRACT_MONEY
});
export const addMoney = () => ({
    type: ADD_MONEY
});
