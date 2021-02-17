import React, { useState, useEffect } from "react";
import "./gamePage.scss";
import "rc-slider/assets/index.css";
import _ from "lodash";
import TopMenu from "../topMenu";
import MenuLink from "../menuLink/menuLink";
import Money from "../money/money";
import {connect} from "react-redux";
import {selectLastLevel, selectLevel} from "../../store/selectors";
import GameLevel from "../gameLevel/gameLevel";
import StartAgainButton from "./startAgainButton/startAgainButton";
import {getLevelHints, getLevelInfo, testLevelAbilityToComplete} from "../../projectCommon";
import EndGameWindow from "../endGameWindow/endGameWindow";
import {addMoney, chooseLevel, increaseLastLevel} from "../../store/ac";
import Hint from "../hint/hint";



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


const IS_CREATE_LEVEL = false;

const ignoreBlackoutSteps = [1,2,4,5];
function testBlackoutHintStep(step){
    return ignoreBlackoutSteps.includes(step);
}

let isTeach = true;
//Внутри [ [String: key, Object: node obj] ... ]
let allGameMoves = [];

function GamePage(props) {
    const {
        level, lastLevel,
        addMoney, increaseLastLevel, chooseLevel
    } = props;

    let levelInfo = getLevelInfo(level);

    const [isWin, setIsWin] = useState(false);
    const [isAddMoney, setIsAddMoney] = useState(false);

    //Для обучения
    const [isShowHint, setIsShowHint] = useState(false);
    const [teaching, setTeaching] = useState(false);
    const [teachingStep, changeTeachingStep] = useState(0);

    const [gameState, setGameState] = useState(levelInfo.gameState);

    let numColors = levelInfo.numColors;
    let tubeHeight = levelInfo.tubeHeight;
    let numEmptyTube = levelInfo.numEmptyTube;


    const getTeaching = () => {
        if(level <= 1){
            setIsShowHint(true);
        }
        if(level === 0){
            setTeaching(true);
        }

    };

    useEffect(getTeaching, [level]);

    const closeHint = () => {
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
    // numColors = 2;
    // tubeHeight = 3;
    // numEmptyTube = 1;

    let nodes;


    const createLevel = () => {
        if(!IS_CREATE_LEVEL) return;

        nodes = _.chain(numColors)
            .range()
            .map(colorIndex => {
                return _.range(tubeHeight).map(() => colorIndex);
            })
            .flatten()
            .shuffle()
            .value();


        const positions = _.chain(numColors)
            .range()
            .map(col => {
                return _.range(tubeHeight).map(row => ({ row, col }));
            })
            .flatten()
            .value();
        const state =  _.chain(positions)
            .map((position, index) => {
                return {
                    ...position,
                    colorIndex: nodes[index],
                    key: index
                };
            })
            .keyBy(hashPosition)
            .value();

        localStorage.setItem('tubeState', JSON.stringify({
            gameState: state,
            numColors,
            tubeHeight,
            numEmptyTube
        }))
        if(testLevelAbilityToComplete(state, numEmptyTube)){
            setGameState(state);
            setSelectedNode(null);
        }else{
            console.log("BAD LEVEL");
            createLevel();
        }


    };

    useEffect(createLevel, [numColors, tubeHeight, numEmptyTube]);
    //Конец создания уровня






    const [selectedNode, setSelectedNode] = useState(null);
    const [highNode, setHighNode] = useState(null);

    useEffect(()=>{
        console.log('use');
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
                }, 200);


            } else {
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














    const tubesAmount = numColors + numEmptyTube;

    const tubesInLine =  getTubesWidthInLineWithTwoLines(tubesAmount);
    const nextLineTubeNumber =  getNextLineNumberWithTwoLines(tubesAmount);
    const tubesInFirstLine = nextLineTubeNumber;
    const tubesInSecondLine = tubesAmount - tubesInFirstLine;

    const tubeWidth = (flasksWidth - spaceBetweenTubes * (tubesInLine+1))/ tubesInLine;
    const ballWidth = tubeWidth - diffBetweenTubeAndBall;
    const tubeHeightPx = tubeHeight * ballWidth + 10;
    let firstLineSpace = 0;
    let secondLineSpace = 0;
    if(tubeNumberToDivideLines <= tubesAmount){
        firstLineSpace = (flasksWidth - tubesInFirstLine * tubeWidth - spaceBetweenTubes * (tubesInFirstLine + 2)) / 2;
        secondLineSpace = (flasksWidth - tubesInSecondLine * tubeWidth - spaceBetweenTubes * (tubesInSecondLine + 2)) / 2;
    }


    const nextLineTop = tubeHeightPx + 50;


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
        if(col < nextLineTubeNumber){
            return col * tubeWidth + spaceBetweenTubes*(col+1) + firstLineSpace
        }
        return (col-nextLineTubeNumber) * tubeWidth + spaceBetweenTubes*(col-nextLineTubeNumber+1) + secondLineSpace
    };

    const getBallLeft = (col) => {
        if(col < nextLineTubeNumber){
            return col * tubeWidth + spaceBetweenTubes*(col+1) + diffBetweenTubeAndBall/2 + firstLineSpace
        }
        return (col-nextLineTubeNumber) * tubeWidth + spaceBetweenTubes*(col-nextLineTubeNumber+1) + diffBetweenTubeAndBall/2 + secondLineSpace
    };

    const getTubesBlockHeight = () => {
        if(tubeNumberToDivideLines <= tubesAmount){
            return tubeHeightPx + nextLineTop + 40;
        }
        return tubeHeightPx + 20
    };


    const startAgain = () => {
        if(level === 0) return;
        setGameState(levelInfo.gameState);
    }

    const testWin = () => {
        let balls = Object.keys(gameState);
        const ballsInTubes = {};
        for(let i = 0; i < balls.length; i++){
            let ballState = gameState[balls[i]];
            if(ballsInTubes[ballState.colorIndex] !== undefined){
                if(ballsInTubes[ballState.colorIndex] !== ballState.col) return;
            }else{
                ballsInTubes[ballState.colorIndex] = ballState.col;
            }
        }
        //Выиграть уровень
        if(teaching && teachingStep === 7 && isTeach) {
            setIsShowHint(true);
            return;
        }

        setIsWin(true);
        if(level === lastLevel) {
            increaseLastLevel(lastLevel+1);
            setIsAddMoney(true);
            addMoney();
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
        return "blackout hintBlackout " + (testBlackoutHintStep(teachingStep) ? 'hintBlackout_noPointers' : '');
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
                    className={'gamePage__tubes'}
                    style={{
                        width: flasksWidth,
                        height: getTubesBlockHeight()
                    }}
                >

                    {isShowHint ? <Hint
                        message={getLevelHints(level, teachingStep)}
                        isBottomHint={teachingStep === 2 || teachingStep === 5}
                    /> : ''}


                    {_.range(tubesAmount).map(col => (
                        <div
                            className={'gamePage__tube'}
                            key={`tube-${col}`}
                            onClick={onClickTube(col)}
                            style={{
                                width: tubeWidth,
                                height: tubeHeightPx,
                                left: getTubeLeft(col),
                                top: col < nextLineTubeNumber ? 0 : nextLineTop,
                                cursor: getCursorType(col)
                            }}
                        >
                            <div
                                className="gamePage__tube-putty"
                                style={{
                                    width: tubeWidth - 4
                                }}

                            />
                            <div
                                className={'gamePage__tube_top'}
                                style={{
                                    borderRadius: 15,
                                    width: tubeWidth+12,
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
                                width: ballWidth,
                                height: ballWidth,
                                left: getBallLeft(col),
                                top:
                                    hashPosition({ row, col }) === highNode
                                        ?  -ballWidth + (col < nextLineTubeNumber ? 0 : nextLineTop)
                                        : (row) * ballWidth + spaceBetweenBalls + 5 + (col < nextLineTubeNumber ? 0 : nextLineTop),
                                zIndex: isShowBall(col, row, hashPosition({ row, col }) === highNode) ? 3
                                    : (col < nextLineTubeNumber ? 2 : 3)
                            }}
                        >
                            {isShowBallHand(col, row) ?  <div className="hand" /> : ''}
                        </div>
                    ))}
                </div>


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
    }),
    (dispatch)=>({
        chooseLevel: (level) => dispatch(chooseLevel(level)),
        addMoney: () => dispatch(addMoney()),
        increaseLastLevel: () => dispatch(increaseLastLevel())
    })

)(GamePage);