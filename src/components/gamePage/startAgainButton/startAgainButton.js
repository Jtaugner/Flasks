import React from 'react';
import './startAgainButton.scss'


function StartAgainButton(props) {
    return (
        <div className="top-menu__startAgain icon decor-button" onClick={props.onClick} />
    );
}

export default StartAgainButton
