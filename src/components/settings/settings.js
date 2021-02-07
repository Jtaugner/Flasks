import React from 'react';
import './settings.scss'
import {connect} from "react-redux";
import {toggleDeleteWrongWord, toggleSounds, toggleStartFromFirstCell} from "../../store/ac";
import {selectIsDeleteWrongWord, selectSounds, selectStartFromFirstCell} from "../../store/selectors";
import {giveParams} from "../../App";
const games = [
    {id: 99195, classGame: 'wfw'},
    {id: 99196, classGame: 'wfl'},
    {id: 100325, classGame: 'tm'},
    {id: 98125, classGame: 'stm'},
];

//

function Settings(props) {
    const {closeSettings,
        toggleSounds, sounds,
        toggleDeleteWrongWord, deleteWrongWord,
        toggleStartFromFirstCell, startFromFirstCell

    } = props;
    const doParams = (id) => {
        giveParams({[id]: 1});
    };
    return (
        <>
            <div className="blackout settings__blackout" onClick={closeSettings}/>
            <div className="settings">
                <div className="settings__header">Настройки</div>
                <ul>
                    <li>
                        <input type="checkbox"
                               onChange={toggleSounds}
                               checked={sounds}
                               id="musicCheckbox" className="checkbox" />
                        <label
                            htmlFor="musicCheckbox">
                            Звук
                        </label>
                    </li>

                    <li>
                        <input type="checkbox"
                               onChange={toggleDeleteWrongWord}
                               checked={deleteWrongWord}
                               id="wrongWordCheckbox" className="checkbox" />
                        <label
                            htmlFor="wrongWordCheckbox">
                            Стирать неверное слово
                        </label>
                    </li>

                    <li>
                        <input type="checkbox"
                               onChange={toggleStartFromFirstCell}
                               checked={startFromFirstCell}
                               id="startFromFirstCellCheckbox" className="checkbox" />
                        <label
                            htmlFor="startFromFirstCellCheckbox">
                            Начинать с первой буквы
                        </label>
                    </li>

                    <li>
                        <a href={'https://vk.com/jaugr'}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={'settings__group'}
                           onClick={()=>{
                               try{
                                   giveParams({'openVK': 1});
                               }catch(ignored){}

                           }}
                        >
                            Наша группа ВКонтакте
                        </a>
                    </li>


                    <li className={'our-games'}>
                        Наши игры
                    </li>
                    {
                        games.map((obj)=>{
                            return  <li key={obj.id} onClick={()=>doParams(obj.id)}>
                                <a href={"https://yandex.ru/games/play/" + obj.id} target="_blank"
                                   rel="noopener noreferrer"
                                >
                                    <div className={"my-game " + obj.classGame} />
                                </a>
                            </li>
                        })
                    }

                </ul>
            </div>
        </>

    );
}

export default connect((store)=>({
    sounds: selectSounds(store),
    deleteWrongWord: selectIsDeleteWrongWord(store),
    startFromFirstCell: selectStartFromFirstCell(store)
}), (dispatch)=>({
    toggleSounds: () => dispatch(toggleSounds()),
    toggleDeleteWrongWord: () => dispatch(toggleDeleteWrongWord()),
    toggleStartFromFirstCell: () => dispatch(toggleStartFromFirstCell())
}))(Settings);