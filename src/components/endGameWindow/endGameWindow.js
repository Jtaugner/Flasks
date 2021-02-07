import React from 'react';
import './endGameWindow.scss'
import popUpBlackout from "../../decorators/pop-up-blackout/PopUpBlackout";
import MenuLink from "../menuLink/menuLink";
import {gameLevels} from "../../projectCommon";

//[[0,0,0,0,0,0,0,0],true,true,true,true,true,true,true,true,true]
function EndGameWindow(props) {
    const {nextGame, level} = props;
    return (
        <div className="endGame popUp">
            <div className="popUp__header">
                Уровень {level+1} пройден!
            </div>
            <div className="endGame__prize">
                Ваша награда:
                <div className="endGame__prizeMoney">
                    {props.addMoney ? '+5' : 0}
                    <div className="endGame__money" />
                </div>
            </div>

            <div className="endGame__actions">
                    <MenuLink endGame={true}/>
                    {level !== gameLevels.length-1 ?
                        <div
                        className="menu endGame__nextLevel icon decor-button"
                        onClick={nextGame}
                    /> : ''}

            </div>
        </div>
    );
}

export default popUpBlackout(EndGameWindow);
