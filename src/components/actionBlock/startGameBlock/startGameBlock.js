import React from 'react';
import './startGameBlock.scss'

function StartGameBlock(props) {
    const {startLevelAgain} = props;
    return (
        <div
            className={'startGameBlock'}
        >
            <div
                className="startGameBlock__button"
                onClick={startLevelAgain}
                >
                Начать заново
            </div>
        </div>
    );
}
export default StartGameBlock;
