/* eslint-disable no-unused-vars */
import {ParamSchema} from "express-validator";

/**
 * Создаем тип для валидации полей request-а переданной DTO-шки
 * Выведенный тип будет требовать схему валидации для каждого свойства DTO объекта
 * Hint: если на модели есть nested объекты, то валидировать кастомными схемами
 */
type SchemaValidationProps<DTO> = {
    [Property in keyof Required<DTO>]: ParamSchema;
};

export {SchemaValidationProps};
