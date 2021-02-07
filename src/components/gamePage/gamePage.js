import React, { useState, useEffect } from "react";
import "./gamePage.scss";
import "rc-slider/assets/index.css";
import _ from "lodash";
import TopMenu from "../topMenu";
import MenuLink from "../menuLink/menuLink";
import Money from "../money/money";
import {connect} from "react-redux";
import {selectLevel} from "../../store/selectors";
import Levels from "../levels/levels";
import GameLevel from "../gameLevel/gameLevel";
import StartAgainButton from "./startAgainButton/startAgainButton";
import {getLevelInfo} from "../../projectCommon";
import EndGameWindow from "../endGameWindow/endGameWindow";
import {chooseLevel} from "../../store/ac";


const LEFT = { row: 0, col: -1 };
const RIGHT = { row: 0, col: 1 };
const DOWN = { row: 1, col: 0 };
const UP = { row: -1, col: 0 };

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

function GamePage(props) {
    const {level, chooseLevel} = props;

    let levelInfo = getLevelInfo(level);

    const [isWin, setIsWin] = useState(false);

    const [gameState, setGameState] = useState(levelInfo.gameState);

    let numColors = levelInfo.numColors;
    let tubeHeight = levelInfo.tubeHeight;
    let numEmptyTube = levelInfo.numEmptyTube;

    //Отладка - создание уровня - комментировать перед продом
    numColors = 8;
    tubeHeight = 3;
    numEmptyTube = 2;

    let nodes = _.chain(numColors)
        .range()
        .map(colorIndex => {
            return _.range(tubeHeight).map(() => colorIndex);
        })
        .flatten()
        .shuffle()
        .value();

    const createLevel = () => {
        if(!IS_CREATE_LEVEL) return;
        setSelectedNode(null);
        const positions = _.chain(numColors)
            .range()
            .map(col => {
                return _.range(tubeHeight).map(row => ({ row, col }));
            })
            .flatten()
            .value();

        let state = _.chain(positions)
            .map((position, index) => {
                return {
                    ...position,
                    colorIndex: nodes[index],
                    key: index
                };
            })
            .keyBy(hashPosition)
            .value();

        setGameState(state);
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
                const newState = { ...gameState };
                newState[selectedNode] = {
                    ...node,
                    col,
                    row: firstNode ? firstNode.row - 1 : tubeHeight - 1
                };
                setGameState(_.keyBy(newState, hashPosition));
                setHighNode(hashPosition(newState[selectedNode]));
                setTimeout(() => {
                    setHighNode(null);
                }, 200);
            } else {
                setHighNode(null);
            }
            setSelectedNode(null);
        } else if (firstNode) {
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
        setIsWin(true);
    }

    const nextGame = () => {
        const newLevel = level + 1;
        chooseLevel(newLevel)
        levelInfo = getLevelInfo(newLevel);
        setGameState(levelInfo.gameState);

        numColors = levelInfo.numColors;
        tubeHeight = levelInfo.tubeHeight;
        numEmptyTube = levelInfo.numEmptyTube;

        setIsWin(false)
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
                    <Money/>
                </TopMenu>

                <div
                    className={'gamePage__tubes'}
                    style={{
                        width: flasksWidth,
                        height: getTubesBlockHeight()
                    }}
                >
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
                        </div>
                    ))}

                    {_.map(gameState, ({ row, col, colorIndex, key, locked }) => (
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
                            }}
                        />
                    ))}
                </div>

                {isWin?
                    <EndGameWindow
                        nextGame={nextGame}
                        addMoney={true}
                        level={level}
                    /> : ''}
            </div>
    );
}

export default connect(
    (store)=>({
        level: selectLevel(store)
    }),
    (dispatch)=>({
        chooseLevel: (level) => dispatch(chooseLevel(level))
    })

)(GamePage);