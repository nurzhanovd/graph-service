import {session} from 'neo4j-driver';

import driver from '../driver';

/**
 * @param {Driver} driver
 * @return function
 */
export const createReadSession = (driver) => driver.session({defaultAccessMode: session.READ})

/**
 * @param {Driver} driver
 * @return function
 */
export const createWriteSession = (driver) => driver.session({defaultAccessMode: session.WRITE})

export const createSession = (driver) => driver.session()
