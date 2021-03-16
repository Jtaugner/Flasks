import React from 'react';
import './skipLevelWindow.scss'
import popUpBlackout from "../../decorators/pop-up-blackout/PopUpBlackout";
import {gameLevels} from "../../projectCommon";

function SkipLevelWindow(props) {
    const {closeWindow, skipLevel} = props;
    return (
        <div className="endGame popUp skipWindow">
            <div className="popUp__header">
                Пропуск уровня
            </div>
            <div className="endGame__prize">
                Вы можете пропустить уровень за просмотр рекламы
            </div>

            <div className="endGame__actions">
                <div className="skipWindow__button icon decor-button" onClick={closeWindow}>Назад</div>
                <div className="skipWindow__button icon decor-button" onClick={skipLevel}>Пропустить</div>
            </div>
        </div>
    );
}

export default popUpBlackout(SkipLevelWindow);
