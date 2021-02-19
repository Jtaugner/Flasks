import React from 'react';
import './money.scss'
import {connect} from "react-redux";
import {selectMoney} from "../../store/selectors";
import {subtractMoney, toggleShopOpened} from "../../store/ac";


function Money(props) {
    const {money, onClick, subtractMoney, allGameMoves, level} = props;
    const useTip = () => {
        if(allGameMoves.length === 0 || level === 0 || !onClick) return;
        if(level !== 1){
            subtractMoney();
        }

        onClick();
    }
    return (
        <div className="moneyBlock decor-button" onClick={useTip}>
            <span className={'moneyBlock__moneyAmount'}>{money}</span>
            <div className="moneyBlock__moneyPic" />
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
