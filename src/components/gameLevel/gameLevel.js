import React from 'react';
import './gameLevel.scss'


function GameLevel(props) {
    const {level} = props;
    return (
        <div className="top-menu__level decor-button">Уровень {level+1}</div>
    );
}

export default GameLevel
