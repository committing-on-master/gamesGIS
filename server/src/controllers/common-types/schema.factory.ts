import {ParamSchema} from "express-validator";

/** Статические схемы валидации полей запроса, без сторонних обращений в другие модули*/
class StaticSchemaFactory {
    /**
     * Схема валидации поля - Почта
     * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
     * @return {ParamSchema} схема валидации "express-validator"-а
     */
    public static createEmailSchema(optional: boolean = false): ParamSchema {
        return {
            in: ["body"],

            ...(optional ? // если поле не обязательное
                {optional: true} : // то делаем его проверку опциональной
                {exists: {errorMessage: "email body field is missing"}}), // в противном случае, требуем его наличия

            isEmpty: {negated: true, options: {ignore_whitespace: true}, errorMessage: "email body field is empty"},
            trim: true,
            isEmail: {errorMessage: "wrong email format"},
        };
    }

    /**
     * Схема валидации поля - Пароля
     * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
     * @return {ParamSchema} схема валидации "express-validator"-а
     */
    public static createPasswordSchema(optional: boolean = false): ParamSchema {
        return {
            in: ["body"],

            ...(optional ? // если поле не обязательное
                {optional: true} : // то делаем его проверку опциональной
                {exists: {errorMessage: "password body field is missing"}}), // в противном случае, требуем его наличия

            isEmpty: {negated: true, options: {ignore_whitespace: true}, errorMessage: "password body field is empty"},
            isLength: {
                options: {
                    min: 6,
                    max: 255,
                },
                errorMessage: "password should not be greater than 255 symbols or shorter than 6 symbols",
            },
        };
    }

    /**
     * Схема валидации поля - Имени пользователя
     * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
     * @return {ParamSchema} схема валидации "express-validator"-а
     */
    public static createNameSchema(optional: boolean = false): ParamSchema {
        return {
            in: ["body"],

            ...(optional ? // если поле не обязательное
                {optional: true} : // то делаем его проверку опциональной
                {exists: {errorMessage: "name body field is missing"}}), // в противном случае, требуем его наличия

            isEmpty: {negated: true, options: {ignore_whitespace: true}, errorMessage: "name body field is empty"},
            trim: true,
            isLength: {
                options: {min: 3, max: 25},
                errorMessage: "Username should not be greater than 25 symbols, not shorter than 3 symbols",
            },
        };
    }

    /**
     * Схема валидации поля - id
     * @return {ParamSchema} схема валидации "express-validator"-а
     */
    public static createIdSchema(): ParamSchema {
        return {
            in: ["body"],
            exists: {errorMessage: "id body field is missing"},
            isEmpty: {negated: true, options: {ignore_whitespace: true}, errorMessage: "id body field is empty"},
            trim: true,
            isNumeric: true,
        };
    }

    /**
     * Схема валидации поля - id
     * @return {ParamSchema} схема валидации "express-validator"-а
     */
    public static createRefreshTokenSchema(): ParamSchema {
        return {
            in: ["body"],
            exists: {errorMessage: "refreshToken body field is missing"},
            isEmpty: {negated: true, options: {ignore_whitespace: true}, errorMessage: "refreshToken body field is empty"},
            trim: true,
        };
    }

    public static createMapSchema(): ParamSchema {
        return {
            in: ["body"],

            exists: {negated: true, errorMessage: "map body field is missing"},
            isNumeric: {
                negated: true,
                options: {no_symbols: true},
                errorMessage: "map body field numeric only"},
        };
    }

    public static createProfileNameSchema(): ParamSchema {
        return {
            in: ["body"],

            exists: {negated: true, errorMessage: "profileName body field is missing"},
            isEmpty: {negated: true, options: {ignore_whitespace: true}, errorMessage: "profileName body field is empty"},
            isLength: {
                options: {
                    min: 3,
                    max: 255,
                },
                errorMessage: "profileName should not be greater than 255 symbols or shorter than 3 symbols",
            },
        };
    }
}

export {StaticSchemaFactory};
