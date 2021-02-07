import React from 'react';
import './errorMessage.scss'
import popUpBlackout from "../../decorators/pop-up-blackout/PopUpBlackout";
import {Link} from "react-router-dom";

function ErrorMessage(props) {
    const {onClick} = props;
    return (
        <Link to={'/home'} onClick={onClick}>
            <div className={'errorMessage popUp'}>
                <div className="popUp__header">
                    Упс, ошибка...
                </div>
                <div className="close" />
                <p>Извините, произошла неизвестная ошибка.
                    Отчёт об ошибке уже отправлен разработчикам. Кликните в любое место, чтобы вернуться в меню</p>
            </div>
        </Link>
    );
}

export default popUpBlackout(ErrorMessage);
