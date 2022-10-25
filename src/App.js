import React, { useEffect, useState } from 'react';
import logo from './img/logo.svg';
import Fighter, { HeroContext } from './components/Fighter';
import {
    PAPER,
    ROCK,
    SCISSORS,
    HERO,
    VILLAIN,
    veryVeryVeryVeryAdvancedLogic,
    confrontation,
    calculateAttack
} from './utils';

/**
 * @return {jsx}
 */
const App = () => {
    // Nombre del héroe
    const [name, setName] = useState();
    // Objeto con la configuración del héroe
    const [hero, setHero] = useState(initialHero);
    // Objeto con la configuración del villano
    const [villain, setVillain] = useState(villains[0]);
    // Ronda actual
    const [round, setRound] = useState(0);
    // Texto del resultado de la partida
    const [resultText, setResultText] = useState('Elige un movimiento');
    // Deshabilita los botones del héroe
    const [disableButtons, setDisableButtons] = useState(false);
    // Información del modal
    const [modal, setModal] = useState({ show: false, message: '' });


    const onHeroActionHandler = (action) => {
        setHero(prev => ({
            ...prev,
            currentAction: action,
            actions: [...prev.actions, action]
        }));
        setDisableButtons(true)
    }

    useEffect(() => {
        if (hero.currentAction) {
            setTimeout(() => {
                setHero(prev => ({ ...prev, currentAction: null }))
                useVillainAction(hero.actions, setVillain)
            }, 1000)
        }
    }, [hero.currentAction])

    useEffect(() => {
        if (villain.currentAction) {
            setTimeout(() => {
                setVillain(prev => ({ ...prev, currentAction: null }));
                useConfrontation(
                    hero.actions,
                    villain.actions,
                    hero.powerstats.strength,
                    villain.powerstats.strength,
                    setHero,
                    setVillain,
                    setRound,
                    setResultText,
                    setDisableButtons
                );
            }, 1000)
        }
    }, [villain.currentAction])

    useEffect(() => {
        useHeroHealth(hero.health, setModal);
    }, [hero.health])

    useEffect(() => {
        useVillainHealth(villain.health, setHero, setVillain, setModal, setRound);
    }, [villain.health])

    return <div className='App'>
        <img id='logo' src={logo} />
        <h1>SUPERHERO FIGHT</h1>
        <h2 className={`${!name ? 'hide' : ''}`} id='round'>RONDA {round}</h2>
        <h3 className={`${!name ? 'hide' : ''}`} id='result'>- {resultText} -</h3>
        <div id='content'>
            <HeroContext.Provider value={{ ...hero, name: name }}>
                {name ?
                    <React.Fragment>
                        <section id='actions'>
                            <ul>
                                <li className={disableButtons ? 'disabled' : ''} onClick={() => onHeroActionHandler(ROCK)}>
                                    <img src='https://static.thenounproject.com/png/477914-200.png' />
                                </li>
                                <li className={disableButtons ? 'disabled' : ''} onClick={() => onHeroActionHandler(PAPER)}>
                                    <img src='https://static.thenounproject.com/png/477912-200.png' />
                                </li>
                                <li className={disableButtons ? 'disabled' : ''} onClick={() => onHeroActionHandler(SCISSORS)}>
                                    <img src='https://static.thenounproject.com/png/477919-200.png' />
                                </li>
                            </ul>
                        </section>
                        <Fighter type={HERO} config={hero} disableButtons={disableButtons} />
                        <Fighter config={villain} />
                    </React.Fragment> :
                    <React.Fragment>
                        <div className='login'>
                            <input
                                type='text'
                                name='heroName'
                                placeholder='Nombre del héroe'
                            />
                            <button onClick={e => startGame(e, setName)}>- COMENZAR -</button>
                        </div>
                    </React.Fragment>
                }
            </HeroContext.Provider>
        </div>
        <div className={`modal${modal.show ? ' show' : ''}`}><span className='EOGmessage'>- {modal.message} -</span><a href=''>REINTENTAR</a></div>
    </div >;
};

// Constantes

// NO MODIFICABLE
/** Estado inicial del héroe */
const initialHero = {
    powerstats: {
        strength: 19,
        speed: 38,
        durability: 55,
    },
    image: {
        url: 'https://www.superherodb.com/pictures2/portraits/10/100/274.jpg',
    },
    actions: [],
    health: 55,
};

// NO MODIFICABLE
/** Array de villanos, cuando son vencidos se eliminan de aquí */
const villains = [
    {
        name: 'Mysterio',
        powerstats: {
            strength: 10,
            durability: 40,
        },
        image: {
            url: 'https://www.superherodb.com/pictures2/portraits/10/100/1039.jpg',
        },
        actions: [],
        health: 40,
        thinking: false,
    },
    {
        name: 'Shocker',
        powerstats: {
            strength: 10,
            durability: 70,
        },
        image: {
            url: 'https://www.superherodb.com/pictures2/portraits/10/100/19.jpg',
        },
        actions: [],
        health: 70,
        thinking: false,
    },
    {
        name: 'Kingpin',
        powerstats: {
            strength: 18,
            durability: 40,
        },
        image: {
            url: 'https://www.superherodb.com/pictures2/portraits/10/100/623.jpg',
        },
        actions: [],
        health: 40,
        thinking: false,
    },
];

