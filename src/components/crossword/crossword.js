import React, {Component} from 'react';
import './crossword.scss'
import {
    openNewLetterSound,
    openKeyboardSound, newWordSound, wrongWordSound,
    addLetterSound, deleteLetterSound
} from "../../sounds";


const pixelsPerLetters = 5;

function getLetterSize(length) {
    let width = window.innerWidth;
    if(width > 600) width = 570;
    else width = width - 10;
    return (
        width - width * 0.03 - pixelsPerLetters * (length - 1)
    ) / length;
}

function compareWords(word1, word2) {
    return word1.toLowerCase() === word2.toLowerCase();
}
function createPair(i1, i2){
    return i1 + '-' + i2;
}
let timeout, timeout2;
let canUseTip1 = true;
function useTip1() {
    canUseTip1 = false;
    setTimeout(()=>{
        canUseTip1 = 1;
    }, 1000);
}

let gameEnds = false;

class Crossword extends Component {
    letterSize = getLetterSize(this.props.levelWords[0].length);
    letterStyle = {
        width: this.letterSize + 'px',
        height: this.letterSize + 'px',
        fontSize: Math.floor(this.letterSize / 1.5) + 'px'
    };



    componentWillUnmount() {
        clearTimeout(timeout);
        clearTimeout(timeout2);
    }

    constructor(props) {
        super(props);
        this.state = this.getGameState();
    }

    setNewGameState(levelWords) {
        this.setState(this.getGameState(levelWords));
    }

    getGameState = (levelWords) => {
        let words = levelWords;
        if(!words) words = this.props.levelWords;
        this.letterSize = getLetterSize(words[0].length);
        this.letterStyle = {
            width: this.letterSize + 'px',
            height: this.letterSize + 'px',
            fontSize: Math.floor(this.letterSize / 1.5) + 'px'
        };
        let selectedCell = 0;
        if(!levelWords && this.props.levelProgress.length > 0){
            selectedCell = this.getNextOrPrevLetter(true, -1);
        }
        gameEnds = false;
        return {
            selectedCell: selectedCell,
            wrongWords: [],
            rightWords: [],
            newLetters: []
        };
    };

    selectedWordRef = (div, index) => {
        if (this.props.selectedWordIndex === index) this.props.changeWordRef(div);
    };


    wordOnclick = (wordIndex) => {
        clearTimeout(timeout2);
        if(this.props.usingTip){
            if(this.props.tipType === 1) return;
            else if(this.props.tipType === 2){
                if(
                    (this.props.openedKeyboardWords && this.props.openedKeyboardWords.includes(wordIndex))
                    || this.props.levelProgress[wordIndex] === true) return;
                this.props.addOpenedKeyboard(wordIndex);
                if(this.props.isSounds) openKeyboardSound.play();
                this.props.getTip();
                this.getFirstFreeCellInLine(wordIndex);
            }else if(this.props.tipType === 3){
                if(this.props.levelProgress[wordIndex] === true) return;
                this.props.levelProgress[wordIndex] = true;
                this.changeLevelProgress();
                this.addDoneWord(wordIndex);
                this.addRightWords([wordIndex]);
                this.getNextWordTimeout();
                this.props.getTip();
            }

        }
        this.props.changeSelectedWord(wordIndex);
    };

    getNextOrPrevLetter = (isNext, cell, wordIndex) => {
        let newIndex;
        if(cell !== undefined) newIndex = cell;
        else newIndex  = this.state.selectedCell;
        let line;
        if(wordIndex !== undefined) line = wordIndex;
        else line = this.props.selectedWordIndex;

        if(this.props.levelProgress[line] === true) return -1;
        if (isNext && newIndex < this.props.levelWords[0].length - 1) {
            for (let i = newIndex + 1; i < this.props.levelWords[0].length; i++) {
                if(this.props.levelProgress[line][i] === 0 ||
                    (!this.props.startFromFirstCell && this.props.levelProgress[line][i] !== 1)){
                    newIndex = i;
                    break;
                }
            }
        } else if (!isNext && newIndex > 0) {
            for (let i = newIndex - 1; i >= 0; i--) {
                if (this.props.levelProgress[line][i] !== 1) {
                    newIndex = i;
                    break;
                }
            }
        }
        return newIndex;
    };
    deletePrevLetter = () => {
        const newIndex = this.getNextOrPrevLetter(false);

        if (newIndex !== this.state.selectedCell) {
            this.setState({selectedCell: newIndex});

            this.props.levelProgress[this.props.selectedWordIndex][newIndex] = 0;
            this.changeLevelProgress();
        }
    };

