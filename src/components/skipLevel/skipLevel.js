import React from 'react';
import './skipLevel.scss'
import {connect} from "react-redux";
import {selectSounds} from "../../store/selectors";


function SkipLevel(props) {
    const {onClick} = props;
    return (
        <div
            className={'skipLevel icon decor-button'}
            onClick={onClick} />
    );
}

export default connect(
    (store)=>({
        isSounds: selectSounds(store)})
)(SkipLevel);
