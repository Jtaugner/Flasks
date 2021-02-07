import {
    CHANGE_FROM_PLAYER_DATA,
    CHANGE_LEVEL_PROGRESS,
    CLEAR_LEVEL_FROM_PROGRESS,
    getJSONFromLocalStorage
} from "../common";

// Массив, каждые элемент обозначает строку кроссворда:
    // Строки:
        // Массивы с размером в длину слова:
            // 0 - буква закрыта
            // 1 - буква открыта
            // буква - буква вставлена игроком
const defaultProgress = {};
let levelProgress = getJSONFromLocalStorage('levelProgress', defaultProgress);
if(Array.isArray(levelProgress)) levelProgress = defaultProgress;
export const levelProgressReducer = (state = levelProgress, action) => {
    if(action.type === CHANGE_LEVEL_PROGRESS){
        state[action.level] = action.progress;
        localStorage.setItem('levelProgress', JSON.stringify(state));
        return {...state};
    }else if(action.type === CLEAR_LEVEL_FROM_PROGRESS){
        delete state[action.level];
        localStorage.setItem('levelProgress', JSON.stringify(state));
        return {...state};
    }else if(action.type === CHANGE_FROM_PLAYER_DATA && action.id === 'levelProgress'){
        return action.data;
    }
    return state;
};