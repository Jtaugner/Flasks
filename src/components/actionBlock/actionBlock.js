import React, {Component} from 'react';
import './actionBlock.scss'
import {getLevelWordsDescription} from "../../projectCommon";
import Keyboard from "./keyboard/keyboard";
import StartGameBlock from "./startGameBlock/startGameBlock";

function getWordDescriptionFontSize(desc) {
    if(window.innerWidth > 600) return 16;
    const l = desc.length;
    let font = 17;

    for(let i = 21; i < l; i += 10){
        font--;
    }
    if(font < 12) return 12;
    return font;
}


const lettersTranslitMap = {
    'q' : 'й', 'w' : 'ц', 'e' : 'у', 'r' : 'к', 't' : 'е', 'y' : 'н', 'u' : 'г', 'i' : 'ш', 'o' : 'щ', 'p' : 'з', '[' : 'х', ']' : 'ъ', 'a' : 'ф', 's' : 'ы', 'd' : 'в', 'f' : 'а', 'g' : 'п', 'h' : 'р', 'j' : 'о', 'k' : 'л', 'l' : 'д', ';' : 'ж', '\'' : 'э', 'z' : 'я', 'x' : 'ч', 'c' : 'с', 'v' : 'м', 'b' : 'и', 'n' : 'т', 'm' : 'ь', ',' : 'б', '.' : 'ю'
};

function deletePoint(exp) {
    try{
        if(exp[exp.length-1] === "."){
            return exp.substr(0, exp.length-1);
        }
    }catch(ignored){}
    return  exp;

}

class ActionBlock extends Component{



    changeWord = (word) => {
        this.props.changeSelectedWord(word);
    };

    changeWordDownOnclick = () => {
        for(let i = this.props.selectedWordIndex + 1; i < this.props.levelWords.length; i++){
            if(this.props.progress[i] !== true) return this.changeWord(i);
        }
        for(let i = 0; i < this.props.selectedWordIndex; i++){
            if(this.props.progress[i] !== true) return this.changeWord(i);
        }
    };
    changeWordUpOnclick = () => {
        for(let i = this.props.selectedWordIndex - 1; i >= 0; i--){
            if(this.props.progress[i] !== true) return this.changeWord(i);
        }
        for(let i = this.props.levelWords.length-1; i > this.props.selectedWordIndex; i--){
            if(this.props.progress[i] !== true) return this.changeWord(i);
        }
    };


    componentDidMount() {
        document.addEventListener("keydown", this.onKeyPressed);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed);
    }

    onKeyPressed = (e) => {
        if(e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        let letter = e.key.toLowerCase();
        if(lettersTranslitMap[letter]) letter = lettersTranslitMap[letter];
        if(letter.length === 1 && /[а-я]/.test(letter)){
            if(!this.props.openedKeyboard ||
                (this.props.openedKeyboard && this.props.selectedWord.includes(letter.toUpperCase()))){

                this.props.addLetterToCrossWord(letter);
            }
        }else if(letter === 'backspace' || letter === 'delete'){
            this.props.addLetterToCrossWord(0);
        }else if(letter === 'arrowup'){
            this.changeWordUpOnclick();
        }else if(letter === 'arrowdown' || letter === 'enter'){
            this.changeWordDownOnclick();
        }else if(letter === 'escape'){
            this.props.switchOffTip();
        }

    };
    render(){
        const wordDescription = deletePoint(getLevelWordsDescription(this.props.level, this.props.selectedWordIndex));
        return (
            <div
                className={'actionBlock'}
                onKeyDown={this.onKeyPressed}
            >
                <div className="actionBlock__interaction">
                    <div
                        className="actionBlock__changeWord actionBlock__changeWord-down"
                        onClick={this.changeWordDownOnclick}

                    />
                    <span
                        className="actionBlock__wordDescription"
                        style={{fontSize: getWordDescriptionFontSize(wordDescription)}}
                    >
                    {wordDescription}

                </span>
                    <div
                        className="actionBlock__changeWord actionBlock__changeWord-up"
                        onClick={this.changeWordUpOnclick}
                    />
                </div>

                {this.props.isDoneLevel ?
                    <StartGameBlock startLevelAgain={this.props.startLevelAgain} /> :
                    <Keyboard
                    addLetterToCrossWord={this.props.addLetterToCrossWord}
                    openedKeyboard={this.props.openedKeyboard}
                    selectedWord={this.props.selectedWord}
                />}



                {this.props.usingTip ? <div className="innerBlackout" /> : ''}
            </div>
        );
    }

}

export default ActionBlock;
