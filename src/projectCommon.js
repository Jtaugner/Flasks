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

export const gameLevels = [
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
    {"gameState":{"0.0":{"row":0,"col":0,"colorIndex":0,"key":0},"1.0":{"row":1,"col":0,"colorIndex":0,"key":1},"2.0":{"row":2,"col":0,"colorIndex":1,"key":2},"0.1":{"row":0,"col":1,"colorIndex":1,"key":3},"1.1":{"row":1,"col":1,"colorIndex":0,"key":4},"2.1":{"row":2,"col":1,"colorIndex":1,"key":5}},"numColors":2,"tubeHeight":3,"numEmptyTube":1},
];

export const getLevelInfo = (lvl) => {
    return gameLevels[lvl];
};

export const tipsCost = [1, 3, 3, 5];

