import React from 'react';
import './money.scss'
import {connect} from "react-redux";
import {selectMoney} from "../../store/selectors";
import {toggleShopOpened} from "../../store/ac";


function Money(props) {
    const {money} = props;
    return (
        <div className="moneyBlock decor-button">
            <span className={'moneyBlock__moneyAmount'}>{money}</span>
            <div className="moneyBlock__moneyPic" />
        </div>
    );
}

export default connect(
    (store) => ({
        money: selectMoney(store),
    }),
    (dispatch)=>({
    })
)(Money);
