import { instance, mock, reset, resetCalls } from "ts-mockito";

/**
 * Хелпер помогающий работать с ts-mockito
 * Необходимый из-за его странной механики:
 * - вначале сделать прокси объект
 * - потом наворотить на него функциональность
 * - и лишь в конце получить готовую сущность для теста, запретив при этом регистрировать на нее доп функциональность
 * @paramType T - класс для которого будем делать стабы/моки
 */
 class Brick<T> {
    readonly proxy: T;
    private mock?: T;

    /**
     * Создает обертку вокруг proxy: T сущности
     * @param proxy Созданный ранее прокси объект, для случаев каких-то нестандартных регистраций
     * @description Если при тестах улетаешь в таймаут, возможно прокси создан не верно и getter Instance залипает на создании финальной сущности.
     * Проверь доку ts-mockito, возможность мокаешь не верно.
     */
    constructor(proxy: T) {
        this.proxy = proxy;
    }

    /**
     * Предоставляет коллбэк, прокидывая внутрь прокси-мок объект, позволяя повешать на него требуемую функциональность
     * @param callBack колллбэк для определения функциональности
     * @returns Текущий объект, позволяя собирать цепочку расширяющих колбэков.
     */
    public addMock(callBack: (proxy: T) => any ): Brick<T> {
        if (!mock) {
            throw new Error("Proxy object locked because instance already created.");
        }
        callBack(this.proxy);
        return this;
    }
    /**
     * Сбрасывает счетчик вызовов методов/полей на mock объекте
     */
    public resetCalls() { resetCalls(this.proxy); }
    /**
     * Сбрасывает всю зарегистрированную функциональность на mock объекте
     */
    public reset() {
        reset(this.proxy);
        this.mock = undefined; 
    }
    
    /**
     * Заворачивает прокси-мок в результирующий объект
     * Кэширует результат
     */
    public get Instance() : T {
        if (!this.mock) {
            this.mock = instance(this.proxy);
        }
        return this.mock;
    }
}

export { Brick }