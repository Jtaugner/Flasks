import React from 'react';
import './tips.scss'
import {connect} from "react-redux";
import {tipsCost} from "../../projectCommon";
function Tips(props) {
    const {getTip} = props;

    return (
        <div className={'tips'}>
            {
                tipsCost.map((cost, index)=>(
                    <div
                        className={"tip tip" + (index+1)}
                        key={'cost' + index}
                        onClick={()=> getTip(index)}
                    >
                        <div className="tip__cost">{cost}</div>
                    </div>
                ))
            }

        </div>
    );
}

export default connect((store) => ({


    })
)(Tips);
