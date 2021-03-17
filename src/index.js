//Jtaugner (yotik123@yandex.ru) Copyright © 2020
import React from 'react';
import ReactDOM from 'react-dom';
import App, {giveParams} from './App';
import {Provider} from 'react-redux'
import {store} from "./store";
import {MemoryRouter} from "react-router-dom";
import {
    changeFromPlayerData,
    changeGameSDK, chooseLevel,
} from "./store/ac";
import {
    selectLastLevel,
    selectMoney,
} from "./store/selectors";

var playerGame;


function getState() {
    const state = store.getState();
    return {
        money: selectMoney(state),
        lastLevel: selectLastLevel(state)
    }
}

let advTime = true;
let showAdv;

// Сохранение данных в аккаунт пользователя Яндекса
function saveData() {
    console.log('saveData');
    try{
        if (playerGame) {
            const state = getState();
            if(playerGame)
                playerGame.setStats(state)
                .then((ignored) => {console.log('Successful');})
                .catch((e)=>{
                    console.log(e);
                });
        }
    }catch (ignored) {}
}


export function initPlayer(ysdk) {
    ysdk.getPlayer().then(_player => {
        // Игрок авторизован.
        playerGame = _player;
        playerGame.getStats(['money', 'lastLevel'], false).then((dataObject) => {
            console.log('DATA');
            console.log(dataObject);
            if (dataObject.money) store.dispatch(changeFromPlayerData('money', dataObject.money));
            if(dataObject.lastLevel){
                store.dispatch(changeFromPlayerData('lastLevel', dataObject.lastLevel));
                store.dispatch(chooseLevel(dataObject.lastLevel));
            }

            createApp();
        }).catch((e) => {
            console.log(e);
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
                <App showAdv={showAdv} saveData={saveData}/>
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

                showAdv = () => {
                    if(!advTime) return;
                    console.log('Show adv');
                    ysdk.adv.showFullscreenAdv({
                        callbacks: {
                            onClose: function() {
                                advTime = false;
                                setTimeout(()=>{
                                    advTime = true;
                                }, 210000);
                            }
                        }
                    });
                };

                initPlayer(ysdk);
            });
} else {
    createApp();
}

