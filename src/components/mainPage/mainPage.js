import React, {useState} from 'react';
import './mainPage.scss'
import {connect} from "react-redux";

import TopMenu from "../topMenu/topMenu";
import Money from "../money/money";
import Settings from "../settings";
import SettingsOpen from "../settingsOpen/settingsOpen";
import Levels from "../levels/levels";


function MainPage(props) {
    const [isSettingsOpen, changeSettingsOpen] = useState(false);

    const settingsOpenOnClick = () => {changeSettingsOpen(true)};
    const settingsCloseOnClick = () => {changeSettingsOpen(false)};

    console.log(isSettingsOpen);
    return (
        <div className={'mainPage'}>
            <div className="mainPage__blur" />
            <TopMenu>
                <SettingsOpen onClick={settingsOpenOnClick}/>
                <Money/>
            </TopMenu>

            <Levels canSwitchPage={props.canSwitchPage}/>

            {isSettingsOpen ? <Settings closeSettings={settingsCloseOnClick}/> : ''}
        </div>
    );
}

export default connect(
    (store)=>({

    })
    ,
    (dispatch)=>({

    })

)(MainPage);
