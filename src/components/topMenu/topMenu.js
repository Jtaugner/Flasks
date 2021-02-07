import React from 'react';
import './topMenu.scss'
import {connect} from "react-redux";
import {tipsDescription} from "../../projectCommon";
function TopMenu(props) {
    return (
        <div className="top-menu">
            <div className="top-menu__inner">
                {props.children}
            </div>
        </div>
    );
}

export default connect((store) => ({


    })
)(TopMenu);
