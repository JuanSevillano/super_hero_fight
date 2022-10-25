export const HERO = 'hero';
export const VILLAIN = 'villain';
export const ROCK = 'rock';
export const PAPER = 'paper';
export const SCISSORS = 'scissors';

const possibleActions = [ROCK, PAPER, SCISSORS]
/**
 * Las condiciones son:
 * 0. Si el héroe ha hecho menos de 5 movimientos, el villano escogerá acción de manera aleatoria.
 * 1. Si en los últimos 5 movimientos hay una o varias acciones que el héroe no haya realizado, el villano deberá elegir alguna de esas acciones de manera aleatoria.
 * 2. Sin embargo, si en los últimos 5 movimientos están presentes los tres tipos de acción.
 *      el villano tendrá un 60% de probabilidad de elegir la, o las, acciones más habituales del héroe,
 *      y un 40% de probabilidad de elegir la, o las, menos habituales del héroe,
 * 2.1. En el caso de que los movimientos más, o menos, habituales del héroe, sean dos, el villano deberá elegir alguna de esas acciones de manera aleatoria.
 * 2.2. Una vez el villano haya calculado la acción más probable del héroe, deberá elegir la acción que venza a la del héroe, mediante la función `getCounter`.
 * @return {string} Acción elegida
 */
export const veryVeryVeryVeryAdvancedLogic = (heroActions) => {
    const randomNumber = Math.floor(Math.random() * possibleActions.length);

    if (heroActions.length < 5) {
        return possibleActions[randomNumber]
    }

    const hasRock = heroActions.find(action => action === ROCK);
    const hasPaper = heroActions.find(action => action === PAPER);
    const hasScissors = heroActions.find(action => action === SCISSORS);

    if (!hasRock) return ROCK
    if (!hasPaper) return PAPER
    if (!hasScissors) return SCISSORS

    let rest = [ROCK, PAPER]
    if (!hasRock && !hasPaper) {
        return rest[Math.floor(Math.random() * rest.length)]
    }
    // No contiene ni papel ni tijeras
    if (!hasPaper && !hasScissors) {
        rest = [PAPER, SCISSORS]
        return rest[Math.floor(Math.random() * rest.length)]
    }
    //No contiene ni piedra ni tijeras
    if (!hasRock && !hasScissors) {
        rest = [ROCK, SCISSORS]
        return rest[Math.floor(Math.random() * rest.length)]
    }

    // count actions
    const countedActions = heroActions.reduce((acc, current, index) => {
        if (!acc[current]) {
            acc[current] = 1;
            return acc
        }

        acc[current] = acc[current] + 1
        return acc
    }, [])


    const probability = Math.random();
    const lessCommonActions = Object.keys(countedActions)
        .filter(amount => countedActions[amount] <= 1);
    const mostCommonActions = Object.keys(countedActions)
        .filter((amount) => countedActions[amount] >= 2);

    if (probability <= 0.6 && lessCommonActions.length > 0) {
        return lessCommonActions[Math.floor(Math.random() * lessCommonActions.length)];
    } else if (mostCommonActions.length > 0) {
        // Get Counter per most used actions
        const counterPerCommonAction = mostCommonActions.map(action => getCounter(action));
        return counterPerCommonAction[Math.floor(Math.random() * counterPerCommonAction.length)];
    }

    // Default 
    return possibleActions[randomNumber]
};

/**
 * Devuelve el movimiento que vence a la opción seleccionada
 * @param {string} selectedChoice
 * @return {string} El counter de la opción seleccionada
 */
const getCounter = selectedChoice => {
    switch (selectedChoice) {
        case ROCK:
            return PAPER;
        case PAPER:
            return SCISSORS;
        case SCISSORS:
            return ROCK;
    }
};

/**
 * Resuelve la confrontación comparando las acciones de ambos luchadores
 * @param {array} heroActions
 * @param {array} villainActions
 * @return {string} Ganador de la confrontación
 */
export const confrontation = (heroActions, villainActions) => {
    const heroLastAction = heroActions[heroActions.length - 1];
    const villainLastAction = villainActions[villainActions.length - 1];
    if (heroLastAction === villainLastAction) {
        return 'tie';
    } else if (
        (heroLastAction === ROCK && villainLastAction === SCISSORS) ||
        (heroLastAction === SCISSORS && villainLastAction === PAPER) ||
        (heroLastAction === PAPER && villainLastAction === ROCK)
    ) {
        return HERO;
    } else {
        return VILLAIN;
    }
};


/**
 * Calcula el ataque en base a un random de la fuerza del atacante
 * @param {number} strength
 * @return {number} Cantidad de ataque a aplicar sobre el fighter perdedor
 */
export const calculateAttack = strength => Math.ceil(Math.random() * strength);