    getFilledLetter = (index) => {
        if(this.props.levelProgress[index] === true) return -1;
        for (let i = this.props.levelWords[0].length - 1; i >= 0 ; i++) {
           if(this.props.levelProgress[index][i] !== 1) return i;
        }
        return -1;
    };
    setNextOrPrevLetter = (isNext, cell, wordIndex) => {
        let newIndex = this.getNextOrPrevLetter(isNext, cell, wordIndex);
        if(newIndex === -1) newIndex = this.getFilledLetter(wordIndex);
        if (newIndex !== this.state.selectedCell) {
            this.setState({selectedCell: newIndex})
        }
    };
    getNextWord = () => {
        let line = this.props.selectedWordIndex;
        const lastLine = this.props.selectedWordIndex;
        for(let i = lastLine+ 1; i < this.props.levelProgress.length; i++) {
            if (this.props.levelProgress[i] !== true) {
                line = i;
                break;
            }
        }
        if(line === lastLine){
            for(let i = 0; i < lastLine; i++){
                if (this.props.levelProgress[i] !== true) {
                    line = i;
                    break;
                }
            }
        }

        this.props.changeSelectedWord(line);
        this.getFirstFreeCellInLine(line);
    };

    changeLevelProgress = () => {
        this.props.changeLevelProgress(this.props.levelProgress);
    };

    getNextWordTimeout = () => {
        timeout2 = setTimeout(()=>{
            this.getNextWord();
        }, 700);
    };

    testWordAndGetNext = (wordIndex, getFirstCell) => {
        let index;
        if(wordIndex !== undefined) index = wordIndex;
        else index = this.props.selectedWordIndex;


        if (this.testWord(index)) {
            this.addRightWords([index]);
            this.getNextWordTimeout();
        } else {
            let isWordDeleted = false;
            if (this.props.deleteWrongWord) {
                isWordDeleted = this.deleteWrongWord(index);
            }
            if(!isWordDeleted){
                if(getFirstCell){
                    this.getFirstFreeCellInLine(wordIndex);
                }else if(index === this.props.selectedWordIndex){
                    this.setNextOrPrevLetter(true);
                }
            }

        }
    };

    addRightWords = (rightWords) => {
        if(this.props.isSounds) newWordSound.play();
        this.setState({
            rightWords: rightWords
        });
        timeout = setTimeout(()=>{
            this.setState({
                rightWords: []
            });
        }, 1000);
    };

    testAllWords = () => {
        const rightWords = [];
        for(let i = 0; i < this.props.levelWords.length; i++){
            if (this.testWord(i)) {
                rightWords.push(i);
            } else {
                if (this.props.deleteWrongWord) {
                    this.deleteWrongWord(i);
                }
            }
        }
        if(rightWords.length > 0) this.addRightWords(rightWords);


    };
    testWin = () => {
        if(gameEnds) return;
        const progress = this.props.levelProgress;
        for(let i = 0; i < progress.length; i++){
            if(progress[i] !== true) return;
        }
        console.log('test win - true');
        gameEnds = true;
        return this.props.endGame();
    };

