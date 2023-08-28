'use strict'
import pino from 'pino';
import path from "path";


const isProduction = process.env.NODE_ENV === 'production';
const pinoConfig = {
    browser: {
        asObject: true,
    },
    level: isProduction ? 'info' : 'debug',
};

const logger = pino(pinoConfig);

type Option = {
    caller?: string;
    status?: number;
}

export const loggerError = (message: string, option?: Option | object) => {
    return logger.error(option, `[${path.relative(process.cwd(), __filename)}]>>>${message}`);
};

export const loggerWarn = (message: string, option?: Option | object) => {
    return logger.warn(option, `[${path.relative(process.cwd(), __filename)}]>>>${message}`);
};

export const loggerInfo = (message: string, option?: Option | object) => {
    return logger.info(option, `[${path.relative(process.cwd(), __filename)}]>>>${message}`);
};

export const loggerDebug = (message: string, option?: Option | object, any?: any[]) => {
    return logger.debug(option, `[${path.relative(process.cwd(), __filename)}]>>>${message}`, any);
};