import React, {useState} from 'react';
import './keyboard.scss'
import {isPhone} from "../../../projectCommon";

const letters = [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"]
];
const pixelsPerLetters = 3;
const softSign = 'ь';
const hardSign = 'ъ';

let rememberedLetter;

let isLetterStarted = false;

let letterTimeout;
let width = window.innerWidth;
if(width > 800) width = 800;


function Keyboard(props) {
    const {addLetterToCrossWord} = props;
    const selectedWord = props.selectedWord.toLowerCase();
    const letterSize = (
        (width- 16) - pixelsPerLetters * (10)) / 11;

    const [isLetterClicked, changeIsLetterClicked] = useState('');
    const [isChangedSoftSign, changeSoftSign] = useState(false);


    const letterOnStart = (letter) => {
        changeIsLetterClicked(letter);
        if(props.openedKeyboard){
            letter = letter === softSign ? chooseSoftLetter(letter) : letter;
            if(!selectedWord.includes(letter)) return;
        }

        isLetterStarted = true;
        rememberedLetter = letter;

        //Для твёрдого знака
        //При удерживании мягкого знака он заменяется на твёрдый
        if (letter === softSign ) {
            if(props.openedKeyboard && !selectedWord.includes(hardSign)) return;
            letterTimeout = setTimeout(()=>{
                rememberedLetter = hardSign;
                changeSoftSign(true);

            }, 450);
        }

    };
    const letterOnStartDesktop = (letter) => {
        if (!isPhone) letterOnStart(letter);
    };
    const letterOnStartPhone = (letter) => {
        if (isPhone) letterOnStart(letter);
    };

    const letterOnEnd = () => {
        clearTimeout(letterTimeout);
        changeIsLetterClicked('');
        changeSoftSign(false);

        if(!isLetterStarted) return;
        isLetterStarted = false;
        addLetterToCrossWord(rememberedLetter);
    };

    const deleteLetter = () => {
      addLetterToCrossWord(0);
    };

    const chooseSoftLetter = () => {
        if(props.openedKeyboard){
            let includesHard = selectedWord.includes(hardSign);
            let includesSoft = selectedWord.includes(softSign);
            if(!(includesHard && includesSoft)){
                if(includesHard) return hardSign;
                return softSign
            }

        }
        return isChangedSoftSign ? hardSign : softSign;
    };

    const getKeyboardClasses = (letter) => {
        let isSameLetter = isLetterClicked === letter;
        if(letter === softSign && isLetterClicked === hardSign){
            isSameLetter = true;
        }
        let classes = 'keyboard__letter'
            + (isSameLetter? ' keyboard__letter_selected' : '');
        if(props.openedKeyboard && !selectedWord.includes(letter)){
            if(letter === softSign && selectedWord.includes(hardSign)) return classes;
            classes += ' keyboard__letter_notVisible'
        }
        return classes;
    };
    const getLetterTipSize = () => {
        let size = letterSize * 1.5;
        if(size > 75) return 75 + 'px';
        return size + 'px';
    };

    return (
        <div
            className={'keyboard'}
        >
            {
                letters.map((line, index) =>
                    <div
                        className="keyboard__line"
                        key={'line' + index}
                    >
                        {
                            line.map((letter) =>
                                <div
                                    className={getKeyboardClasses(letter)}


                                    onTouchStart={() => letterOnStartPhone(letter)}
                                    onMouseDown={() => letterOnStartDesktop(letter)}

                                    onMouseUp={letterOnEnd}
                                    onTouchEnd={letterOnEnd}
                                    onTouchCancel={letterOnEnd}

                                    style={{width: letterSize + 'px'}}
                                    key={'letter' + letter}
                                >
                                    {letter === softSign ? chooseSoftLetter(letter) : letter}
                                    <div
                                        className="keyboard__letter keyboard__letterTip"
                                        style={{width:  getLetterTipSize()}}
                                    >{letter === softSign ? chooseSoftLetter(letter) : letter}</div>
                                </div>
                            )
                        }
                        {
                            index === 2 ?
                                <div
                                    className={'keyboard__deleteButton'}
                                    onClick={deleteLetter}
                                    style={{width: letterSize * 2 + pixelsPerLetters + 'px'}}
                                /> : ''
                        }
                    </div>
                )
            }

        </div>
    );
}
export default Keyboard;
