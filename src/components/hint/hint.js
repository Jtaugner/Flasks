import React from 'react';
import './hint.scss'


function Hint(props) {
    return (
        <div className={'hint ' + (props.isBottomHint ? 'hint_bottom' : '')}>

            <p className={'hint__text'}>{props.message} </p>

        </div>
    );
}

export default Hint;
