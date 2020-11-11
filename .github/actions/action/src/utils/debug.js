import debug from 'debug';
import { name } from '../../package.json';
export function logger(nameSpace) {
    const log = debug(`${name}:${nameSpace}`);
    log.log = console.log.bind(console);
    return log;
}
//# sourceMappingURL=debug.js.map