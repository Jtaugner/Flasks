export const selectSettings= (store) => store.settings;
export const selectSounds= (store) => store.sounds;

export const selectGameSDK = (store) => store.gameSDK;
export const selectPayments = (store) => store.gamePayments;

export const selectLevel = (store) => store.level;
export const selectLastLevel = (store) => store.lastLevel;
export const selectLevelProgress= (store) => store.levelProgress;

//Покупки за монеты
export const selectMoney= (store) => store.money;

//Игра
export const selectIsDeleteWrongWord= (store) => store.deleteWrongWord;
export const selectStartFromFirstCell= (store) => store.startFromFirstCell;

export const selectOpenedKeyboardWords = (store) => store.openedKeyboardWords;