import {
    ADD_MONEY,
    ADD_OPENED_KEYBOARD, CHANGE_FROM_PLAYER_DATA,
    CHANGE_GAME_PAYMENTS,
    CHANGE_GAME_SDK,
    CHANGE_LEVEL_PROGRESS, CLEAR_LEVEL_FROM_PROGRESS,
    CLEAR_OPENED_KEYBOARD,
    INCREASE_LAST_LEVEL,
    INCREASE_LEVEL,
    SELECT_LEVEL,
    SUBTRACT_MONEY,
    TOGGLE_DELETE_WRONG_WORD,
    TOGGLE_SOUNDS,
    TOGGLE_START_FROM_FIRST_CELL
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
export const increaseLevel = () => ({
    type: INCREASE_LEVEL
});
export const increaseLastLevel = () => ({
    type: INCREASE_LAST_LEVEL
});
export const changeLevelProgress = (level, progress) => ({
    type: CHANGE_LEVEL_PROGRESS,
    progress, level
});

export const clearLevelFromProgress = (level) => ({
    type: CLEAR_LEVEL_FROM_PROGRESS,
    level
});

export const changeGamePayments = (payments) => ({
    type: CHANGE_GAME_PAYMENTS,
    payments
});


export const changeFromPlayerData = (id, data) => ({
    type: CHANGE_FROM_PLAYER_DATA,
    id, data
});

export const toggleDeleteWrongWord = () => ({
    type: TOGGLE_DELETE_WRONG_WORD,
});
export const toggleStartFromFirstCell = () => ({
    type: TOGGLE_START_FROM_FIRST_CELL,
});


//Деньги
export const subtractMoney = (money) => ({
    type: SUBTRACT_MONEY,
    money
});
export const addMoney = (money) => ({
    type: ADD_MONEY,
    money
});


export const clearOpenedKeyboardWords = (level) => ({
    type: CLEAR_OPENED_KEYBOARD,
    level
});
export const addOpenedKeyboard = (level, index) => ({
    type: ADD_OPENED_KEYBOARD,
    level, index
});