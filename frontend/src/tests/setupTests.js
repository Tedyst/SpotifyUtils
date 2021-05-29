// setupTests.js
import { format } from 'util';

const { error } = global.console;

global.console.error = function (...args) {
    error(...args);
    throw new Error(format(...args));
};
