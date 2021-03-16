import React, {useState} from 'react';
import './money.scss'
import {connect} from "react-redux";
import {selectMoney} from "../../store/selectors";
import {subtractMoney} from "../../store/ac";


function Money(props) {
    const {money, onClick, subtractMoney, allGameMoves, level} = props;
    const [showingTip, setShowingTip] = useState(true);
    const useTip = () => {
        if(!onClick || allGameMoves.length === 0 || level === 0) {
            setShowingTip(true);
            return;
        }
        setShowingTip(false);
        if(level !== 1){
            subtractMoney();
        }

        onClick();
    }
    return (
        <div className={"moneyBlock decor-button " + (onClick && allGameMoves.length === 0 ? 'moneyBlock_game' : '')} onClick={useTip}>
            <span className={'moneyBlock__moneyAmount'}>{money}</span>
            <div className="moneyBlock__moneyPic" />
            {level < 15 && showingTip ? <div className="moneyBlock__tip">Кнопка отмены последнего хода</div> : ''}
        </div>
    );
}

export default connect(
    (store) => ({
        money: selectMoney(store),
    }),
    (dispatch) => ({
        subtractMoney: () => dispatch(subtractMoney())
    })
)(Money);
