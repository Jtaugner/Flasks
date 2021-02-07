import React, {Component} from 'react';
import './levels.scss'
import {connect} from "react-redux";
import {chooseLevel} from "../../store/ac";
import {selectLastLevel, selectSounds} from "../../store/selectors";
import {Link} from "react-router-dom";
import {openGameSound} from "../../sounds";
import {gameLevels} from "../../projectCommon";

const gameLevelsLength = gameLevels.length;
class Levels extends Component {
    levelRef;

    componentDidMount() {
        if(this.levelRef){
            try{
                this.levelRef.scrollIntoView({behavior: 'auto', block: "center", inline: "center"});
            }catch(ignored){
                try{
                    this.levelRef.scrollIntoView();
                }catch(ign){}
            }

        }

    }

    selectLevelRef = (div) => {
        this.levelRef = div;
    };


    render() {
        let levelList = [];

        let lastLevel = this.props.lastLevel;
        if(lastLevel === -1) lastLevel = 0;

        const addLevel = (i) => {
            const levelOnClick = (e) => {
                if(!this.props.canSwitchPage) {
                    e.preventDefault();
                    return;
                }
                this.props.chooseLevel(i);
                if(this.props.isSounds) openGameSound.play();
            };
            const levelSmall =  i > 99 ? ' levels__level_small' : '';

            let LevelComponent =
                <Link
                    to={'/game'}
                    className={'levels__level' + levelSmall}
                    onClick={levelOnClick}
                    key={'level' + i}
                >
                    {i + 1}
                </Link>;

            if(lastLevel < i){
                LevelComponent =
                    <div
                        className={'levels__level levels__level_close' + levelSmall}
                        key={'level' + i}
                    />
            } else if (i === lastLevel) {
                LevelComponent =
                    <Link
                        to={'/game'}
                        className={'levels__level levels__level_last' + levelSmall}
                        onClick={levelOnClick}
                        key={'level' + i}
                        ref={(div) => this.selectLevelRef(div)}
                    >
                        {i + 1}
                    </Link>;
            }
            return LevelComponent
        };
        if(window.innerWidth >= 600){
            let k = 0;
            let isReverse = false;
            levelList = [[], [], [], [], []];
            for (let i = 0; i < gameLevelsLength; i++) {
                levelList[k].push(addLevel(i));
                if(isReverse) k--;
                else k++;
                if(k === 5) {
                    k = 4;
                    isReverse = true;
                }else if(k === -1){
                    k = 0;
                    isReverse = false;
                }
            }

            return (
                <div className={'levels'}>
                    {levelList.map((levelsLine, i)=>(
                        <div
                            className={'levels__line'}
                            key={'line' + i}
                        >
                            {
                                levelsLine
                            }
                        </div>
                    ))}
                </div>
            );
        }
        for (let i = gameLevelsLength - 1; i >= 0; i--) {
            levelList.push(addLevel(i));
        }

        return (
            <div className={'levels'}>
                {levelList}
            </div>
        );

    }

}

export default connect(
    (store) => ({
        lastLevel: selectLastLevel(store),
        isSounds: selectSounds(store)
    }),
    (dispatch) => ({
        chooseLevel: (level) => dispatch(chooseLevel(level))
    }))(Levels);
