import React, { useState, useEffect } from "react";
import "./gamePage.scss";
import "rc-slider/assets/index.css";
import _ from "lodash";
import TopMenu from "../topMenu";
import MenuLink from "../menuLink/menuLink";
import Money from "../money/money";
import {connect} from "react-redux";
import {selectGameSDK, selectLastLevel, selectLevel, selectSounds} from "../../store/selectors";
import GameLevel from "../gameLevel/gameLevel";
import StartAgainButton from "./startAgainButton/startAgainButton";
import {gameLevels, getLevelHints, getLevelInfo, testLevelAbilityToComplete} from "../../projectCommon";
import EndGameWindow from "../endGameWindow/endGameWindow";
import {addMoney, chooseLevel, increaseLastLevel} from "../../store/ac";
import Hint from "../hint/hint";
import {ballSound, returnBackSound, sortSound, winSound} from "../../sounds";
import {giveParams, reachGoal} from "../../App";
import SkipLevel from "../skipLevel/skipLevel";
import SkipLevelWindow from "../skipLevelWindow/skipLevelWindow";



const colors = [
    "#d95e54",
    "#9be09d",
    "#e1dd7a",
    "#9e85d7",
    "#ddaf7e",
    "#85b5d7",
    "#40d6aa",
    "#7984ec",
    "#de9044",
    "#57b24d",
    "#e07ae1",
    "#a1a0a0",
    "#b3d646",
];

const tubeNumberToDivideLines = 6;

function getTubesWidthInLineWithTwoLines(tubesAmount) {
    if (tubesAmount < tubeNumberToDivideLines) return tubesAmount;
    let am = Math.round(tubesAmount/2);
    if(am < 5) return 5;
    return am;
}
function getNextLineNumberWithTwoLines(tubesAmount) {
    if (tubesAmount < tubeNumberToDivideLines) return 100;
    return Math.floor(tubesAmount/2);
}

const spaceBetweenTubes = 15;
const spaceBetweenBalls = 2;
const diffBetweenTubeAndBall = 10;


let flasksWidth;

function setFlaskWidth(){
    let height = window.innerHeight * 0.66;
    flasksWidth = window.innerWidth > 600 ? 600 : window.innerWidth
    if(height < flasksWidth) flasksWidth = height;
}

setFlaskWidth();
window.onresize = () => {
    setFlaskWidth();
};

const hashPosition = ({ row, col }) => row + '.' + col;


const IS_CREATE_LEVEL = true;

const ignoreBlackoutSteps = [1,2,4,5];
function testBlackoutHintStep(step, level){
    if(level >= 1) return  false;
    return ignoreBlackoutSteps.includes(step);
}

let isTeach = true;
//Внутри [ [String: key, Object: node obj] ... ]
let allGameMoves = [];