    addLetter = (letter) => {
        if ( this.state.selectedCell === -1
            || this.props.levelProgress[this.props.selectedWordIndex] === true
            || this.props.levelProgress[this.props.selectedWordIndex][this.state.selectedCell] === 1
            || this.state.wrongWords.length > 0 || this.state.rightWords.length > 0)
            return;

        if(letter === 0){
            if(this.props.isSounds) deleteLetterSound.play();
            if (this.props.levelProgress
                [this.props.selectedWordIndex]
                [this.state.selectedCell] === 0) {
                this.deletePrevLetter();
                return;
            }
        }

        this.props.levelProgress
            [this.props.selectedWordIndex]
            [this.state.selectedCell] = letter;
        this.changeLevelProgress();
        if (letter === 0) return;
        if(this.props.isSounds) addLetterSound.play();

        this.testWordAndGetNext();
    };
    getFirstFreeCellInLine(line){
        if(this.props.levelProgress[line] === true){
            this.setState({
                selectedCell: -1
            })
        } else if(this.props.levelProgress[line][0] !== 0){
            this.setNextOrPrevLetter(true, -1, line);
        }else{
            this.setState({
                selectedCell: 0
            })
        }
    }
    wordIndexChangedTrigger(line){
        this.getFirstFreeCellInLine(line);
    }
    deleteWrongWord(selectedWord) {
        let wordArray = this.props.levelProgress[selectedWord];
        if(wordArray === true) return false;
        for (let i = 0; i < wordArray.length; i++)
            if (wordArray[i] === 0) return false;
        this.setState({
            wrongWords: [selectedWord]
        });
        if(this.props.isSounds) wrongWordSound.play();
        timeout = setTimeout(() => {
            this.setState({
                wrongWords: []
            });
            wordArray = wordArray.map((el) => {
                if (el !== 1) return 0;
                return 1;
            });
            this.props.levelProgress[selectedWord] = wordArray;
            this.changeLevelProgress();
            this.getFirstFreeCellInLine(selectedWord);

        }, 500);
        return true;
    }

    selectLetter(wordIndex, letterIndex) {
        /* Подсказки */
        if(this.props.usingTip){
            if(this.props.tipType === 0
                && this.props.levelProgress[wordIndex] !== true
                && !(this.props.levelProgress[wordIndex][letterIndex] === 1)){
                this.props.levelProgress[wordIndex][letterIndex] = 1;


                this.changeLevelProgress();
                this.testWordAndGetNext(wordIndex, true);

                if(this.props.isSounds) openNewLetterSound.play();

                this.props.getTip();
            }

            return;
        }


        if(this.props.startFromFirstCell){
            this.getFirstFreeCellInLine(wordIndex);
        }else if (this.props.levelProgress[wordIndex] === true || this.props.levelProgress[wordIndex][letterIndex] === 1) {
            this.setState({
                selectedCell: -1
            })
        } else {
            this.setState({
                selectedCell: letterIndex
            })
        }

    };

    addDoneWord(selectedLine) {
        this.props.levelProgress[selectedLine] = true;
        this.changeLevelProgress();
        this.openLettersForNewWord();
        this.testWin();
    }

    testWord(selectedLine) {
        if(this.props.levelProgress[selectedLine] === true) return;

        let word = '';
        let wordProgress = this.props.levelProgress[selectedLine];
        for (let i = 0; i < wordProgress.length; i++) {
            if (wordProgress[i] === 0) return false;
            if (wordProgress[i] === 1) word += this.props.levelWords[selectedLine][i];
            else word += wordProgress[i];
        }
        this.props.showAdv();
        if (compareWords(word, this.props.levelWords[selectedLine])) {
            this.addDoneWord(selectedLine);
            return true;
        }


        return false
    };

    fillCellByIndex(wordIndex, letterIndex, letter) {
        if(this.props.levelProgress[wordIndex] === true) return letter;
        if (this.props.levelProgress.length === 0) return '';
        let cell = this.props.levelProgress[wordIndex][letterIndex];
        if (cell === 0) return '';
        if (cell === 1) return letter;
        return cell;
    }