// NO MODIFICABLE
/** Array de villanos vencidos, se va rellenando a medida que se van venciendo */
const villainsWon = [];

// Funciones

// NO MODIFICABLE
/**
 * Setea el nombre del héroe, el cual genera que comience el juego
 * @param {object} e
 * @param {function} setName
 */
const startGame = (e, setName) => {
    setName(e.target.previousElementSibling.value);
};

// NO MODIFICABLE
/**
 * Elimina al villano del array, lo añade al de villanos vencidos
 * Y por último setea el nuevo villano y reinicia la vida del héroe
 * @param {function} setHero
 * @param {function} setVillain
 * @param {function} setRound
 */
const nextVillain = (setHero, setVillain, setRound) => {
    villainsWon.push(villains.shift());
    if (villains.length) {
        setRound(1);
        // Reset de hero
        setHero(hero => ({ ...hero, actions: [], health: initialHero.powerstats.durability }));
        // Siguiente villano
        setVillain(villains[0]);
    }
};

// NO MODIFICABLE
/**
 * Tras dos segundos de espera se pasa a la siguiente ronda:
 * Resetando las acciones actuales (para ocultar las imágenes)
 * Y volviendo a restaurar los botones
 * @param {function} setVillain
 * @param {function} setHero
 * @param {function} setRound
 * @param {function} setResultText
 * @param {function} setDisableButtons
 */
const nextRound = (setVillain, setHero, setRound, setResultText, setDisableButtons) => {
    // Timeout para pasar a la siguiente ronda
    setTimeout(() => {
        setVillain(villain => ({ ...villain, currentAction: null }));
        setHero(hero => ({ ...hero, currentAction: null }));
        setRound(round => ++round);
        setResultText('Elige un movimiento');
        setDisableButtons(false);
    }, 2000);
};

/**
 * Cuando la acción del héroe cambia, el villano decide su movimiento
 * @param {array} heroActions
 * @param {function} setVillain
 */
const useVillainAction = (heroActions, setVillain) => {
    if (heroActions.length) {
        // Carga el spinner de thinking
        setVillain(villain => ({ ...villain, thinking: true }));

        // En un tiempo decide el movmiento y lo añade a las actions
        setTimeout(() => {
            // Tras pensarlo un poco el villano decide su movimiento y lo añade a sus acciones
            const villainAction = veryVeryVeryVeryAdvancedLogic(heroActions);
            setVillain(villain => ({
                ...villain,
                actions: [
                    ...villain.actions,
                    villainAction
                ],
                currentAction: villainAction,
                thinking: false
            }));

            // Añadir la acción seleccionada del villano a las acciones del villano
        }, 1500);
    }
};

/**
 * Cuando héroe y villano han decidido su acción se ejecuta la confrontación.
 * La barra de vida se reduce
 * @param {array} heroActions
 * @param {array} villainActions
 * @param {number} heroStrength
 * @param {number} villainStrength
 * @param {function} setHero
 * @param {function} setVillain
 * @param {function} setRound
 * @param {function} setResultText
 * @param {function} setDisableButtons
 */
const useConfrontation = (heroActions, villainActions, heroStrength, villainStrength, setHero, setVillain, setRound, setResultText, setDisableButtons) => {
    if (heroActions.length && villainActions.length && heroActions.length === villainActions.length) {
        const fightWinner = confrontation(heroActions, villainActions);
        if (fightWinner === HERO) {
            setResultText('Has ganado la ronda');
            // Resta vida al villano
            setVillain(villain => {
                const newHealth = villain.health - calculateAttack(heroStrength);
                return { ...villain, health: newHealth > 0 ? newHealth : 0 };
            });
        } else if (fightWinner === VILLAIN) {
            setResultText('Has perdido la ronda');
            // Resta vida al héroe
            setHero(hero => {
                const newHealth = hero.health - calculateAttack(villainStrength);
                return { ...hero, health: newHealth > 0 ? newHealth : 0 };
            });
        } else {
            setResultText('Empate');
        }

        nextRound(setVillain, setHero, setRound, setResultText, setDisableButtons);
    }
};

/**
 * Cuando la vida del héroe cambia, comprueba que no haya perdido
 * @param {number} heroHealth
 * @param {function} setModal
 */
const useHeroHealth = (heroHealth, setModal) => {
    if (!heroHealth) {
        setModal({ show: true, message: 'GAME OVER' });
    }
};

/**
 * Cuando la vida del villano cambia, comprueba si perdió para cambiar de villano o hacer ganador al hérore
 * @param {number} villainHealth
 * @param {function} setHero
 * @param {function} setVillain
 * @param {function} setModal
 * @param {function} setRound
 */
const useVillainHealth = (villainHealth, setHero, setVillain, setModal, setRound) => {
    if (villainHealth <= 0) {
        nextVillain(setHero, setVillain, setRound);
        if (!villains.length) {
            setModal({ show: true, message: 'HAS GANADO' });
        }
    }
};

export default App;