function GamePage(props) {
    const {
        level, lastLevel,
        addMoney, increaseLastLevel, chooseLevel,
        isSounds,
        gameSDK, showAdv, saveData
    } = props;

    let levelInfo = getLevelInfo(level);

    const [isWin, setIsWin] = useState(false);
    const [isAddMoney, setIsAddMoney] = useState(false);

    //Для обучения
    const [isShowHint, setIsShowHint] = useState(false);
    const [hintMessage, setHintMessage] = useState(false);


    const [teaching, setTeaching] = useState(false);
    const [teachingStep, changeTeachingStep] = useState(0);


    const [isShowSkipWindow, setIsShowSkipWindow] = useState(false);

    const [gameState, setGameState] = useState(levelInfo.gameState);





    let numColors = levelInfo.numColors;
    let tubeHeight = levelInfo.tubeHeight;
    let numEmptyTube = levelInfo.numEmptyTube;

    const getInfo = () => {
        const info = {};
        info.tubesAmount = numColors + numEmptyTube;

        info.tubesInLine = getTubesWidthInLineWithTwoLines(info.tubesAmount);
        info.nextLineTubeNumber = getNextLineNumberWithTwoLines(info.tubesAmount);
        info.tubesInFirstLine = info.nextLineTubeNumber;
        info.tubesInSecondLine = info.tubesAmount - info.tubesInFirstLine;
        info.flasksWidth = flasksWidth;

        info.tubeWidth = (flasksWidth - spaceBetweenTubes * (info.tubesInLine + 1)) / info.tubesInLine;
        if(window.innerWidth > 600 && window.innerHeight < 1100 && tubeNumberToDivideLines <= info.tubesAmount &&
            info.tubeWidth * tubeHeight * 2 > window.innerHeight * 0.6 ){

            info.flasksWidth = window.innerHeight * 0.6;
            info.tubeWidth = (window.innerHeight * 0.6  - spaceBetweenTubes * (info.tubesInLine + 1)) / info.tubesInLine;
        }else if(info.tubeWidth * tubeHeight > window.innerHeight * 0.55 && (numColors + numEmptyTube <= 3)){
            info.flasksWidth = window.innerHeight * 0.5;
            info.tubeWidth = (window.innerHeight * 0.5  - spaceBetweenTubes * (info.tubesInLine + 1)) / info.tubesInLine;
        }
        info.ballWidth = info.tubeWidth - diffBetweenTubeAndBall;
        info.tubeHeightPx = tubeHeight * info.ballWidth + 10;
        info.firstLineSpace = 0;
        info.secondLineSpace = 0;

        if (tubeNumberToDivideLines <= info.tubesAmount) {
            info.firstLineSpace = (flasksWidth - info.tubesInFirstLine * info.tubeWidth - spaceBetweenTubes * (info.tubesInFirstLine + 2)) / 2;
            info.secondLineSpace = (flasksWidth - info.tubesInSecondLine * info.tubeWidth - spaceBetweenTubes * (info.tubesInSecondLine + 2)) / 2;
            if(info.firstLineSpace < 0) info.firstLineSpace = 0;
            if(info.secondLineSpace < 0) info.secondLineSpace = 0;
        }
        info.nextLineTop = info.tubeHeightPx + 50;

        return info;
    }

    const [infoAboutInterface, setInfoAboutInterface] = useState(getInfo());


    const changeLevel = () => {
        allGameMoves = [];
        if(level <= 1){
            setIsShowHint(true);
        }
        if(level === 0){
            setTeaching(true);
        }

    };


    const closeHint = () => {
        setHintMessage(false);
        if(level === 1 && teachingStep === 0){
            changeTeachingStep(1);
            return;
        }
        if(level >= 1) setIsShowHint(false);
        if(testBlackoutHintStep(teachingStep)) return;


        const step = teachingStep + 1;
        if(step >= 7) setIsShowHint(false);
        changeTeachingStep(step);
        if(step === 8){
            isTeach = false;
            setTeaching(false);
            testWin();
        }
    }




    //Отладка - создание уровня - комментировать перед продом
    // if(IS_CREATE_LEVEL){
    //     numColors = 4;
    //     tubeHeight = 5;
    //     numEmptyTube = 1;
    // }
    //
    //
    // let nodes;
    // let levels = [];
    //
    //
    // const createLevel = () => {
    //     if(!IS_CREATE_LEVEL) return;
    //
    //     nodes = _.chain(numColors)
    //         .range()
    //         .map(colorIndex => {
    //             return _.range(tubeHeight).map(() => colorIndex);
    //         })
    //         .flatten()
    //         .shuffle()
    //         .value();
    //
    //
    //     const positions = _.chain(numColors)
    //         .range()
    //         .map(col => {
    //             return _.range(tubeHeight).map(row => ({ row, col }));
    //         })
    //         .flatten()
    //         .value();
    //     const state =  _.chain(positions)
    //         .map((position, index) => {
    //             return {
    //                 ...position,
    //                 colorIndex: nodes[index],
    //                 key: index
    //             };
    //         })
    //         .keyBy(hashPosition)
    //         .value();
    //
    //     localStorage.setItem('tubeState', JSON.stringify({
    //         gameState: state,
    //         numColors,
    //         tubeHeight,
    //         numEmptyTube
    //     }))
    //
    //
    //     if(testLevelAbilityToComplete(state, numEmptyTube)){
    //         levels.push({
    //             gameState: state,
    //             numColors,
    //             tubeHeight,
    //             numEmptyTube
    //         });
    //         // setGameState(state);
    //         // setSelectedNode(null);
    //     }else{
    //         console.log("BAD LEVEL");
    //         createLevel();
    //     }
    //
    //
    // };
    //
    // const getRandEmpty = () => {
    //     let rand = Math.random();
    //     if(rand > 0.7) return 2;
    //     return 1;
    // }
    // if(IS_CREATE_LEVEL){
    //
    //     for(let i = 0; i < 200; i++){
    //         numColors = Math.floor(Math.random() * 4) + 8;
    //         tubeHeight = 4;
    //         numEmptyTube = getRandEmpty();
    //         if(numColors === 11) numEmptyTube = 1;
    //         // if(numColors < 5){
    //         //     tubeHeight = 4;
    //         //     numEmptyTube = 1;
    //         // }
    //         // console.log('num: ', numColors);
    //         createLevel();
    //     }
    // }
    //
    // localStorage.setItem('allLevelsTubes', JSON.stringify(levels).slice(1));

    // useEffect(createLevel, [numColors, tubeHeight, numEmptyTube]);
    //Конец создания уровня






    const [selectedNode, setSelectedNode] = useState(null);
    const [highNode, setHighNode] = useState(null);

    useEffect(()=>{
        testWin();
    }, [gameState])




    const findColNodes = col => {
        return _.chain(gameState)
            .filter(node => node.col === col)
            .sortBy("row")
            .value();
    };




    const onClickTube = col => () => {
        const colNodes = findColNodes(col);
        const firstNode = colNodes[0];
        const node = gameState[selectedNode];


        if(isSounds && (node || firstNode)){
            ballSound.play();
        }


        if (node) {
            if (node.col === col) {
                setHighNode(null);
            } else if (
                !firstNode ||
                (colNodes.length < tubeHeight &&
                    firstNode.colorIndex === node.colorIndex)
            ) {

                allGameMoves.push([selectedNode, node]);

                const newState = { ...gameState };
                newState[selectedNode] = {
                    ...node,
                    col,
                    row: firstNode ? firstNode.row - 1 : tubeHeight - 1
                };
                setGameState(_.keyBy(newState, hashPosition));
                setHighNode(hashPosition(newState[selectedNode]));
                if(teaching && teachingStep < 7){
                    changeTeachingStep(teachingStep + 1);
                }
                setTimeout(() => {
                    setHighNode(null);
                }, 100);


            } else {
                if(level > 0 && level < 4){
                    changeTeachingStep(100);
                    setIsShowHint(true);
                    setHintMessage('Шар можно переместить либо в пустую колбу, либо на шар такого же цвета.');
                }
                setHighNode(null);
            }
            setSelectedNode(null);
        } else if (firstNode) {


            if(teaching){
                if(teachingStep === 1){
                    changeTeachingStep(2);
                }else if(teachingStep === 4){
                    if(firstNode.row !== 0) return;
                    changeTeachingStep(5);
                }
            }


            setSelectedNode(hashPosition(firstNode));
            setHighNode(hashPosition(firstNode));
        } else {
            setSelectedNode(null);
            setHighNode(null);
        }

        testWin();

    };
    // const solveLevel = () => {
    //     const moves = testLevelAbilityToComplete(gameLevels[level].gameState, gameLevels[30].numEmptyTube);
    //     for(let i = 0; i < moves.length; i++){
    //         setTimeout(()=>{
    //             document.querySelectorAll('.gamePage__tube')[moves[i][0][0]].click()
    //             setTimeout(()=>{
    //                 document.querySelectorAll('.gamePage__tube')[moves[i][1][0]].click()
    //             }, 400);
    //         }, i * 700 + 5000)
    //
    //     }
    //
    //
    // };












    useEffect(() => {
        changeLevel();
        showAdv();

        setInfoAboutInterface(getInfo());
        // solveLevel();
    }, [level])







    const getCursorType = (col) => {
      if(selectedNode === null) return 'pointer';
      const colNodes = findColNodes(col);
      const firstNode = colNodes[0];
      const selectedNodeInfo = gameState[selectedNode];
      //Если шар нельзя положить в эту колбу - показываем дефолтный курсор
      if(firstNode &&
          (firstNode.row === 0 || firstNode.colorIndex !== selectedNodeInfo.colorIndex)
        ) return 'default';

      return 'pointer';

    };

    const getTubeLeft = (col) => {
        if(col < infoAboutInterface.nextLineTubeNumber){
            return col * infoAboutInterface.tubeWidth + spaceBetweenTubes*(col+1) + infoAboutInterface.firstLineSpace;
        }
        return (col-infoAboutInterface.nextLineTubeNumber) * infoAboutInterface.tubeWidth + spaceBetweenTubes*(col-infoAboutInterface.nextLineTubeNumber+1) + infoAboutInterface.secondLineSpace
    };

    const getBallLeft = (col) => {
        if(col < infoAboutInterface.nextLineTubeNumber){
            return col * infoAboutInterface.tubeWidth + spaceBetweenTubes*(col+1) + diffBetweenTubeAndBall/2 + infoAboutInterface.firstLineSpace;
        }
        return (col-infoAboutInterface.nextLineTubeNumber) * infoAboutInterface.tubeWidth + spaceBetweenTubes*(col-infoAboutInterface.nextLineTubeNumber+1) + diffBetweenTubeAndBall/2 + infoAboutInterface.secondLineSpace
    };

    const getTubesBlockHeight = () => {
        if(tubeNumberToDivideLines <= infoAboutInterface.tubesAmount){
            return infoAboutInterface.tubeHeightPx + infoAboutInterface.nextLineTop + 40;
        }
        return infoAboutInterface.tubeHeightPx + 20
    };


    const startAgain = () => {
        if(level === 0) return;
        allGameMoves = [];
        if(isSounds){
            sortSound.play();
        }
        setSelectedNode(null);
        setHighNode(null);
        setGameState(levelInfo.gameState);

        showAdv();
    }

    const testWin = () => {
        let balls = Object.keys(gameState);
        const ballsInTubes = {};
        for(let i = 0; i < balls.length; i++){
            let ballState = gameState[balls[i]];
            if(ballsInTubes[ballState.colorIndex] !== undefined){
                if(ballsInTubes[ballState.colorIndex] !== ballState.col) return false;
            }else{
                ballsInTubes[ballState.colorIndex] = ballState.col;
            }
        }
        //Выиграть уровень
        console.log("WON");

        if(teaching && teachingStep === 7 && isTeach) {
            setIsShowHint(true);
            return;
        }

        setIsWin(true);
        if(isSounds){
            winSound.play();
        }

        if(level === lastLevel) {
            const newLevel = lastLevel + 1;
            increaseLastLevel(newLevel);
            setIsAddMoney(true);
            addMoney();

            if(newLevel === 9){reachGoal('level10')}
            else if(newLevel === 49){reachGoal('level50')}
            else if(newLevel === 99){reachGoal('level100')}
            else if(newLevel === 199){reachGoal('level200')}
            saveData();
        }else{
            setIsAddMoney(false);
        }


    }

    const nextGame = () => {
        //Переходим на следующий уровень
        allGameMoves = [];
        changeTeachingStep(0);
        const newLevel = level + 1;
        chooseLevel(newLevel)
        levelInfo = getLevelInfo(newLevel);
        setGameState(levelInfo.gameState);

        numColors = levelInfo.numColors;
        tubeHeight = levelInfo.tubeHeight;
        numEmptyTube = levelInfo.numEmptyTube;

        showAdv();

        setIsWin(false)
    }

    const returnBack = () => {
        if(allGameMoves.length === 0 || level === 0) return;
        setSelectedNode(null);
        setHighNode(null);

        const lastMove = allGameMoves.pop();

        const newState = { ...gameState };

        //Убираем последний ход
        const keys = Object.keys(newState);
        const key = lastMove[1].key;


        for(let i = 0; i < keys.length; i++){
            if(newState[keys[i]].key === key){
                delete newState[keys[i]];
                break;
            }
        }

        //Возвращаем предпоследний ход
        newState[lastMove[0]] = lastMove[1];

        setGameState(newState);

        if(isSounds){
            returnBackSound.play();
        }

    }


    const isShowBallHand = (col, row) => {
        if(!teaching) return false;
        return (teachingStep === 1 || teachingStep === 4) && row === 0 ;
    }

    const isShowTubeHand = (col) => {
        if(!teaching) return false;
        if(teachingStep === 2 && col === 2) return true;
        if(teachingStep === 5){
            if(!highNode) return false;
            let selectedCol = Number(highNode[2]);
            if(
                (selectedCol === 0 && col === 1) ||
                (selectedCol === 1 && col === 0)   ) return true;
        }
        return false;

    }

    const isShowBall = (col, row, pos) => {
        if(!teaching) return false;
        return ( (teachingStep === 1 || teachingStep === 4) && row === 0 ) ||
            ( (teachingStep === 2 || teachingStep === 5) && pos);

    }

    const getBlackoutClasses = () => {
        return "blackout hintBlackout " + (testBlackoutHintStep(teachingStep, level) ? 'hintBlackout_noPointers' : '');
    }

    const skipLevel = () => {
        try{
            gameSDK.adv.showRewardedVideo({
                callbacks: {
                    onRewarded: () => {
                        console.log('rewarded');
                        giveParams({'skipLevel': lastLevel});
                        increaseLastLevel(lastLevel+1);
                        setIsShowSkipWindow(false);
                        setIsAddMoney(false);
                        setIsWin(true);
                    }
                }
            });
        }catch(e){console.log(e);}

    }


    const changeSkipLevel = () => {
        setIsShowSkipWindow(!isShowSkipWindow);
    }

    return (
            <div
                className="gamePage"
                tabIndex="0"
            >
                <TopMenu>
                    <MenuLink/>
                    <StartAgainButton onClick={startAgain}/>
                    <GameLevel level={level}/>
                    <Money onClick={returnBack} allGameMoves={allGameMoves} level={level}/>
                </TopMenu>



                {isShowHint ? <div className={getBlackoutClasses()} onClick={closeHint}/> : ''}

                <div
                    className={'gamePage__tubes ' + (tubeNumberToDivideLines <= infoAboutInterface.tubesAmount ? 'gamePage__tubes_twoLines' : '')}
                    style={{
                        width: infoAboutInterface.flasksWidth,
                        height: getTubesBlockHeight()
                    }}
                >

                    {isShowHint ? <Hint
                        message={hintMessage || getLevelHints(level, teachingStep)}
                        isBottomHint={teachingStep === 2 || teachingStep === 5}
                    /> : ''}


                    {_.range(infoAboutInterface.tubesAmount).map(col => (
                        <div
                            className={'gamePage__tube'}
                            key={`tube-${col}`}
                            onClick={onClickTube(col)}
                            style={{
                                width: infoAboutInterface.tubeWidth,
                                height: infoAboutInterface.tubeHeightPx,
                                left: getTubeLeft(col),
                                top: col < infoAboutInterface.nextLineTubeNumber ? 0 : infoAboutInterface.nextLineTop,
                                cursor: getCursorType(col)
                            }}
                        >
                            <div
                                className="gamePage__tube-putty"
                                style={{
                                    width: infoAboutInterface.tubeWidth - 4
                                }}

                            />
                            <div
                                className={'gamePage__tube_top'}
                                style={{
                                    borderRadius: 15,
                                    width: infoAboutInterface.tubeWidth+12,
                                    height: 18,
                                    left: -8,
                                    top: -17
                                }}
                            >

                            </div>
                            {isShowTubeHand(col) ?  <div className="hand hand_tube" /> : ''}
                        </div>
                    ))}

                    {_.map(gameState, ({ row, col, colorIndex, key }) => (
                        <div
                            className={'gamePage__ball'}
                            key={key}
                            style={{
                                background: colors[colorIndex],
                                width: infoAboutInterface.ballWidth,
                                height: infoAboutInterface.ballWidth,
                                left: getBallLeft(col),
                                top:
                                    hashPosition({ row, col }) === highNode
                                        ?  -infoAboutInterface.ballWidth + (col < infoAboutInterface.nextLineTubeNumber ? 0 : infoAboutInterface.nextLineTop)
                                        : (row) * infoAboutInterface.ballWidth + spaceBetweenBalls + 5 + (col < infoAboutInterface.nextLineTubeNumber ? 0 : infoAboutInterface.nextLineTop),
                                zIndex: isShowBall(col, row, hashPosition({ row, col }) === highNode) ? 4
                                    : (col < infoAboutInterface.nextLineTubeNumber ? 3 : 4)
                            }}
                        >
                            {isShowBallHand(col, row) ?  <div className="hand" /> : ''}
                        </div>
                    ))}
                </div>

                {lastLevel === level ? <SkipLevel onClick={changeSkipLevel} /> : ''}
                {isShowSkipWindow ? <SkipLevelWindow closeWindow={changeSkipLevel} skipLevel={skipLevel}/> : ''}


                {isWin?
                    <EndGameWindow
                        nextGame={nextGame}
                        isAddMoney={isAddMoney}
                        level={level}
                    /> : ''}
            </div>
    );
}

export default connect(
    (store)=>({
        level: selectLevel(store),
        lastLevel: selectLastLevel(store),
        isSounds: selectSounds(store),
        gameSDK: selectGameSDK(store)
    }),
    (dispatch)=>({
        chooseLevel: (level) => dispatch(chooseLevel(level)),
        addMoney: () => dispatch(addMoney()),
        increaseLastLevel: () => dispatch(increaseLastLevel())
    })

)(GamePage);