export const YM_METRIKA_ID = 67896859;

// Алгоритм случайного перемешивания массива
export const shuffle = (arr)=> {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
};
export const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

//Проверка уровня на проходимость

let canCompleteLevel = false;
let allStates = [];

function findAllPossibleMoves(arr){
    let moves = [];
    for(let i = 0; i < arr.length; i++){
        let color;
        let index;
        for(let q = 0; q < arr[i].length; q++){
            if(arr[i][q] !== null){
                index = q;
                color = arr[i][q];
                break;
            }
        }
        // console.log(i, index, color);
        if(color === undefined || color === null) continue;
        for(let q = 0; q < arr.length; q++){
            if(q === i) continue;
            //Кладём вниз колбы
            if(arr[q][arr[q].length-1] === null){
                moves.push([
                    [i, index], [q, arr[q].length-1]
                ])
            }else{
                if(arr[q][0] !== null) continue;
                for(let z = 1; z < arr[q].length; z++){
                    if(arr[q][z] === color){
                        moves.push([
                            [i, index], [q, z-1]
                        ])
                        break;
                    }else if(arr[q][z] !== null){
                        break;
                    }
                }
            }

        }
    }
    return moves;
}

function isLevelCompleted(arr){
    for(let i = 0; i < arr.length; i++){
        let color = arr[i][0];
        for(let q = 1; q < arr[i].length; q++){
            if(color !== arr[i][q]) return false;
        }
    }
    return true;

}

function copyArr(arr){
    let newArr = [];
    for(let i = 0; i < arr.length; i++){
        newArr.push([...arr[i]]);
    }
    return newArr;
}


function tryToComplete(arr){
    if(canCompleteLevel) return true;
    if(isLevelCompleted(arr)) {
        canCompleteLevel = true;
        return true;
    }
    // console.log('tryToComplete');
    let jsoned = JSON.stringify(arr);
    if(allStates.includes(jsoned)) return false;
    allStates.push(jsoned);

    const allMoves = findAllPossibleMoves(arr);
    // console.log(arr);
    // console.log('MOVES');
    // console.log(allMoves);
    for(let i = 0; i < allMoves.length; i++){
        let newArr = copyArr(arr);
        newArr[allMoves[i][1][0]][allMoves[i][1][1]] = newArr[allMoves[i][0][0]][allMoves[i][0][1]];
        newArr[allMoves[i][0][0]][allMoves[i][0][1]] = null;
        // console.log(newArr);
        if(tryToComplete(newArr, allMoves[i])) return true;
    }
    return false;
}


export function testLevelAbilityToComplete(obj, numEmptyTube){
    canCompleteLevel = false;
    allStates = [];


    let keys = Object.keys(obj);
    let arr = [];
    for(let i = 0; i < keys.length; i++){
        let ball = obj[keys[i]];
        if(!arr[ball.col]){
            arr[ball.col] = [];
        }
        arr[ball.col][ball.row] = ball.colorIndex;
    }
    let nullArr = [];
    for(let i = 0; i < arr[0].length; i++) nullArr.push(null);
    for(let i = 0; i < numEmptyTube; i++) arr.push(nullArr.slice());
    //Если уровень пройдег сразу  - false;
    if(isLevelCompleted(arr)) return false;

    let res = tryToComplete(arr);
    // console.log("RESULT: ", res);
    return canCompleteLevel;
}




export const gameLevels = [
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":1,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":0,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":1,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":0,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":1,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":0,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":1,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":0,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":1,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":0,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":1,"key":0},"1.0":{"row":1,"col":0,"colorIndex":1,"key":1},"2.0":{"row":2,"col":0,"colorIndex":0,"key":2},"0.1":{"row":0,"col":1,"colorIndex":0,"key":3},"1.1":{"row":1,"col":1,"colorIndex":1,"key":4},"2.1":{"row":2,"col":1,"colorIndex":0,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
];

export const getLevelInfo = (lvl) => {
    return gameLevels[lvl];
};

export const moneyPerLevel = 10;


const levelsHints = [
    [
    'Добро пожаловать в "Колбочки"! Цель игры - разместить все шары по колбам так, чтобы в каждой колбе были шары одного цвета.',
    'Вы можете перемещать только те шары, которые лежат сверху. Возьмите любой шар, нажав на колбу!',
    'А теперь положите его в пустую колбу!',
    'Шар можно переместить либо в пустую колбу, либо на шар этого же цвета.',
    'Возьмите верхний шар.',
    'Переместите его в нужную колбу - к шарам такого же цвета.',
    'Ура! А теперь самостоятельно завершите уровень, заполнив оставшуюся колбу.',
    'Уровень пройден! В игре вам встретится много уровней разной сложности. Попробуйте пройти все!'
        ]
    ,
    ['Любой ход можно отменить - нажмите на часы в правом верхнем углу. На этом уровне использование бесплатно.']

]

export function getLevelHints(level, step){
    return levelsHints[level][step];
}