    getLetterClasses(wordIndex, letterIndex) {
        return 'crossword__letter '
            + ((this.props.selectedWordIndex === wordIndex && this.state.selectedCell === letterIndex) ? ' crossword__letter_selected' : '')
            + (this.props.levelProgress.length !== 0 && (this.props.levelProgress[wordIndex] === true || this.props.levelProgress[wordIndex][letterIndex] === 1) ? ' crossword__letter_done' : '')
            + (this.state.newLetters.includes(createPair(wordIndex, letterIndex)) ? ' crossword__letter_new' : '')
    }

    getWordClasses(wordIndex) {
        return 'crossword__word'
            + (this.props.selectedWordIndex === wordIndex ?
                ' crossword__word_selected' : '')
            + (this.state.wrongWords.includes(wordIndex) ?
                ' crossword_word_wrong' : '')
            + (this.state.rightWords.includes(wordIndex) ?
                ' crossword__word_right' : '') ;
    }
    addNewLetters(array){
        for(let i = 0; i < array.length; i++){
            this.props.levelProgress[array[i][0]][array[i][1]] = 1;
            array[i] = createPair(array[i][0], array[i][1]);
        }
        this.changeLevelProgress();
        this.testAllWords();


        this.setState({
            newLetters: array
        });
        timeout = setTimeout( ()=>{
            this.setState({
                newLetters: []
            })
        }, 1000)
    }
    getFreeCells = (dontCountWordWithoutOneLetter) => {
        const progress = this.props.levelProgress;
        let allFreeCells = [];
        for(let i = 0; i < progress.length; i++){
            if(progress[i] === true) continue;
            const freeCells = [];
            for(let q = 0; q < progress[i].length; q++){
                if(progress[i][q] !== 1){
                    freeCells.push([i, q]);
                }
            }
            if(!dontCountWordWithoutOneLetter ||
                (dontCountWordWithoutOneLetter && freeCells.length > 1)){
                allFreeCells = [...allFreeCells, ...freeCells];
            }

        }
        return allFreeCells;
    };
    addRandomLetters = (freeCells, amount) => {
        let newLetters = [];
        if(freeCells.length <= amount){
            newLetters = freeCells;
        }else{
            for(let i = 0; i < amount; i++){
                const randCell = Math.floor(Math.random()*freeCells.length);

                newLetters.push(freeCells[randCell]);

                freeCells.splice(randCell, 1);
            }
        }
        this.addNewLetters(newLetters);
    };
    openLettersForNewWord = () => {
        const allFreeCells = this.getFreeCells(false);
        let amount = 0;
        if(this.props.levelWords[0].length >= 7){
            if(allFreeCells.length > 15) amount = 4;
            else if(allFreeCells.length > 5) amount = 2;
        }else{
            if(allFreeCells.length > 15) amount = 3;
            else if(allFreeCells.length > 10) amount = 2;
            else if(allFreeCells.length > 5) amount = 1;
        }
        this.addRandomLetters(allFreeCells, amount);
    };
    crosswordOnClick = () => {
        if(this.props.usingTip && this.props.tipType === 1 && canUseTip1){
            //Ищем все свободные клетки
            const allFreeCells = this.getFreeCells(false);

            this.addRandomLetters(allFreeCells, 5);


            if(this.props.isSounds) openNewLetterSound.play();
            this.props.getTip();
            useTip1();
        }

    };

    render() {
        return (
            <div className={'crossword-wrapper'} onClick={this.crosswordOnClick}>
                <div className={'crossword'}>
                    {
                        this.props.levelWords.map((word, wordIndex) => {
                            return <div
                                className={this.getWordClasses(wordIndex)}
                                ref={(div) => this.selectedWordRef(div, wordIndex)}
                                key={word}
                                onClick={() => this.wordOnclick(wordIndex)}
                            >
                                {
                                    word.split('').map((letter, letterIndex) => {
                                        return <div
                                            onClick={() => this.selectLetter(wordIndex, letterIndex)}
                                            className={this.getLetterClasses(wordIndex, letterIndex)}
                                            style={this.letterStyle}
                                            key={word + letterIndex}
                                        >


                                            {this.fillCellByIndex(wordIndex, letterIndex, letter).toUpperCase()}
                                        </div>
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }

}

export default Crossword;