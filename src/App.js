import React, {Component} from 'react';
import './root.css'
import './App.css';
import {connect} from "react-redux";
import MainPage from "./components/mainPage/mainPage";
import {Route, Switch, withRouter} from "react-router-dom";
import Settings from "./components/settings";
import {selectGameSDK, selectSettings} from "./store/selectors";
import GamePage from "./components/gamePage/gamePage";
import ErrorMessage from "./components/errorMessage/errorMessage";

import {YM_METRIKA_ID} from './projectCommon'
import {CSSTransition, TransitionGroup} from "react-transition-group";

export function reachGoal(goal) {
    try{
        window.ym(YM_METRIKA_ID,'reachGoal', goal)
    }catch(ignored){}
}
export function giveParams(data) {
    try{
        window.ym(YM_METRIKA_ID, 'params', data);
    }catch(ignored){}
}


let timeout;
console.log('V-4');

//Реклама
let advTime = true;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            canSwitchPage: true
        };

    }

    changeCanSwitchPage = (bool) => {
        this.setState({canSwitchPage: bool});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.location !== this.props.location){
            clearTimeout(timeout);
            this.changeCanSwitchPage(false);
            timeout = setTimeout(()=>{
                this.changeCanSwitchPage(true);
            }, 1200);

        }
    }

    componentDidCatch(error, info) {
        // Послать ошибку в яндекс метрику
        try{
            console.log(info);
            console.log(error);
            const str = error.toString() + '---' + info.componentStack.slice(0, 150);
            giveParams({[str]: 1})
        }catch(ignored){}
        this.setState({
            isError: true
        })
    }

    render() {
        if (this.state.isError) {
            return (
                <>
                    <ErrorMessage
                        onClick={
                            () => {
                                this.setState({
                                    isError: false
                                })
                            }
                        }
                        getHome={true}
                    />
                </>
            )
        }

        const location = this.props.location;
        return (
            <>

                <TransitionGroup
                    className={'transGroup ' + (location.pathname === '/game' ? 'transGroupMenu' : '')}
                >
                    <CSSTransition
                        key={location.key}
                        timeout={1000}
                        classNames="slide"
                    >
                        <Switch location={location}>


                            <Route path={'/home'}
                                   render={() => <MainPage canSwitchPage={this.state.canSwitchPage}/>}
                                   />
                            <Route path={'/game'}
                                   render={() => <GamePage showAdv={this.props.showAdv}/>}
                                   />


                        </Switch>
                    </CSSTransition>
                </TransitionGroup>

                {this.props.settings ? <Settings/> : ''}

            </>
        );
    }

}

export default connect(
    (store) =>
    ({
        settings: selectSettings(store),
        sdk: selectGameSDK(store)
    }),
    null,
    (stateProps, dispatchProps) => {
        return ({
            ...stateProps,
            ...dispatchProps,
            showAdv: () => {
                if(stateProps.sdk && advTime){
                    stateProps.sdk.adv.showFullscreenAdv({
                        callbacks: {
                            onClose: function(wasShown) {
                                if(wasShown){
                                    advTime = false;
                                    setTimeout(()=>{
                                        advTime = true;
                                    }, 200000);
                                }
                            }
                        }
                    });
                }
            }
        })
    }

)(withRouter(App));
