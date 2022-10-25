import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HERO, PAPER, ROCK, SCISSORS, VILLAIN } from '../utils';

export const HeroContext = React.createContext();

/**
 * @param {object} props
 * @return {jsx}
 */
const Fighter = ({ type, config, disableButtons }) => {

    const { name } = useContext(HeroContext);

    return <div className='fighter'>
        <h2>{type === HERO ? name : config.name}</h2>
        <div className='imageContainer'>
            <div className='stats'>
                STR: {config.powerstats.strength} (max)<br />
            </div>
            <img src={config.image.url} />
            <img className={`${ROCK}${config.currentAction === ROCK ? ' show' : ''}`} src='https://static.thenounproject.com/png/477914-200.png' />
            <img className={`${PAPER}${config.currentAction === PAPER ? ' show' : ''}`} src='https://static.thenounproject.com/png/477912-200.png' />
            <img className={`${SCISSORS}${config.currentAction === SCISSORS ? ' show' : ''}`} src='https://static.thenounproject.com/png/477919-200.png' />
            <img className={`spinner${config.thinking ? ' show' : ''}`} src='https://thumbs.gfycat.com/ConventionalOblongFairybluebird-size_restricted.gif' />
        </div>
        <div className='progressContainer'>
            <progress className='life' max={config.powerstats.durability} value={config.health}></progress>
            <span>HP: {`${config.health}/${config.powerstats.durability}`}</span>
        </div>
    </div>;
};

Fighter.propTypes = {
    /** Tipo de luchador, cambia ligeramente el render y algunos comportamientos básicos */
    type: PropTypes.oneOf([HERO, VILLAIN]),
    /** Configración del luchador, como la vida, fuerza, acciones, etc. */
    config: PropTypes.object,
    /** Deshabilita los botones del héroe */
    disableButtons: PropTypes.bool,
};

Fighter.defaultProps = {
    type: VILLAIN,
};

export default Fighter;
