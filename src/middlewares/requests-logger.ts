import { Request, Response, NextFunction } from "express"
import logger from '../utils/logs';

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req
    logger.info(`${method} ${url}`);
    next()
}

export { logRequest }