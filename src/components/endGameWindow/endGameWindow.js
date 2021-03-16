import React from 'react';
import './endGameWindow.scss'
import popUpBlackout from "../../decorators/pop-up-blackout/PopUpBlackout";
import MenuLink from "../menuLink/menuLink";
import {gameLevels, moneyPerLevel} from "../../projectCommon";

//[[0,0,0,0,0,0,0,0],true,true,true,true,true,true,true,true,true]
function EndGameWindow(props) {
    const {nextGame, level, isAddMoney} = props;
    return (
        <div className="endGame popUp">
            <div className="popUp__header">
                Уровень {level+1} пройден!
            </div>
            <div className="endGame__prize">
                {
                    level !== gameLevels.length-1 ?
                    <>
                        Ваша награда:
                        <div className="endGame__prizeMoney">
                            {isAddMoney ? '+' + moneyPerLevel : 0}
                            <div className="endGame__money" />
                        </div>
                    </>
                        :
                        <div className={'endGame__text'}>
                            На данный момент это последний уровень игры, но скоро появятся новые!
                            А пока вы можете поиграть в другие наши игры, найти ссылки на них можно в настройках Колбочек.
                        </div>
                }

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
