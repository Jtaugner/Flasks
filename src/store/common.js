


export const TOGGLE_SETTINGS = "TOGGLE_SETTINGS";
export const TOGGLE_SOUNDS = "TOGGLE_SOUNDS";



export const CHANGE_GAME_SDK = "CHANGE_GAME_SDK";

//Покупки за монеты
export const SUBTRACT_MONEY = "SUBTRACT_MONEY";
export const ADD_MONEY = "ADD_MONEY";
export const CHANGE_FROM_PLAYER_DATA = "CHANGE_FROM_PLAYER_DATA";


//Уровни
export const SELECT_LEVEL = "SELECT_LEVEL";
export const INCREASE_LAST_LEVEL = "INCREASE_LAST_LEVEL";



export const getFromLocalStorage = (name, defaultVal) => {
  let val = localStorage.getItem(name);
  if(val) return Number(val);
  localStorage.setItem(name, defaultVal);
  return defaultVal;
};
export const getBoolFromLocalStorage = (name) => {
  let val = localStorage.getItem(name);
  if(val) return val === 'true';
  return true;
};