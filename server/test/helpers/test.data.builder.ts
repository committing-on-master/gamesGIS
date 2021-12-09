/* eslint-disable valid-jsdoc */
/**
 * Класс, помогающий организовать тестовые данные для проведения теста
 * @typeParam TData - объект содержащий данные нужные для проведения тестирования
 * @typeParam TClass - класс сущности, которую мы будем тестировать
 */
abstract class TestDataBuilder<TData, TClass> {
    protected data: TData;
    protected testedInstance?: TClass;

    /**
     * @param data Данные необходимые для выполнения тестов
     */
    constructor(data: TData) {
        this.data = data;
    }

    /**
     * Предоставляет коллбэк, прокидывая внутрь объект содержащий тестовые данные
     * @param callBack коллбэк содержащий манипуляции предназначенные для тестовых данных
     * @return Текущий объект, позволяя собирать цепочку расширяющих коллбэков.
     */
    public addStep(callback: (d: TData) => void): TestDataBuilder<TData, TClass> {
        callback(this.data);
        return this;
    }

    /** Данные необходимые для выполнения тестов */
    public get Data(): TData {
        return this.data;
    }

    /** Метод предназначенные для сбрасывание тестовых данных к изначальным */
    abstract reset(): void;

    /** Тестируемый объект*/
    abstract get TestedInstance(): TClass;
}

export {TestDataBuilder};
