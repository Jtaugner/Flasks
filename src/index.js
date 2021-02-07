//Jtaugner (yotik123@yandex.ru) Copyright © 2020
import React from 'react';
import ReactDOM from 'react-dom';
import App, {giveParams} from './App';
import {Provider} from 'react-redux'
import {store} from "./store";
import {MemoryRouter} from "react-router-dom";
import {
    addMoney, changeFromPlayerData,
    changeGamePayments,
    changeGameSDK, chooseLevel,
} from "./store/ac";
import {
    selectLastLevel,
    selectLevelProgress,
    selectMoney,
    selectOpenedKeyboardWords
} from "./store/selectors";

var playerGame;


let recentData = '';

function getState() {
    const state = store.getState();
    return {
        money: selectMoney(state),
        lastLevel: selectLastLevel(state),
        levelProgress: selectLevelProgress(state),
        openedKeyboardWords: selectOpenedKeyboardWords(state),
    }
}

// Сохранение данных в аккаунт пользователя Яндекса
export function saveData() {
    try{
        if (playerGame) {
            const state = {gameProgress: getState()};
            const newData = JSON.stringify(state);
            if(newData === recentData) return;
            recentData = newData;
            if(playerGame) playerGame.setData(state).then((ignored) => {}).catch(()=>{});
        }
    }catch (ignored) {}
}


export function initPlayer(ysdk) {
    ysdk.getPlayer().then(_player => {
        // Игрок авторизован.
        playerGame = _player;

        //Сохранение данных на серверах Яндекса при закрытии, смене вкладке, обновлении
        window.onblur = saveData;
        window.onunload= saveData;
        window.onbeforeunload = saveData;
        window.onpagehide = saveData;

        // Сохранение данных каждые 60 сек
        setInterval(()=>{
            saveData();
        }, 60000);

        playerGame.getData(['gameProgress'], false).then((data) => {
            const gp = data.gameProgress;
            console.log('date', gp);
            if(gp){
                if(gp.money) store.dispatch(changeFromPlayerData('money', gp.money));
                if(gp.lastLevel) {
                    store.dispatch(changeFromPlayerData('lastLevel', gp.lastLevel));
                    store.dispatch(chooseLevel(gp.lastLevel));
                }
                if(gp.levelProgress) store.dispatch(changeFromPlayerData('levelProgress', gp.levelProgress));
                if(gp.openedKeyboardWords) store.dispatch(changeFromPlayerData('openedKeyboardWords', gp.openedKeyboardWords));

                /*
                    Пример измененеия данных
                        store.dispatch(changeExp(gp.exp));
                 */
            }else{
                saveData();
            }
            createApp();
        }).catch((e) => {
            createApp();
        });
    }).catch((e) => {
        console.log(e);
        createApp();
    });
}

function createApp() {
    ReactDOM.render(
        <Provider store={store}>
            <MemoryRouter
                initialEntries={['/game']}
                initialIndex={0}
            >
                <App/>
            </MemoryRouter>
        </Provider>

        ,
        document.getElementById('root')
    );
}

if (window.YaGames) {
        window.YaGames.init()
            .then(ysdk => {
                store.dispatch(changeGameSDK(ysdk));
                var isNativeCache = ysdk.yandexApp && ysdk.yandexApp.enabled;
                if ('serviceWorker' in navigator && !isNativeCache) {
                    window.onload = function () {
                        navigator.serviceWorker
                            .register('sw.js')
                            .then(function (reg) {
                                console.log('Registration succeeded. Scope is ' + reg.scope);
                            })
                            .catch(function (error) {
                                console.error('Trouble with sw: ', error);
                            });
                    };
                }

                initPlayer(ysdk);
            });
} else {
    createApp();
}

