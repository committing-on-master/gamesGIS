import express from "express";

/**
 * Обертка над асинхронными функциями путей Express-а. Ловит исключения и отправляет в next(ошибка)
 * @param {Function} fn асинхронная функция
 * @return {Promise} обертка над асинхронной функцией
 */
const asyncWrapper = (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

export {asyncWrapper};
